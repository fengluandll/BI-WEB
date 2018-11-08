import { connect } from 'dva';
import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Spin } from 'antd';
import { Tab, Search } from '../../components/NewDashboard';
import { Bar, Pie, Line, Table } from '../../components/Charts';
import ObjectUtils from '../../utils/objectUtils';
import DashBoardUtils from '../../utils/dashboardUtils';

import '../Dashboard/index.less';

const dashboardUtils = new DashBoardUtils();

class Report extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dashBoard: { id: null, name: '' },
      showSearchList: false,
      // 配置的容器
      boxEles: { name: 'box', children: [], type: 'root' },
      // 当前激活组件名
      compActiveName: 'box',
      // 当前激活子组件名
      childCompActiveName: 0,
      // 当前激活的查询控件子项
      searchChild: null,
      boxSize: 0,

      // add by wangliu 0904 onplot 第二次点击  调用搜索框刷新
      onplot: {},

      // add by wangliu 0904 初始化保存搜索条件
      conditions: {},

      // add by wangliu 0904 控制图表 是第一次 还是 第二次 点击
      onpotClickCount: "0",
    };
    // 数据集列表
    this.columnData = [[], []];
    // 当前显示的数据集
    this.activeDs = {};
    // 是否加载初始配置
    this.isLoaded = false;
    // get reportId
    this.reportId = this.props.match.params.reportId;
  }
  componentWillMount() {
    const reportId = this.reportId;
    this.props.dispatch({
      type: 'report/fetch',
      payload: {
        reportId,
        callback: () => {
          const { dashBoard } = this.props.model;
          const boxEles = dashBoard.config;
          // 补全render方法
          this.completionRender(boxEles, this.renderByType);
          // 补全图表的onPlotClick方法
          const charts = [];
          dashboardUtils.findChart(boxEles, charts);
          for (let i = 0; i < charts.length; i += 1) {
            charts[i].onPlotClick = this.relationLoad;
          }
          this.isLoaded = true;
          // 获取所有的数据集
          const ids = [];
          dashboardUtils.fillAllDsId(boxEles, ids);
          // 补全已添加的数据集columns
          this.props.dispatch({
            type: 'report/fetchColumns',
            payload: {
              ids,
              onLoaded: () => {
                this.setState({
                  boxEles,
                  dashBoard,
                });
                // 初始化数据
                this.initLoad(boxEles);
              },
            },
          });
        },
      },
    });
  }
  componentDidUpdate() {
    const box = this.box;
    const boxEles = this.state.boxEles;
    // box render
    const rootChildren = boxEles.children;
    ReactDom.render(this.renderBox(rootChildren), box);
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'report/cleanUp',
    });
  }
  /**
   * 供查询子项查询枚举数据
   * 合并其他条件
   * @param name 对应组件配置名
   * @param fieldId 需要枚举的字段ID
   */
  onLoadSearchEnum = (compName, fieldId) => {
    const comp = dashboardUtils.findByName(this.state.boxEles, compName);
    const { name, relation, ds } = comp;
    const columns = this.props.model.dsColumnMap[ds.id];
    const keys = Object.keys(relation);
    const params = {};
    for (const key of keys) {
      if (key != fieldId) {
        const { props } = relation[key];
        if (props.val) {
          const column = columns.find((item) => {
            return item.id == key;
          });
          params[column.rscName] = {
            column,
            value: props.val,
            rule: props.rule,
          };
        }
      }
    }
    const column = columns.find((item) => {
      return item.id == fieldId;
    });
    // 请求枚举数据
    this.props.dispatch({
      type: 'report/loadSearchEnum',
      payload: { name, table: ds, field: column.rscName, params, reportId: this.reportId },
    });
  };
  onExport = (name) => {
    const child = dashboardUtils.findByName(this.state.boxEles, name);
    const searchParams = this.getAllSearchParams();
    let searchParam = searchParams[child.name];
    searchParam = searchParam || [];
    const conditions = [this.mergeChartParam(child, searchParam)];
    this.exportChartData(conditions[0]);
  };
  // 获取所有查询控件的关联查询参数，参数相同取最后的参数
  getAllSearchParams = (boxEles) => {
    const searchs = [];
    dashboardUtils.findByType(boxEles || this.state.boxEles, searchs, ['search']);
    // 获取查询参数
    const searchParams = {};
    searchs.forEach((search) => {
      const param = this.getSearchParams(search);
      // 合并参数
      const keys = Object.keys(param);
      for (const key of keys) {
        searchParams[key] = param[key];
      }
    });
    return searchParams;
  };
  /**
   * 获取指定查询控件的关联查询参数
   * @param comp
   * @returns { name: [{ column, subColumn, val }]}
   */
  getSearchParams = (comp, boxEles) => {
    boxEles = boxEles || this.state.boxEles;
    const { dsColumnMap } = this.props.model;
    const columns = dsColumnMap[comp.ds.id];
    const params = {};
    const { relation } = comp;
    const keys = Object.keys(relation);
    // key: 关联字段ID
    for (const key of keys) {
      const column = columns.find((item) => {
        return item.id == key;
      });
      const { props, relationFields } = relation[key];
      if (props.val) {
        const fieldKeys = Object.keys(relationFields);
        // fieldKey:被关联控件的name
        for (const fieldKey of fieldKeys) {
          const subComp = dashboardUtils.findByName(boxEles, fieldKey);
          const subColumns = dsColumnMap[subComp.ds.id];
          const subFieldId = relationFields[fieldKey].split(',')[3];
          if (!params[fieldKey]) {
            params[fieldKey] = [];
          }
          params[fieldKey].push({
            column,
            subColumn: subColumns.find((item) => {
              return item.id == subFieldId;
            }),
            val: props.val,
            rule: props.rule,
          });
        }
      }
    }
    return params;
  };
  getSpinning = (name) => {
    return this.props.model.loading[name] || false;
  };
  // 导出图表数据
  exportChartData = (condition) => {
    this.props.dispatch({
      type: 'report/exportData',
      payload: {
        condition,
        reportId: this.reportId,
      },
    });
  };
  // 切换选中组件
  changeEleActive = (name, childName) => {
    this.setState({
      compActiveName: name,
      childCompActiveName: childName,
    });
  };
  /**
   * 补全除了tab_panel以及root的其他控件中的render方法
   * @param o
   * @param func
   */
  completionRender = (o, func) => {
    const hasChildren = !!o.children;
    if (o.type != 'root' && o.type != 'tab_panel') {
      o.render = func(o.type, o);
    }
    if (hasChildren) {
      for (const child of o.children) {
        this.completionRender(child, func);
      }
    }
  };
  /**
   * 触发组件渲染
   */
  triggerUpdate = () => {
    this.setState({
      boxSize: this.state.boxSize + 1,
    });
  };
  filterChart = (name) => {
    const { chart } = this.props.model;
    return chart && chart[name] ? chart[name] : [];
  };
  // 初始化加载页面数据
  initLoad = (boxEles) => {
    const charts = [];
    const searchParams = this.getAllSearchParams(boxEles);
    const conditions = [];
    dashboardUtils.findChart(boxEles, charts);
    for (let i = 0; i < charts.length; i += 1) {
      const chart = charts[i];
      let searchParam = searchParams[chart.name];
      searchParam = searchParam || [];
      conditions.push(this.mergeChartParam(chart, searchParam));
    }
    // add by wangliu 初始化时 把查询条件 保存
    this.setState({
      conditions: conditions,
    });
    this.reqChartData(conditions);
  };
  // 查询条件+图表的关联查询
  search = (comp) => {
    const { boxEles } = this.state;
    const searchParams = this.getSearchParams(comp);
    const keys = Object.keys(searchParams);
    const conditions = [];
    for (const key of keys) {
      const subComp = dashboardUtils.findByName(boxEles, key);
      conditions.push(this.mergeChartParam(subComp, searchParams[key]));
    }
    this.reqChartData(conditions);
  };
  // 图表间的关联查询
  // 比如A图表关联B图表,B图表除了要有A图表关联字段作为查询参数之外还需要对应的查询控件里的查询条件作为参数
  // 搜索所有查询控件的relation字段主关联及被关联字段中是否存在图表对应字段，是则取出作为查询参数
  relationLoad = (ev, config) => {
    // add by wangliu  onplot第二次点击 出发搜索框重新搜索
    if (ev.data == this.state.onplot && this.state.onpotClickCount == "1") {
      const searchs = [];
      dashboardUtils.findByType(this.state.boxEles, searchs, ['search']);
      searchs.forEach((search) => {// 每个搜索框都搜索
        const currentConfig = dashboardUtils.findByName(
          this.state.boxEles, search.name);
        this.search(currentConfig);
      });
      this.setState({
        onpotClickCount: "0",
      });
      return;
    } else {
      this.setState({
        onplot: ev.data,
        onpotClickCount: "1",
      });
    }
    if (ev.data && config && config.relation) {
      const searchControlParams = this.getAllSearchParams();
      const origin = ev.data['_origin'];
      const { relation, dataConfig } = config;
      const { dimension, legend } = dataConfig;
      const fields = Object.keys(relation);
      const condition = {};   // 取出所有查询用的关联条件
      // 判断是否存在关联项
      if (fields && fields.length > 0) {
        for (const key of fields) {
          const relationFields = relation[key].relationFields;
          const relationKeys = Object.keys(relationFields);
          // 获得该字段的值
          // 判断该字段类型 dimension/legend
          let rest = dimension.find((item) => {
            return item.id == key;
          });
          let val = '';
          if (!rest) {
            rest = legend.find((item) => {
              return item.id == key;
            });
          }
          val = origin[rest.rscDisplay];
          for (const relationKey of relationKeys) {
            if (!condition[relationKey]) {
              condition[relationKey] = {};
            }
            condition[relationKey][relationFields[relationKey]] = val;
          }
        }
        const conditionKeys = Object.keys(condition);
        // 拆分出每个关联图表对应的查询参数
        const searchParams = [];
        // conditionKey = 关联控件的name
        for (const conditionKey of conditionKeys) {
          const params = {};
          const conditions = condition[conditionKey];
          const paramKeys = Object.keys(conditions);
          for (const paramKey of paramKeys) {
            const subCompName = paramKey.split(',')[2];
            const subComp = dashboardUtils.findByName(this.state.boxEles, subCompName);
            const paramFieldId = paramKey.split(',')[3];
            const paramColumn = this.props.model.dsColumnMap[subComp.ds.id].find((item) => {
              return item.id == paramFieldId;
            });
            const paramVal = conditions[paramKey];
            params[paramColumn.rscName] = {
              value: [paramVal],
              column: paramColumn,
            };
          }
          const comp = dashboardUtils.findByName(this.state.boxEles, conditionKey);
          let searchParam = searchControlParams[comp.name];
          searchParam = searchParam || [];
          searchParam.forEach((item) => {
            params[item.subColumn.rscName] = {
              value: item.val,
              column: item.subColumn,
              rule: item.rule,
            };
          });
          searchParams.push({
            type: comp.type,
            dimension: comp.dataConfig.dimension,
            measure: comp.dataConfig.measure,
            legend: comp.dataConfig.legend,
            table: comp.ds,
            name: conditionKey,
            params,
            reportId: this.reportId,
          });
        }
        this.reqChartData(searchParams);
      }
    }
  };
  // 合并请求参数
  mergeChartParam = (comp, searchParam) => {
    const { dimension, measure, legend } = comp.dataConfig;
    const params = {};
    searchParam.forEach((item) => {
      params[item.subColumn.rscName] = {
        value: item.val,
        column: item.subColumn,
        rule: item.rule,
      };
    });
    return {
      type: comp.type,
      dimension,
      measure,
      legend,
      table: comp.ds,
      name: comp.name,
      params,
      reportId: this.reportId,
    };
  };
  // 请求图表数据
  reqChartData = (conditions) => {
    if(conditions.length < 1){// 没有搜索条件时  用初始化时候的条件
      conditions = this.state.conditions;
    }
    for (let i = 0; i < conditions.length; i += 1) {
      this.props.dispatch({
        type: 'report/fetchData',
        payload: {
          condition: conditions[i],
        },
      });
    }
  };
  // 根据控件类型获取render方法
  renderByType = (type, config, tabData) => {
    const name = config.name;
    switch (type) {
      case 'line':
        return () => {
          const currentConfig = dashboardUtils.findByName(
            this.state.boxEles, name);
          const { styleConfigs } = currentConfig;
          const data = this.filterChart(name);
          const spinning = this.getSpinning(name);
          return (<Spin tip="Loading..." spinning={spinning}><Line
            data={data}
            config={currentConfig}
            styleConfigs={ObjectUtils.quickDeepClone(styleConfigs)}
          /></Spin>);
        };
      case 'bar':
        return () => {
          const currentConfig = dashboardUtils.findByName(
            this.state.boxEles, name);
          const { styleConfigs } = currentConfig;
          const data = this.filterChart(name);
          const spinning = this.getSpinning(name);
          return (<Spin tip="Loading..." spinning={spinning}><Bar
            data={data}
            config={currentConfig}
            styleConfigs={ObjectUtils.quickDeepClone(styleConfigs)}
          /></Spin>);
        };
      case 'pie':
        return () => {
          const currentConfig = dashboardUtils.findByName(
            this.state.boxEles, name);
          const { styleConfigs } = currentConfig;
          const data = this.filterChart(name);
          const spinning = this.getSpinning(name);
          return (<Spin tip="Loading..." spinning={spinning}><Pie
            styleConfigs={ObjectUtils.quickDeepClone(styleConfigs)}
            config={currentConfig}
            data={data}
          /></Spin>);
        };
      case 'table':
        return () => {
          const currentConfig = dashboardUtils.findByName(
            this.state.boxEles, name);
          const { styleConfigs } = currentConfig;
          const { chart } = this.props.model;
          const data = chart && chart[name] ? chart[name] : { header: [], body: [] };
          const spinning = this.getSpinning(name);
          return (<Spin tip="Loading..." spinning={spinning}><Table
            key={name}
            styleConfigs={ObjectUtils.quickDeepClone(styleConfigs)}
            data={data}
            onExport={this.onExport.bind(this, name)}
          /></Spin>);
        };
      case 'search':
        return () => {
          const currentConfig = dashboardUtils.findByName(
            this.state.boxEles, name);
          const dsColumnMap = this.props.model.dsColumnMap;
          const searchEnum = this.props.model.searchEnum;
          return (<Search
            isReport
            config={currentConfig}
            dsColumnMap={dsColumnMap}
            searchEnum={searchEnum}
            onDeleteItem={() => {
              this.triggerUpdate();
            }}
            onLoad={this.onLoadSearchEnum}
            onClick={(comp, column) => {
              this.setState({
                searchChild: column,
                childCompActiveName: comp.name,
              });
            }}
            onSearch={() => {
              this.search(config);
            }}
          />);
        };
      case 'tab':
        return () => {
          // 这里的tabData可能需要重新获取下
          return this.renderTab(config, config.activeKey, tabData);
        };
      default:
    }
  };
  // 渲染普通容器
  renderBox = (children) => {
    return (<div>
      {this.renderChildren(children)}
    </div>);
  };
  // 渲染tab
  renderTab = (comp, activeKey, children) => {
    const key = comp.name;
    return (<Tab
      isReport
      hideAdd
      type="editable-card"
      styleConfigs={ObjectUtils.quickDeepClone(comp.styleConfigs)}
      activeKey={activeKey}
      data={children}
      key={key}
      onTabClick={(tabKey) => {
        // 查找tab
        const tabContainer = dashboardUtils.findTabByPanel(this.state.boxEles, tabKey);
        // change tab activeKey
        tabContainer.activeKey = tabKey;
        this.changeEleActive(key, tabKey);
      }}
    />);
  };
  // 渲染容器中元素
  renderChildren = data => data.map((item) => {
    if (item.children && item.children.length > 0) {
      Object.defineProperty(item, 'render', {
        value: () => {
          return this.renderTab(item, item.activeKey, item.children);
        },
      });
      const { margintop, marginleft, height, width } = item.styleConfigs;
      //  兼容旧的模板
      if (width == null) {
        return (
          <div key={item.name} className={'bi-container'}>
            {item.render()}
          </div>
        );
      }
      return (
        <div key={item.name} className={'bi-container'}>
          <div style={{ position: 'absolute', marginTop: margintop, marginLeft: marginleft + '%', width: width + '%', }}>
            {item.render()}
          </div>
        </div>
      );
    } else {
      // add by wangliu  0829 显示的时候讲 控件加上 布局 css
      const { margintop, marginleft, height, width } = item.styleConfigs;
      let containerStyle; // 头部搜索框固定
      let searchIndex;   // 头部搜索框下拉框 显示
      if (item.type == "search" && item.styleConfigs.margintop == "0") {
        containerStyle = (
          { position: 'fixed', marginTop: margintop, width: width + '%', }
        )
      } else {
        containerStyle = (
          { position: 'absolute', marginTop: margintop, marginLeft: marginleft + '%', width: width + '%', }
        )
      }
      if (item.type == "search") {
        searchIndex = (
          { zIndex: '1', }
        )
      }
      if (null == width) {
        return (
          <div key={item.name} className={'bi-container'}
          >
            {item.render()}
          </div>);
      }
      return (
        <div key={item.name + "_bi-container-css"} className={'bi-container-css'} style={searchIndex}>
          <div key={item.name} className={'bi-container'}
            style={containerStyle}
          >
            {item.render()}
          </div>
        </div>);
    }
  });
  render() {
    return (
      <div style={{ display: 'flex' }} className="full-height">
        {/* 仪表板编辑展示区 */}
        <div style={{ width: '100%', overflow: 'auto', padding: '0px 5px 5px 5px' }} className="full-height" ref={(instance) => { this.box = instance; }} name="box" />
      </div>
    );
  }
}
export default connect(state => ({
  model: state.report,
}))(Report);

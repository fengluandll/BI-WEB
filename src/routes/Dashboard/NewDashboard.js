import { connect } from 'dva';
import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Collapse, Tag, Card, Icon, Button, message, Input, Dropdown, Menu } from 'antd';
import update from 'immutability-helper';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import SearchList from '../../components/SearchList';
import { ListItem, Tab, DataConfigControl, Search, DataConfigSelection, DataScreen, StyleConfig } from '../../components/NewDashboard';
import { Bar, Pie, Line, Table } from '../../components/Charts';
import ObjectUtils from '../../utils/objectUtils';
import DashBoardUtils from '../../utils/dashboardUtils';

import styles from './index.less';

const Panel = Collapse.Panel;
const dashboardUtils = new DashBoardUtils();

class NewDashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dashBoard: {
        id: null,
        name: '',
      },
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
    };
    // 数据集列表
    this.columnData = [[], []];
    // 当前显示的数据集
    this.activeDs = {};
  }
  componentWillMount() {
    const pageId = this.props.match.params.pageId;
    this.props.dispatch({
      type: 'newDashboard/fetch',
      payload: {
        pageId,
        callback: () => {
          if (!pageId) return;
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
          // 获取所有的数据集
          const ids = [];
          dashboardUtils.fillAllDsId(boxEles, ids);
          // 补全已添加的数据集columns
          this.props.dispatch({
            type: 'newDashboard/fetchColumns',
            payload: {
              ids,
              callback: () => {
                this.setState({
                  boxEles,
                  dashBoard,
                });
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
      type: 'newDashboard/cleanUp',
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
      type: 'newDashboard/loadSearchEnum',
      payload: { name, table: ds, field: column.rscName, params },
    });
  };
  onExport = (name) => {
    const child = this.getActiveEle(name);
    const searchParams = this.getAllSearchParams();
    let searchParam = searchParams[child.name];
    searchParam = searchParam || [];
    const conditions = [this.mergeChartParam(child, searchParam)];
    this.exportChartData(conditions[0]);
  };
  /**
   * 查找当前激活的组件
   * @param name 不为空时查找指定组件
   * @returns {*}
   */
  getActiveEle = (name) => {
    const boxEles = this.state.boxEles;
    const container = dashboardUtils.findByName(boxEles, name
      || this.state.compActiveName) || this.state.boxEles;
    const child = container.children.find((item) => {
      return item.name === this.state.childCompActiveName;
    });
    return child || container;
  };
  // 查找当前激活的容器  root | tab | tab_panel
  getActiveContainer = () => {
    const boxEles = this.state.boxEles;
    let container = dashboardUtils.findByName(boxEles, this.state.compActiveName);
    container = container || boxEles;
    const child = container.children.find((item) => {
      return item.name === this.state.childCompActiveName;
    });
    return child && child.type === 'tab_panel' ? child : container;
  };
  // 获取所有查询控件的关联查询参数，参数相同取最后的参数
  getAllSearchParams = () => {
    const searchs = [];
    dashboardUtils.findByType(this.state.boxEles, searchs, ['search']);
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
  getSearchParams = (comp) => {
    const { boxEles } = this.state;
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
    return params;
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
  changeShowSearchList = () => {
    this.setState({
      showSearchList: !this.state.showSearchList,
    });
  };
  dsMenuSelect = (val, obj) => {
    this.setState({
      showSearchList: false,
    });
    const activeComp = this.getActiveEle();
    // 只有图表需要保存数据集,排除查询控件和tab控件
    if (activeComp.group === 'chart') {
      activeComp.ds = obj.item;
      // 清空数据配置
      const { dataConfig } = activeComp;
      dataConfig.dimension = [];
      dataConfig.measure = [];
      dataConfig.legend = [];
    }
    const { id } = this.activeDs = obj.item;
    this.props.dispatch({
      type: 'newDashboard/fetchColumn',
      payload: { id },
    });
  };
  filterChart = (name) => {
    const { chart } = this.props.model;
    return chart ? chart[name] : [];
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
    if (ev.data && config && config.relation) {
      const searchControlParams = this.getAllSearchParams();
      const origin = ev.data['_origin'];
      const { relation, dataConfig } = config;
      const { dimension, legend, color } = dataConfig;
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
          if (!rest) {
            rest = legend.find((item) => {
              return item.id == key;
            });
          }
          if (!rest && color) {
            rest = color.find((item) => {
              return item.id == key;
            });
          }
          const val = origin[rest.rscDisplay];
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
            if (!params[item.subColumn.rscName]) {
              params[item.subColumn.rscName] = {
                value: item.val,
                column: item.subColumn,
                rule: item.rule,
              };
            }
          });
          searchParams.push({
            type: comp.type,
            dimension: comp.dataConfig.dimension,
            measure: comp.dataConfig.measure,
            legend: comp.dataConfig.legend,
            table: comp.ds,
            name: conditionKey,
            params,
          });
        }
        this.reqChartData(searchParams);
      }
    }
  };
  // 选择图表
  selectChart = (e) => {
    if (e.target.parentElement) {
      const key = e.target.getAttribute('data-key');
      const container = this.getActiveContainer();
      const children = container.children;
      let childName = null;
      switch (key) {
        case 'line': {
          const lineConfig = dashboardUtils.getComponent('line', this.relationLoad);
          childName = lineConfig.name;
          children.push({
            ...lineConfig,
            'containerName':container.name,//  add by wangliu  0907  增加每个图表的属性(父容器名称)
            ...{
              render: this.renderByType(key, lineConfig),
            },
          });
          break;
        }
        case 'bar': {
          const barConfig = dashboardUtils.getComponent('bar', this.relationLoad);
          childName = barConfig.name;
          children.push({
            ...barConfig,
            'containerName':container.name,
            ...{
              render: this.renderByType(key, barConfig),
            },
          });
          break;
        }
        case 'pie': {
          const pieConfig = dashboardUtils.getComponent('pie', this.relationLoad);
          childName = pieConfig.name;
          children.push({
            ...pieConfig,
            'containerName':container.name,
            ...{
              render: this.renderByType(key, pieConfig),
            },
          });
          break;
        }
        case 'table': {
          const tableConfig = dashboardUtils.getComponent('table');
          childName = tableConfig.name;
          children.push({
            ...tableConfig,
            'containerName':container.name,
            ...{
              render: this.renderByType(key, tableConfig),
            },
          });
          break;
        }
        default:
          break;
      }
      this.setState({
        childCompActiveName: childName,
        compActiveName: container.name,
      });
    }
  };
  // 选择控件
  selectControl = (e) => {
    if (e.target.parentElement) {
      const key = e.target.getAttribute('data-key');
      const container = this.getActiveContainer();
      const children = container.children;
      let compActiveName = container.name;
      let childName = null;
      switch (key) {
        case 'search': {
          const searchConfig = dashboardUtils.getComponent('search');
          childName = searchConfig.name;
          children.push({
            ...searchConfig,
            'containerName':container.name,//  add by wangliu  0907  增加每个图表的属性(父容器名称)
            ...{
              render: this.renderByType(key, searchConfig),
            },
          });
          break;
        }
        case 'tab': {
          if (container.type === 'tab_panel') {
            message.warning('tab容器不能互相嵌套');
            return;
          }
          const tabConfig = dashboardUtils.getComponent('tab');
          const tabData = DashBoardUtils.demoData.getTab(children.length + 1);
          compActiveName = tabConfig.name;
          tabConfig.activeKey = childName = tabData[0].name; // 默认激活第一个tab页
          // 判断子容器数量  渲染子容器
          children.push({
            ...tabConfig,
            ...{
              render: this.renderByType(key, tabConfig, tabData),
              children: tabData,
            },
          });
          break;
        }
        default:
          break;
      }
      this.setState({
        compActiveName,
        childCompActiveName: childName,
      });
    }
  };
  // 合并处理数据
  mergeData = () => {
    const { dsList, columnList } = this.props.model;
    const dsData = [];
    const columnData = [[], []];
    dsList.forEach((i) => {
      dsData.push({
        item: i,
        value: i.dsDisplay,
      });
    });
    columnList.forEach((item) => {
      const d = {
        metadata: item,
        id: item.id,
        name: item.rscDisplay,
      };
      if (item.rscCategory === 2) {
        columnData[1].push(d);
      } else {
        columnData[0].push(d);
      }
    });

    this.dsData = dsData;
    this.columnData = columnData;
  };
  boxEleAcive = (e) => {
    if (this.box === e.target) {
      this.changeEleActive('box', null);
    }
  };
  // 切换选中组件
  changeEleActive = (name, childName) => {
    this.setState({
      compActiveName: name,
      childCompActiveName: childName,
    });
    // 切换组件时判断是否需要切换到组件对应数据集
    const comp = this.getActiveEle(childName);
    if (comp.group === 'chart') {
      const ds = comp.ds;
      if (ds && ds.id !== this.activeDs.id) {
        this.activeDs = ds;
        this.props.dispatch({
          type: 'newDashboard/fetchColumn',
          payload: { id: ds.id },
        });
      }
    }
  };
  // 渲染ListItem
  loopListItem = (data, dragType) => data.map((item) => {
    return <ListItem key={item.id} item={item} dragType={dragType} type="dataset" />;
  });
  // 数据配置项删除
  deleteDataConfigItem = (type, data) => {
    const comp = this.getActiveEle();
    switch (type) {
      case 'dimension': {
        const { dimension } = comp.dataConfig;
        comp.dataConfig.dimension = dimension.filter(item => item.id !== data.id);
        break;
      }
      case 'measure': {
        const { measure } = comp.dataConfig;
        comp.dataConfig.measure = measure.filter(item => item.id !== data.id);
        break;
      }
      default: {
        const { legend } = comp.dataConfig;
        comp.dataConfig.legend = legend.filter(item => item.id !== data.id);
      }
    }
    this.triggerUpdate();
  };
  // 数据配置排序
  dataConfigSort = (dragIndex, hoverIndex, dragSource) => {
    const comp = this.getActiveEle();
    if (dragSource === 'measure') {
      const { measure } = comp.dataConfig;
      const drag = measure[dragIndex];
      comp.dataConfig.measure = update(comp.dataConfig, {
        measure: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, drag]],
        },
      }).measure;
    } else {
      const { dimension } = comp.dataConfig;
      const drag = dimension[dragIndex];
      comp.dataConfig.dimension = update(comp.dataConfig, {
        dimension: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, drag]],
        },
      }).dimension;
    }
    this.triggerUpdate();
  };
  // 数据拖放,dimension/measure/legend
  dataDropIn = (type, data) => {
    const comp = this.getActiveEle();
    const { metadata, dragSourceType, dragSource } = data;
    const { dimension, measure, legend } = comp.dataConfig;
    // 判断拖动来源
    switch (dragSourceType) {
      case 'dataset': {
        // 数据集 列表项  需要验证数据
        const rest = this.dragDataValid(type, metadata);
        if (!rest.result) {
          message.warning(rest.msg);
        } else {
          switch (type) {
            case 'dimension': {
              comp.dataConfig.dimension = dimension.concat(metadata);
              break;
            }
            case 'measure': {
              comp.dataConfig.measure = measure.concat(metadata);
              break;
            }
            default: {
              comp.dataConfig.legend = legend.concat(metadata);
            }
          }
        }
        break;
      }
      case 'dataconfig': {
        // 数据配置项
        if (dragSource === 'dimension') {
          if (type !== 'dimension') {
            // 调换
            if (legend.length >= 1) {
              message.warning('图例最多可添加一项');
            } else {
              comp.dataConfig.legend = legend.concat(metadata);
              comp.dataConfig.dimension = dimension.filter(item => item.id !== metadata.id);
            }
          }
        } else if (dragSource === 'legend') {
          if (type === 'dimension') {
            // 调换
            comp.dataConfig.dimension = dimension.concat(metadata);
            comp.dataConfig.legend = legend.filter(item => item.id !== metadata.id);
          }
        } else {
          // 排序
        }
        break;
      }
      default:
    }
    this.triggerUpdate();
  };
  // 验证拖动数据是否重复
  dragDataValid = (type, data) => {
    const comp = this.getActiveEle();
    const { dimension, measure, legend } = comp.dataConfig;
    const { id } = data;
    const rest = { msg: '', result: true };
    switch (type) {
      case 'dimension': {
        const index1 = dimension.findIndex(item => item.id === id);
        const index2 = legend.findIndex(item => item.id === id);
        if (index1 >= 0 || index2 >= 0) {
          rest.msg = '已存在该对象';
          rest.result = false;
        }
        break;
      }
      case 'measure': {
        // 度量需要判断是否在度量存在重复数据，如果存在则提示
        const index = measure.findIndex(item => item.id === id);
        if (index >= 0) {
          rest.msg = '已存在该对象';
          rest.result = false;
        }
        break;
      }
      default: {
        if (legend.length >= 1) {
          rest.msg = '图例最多可添加一项';
          rest.result = false;
        } else {
          const index1 = dimension.findIndex(item => item.id === id);
          const index2 = legend.findIndex(item => item.id === id);
          if (index1 >= 0 || index2 >= 0) {
            rest.msg = '已存在该对象';
            rest.result = false;
          }
        }
        break;
      }
    }
    return rest;
  };
  // 读取数据
  reload = () => {
    const child = this.getActiveEle();
    const searchParams = this.getAllSearchParams();
    let searchParam = searchParams[child.name];
    searchParam = searchParam || [];
    const conditions = [this.mergeChartParam(child, searchParam)];
    this.reqChartData(conditions);
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
    };
  };
  // 请求图表数据
  reqChartData = (conditions) => {
    for (let i = 0; i < conditions.length; i += 1) {
      this.props.dispatch({
        type: 'newDashboard/fetchData',
        payload: {
          condition: conditions[i],
        },
      });
    }
  };
  // 导出图表数据
  exportChartData = (condition) => {
    this.props.dispatch({
      type: 'newDashboard/exportData',
      payload: {
        condition,
      },
    });
  };
  // 删除页签
  delTabPanel = (name) => {
    const tabContainer = dashboardUtils.findTabByPanel(this.state.boxEles, name);
    const children = tabContainer.children.filter(item => item.name !== name);
    tabContainer.children = children;
    if (children.length === 0) {
      this.setState({
        compActiveName: tabContainer.name,
        childCompActiveName: null,
      });
    } else {
      this.setState({
        compActiveName: tabContainer.name,
        childCompActiveName: children[0].name,
        boxSize: this.state.boxSize + 1,
      });
    }
  };
  // 修改页签
  updateTabPanel = (name, e) => {
    const val = e.target.value;
    const tabContainer = dashboardUtils.findTabByPanel(this.state.boxEles, name);
    const child = tabContainer.children.find(item => item.name === name);
    child.title = val;
    this.triggerUpdate();
  };
  // 新增页签
  addTabPanel = () => {
    const activeComp = this.getActiveEle();
    let tabContainer;
    if (activeComp.type === 'tab') {
      tabContainer = activeComp;
    } else {
      tabContainer = dashboardUtils.findTabByPanel(this.state.boxEles, activeComp.name);
    }
    const tabPanelConfig = {
      title: `Tab${tabContainer.children.length + 1}`,
      type: 'tab_panel',
      name: ObjectUtils.generateUUID(),
      children: [],
    };
    tabContainer.children.push(tabPanelConfig);
    tabContainer.activeKey = tabPanelConfig.name;
    this.setState({
      compActiveName: tabContainer.name,
      childCompActiveName: tabPanelConfig.name,
    });
  };
  // 删除组件
  delComp = (name) => {
    const boxEles = this.state.boxEles;
    const comp = dashboardUtils.findByName(boxEles, name);
    const dsId = comp.ds.id;
    // 判断是否图表控件
    if (comp.group === 'chart') {
      // 判断对应数据集是否存在并唯一
      if (dsId) {
        const charts = [];
        dashboardUtils.findByName(boxEles, charts, comp.name);
        const restArr = charts.filter((item) => {
          return item.ds.id === dsId;
        });
        if (restArr.length === 0) {
          // 图表数据集唯一，需要删除使用该数据集的查询控件
          const searchs = [];
          dashboardUtils.findByType(boxEles, searchs, ['search']);
          searchs.forEach((item) => {
            if (item.ds.id === dsId) {
              item.ds = {}; // 去除查询控件选中的数据集
              item.relation = {}; // 清空关联配置
            }
          });
        }
      }
    }
    dashboardUtils.delByName(boxEles, name);
    this.triggerUpdate();
  };
  selectRelation = (selectCompName, fieldId, name, checkValue) => {
    if (!checkValue) {
      return;
    }
    const boxEles = this.state.boxEles;
    // todo 下面注释代码作用是能取消关联，目前有问题会导致两表以上的关联关系无法形成，待修复
    const selectComp = dashboardUtils.findByName(boxEles, selectCompName);
    if (selectComp.relation[fieldId]) {
      //selectComp.relation[fieldId].relationFields = {};
      // add by wangliu  修复取消 会把其他全部弄没得bug
      delete selectComp.relation[fieldId].relationFields[name];
    }
    for (const value of checkValue) {
      const [compName, field, subCompName, subField] = value.split(',');
      const comp = dashboardUtils.findByName(boxEles, compName);
      const relation = comp.relation;
      const key = `${compName},${field},${subCompName},${subField}`;
      if (relation[field]) {
        relation[field].relationFields[subCompName] = key;
      } else {
        const relationFields = {};
        relationFields[subCompName] = key;
        relation[field] = {
          relationFields,
        };
      }
    }
    this.triggerUpdate();
  };
  save = ({ key }) => {
    const dashboard = this.state.dashBoard;
    dashboard.config = this.state.boxEles;
    if (dashboard.name && dashboard.name.length > 0) {
      this.props.dispatch({
        type: 'newDashboard/saveDashBoard',
        payload: {
          dashboard,
          type: key,
          onSuccess: (status, pageId) => {
            if (status === 0) {
              message.warning('仪表板名称已存在');
            } else if (status === 1) {
              message.success('保存成功');
              if (!dashboard.pageId) {
                this.props.history.push(`/newDashboard/${pageId}`);
              }
            } else {
              message.error('保存失败');
            }
          },
        },
      });
    } else {
      message.warning('仪表板名称不能为空');
    }
  };
  saveMenu = (
    <Menu onClick={this.save}>
      <Menu.Item key="save">保存</Menu.Item>
      <Menu.Item key="saveAs">另存为</Menu.Item>
    </Menu>
  );
  // 根据控件类型获取render方法
  renderByType = (type, config, tabData) => {
    const name = config.name;
    switch (type) {
      case 'line':
        return () => {
          const currentConfig = dashboardUtils.findByName(
            this.state.boxEles, name);
          const { styleConfigs } = currentConfig;
          const data = this.filterChart(name) || DashBoardUtils.demoData.line;
          return (<Line
            data={data}
            config={currentConfig}
            styleConfigs={ObjectUtils.quickDeepClone(styleConfigs)}
          />);
        };
      case 'bar':
        return () => {
          const currentConfig = dashboardUtils.findByName(
            this.state.boxEles, name);
          const { styleConfigs } = currentConfig;
          const data = this.filterChart(name) || DashBoardUtils.demoData.bar;
          return (<Bar
            data={data}
            config={currentConfig}
            styleConfigs={ObjectUtils.quickDeepClone(styleConfigs)}
          />);
        };
      case 'pie':
        return () => {
          const currentConfig = dashboardUtils.findByName(
            this.state.boxEles, name);
          const { styleConfigs } = currentConfig;
          const data = this.filterChart(name) || DashBoardUtils.demoData.pie;
          return (<Pie
            styleConfigs={ObjectUtils.quickDeepClone(styleConfigs)}
            config={currentConfig}
            data={data}
          />);
        };
      case 'table':
        return () => {
          const currentConfig = dashboardUtils.findByName(
            this.state.boxEles, name);
          const { styleConfigs } = currentConfig;
          const data = this.filterChart(name) || DashBoardUtils.demoData.table;
          return (<Table
            key={name}
            styleConfigs={ObjectUtils.quickDeepClone(styleConfigs)}
            data={data}
            onExport={this.onExport.bind(this, name)}
            name="name"
          />);
        };
      case 'search':
        return () => {
          const currentConfig = dashboardUtils.findByName(
            this.state.boxEles, name);
          const dsColumnMap = this.props.model.dsColumnMap;
          const searchEnum = this.props.model.searchEnum;
          return (<Search
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
      hideAdd
      type="editable-card"
      styleConfigs={ObjectUtils.quickDeepClone(comp.styleConfigs)}
      activeKey={activeKey}
      data={children}
      key={key}
      tabBarExtraContent={<Icon type="close" className="tool-icon" onClick={this.delComp.bind(this, key)} />}
      onCompDelte={(name) => {
        this.delComp(name);
      }}
      onTabClick={(tabKey) => {
        // 查找tab
        const tabContainer = dashboardUtils.findTabByPanel(this.state.boxEles, tabKey);
        // change tab activeKey
        tabContainer.activeKey = tabKey;
        this.changeEleActive(key, tabKey);
      }}
      onClick={(tabKey, childKey, e) => {
        const { boxEles } = this.state;
        const childComp = dashboardUtils.findByName(boxEles, childKey);
        if (childKey && childComp) {
          // 判断点击来源  是否需要删除当前激活查询子项
          if (!(childComp.type === 'search' && e.target.className.indexOf('query-area-item') >= 0)) {
            this.setState({
              searchChild: null,
            });
          }
          this.changeEleActive(tabKey, childKey);
        }
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
      // 兼容旧模板
      if (width == null) {
        return (
          <div key={item.name} className={'bi-container'}>
            <Icon type="close" className={'del-icon'} onClick={this.delComp.bind(this, item.name)} />
            {item.render()}
          </div>
        );
      }
      return (
        <div key={item.name} className={'bi-container'}>
          <div style={{ position: 'absolute', marginTop: margintop, marginLeft: marginleft + '%', width: width + '%', }}>
            <Icon type="close" className={'del-icon'} onClick={this.delComp.bind(this, item.name)} />
            {item.render()}
          </div>
        </div>
      );
    } else {
      // add by wangliu  0829 显示的时候讲 控件加上 布局 css
      const { margintop, marginleft, height, width } = item.styleConfigs;
      let searchIndex;   // 头部搜索框下拉框 显示
      if (item.type == "search") {
        searchIndex = (
          { zIndex: '1', }
        )
      }
      if (null == width) {
        return (
          <div key={item.name} className={'bi-container'}
            onClick={(ev) => {
              if (item.type === 'search') {
                if (ev.target.className.indexOf('query-container') >= 0 || ev.target.hasAttribute('data-reactroot')) {
                  this.changeEleActive('box', item.name);
                  this.setState({
                    searchChild: null,
                  });
                }
              } else {
                this.changeEleActive('box', item.name);
              }
            }}
          >
            <Icon type="close" className={'del-icon'} onClick={this.delComp.bind(this, item.name)} />
            {item.render()}
          </div>);
      }
      return (
        <div key={item.name + "_bi-container-css"} className={'bi-container-css'} style={searchIndex}>
          <div key={item.name} className={'bi-container'}
            style={{ position: 'absolute', marginTop: margintop, marginLeft: marginleft + '%', width: width + '%', }}
            onClick={(ev) => {
              if (item.type === 'search') {
                if (ev.target.className.indexOf('query-container') >= 0 || ev.target.hasAttribute('data-reactroot')) {
                  this.changeEleActive('box', item.name);
                  this.setState({
                    searchChild: null,
                  });
                }
              } else {
                this.changeEleActive('box', item.name);
              }
            }}
          >
            <Icon type="close" className={'del-icon'} onClick={this.delComp.bind(this, item.name)} />
            {item.render()}
          </div>
        </div>);
    }
  });
  /** 组件数据配置容器渲染 */
  renderDataConfig = () => {
    const rules = ['pie', 'bar', 'line', 'table', 'search'];
    const child = this.getActiveEle();
    // 不在规则匹配范围内 || 当前激活的是查询子项
    if (rules.indexOf(child.type) < 0 || (child.type === 'search' && this.state.searchChild !== null)) {
      return '';
    }
    const dataConfigProps = {
      onDrop: this.dataDropIn,
      sort: this.dataConfigSort,
      onDeleteItem: this.deleteDataConfigItem,
    };
    // 当前已选中数据集 & 当前激活组件为图表 & 当前组件数据集不存在
    if (this.activeDs && !child.ds.id && child.group === 'chart') {
      child.ds = ObjectUtils.deepClone(this.activeDs);
    }
    return (<Panel header="数据" key="3">
      <DataConfigControl
        dataConfigProps={dataConfigProps}
        boxEles={this.state.boxEles}
        dsColumnMap={this.props.model.dsColumnMap}
        comp={child}
        reload={this.reload}
        onChangeCheck={() => {
          this.setState({
            boxSize: this.state.boxSize + 1,
          });
        }}
      />
    </Panel>);
  };
  /** 4-组件查询数据项筛选 */
  renderScreen = () => {
    const child = this.getActiveEle();
    const { searchChild } = this.state;
    /** 判断当前激活查询子项是否存在关联 */
    if (child.type !== 'search' || searchChild === null || !child.relation[searchChild.id]) {
      return '';
    }
    return (<Panel header="筛选" key="4">
      <DataScreen
        key={`${child.name}-${searchChild.id}`}
        comp={child}
        child={searchChild}
        onChange={() => {
          this.triggerUpdate();
        }}
      />
    </Panel>);
  };
  /** 5-组件样式配置容器渲染 */
  renderStyleConfig = () => {
    const child = this.getActiveEle();
    const rules = ['line', 'bar', 'pie', 'table', 'tab', 'search'];
    if (rules.indexOf(child.type) >= 0) {
      return (
        <Panel header="样式" key="5">
          <StyleConfig
            comp={child}
            onChange={() => {
              this.triggerUpdate();
            }}
          />
        </Panel>
      );
    } else if (child.type === 'tab_panel') {
      const tabComp = dashboardUtils.findTabByPanel(this.state.boxEles, child.name);
      return (
        <Panel header="样式" key="5">
          <StyleConfig
            comp={tabComp}
            onChange={() => {
              this.triggerUpdate();
            }}
          />
        </Panel>
      );
    }
  };
  /** 6-组件数据关联关系配置容器渲染 */
  renderDataRelationConfig = () => {
    // todo 查询组件
    const rules = ['line', 'bar', 'pie'];
    const child = this.getActiveEle();
    if (rules.indexOf(child.type) >= 0) {
      const comp = this.getActiveEle();
      const arr = comp.dataConfig ? comp.dataConfig.dimension.concat(comp.dataConfig.legend) : [];
      // 获取其他图表
      const boxEles = this.state.boxEles;
      const charts = [];
      // modify wangliu  获取同一个父容器的图表   0907
      //dashboardUtils.findTagCharts(boxEles, charts, comp);
      dashboardUtils.findChartsChange(boxEles, charts, comp);
      return (
        <Panel header="关联" key="6">
          {arr.map((item) => {
            const data = {
              name: `源字段-${item.rscDisplay}`,
              children: [],
              compName: comp.name,
              fieldId: item.id,
            };
            charts.forEach((subItem) => {
              const id = subItem.ds ? subItem.ds.id : '';
              const dsColumns = this.props.model.dsColumnMap[id] || [];
              const children = [];
              dsColumns.forEach((column) => {
                // {当前组件name,当前组件字段,关联组件name，关联组件字段}
                const key = `${comp.name},${item.id},${subItem.name},${column.id}`;
                children.push({
                  label: column.rscDisplay,
                  value: key,
                });
              });
              data.children.push({
                name: `图表-${subItem.styleConfigs.title.name}`,
                key: subItem.name,
                children,
              });
            });
            const relations = comp.relation[item.id] ? comp.relation[item.id].relationFields : {};
            return (<DataConfigSelection
              relations={relations}
              data={data}
              key={item.id}
              changeCheck={this.selectRelation}
            />);
          })}
        </Panel>
      );
    }
  };
  /** 7-tab页签配置渲染 */
  renderTabConfig = () => {
    const rules = ['tab_panel', 'tab'];
    const child = this.getActiveEle();
    if (rules.indexOf(child.type) >= 0) {
      // 查找tab
      const tabContainer = dashboardUtils.findTabByPanel(this.state.boxEles, child.name);
      return (
        <Panel header="页签" key="7">
          {tabContainer && tabContainer.children.map(item => <Input style={{ marginBottom: '5px' }} key={item.name} addonAfter={<Icon type="delete" style={{ cursor: 'pointer' }} onClick={this.delTabPanel.bind(this, item.name)} />} onChange={this.updateTabPanel.bind(this, item.name)} defaultValue={item.title} />)}
          <Button type="primary" onClick={this.addTabPanel} style={{ width: '100%' }}>新增TAB页签</Button>
        </Panel>
      );
    }
    return '';
  };
  render() {
    this.mergeData();
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div className="full-height">
          {/* 顶部导航 */}
          <div className={styles['header']}>
            <div className={styles['header-left']}>
              <input
                placeholder="请输入仪表板名称"
                value={this.state.dashBoard.name}
                onChange={(e) => {
                  const dashBoard = this.state.dashBoard;
                  dashBoard.name = e.target.value;
                  this.setState({
                    dashBoard: ObjectUtils.quickDeepClone(dashBoard),
                  });
                }}
              />
            </div>
            <div className={styles['header-right']}>
              <Dropdown overlay={this.saveMenu}>
                <Button style={{ marginLeft: 8 }}>
                  保存 <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
          </div>
          <div style={{ display: 'flex', height: 'calc(100% - 35px)' }}>
            {/* 仪表板编辑展示区 */}
            <div style={{ width: 'calc(100% - 200px)', overflow: 'auto', backgroundColor: '#ececec', padding: '0px 5px 5px 5px' }} className="full-height" ref={(instance) => { this.box = instance; }} name="box" onClick={this.boxEleAcive} />
            {/* 工具栏 */}
            <div style={{ width: '250px', marginRight: '-1px', overflow: 'auto' }} className="full-height">
              <Collapse className="full-height" defaultActiveKey={['1', '2', '3', '4', '5', '6']}>
                <Panel header={<div><span>数据图表</span></div>} key="1">
                  <Tag data-key="line" onDoubleClick={this.selectChart}>折线图</Tag>
                  <Tag data-key="bar" onDoubleClick={this.selectChart}>柱状图</Tag>
                  <Tag data-key="pie" onDoubleClick={this.selectChart}>饼图</Tag>
                  <Tag data-key="table" onDoubleClick={this.selectChart}>交叉表</Tag>
                </Panel>
                <Panel header="控件" key="2">
                  <Tag data-key="search" onDoubleClick={this.selectControl}>查询条件</Tag>
                  <Tag data-key="tab" onDoubleClick={this.selectControl}>TAB</Tag>
                </Panel>
                {this.renderDataConfig()}
                {this.renderScreen()}
                {this.renderStyleConfig()}
                {this.renderDataRelationConfig()}
                {this.renderTabConfig()}
              </Collapse>
            </div>
            {/* 数据集配置区 */}
            <div style={{ width: '200px' }} className="full-height">
              <Card
                title={
                  <div onClick={this.changeShowSearchList}>
                    <span>切换数据集</span>
                    <Icon type="shrink" className="card-icon-shrink" />
                  </div>
                }
                bordered={false}
                className="dsConfigArea"
              >
                <SearchList
                  data={this.dsData}
                  visible={this.state.showSearchList}
                  val={this.activeDs}
                  onSelect={this.dsMenuSelect}
                />
                <Card title="维度" style={{ height: '50%' }}>
                  <ul className={styles.list}>
                    {this.loopListItem(this.columnData[0], 'dimension')}
                  </ul>
                </Card>
                <Card title="度量" style={{ height: '50%' }}>
                  <ul className={styles.list}>
                    {this.loopListItem(this.columnData[1], 'measure')}
                  </ul>
                </Card>
              </Card>
            </div>
          </div>
        </div>
      </DragDropContextProvider>
    );
  }
}
export default connect(state => ({
  model: state.newDashboard,
}))(NewDashboard);

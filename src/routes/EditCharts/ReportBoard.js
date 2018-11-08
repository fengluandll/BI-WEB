import { connect } from 'dva';
import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Spin, Icon, Button, Switch, message } from 'antd';
import DashBoardUtils from '../../utils/dashboardUtils';
import ReportBoardUtils from '../../utils/reportBoardUtils';
import { ChartList } from '../../componentsPro/ChartList';
import { Relation, RelationCharts, RelationChartsAuto } from '../../componentsPro/RelationUtil';
import { Bar, Pie, Line, Table } from '../../componentsPro/Charts';
import { Search } from '../../componentsPro/NewDashboard';
import { Dragact } from 'dragact';
import styles from './index.less';



const dashboardUtils = new DashBoardUtils();
const reportBoardUtils = new ReportBoardUtils();

class ReportBoard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mDashboard: {}, //m_dashboard表11
      mCharts: {},    // m_charts表   控件表  主要放控件的配置
      dataList: {},    // 查询结束后所有的 图表的 数据  key：chartID  value:data  (数据是根据 mDashboard 中的 search 中的  props  参数  进行的有参数查询)
      searchItems: {},  // 搜索框所拥有的子组件 的 数据
      idColumns: {},   // 每个图表所拥有的 维度 度量图例 和 搜索框的 子组件 所在 字段 的对应的表数据
      tableIdColumns: {},  // 每个图表 所拥有的 数据集 的 所有字段 的表数据

      activeName: "",    //  每个 图表 的 uuid名称
      fatherActiveName: "",    //  父组件 名称  root  或者 tab_panel 名称

      refreshUI: 0,   //   state 用来刷新ui 
      rightProps: [],      //   右侧选择框的参数

      editModel: "false",   // 是否编辑模式
      dragMoveChecked: false,  // 是否静止dragact移动，移动就点击无法显示右侧的编辑界面。
      dragactStyle: [],  // dragactStyle 数据
    };
    // get boardId
    this.boardId = this.props.match.params.boardId;
    this.mDashboardVia = {};   // mDashboard 从后端取过来后 放到这个变量里 对布局的任何修改都保存到这个变量，提交保存的时候提交这个变量。
  }
  componentWillMount() {
    const boardId = this.boardId;
    this.props.dispatch({
      type: 'reportBoard/fetch',
      payload: {
        boardId,
        callback: () => {
          const { mDashboard, mCharts, dataList } = this.props.model;
          const { id, name, style_config } = mDashboard;
          const md_children = JSON.parse(style_config).children;
          const dragactStyle = JSON.parse(style_config).dragactStyle;
          this.setState({
            mDashboard,
            mCharts,
            md_children,
            dataList,
            dragactStyle,
          });
        }
      }
    });

  }
  componentDidUpdate() {
    // 如果后端请求没过来 就不执行 省的报错
    if (null == this.state.mDashboard.style_config) {
      return;
    }
    if (this.state.editModel == "true") {
      //  display  左侧的控件列表
      this.disPlayLeft();
    }
    //  display  中间的图表
    this.disPlayCharts();
  }

  componentWillUnmount() {

  }

  /****************************************展示左侧仪表盘*****************************************************************/

  // 展示 左侧控件列表
  disPlayLeft() {
    const left = this.left;
    const { mDashboard, mCharts } = this.props.model;
    ReactDom.render(<ChartList
      mCharts={mCharts}
      mDashboard={mDashboard}
      addOrRemoveChart={this.addOrRemoveChart}
    />, left);
  }


  /****************************************展示右侧仪表盘*****************************************************************/

  // 搜索框关联 参数  chartid,  图表的uuuid
  disPlayRight(chartId, name) {
    //  如果不是编辑模式 右侧不相应监听事件
    if (this.state.editModel == "false" || this.state.dragMoveChecked == false) {
      return;
    }
    const rightRelation = this.rightRelation;
    const { mDashboard, mCharts } = this.state;
    // 取m_dashboard
    let fatherName;//  搜索框的farherName 用来找到  和 搜索框一起的 其他图表
    let board_item;//  搜索框的 relation
    let chart_children = [];//  和搜索框一起的图表的 集合
    let search_item; // 搜索框自身(mdashboard中 chidren 里的search )
    const { id, style_config } = mDashboard;
    const md_children = JSON.parse(style_config).children;
    md_children.map((item, index) => {
      if (item.name == name) {
        board_item = item.relation;
        fatherName = item.fatherName;
        search_item = item;
      }
    });
    // 找到和 搜索框一起的 图表
    md_children.map((item, index) => {
      if (item.fatherName == fatherName && item.type != "tab" && item.type != "search") {
        chart_children.push(item);
      }
    });

    mCharts.map((item, index) => {
      if (item.id == chartId) {
        ReactDom.render(
          <Relation mChart={item}
            relation={board_item}
            search_item={search_item}
            searchItems={this.props.model.searchItems}
            chart_children={chart_children}
            mCharts={this.props.model.mCharts}
            tableIdColumns={this.props.model.tableIdColumns}
            changeSearchItem={this.changeSearchItem}
            changeCheckRelation={this.changeCheckRelation}
            name={name}
          />, rightRelation);
      }
    });

  }

  // 图表关联
  disPlayRightCharts(chartId, name) {
    //  如果不是编辑模式 右侧不相应监听事件
    if (this.state.editModel == "false") {
      return;
    }
    // 先清除右侧的样式
    ReactDom.render(<div></div>, this.rightRelation);
    const rightRelation = this.rightRelation;
    const { mDashboard, mCharts } = this.state;
    // 取m_dashboard
    let fatherName;//  图表的farherName 用来找到  和 搜索框一起的 其他图表
    let board_item;//  图表的 relation
    let chart_children = [];//  和图表一起的图表的 集合
    const { id, style_config } = mDashboard;
    const md_children = JSON.parse(style_config).children;
    md_children.map((item, index) => {
      if (item.name == name) {
        board_item = item.relation;
        fatherName = item.fatherName;
      }
    });
    // 找到和 图表一起的 图表
    md_children.map((item, index) => {
      if (item.fatherName == fatherName && item.type != "tab" && item.type != "search" && item.name != name) {
        chart_children.push(item);
      }
    });

    mCharts.map((item, index) => {
      if (item.id == chartId) {
        ReactDom.render(
          <RelationChartsAuto mChart={item}
            relation={board_item}
            chart_children={chart_children}
            mCharts={this.props.model.mCharts}
            tableIdColumns={this.props.model.tableIdColumns}
            idColumns={this.props.model.idColumns}
            changeCheckRelation={this.changeCheckRelation}
            name={name}
          />, rightRelation);
      }
    });
  }


  /****************************************展示中间仪表盘*****************************************************************/
  //  展示中间的图表
  disPlayCharts() {
    this.renderChilren();
  }

  // 展示每一个图表
  renderChilren() {
    const children = JSON.parse(this.state.mDashboard.style_config).children;
    this.renderContent(children);
  }

  //  展示 tab
  renderTab(tabChildren) {
    if (tabChildren && tabChildren.size > 0) {
      tabChildren.map((item, index) => {
        const { children, name, title } = item;
        return (
          <TabPane tab={item.title} key={item.name} closable={false}>
            <div>
              {this.renderContent(children)}
            </div>
          </TabPane>
        );
      });
    }
  }

  //  循环自己 然后展示出所有的 图表
  renderContent(children) {
    if (children && children.length > 0) {
      children.map((item, index) => {
        const { type, name, chartId, styleConfig, relation } = item;
        // 从 datalist 中 根据 chartId 取出  数据
        const dateSetList = this.state.dataList[name];
        const mCharts = this.props.model.mCharts;
        let mChart;
        // 根据 chartId 寻找 m_charts 
        mCharts.map((obj) => {
          if (obj.id == chartId) {
            mChart = obj;
          }
        });
        if (type == "line") {
          this.renderLine(name, dateSetList, mChart, styleConfig);
        } else if (type == "bar") {
          this.renderBar(name, dateSetList, mChart, styleConfig);
        } else if (type == "pie") {
          this.renderPie(name, dateSetList, mChart, styleConfig);
        } else if (type == "table") {
          this.renderTable(name, dateSetList, mChart, styleConfig);
        } else if (type == "search") {
          //return this.renderSearch(relation, mChart, styleConfig);
          this.renderSearch(item, mChart);
        } else if (type == "tab") {
          const tabChildren = item.children;  //  取得 tab 下的  tab_tabel
          return this.renderTab(tabChildren);
        }
      });
    }
  }
  /****************************************图形展示*****************************************************************/
  // 展示 折线图
  renderLine(name, dateSetList, mChart, styleConfig) {
    ReactDom.render(
      <div className={'bi-container'}
        onClick={(ev) => {
          //  显示右侧的图表关联
          this.disPlayRightCharts(mChart.id, name);
          //  讲展示右侧的变量参数放入 state 中
          const rightProps = [];
          rightProps.push(mChart.id);
          rightProps.push(name);
          this.setState({
            rightProps,
          });
        }}
      >
        <Line
          dragactStyle={this.state.dragactStyle}
          editModel={this.state.editModel}
          mChart={mChart}
          dateSetList={dateSetList}
          onPlotClick={this.onPlotClick}
        />
      </div>,
      document.getElementById(name));

  }

  // 展示 柱状图
  renderBar(name, dateSetList, mChart, styleConfig) {
    ReactDom.render(
      <div className={'bi-container'}
        onClick={(ev) => {
          //  显示右侧的图表关联
          this.disPlayRightCharts(mChart.id, name);
          //  讲展示右侧的变量参数放入 state 中
          const rightProps = [];
          rightProps.push(mChart.id);
          rightProps.push(name);
          this.setState({
            rightProps,
          });
        }}
      >
        <Bar
          dragactStyle={this.state.dragactStyle}
          editModel={this.state.editModel}
          mChart={mChart}
          dateSetList={dateSetList}
          onPlotClick={this.onPlotClick}
        />
      </div>,
      document.getElementById(name));
  }
  // 展示 饼图
  renderPie(name, dateSetList, mChart, styleConfig) {
    ReactDom.render(
      <div className={'bi-container'}
        onClick={(ev) => {
          //  显示右侧的图表关联
          this.disPlayRightCharts(mChart.id, name);
          //  讲展示右侧的变量参数放入 state 中
          const rightProps = [];
          rightProps.push(mChart.id);
          rightProps.push(name);
          this.setState({
            rightProps,
          });
        }}
      >
        <Pie
          dragactStyle={this.state.dragactStyle}
          editModel={this.state.editModel}
          mChart={mChart}
          dateSetList={dateSetList}
          onPlotClick={this.onPlotClick}
        />
      </div>,
      document.getElementById(name));
  }
  // 展示 交叉表
  renderTable(name, dateSetList, mChart, styleConfig) {
    ReactDom.render(
      <div className={'bi-container'}>
        <Table
          dragactStyle={this.state.dragactStyle}
          editModel={this.state.editModel}
          mChart={mChart}
          dateSetList={dateSetList}
        />
      </div>,
      document.getElementById(name));
  }
  // 展示 搜索框
  renderSearch(item, mChart) {
    const { name, chartId, styleConfig, relation } = item;
    const searchEnum = this.props.model.searchEnum;
    ReactDom.render(
      <div className={'bi-container'}
        style={{ cursor: 'pointer' }}
        onClick={(ev) => {
          if (ev.target.className.indexOf('query-container') >= 0 || ev.target.hasAttribute('data-reactroot')) {
            //  搜索框的点击事件
            this.disPlayRight(chartId, name);
            //  讲展示右侧的变量参数放入 state 中
            const rightProps = [];
            rightProps.push(chartId);
            rightProps.push(name);
            this.setState({
              rightProps,
            });
          }
        }}
      >
        <Search
          dragactStyle={this.state.dragactStyle}
          editModel={this.state.editModel}
          relation={relation}
          mChart={mChart}
          styleConfig={styleConfig}
          chart_item={item}
          onLoad={this.searchItemData}
          searchEnum={searchEnum}
          clickSearch={this.searchData}
          changeProps={this.changeProps}
        />

      </div>, document.getElementById(name));
  }
  /*****************************************控制UI*****************************************************************/

  // 刷新页面
  refreshDashboard() {
    this.setState({
      refreshUI: this.state.refreshUI + 1,
    });
  }

  // 添加新的图表chart
  addNewChart = (mChart) => {
    // 获取接受的数据
    const chartId = mChart.id;
    const config = JSON.parse(mChart.config);
    const { type } = config;
    let tmpType;

    // 制造json数据 
    // relation:{ id:{ label:,relationFields:[],props:[], }},
    const relation = {};
    let dragactW;  // dragact宽度
    let dragactH;  // dragact高度
    if (type == "0") {
      // 折线图
      tmpType = "line";
      const dimension = config.dimension;
      const measure = config.measure;
      const color = config.color;
      const item = {};
      item.relationFields = {};
      relation[dimension] = item;
      relation[measure] = item;
      relation[color] = item;
      dragactW = 20;
      dragactH = 10;
    } else if (type == "1") {
      // 柱状图
      tmpType = "bar";
      const dimension = config.dimension;
      const measure = config.measure;
      const color = config.color;
      const item = {};
      item.relationFields = {};
      relation[dimension] = item;
      relation[measure] = item;
      relation[color] = item;
      dragactW = 20;
      dragactH = 10;
    } else if (type == "2") {
      // 饼图
      tmpType = "pie";
      const dimension = config.dimension;
      const measure = config.measure;
      const item = {};
      item.relationFields = {};
      relation[dimension] = item;
      relation[measure] = item;
      dragactW = 20;
      dragactH = 10;
    } else if (type == "3") {
      //  交叉表
      tmpType = "table";
      const column = config.column;
      relation.column = column;
      dragactW = 20;
      dragactH = 10;
    } else if (type == "11") {
      //  搜索框
      tmpType = "search";
      const searchJson = config.searchJson;
      const keys = Object.keys(searchJson);
      for (let i; i < keys.length; i++) {
        const search = searchJson[keys[i]];
        const label = search.name;
        const item = {};
        item.label = label;
        item.relationFields = {};
        item.props = [];
        relation[keys[i]] = item;
      }

    }
    const item = {
      name: chartId.toString(),
      type: tmpType,
      chartId: chartId.toString(),
      fatherName: "root",
      styleConfig: "",
      relation: relation,
    };
    //  放入children
    const { mDashboard } = this.state;
    const { style_config } = mDashboard;
    const style_config_obj = JSON.parse(style_config);
    const md_children = style_config_obj.children;
    md_children.push(item);
    // 增加dragact样式
    const dragactStyle = style_config_obj.dragactStyle;
    const dragact_item = { GridX: 0, GridY: 25, w: dragactW, h: dragactH, key: chartId.toString() };
    dragactStyle.push(dragact_item);
    // md_children转回string  然后刷新state
    style_config_obj.children = md_children;
    style_config_obj.dragactStyle = dragactStyle;
    mDashboard.style_config = JSON.stringify(style_config_obj);
    // 加上为搜索框全部Item自动配置和图表的关联 20181101
    reportBoardUtils.addSearchChartRelationAuto(mDashboard, this.props.tableIdColumns, mChart);
    this.setState({
      mDashboard: mDashboard,
    });
  }

  // 编辑按钮
  changeEditeMode = (e) => {
    let editModel = this.state.editModel;
    const boardId = this.boardId;
    if (editModel == "true") {
      //  如果是展示 则调用保存mdashboard
      this.saveDashBoard();
      editModel = "false";
      this.setState({
        editModel: editModel,
      });
    } else {
      editModel = "true";
      this.props.dispatch({
        type: 'reportBoard/fetchEdit',
        payload: {
          boardId,
          callback: () => {
            const { mDashboard, searchItems, idColumns, tableIdColumns } = this.props.model;
            this.setState({
              mDashboard,
              searchItems,
              idColumns,
              tableIdColumns,
              editModel: editModel,
            });
          }
        }
      });
    }
  }
  onMouseEnterShow = (e) => {
    e.target.style.opacity = 1;
  }
  onMouseLeaveHide = (e) => {
    e.target.style.opacity = 0;

  }
  /****************************************点击事件*****************************************************************/

  //  点击搜索查询
  searchData = (value) => {
    // 请求数据
    this.props.dispatch({
      type: 'reportBoard/searchData',
      payload: {
        mdashboard: this.state.mDashboard,
        boardId: this.boardId,
        value: value,
        callback: () => {
          //  display  中间的图表
          this.setState({
            dataList: this.props.model.dataList,
          });
        },
      },
    });
  }
  //  改变搜索框的参数  
  changeProps = (chart_item) => {
    const { mDashboard } = this.state;
    const { style_config } = mDashboard;
    const style_config_obj = JSON.parse(style_config);
    const md_children = style_config_obj.children;
    md_children.map((item, index) => {
      if (item.name == chart_item.name) {
        item.relation = chart_item.relation;
      }
    });
    // md_children转回string  然后刷新state
    style_config_obj.children = md_children;
    mDashboard.style_config = JSON.stringify(style_config_obj);
    this.setState({
      mDashboard: mDashboard,
    });
  }

  //  点击搜索框,str的时候查询下拉框的数据
  searchItemData = (id) => {
    // 思路 rs_column_conf 表中的  id  取得 rsc_name 便可查询  参数 配上 所有的搜索框参数

    // 请求枚举数据
    this.props.dispatch({
      type: 'reportBoard/searchItemData',
      payload: {
        id,
        boardId: this.boardId,
        callback: () => {
          // 刷新ui
          this.refreshDashboard();
        },
      },
    });
  }

  // 点击保存
  saveDashBoard = () => {
    //  获取变量 
    this.props.dispatch({
      type: 'reportBoard/saveDashBoard',
      payload: {
        mDashboard_porp: this.state.mDashboard,
        callback: (success) => {
          // alert 保存成功
          if (success) {
            message.success('保存成功');
          } else {
            message.error('保存失败');
          }
        }
      }
    });
  }

  // 关联关系点击回调
  // 修改 搜索的 item 增加或减少
  // id 是当前图表的uuuid  
  changeSearchItem = (id, value) => {
    // 思路 看 relation里有没有 name,有就删除，没有就新增一个空的
    const { mDashboard } = this.state;
    const { style_config } = mDashboard;
    const style_config_obj = JSON.parse(style_config);
    const md_children = style_config_obj.children;
    md_children.map((item, index) => {
      if (item.name == id) {
        // relation 关联关系
        const relation = item.relation;
        const relation_keys = Object.keys(relation);
        const value_keys = value;
        // 有就删除
        for (let i = 0; i < relation_keys.length; i++) {
          let flag = false;
          for (let j = 0; j < value_keys.length; j++) {
            if (relation_keys[i] == value_keys[j]) {
              flag = true;
            }
          }
          if (!flag) {
            delete relation[relation_keys[i]];
          }
        }
        // 没有就增加一个   relationFields:"图表uuuid,columnid"
        for (let i = 0; i < value_keys.length; i++) {
          let flag = false;
          for (let j = 0; j < relation_keys.length; j++) {
            if (value_keys[i] == relation_keys[j]) {
              flag = true;
            }
          }
          if (!flag) {
            const relationItem = { label: "", relationFields: {}, props: [] }
            relation[value_keys[i]] = relationItem;
          }
        }
      }
    });
    // md_children转回string  然后刷新state
    style_config_obj.children = md_children;
    mDashboard.style_config = JSON.stringify(style_config_obj);
    this.setState({
      mDashboard: mDashboard,
    });
    // 重新调用展示右侧
    const rightProps = this.state.rightProps;
    this.disPlayRight(rightProps[0], rightProps[1]);
    // 更新ui(主要是搜索框的子项个数)
    this.refreshDashboard();
  }

  // 修改图表之间的关联关系
  // 参数  id search里面的itemid(rsc_column_config), dimension维度id , value   relation里拼好的  "name":{ label:,relationFields:{"chart_item_name":[value]},props:, }
  changeCheckRelation = (id, dimension, value) => {
    const { mDashboard } = this.state;
    const { style_config } = mDashboard;
    const style_config_obj = JSON.parse(style_config);
    const md_children = style_config_obj.children;
    let type;// 图表的类型
    md_children.map((item, index) => {
      if (item.chartId == id) {
        // relation 关联关系
        const relation = item.relation;
        const object = relation[dimension];
        let relationFields = object.relationFields;
        type = item.type;
        // 拼接 relationFields 里的关联关系  relationFields ["uuuid,columnid"]
        //const field = `${chart_item_name},${value}`;
        // 拼接 relationFields 里的关联关系  relationFields {"uuuid":"columnid"}
        //relationFields[chart_item_name] = value;
        // 清空relationFields
        relationFields = {};
        // 将value中的值放入relationFields
        value.map((value_item) => {
          const arr = value_item.toString().split("\:");
          const value_array = [];
          value_array.push(value_item.toString());
          relationFields[arr[0]] = value_array;
        });
        object.relationFields = relationFields;
      }
    });
    // md_children转回string  然后刷新state
    style_config_obj.children = md_children;
    mDashboard.style_config = JSON.stringify(style_config_obj);
    this.setState({
      mDashboard: mDashboard,
    });
  }

  //  左侧配置图表 点击删除或增加图表
  addOrRemoveChart = (value) => {
    const { mDashboard } = this.state;
    const { style_config } = mDashboard;
    const style_config_obj = JSON.parse(style_config);
    const children = style_config_obj.children;
    const dragactStyle = style_config_obj.dragactStyle;
    let len = value.length;
    let chartId;  // 要增加的图表的chartID
    if (len > children.length) {
      //  复选框值比mDashboard中的多 要增加
      for (let i = 0; i < len; i++) {
        let flag = 0;
        for (let j = 0; j < children.length; j++) {
          if (value[i] == children[j].chartId) {
            flag = 1;
          }
        }
        if (flag == 0) {
          chartId = value[i];
        }
      }
      // 找到对应的mChart表，并调用增加方法
      const mCharts = this.state.mCharts;
      mCharts.map((item, index) => {
        if (item.id.toString() == chartId) {
          this.addNewChart(item);
        }
      });
    } else {
      //  复选框值比mDashboard中的少 要删除
      for (let i = 0; i < children.length; i++) {
        let flag = 0;
        for (let j = 0; j < len; j++) {
          if (children[i].chartId == value[j]) {
            flag = 1;
          }
        }
        if (flag == 0) {
          chartId = children[i].chartId;
          children.splice(i, 1);//  删除children数组
          // 删除dragact样式
          for (let k = 0; k < dragactStyle.length; k++) {
            if (dragactStyle[k].key.toString() == chartId) {
              dragactStyle.splice(k, 1);
            }
          }
        }
      }
      // md_children转回string  然后刷新state
      style_config_obj.children = children;
      style_config_obj.dragactStyle = dragactStyle;
      mDashboard.style_config = JSON.stringify(style_config_obj);
      this.setState({
        mDashboard: mDashboard,
      });
    }
    //  刷新ui
    this.refreshDashboard();
  }

  //  设置右侧开关 控制dragact是否可移动
  changeDragMoveChecked = () => {
    const check = this.state.dragMoveChecked;
    if (check == true) {
      this.setState({
        dragMoveChecked: false,
      });
      // 清除右侧的关联界面
      ReactDom.render(<div></div>, this.rightRelation);
    } else {
      this.setState({
        dragMoveChecked: true,
      });
    }
  }

  // 图表的plot点击事件
  //  点击获取图表的 维度、度量、图例 参数进行图表关联查询
  onPlotClick = (data, dimension, chartId) => {
    if (this.state.editModel == "true") {
      return;
    }
    const origin = data._origin;
    const dimensionValue = origin["维度"];  //  图表维度的值
    const value = [];
    value.push(dimension);  // 图表维度的字段 id
    value.push(dimensionValue);  // 值
    value.push(chartId);  // 图表的名称(mchart表id)
    this.searchData(value);
  }

  /****************************************************dragact*****************************************************/
  // 拖拽后本地缓存
  handleOnDragEnd = () => {
    //新的布局,通过getLayout方法获取拖拽节点
    const newLayout = this.dragactNode.getLayout();
    const array = [];
    newLayout.map((item, index) => {
      const GridX = item.GridX;
      const GridY = item.GridY;
      const w = item.w;
      const h = item.h;
      const key = item.key;
      let chart = { GridX, GridY, w, h, key };
      if (item.type == "search") {
        chart.type = "search";
      }
      array.push(chart);
    });
    const mDashboard = this.state.mDashboard;
    const { id, style_config } = mDashboard;
    const style_config_obj = JSON.parse(style_config);
    style_config_obj.dragactStyle = array;
    mDashboard.style_config = JSON.stringify(style_config_obj);
    // 给state赋值
    this.setState({
      dragactStyle: array,
    });
  }
  // 初始化的时候获取数据库里的 dragact数据
  getDragactData = () => {
    const fakeData = [
      { GridX: 8, GridY: 0, w: 1, h: 1, key: '1' }
    ];
    const style_config = this.state.mDashboard.style_config;
    if (style_config) {
      const data = JSON.parse(style_config).dragactStyle;
      return data;
    } else {
      return fakeData;
    }
  }

  /****************************************************************************************************************/
  render() {
    const data = this.getDragactData();
    //  设置dragact静止拖动  展示的时候和右侧开关为开的时候静止拖动
    if (this.state.editModel == "false" || this.state.dragMoveChecked == true) {
      data.map((item, index) => {
        item.static = "true";
      });
    }
    const dragactInit = {
      width: this.state.editModel == "true" ? document.getElementsByTagName('body')[0].offsetWidth - 400 : document.getElementsByTagName('body')[0].offsetWidth - 10,
      col: 40,
      rowHeight: 40,
      margin: [0, 0],
      className: 'plant-layout',
      layout: data,
      placeholder: true,
      style: {
        border: "1px solid #E8E8E8",
      }
    }
    // dragact样式
    const getblockStyle = isDragging => {
      return {
        background: isDragging ? '#ccc' : '#ccc'
      }
    }

    return (
      <div>
        <div style={{ width: 30, height: 300, border: '2px solid #ccc', borderRadius: 6, borderLeft: '0', opacity: 0, position: 'absolute', top: '50%', marginTop: -150, left: 0, zIndex: 1000, fontSize: 26, textAlign: 'center', lineHeight: 11, cursor: 'pointer' }} onClick={this.changeEditeMode} onMouseEnter={this.onMouseEnterShow.bind(this)} onMouseLeave={this.onMouseLeaveHide.bind(this)}>||</div>
        {this.state.editModel == "true" ? <div className={styles['boardLeft']} ref={(instance) => { this.left = instance; }} > </div> : <div></div>}
        <div id="contents" className={`boardcenter_report`} ref={(instance) => { this.center = instance; }} style={{ paddingLeft: (this.state.editModel == "true") ? "200px" : "0", paddingRight: (this.state.editModel == "true") ? "200px" : "0", }}>
          <Dragact
            {...dragactInit}
            ref={node => node ? this.dragactNode = node : null}
            onDragEnd={this.handleOnDragEnd}>
            {(item, provided) => {
              let zIndex = 1;
              if (item.type && item.type == "search") {
                zIndex = 10;
              }
              return (
                <div
                  {...provided.props}
                  //provided.dragHandle:获取拖拽的属性
                  {...provided.dragHandle}
                  //设置样式
                  style={{
                    //获取原型父组件的样式
                    ...provided.props.style,
                    //监听每一个组件的拖拽状态
                    ...getblockStyle(provided.isDragging),
                    zIndex: zIndex
                  }}
                >
                  {this.state.editModel == "true" ?
                    <span
                      //调整大小
                      {...provided.resizeHandle}
                      style={{
                        position: 'absolute',
                        width: 10, height: 10, right: 2, bottom: 2, cursor: 'se-resize',
                        borderRight: '2px solid rgba(15,15,15,0.2)',
                        borderBottom: '2px solid rgba(15,15,15,0.2)'
                      }}
                    /> : <div></div>}
                  <div id={item.key}></div>
                </div>
              )
            }}
          </Dragact>
        </div>
        {this.state.editModel == "true" ? <div className={styles['boardRight']} ref={(instance) => { this.right = instance; }} >
          <div><Switch checkedChildren="开" unCheckedChildren="关" checked={this.state.dragMoveChecked} onChange={this.changeDragMoveChecked} /></div>
          <div ref={(instance) => { this.rightRelation = instance; }}></div>
        </div> : <div></div>}
      </div>
    );
  }
}
export default connect(state => ({
  model: state.reportBoard,
}))(ReportBoard);

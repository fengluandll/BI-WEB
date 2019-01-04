import { connect } from 'dva';
import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Switch, message, Tabs, Button, Spin, Modal, Radio } from 'antd';
import ReportBoardUtils from '../../utils/reportBoardUtils';
import TabUtils from '../../utils/tabUtils';
import CssUtils from '../../utils/cssUtils';
import { ChartList, TabList } from '../../componentsPro/ChartList';
import { Relation, RelationChartsAuto, TabName } from '../../componentsPro/RelationUtil';
import { Bar, Pie, Line, Table, Pivottable, Perspective } from '../../componentsPro/Charts';
import { Search } from '../../componentsPro/NewDashboard';
import { Dragact } from 'dragact';
import styles from './index.less';

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const reportBoardUtils = new ReportBoardUtils();
const tabUtils = new TabUtils();
const cssUtils = new CssUtils();

class ReportBoard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mDashboard_old: {}, // m_dashboard原始数据 addby wangliu 20181130,这个为m_dashboard表原始数据,mDashboard是取得其中一个children
      mDashboard: {}, //m_dashboard表
      mCharts: {},    // m_charts表   控件表  主要放控件的配置
      dataList: {},    // 查询结束后所有的 图表的 数据  key：chartID  value:data  (数据是根据 mDashboard 中的 search 中的  props  参数  进行的有参数查询)
      searchItems: {},  // 搜索框所拥有的子组件 的 数据
      idColumns: {},   // 每个图表所拥有的 维度 度量图例 和 搜索框的 子组件 所在 字段 的对应的表数据
      tableIdColumns: {},  // 每个图表 所拥有的 数据集 的 所有字段 的表数据

      activeName: "",    //  每个报表的uuid名称,也就是m_dashboard中style_config的name
      fatherActiveName: "",    //  父组件 名称  root  或者 tab_panel 名称

      tagName: {}, // 当前tag的名称 {key,value}存储
      tagNames: [], // 所有tag的名称

      refreshUI: 0,   //   state 用来刷新ui 
      rightProps: [],      //   右侧选择框的参数
      spinning: false,   // 是否显示加载中
      plotClickFlag: false, // flag是否plot点击

      editModel: "false",   // 是否编辑模式
      dragMoveChecked: false,  // 是否静止dragact移动，移动就点击无法显示右侧的编辑界面。

      user_type: "", // 权限控制,用户类型
      user_auth: "0", // 权限控制,是否有编辑权限,"1"有权限
    };
    // get boardId
    this.boardId = this.props.match.params.boardId;
    // 被plot点击查询的图表id
    this.plotChartId = [];
    // 点击图表div的次数
    this.clickChartDivTimes = 0;
  }
  componentWillMount() {
    const boardId = this.boardId;

    // 初始化先请求结构数据
    this.props.dispatch({
      type: 'reportBoard/fetch',
      payload: {
        boardId,
        callback: () => {
          const { mDashboard_old, mCharts, user_type, user_auth } = this.props.model;
          const { tagName, tagNames } = this.state;
          const mDashboard = reportBoardUtils.getStyle_configByOrder(mDashboard_old, tagName, tagNames);
          this.fetchData(boardId, mDashboard);//查询数据
          this.setState({
            mDashboard_old,
            mDashboard,
            mCharts,
            tagName,
            tagNames,
            user_type,
            user_auth,
            spinning: true,// 初始化时候设置为加载中
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
      this.disPlayChartList();
    }
    //  display  中间的图表
    this.disPlayCharts();
  }

  componentWillUnmount() {

  }
  fetchData = (boardId, mDashboard) => {
    // 请求回结构数据后再请求图表数据 数据先请求可以快0.5秒
    this.props.dispatch({
      type: 'reportBoard/fetchData',
      payload: {
        boardId,
        mDashboard,
        callback: () => {
          const { dataList } = this.props.model;
          this.setState({
            dataList,
            spinning: false, // 数据加载完成设置为false
          });
          const keys = Object.keys(dataList);
          if (keys != null && keys.length > 8) {
            // 延时刷新
            this.refreshDashboardTimeout(1000);
          } else {
            // 延时刷新
            this.refreshDashboardTimeout();
          }
        }
      }
    });
  }

  /****************************************展示左侧仪表盘*****************************************************************/

  // 展示 左侧控件列表
  disPlayLeft() {
    const { mDashboard, mCharts, mDashboard_old } = this.state;
    const { tDashboard } = this.props.model;
    return (
      <div>
        {/* logo标题start */}
        <div style={{ height: '39px', position: 'relative', lineHeight: '39px', textAlign: 'center', borderRight: '1px solid #ccc', background: '#eee', overflow: 'hidden' }}><h1 style={{ color: '#1890ff', fontSize: '16px' }}>编辑模式</h1></div>
        {/* logo标题end */}
        <div ref={(instance) => { this.chartList = instance }}></div>{/* 控件列表 */}
        <div>{/*只有customer才有权限看到*/}
          {this.state.user_type == 'customer' ?
            <TabList
              mCharts={mCharts}
              mDashboard_old={mDashboard_old}
              tDashboard={tDashboard}
              updateState={this.updateState}
            /> : <div></div>}
        </div>
      </div>
    );
  }
  // 展示 左侧控件列表
  disPlayChartList() {
    const chartList = this.chartList;
    ReactDom.render(<div></div>, chartList); // 清空
    const { mDashboard, mCharts, mDashboard_old } = this.state;
    ReactDom.render(
      <ChartList
        mCharts={mCharts}
        mDashboard={mDashboard}
        addOrRemoveChart={this.addOrRemoveChart}
      />, chartList);
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
            changeSearchRelation={this.changeSearchRelation}
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

  // 展示右侧tab的名称
  displayTabName = () => {
    //  如果不是编辑模式 右侧不相应监听事件
    if (this.state.editModel == "false") {
      return;
    }
    // 先清除右侧的样式
    ReactDom.render(<div></div>, this.rightRelation);
    const rightRelation = this.rightRelation;
    const { tagName } = this.state;
    ReactDom.render(
      <TabName
        tagName={tagName}
        changeTabName={this.changeTabName}
      />, rightRelation);

  }


  /****************************************展示中间仪表盘*****************************************************************/
  //  展示中间的图表
  disPlayCharts() {
    const children = JSON.parse(this.state.mDashboard.style_config).children;
    if (children && children.length > 0) {
      children.map((item, index) => {
        const { type, name, chartId, styleConfig, relation } = item;
        // 没有被plot点击关联的图表或者是编辑模式的时候
        if (this.plotChartId.length == 0 || this.state.editModel == "true") {
          this.renderContent(item);
        } else if (this.plotChartId.indexOf(chartId) > -1) {// 被点击的plot展示
          this.renderContent(item);
        }
      });
    }
  }

  //  展示 tab
  renderTab = () => {
    // 如果后端请求没过来 就不执行 省的报错
    if (null == this.state.mDashboard.style_config) {
      return;
    }
    // 拼接panes
    const panes = [];
    const { tagName, tagNames, editModel } = this.state;
    for (let key in tagNames) {
      const obj = {};
      obj.title = tagNames[key];
      obj.key = key;
      panes.push(obj);
    }
    let activeKey; // 当前tab
    for (let key in tagName) {
      activeKey = key;
    }
    // tab的样式类型
    let type = "card";
    if (editModel == "true") {
      type = "editable-card";
    }
    return (
      <div
        onClick={(ev) => {
          this.displayTabName();
        }}
      >
        <Tabs
          onChange={this.tabOnChange}
          activeKey={activeKey}
          type={type}
          onEdit={this.onTabsEdit}
          size="small"
        >
          {panes.map(pane => <TabPane tab={pane.title} key={pane.key} closable={pane.closable}></TabPane>)}
        </Tabs>
      </div>
    );
  }

  //  循环自己 然后展示出所有的 图表
  renderContent(item) {
    const { type, name, chartId, styleConfig, relation } = item;
    // 从 datalist 中 根据 chartId 取出  数据
    let dateSetList = this.state.dataList[name];
    // 数据 如果前期进来数据为空那就遭些假数据用用  add by wangliu 20181128
    if (null == dateSetList) {
      dateSetList = reportBoardUtils.getFakeData(type);
    }
    const mCharts = this.props.model.mCharts;
    // 根据 chartId 寻找 m_charts
    const mChart = reportBoardUtils.getMChartByChartId(mCharts, chartId);
    if (type == "line") {
      this.renderLine(name, dateSetList, mChart, styleConfig);
    } else if (type == "bar") {
      this.renderBar(name, dateSetList, mChart, styleConfig);
    } else if (type == "pie") {
      this.renderPie(name, dateSetList, mChart, styleConfig);
    } else if (type == "table") {
      this.renderTable(name, dateSetList, mChart, styleConfig);
    } else if (type == "search") {
      this.renderSearch(item, mChart);
    } else if (type == "pivottable") {
      this.renderPivottable(name, dateSetList, mChart, styleConfig);
    } else if (type == "perspective") {
      this.renderPerspective(name, dateSetList, mChart, styleConfig);
    }
  }
  /****************************************图形展示*****************************************************************/
  // 展示 折线图
  renderLine(name, dateSetList, mChart, styleConfig) {
    const spinning = this.state.spinning;
    let cssName = cssUtils.getBIContainer(mChart);
    const { dragactStyle } = JSON.parse(this.state.mDashboard.style_config);
    ReactDom.render(
      <div className={cssName}
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
        <Spin spinning={spinning}>
          <Line
            dragactStyle={dragactStyle}
            editModel={this.state.editModel}
            mChart={mChart}
            dateSetList={dateSetList}
            onPlotClick={this.onPlotClick}
          />
        </Spin>
      </div>,
      document.getElementById(name));
  }

  // 展示 柱状图
  renderBar(name, dateSetList, mChart, styleConfig) {
    const spinning = this.state.spinning;
    let cssName = cssUtils.getBIContainer(mChart);
    const { dragactStyle } = JSON.parse(this.state.mDashboard.style_config);
    ReactDom.render(
      <div className={cssName}
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
        <Spin spinning={spinning}>
          <Bar
            dragactStyle={dragactStyle}
            editModel={this.state.editModel}
            mChart={mChart}
            dateSetList={dateSetList}
            onPlotClick={this.onPlotClick}
          />
        </Spin>
      </div>,
      document.getElementById(name));
  }
  // 展示 饼图
  renderPie(name, dateSetList, mChart, styleConfig) {
    const spinning = this.state.spinning;
    let cssName = cssUtils.getBIContainer(mChart);
    const { dragactStyle } = JSON.parse(this.state.mDashboard.style_config);
    ReactDom.render(
      <div className={cssName}
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
        <Spin spinning={spinning}>
          <Pie
            dragactStyle={dragactStyle}
            editModel={this.state.editModel}
            mChart={mChart}
            dateSetList={dateSetList}
            onPlotClick={this.onPlotClick}
          />
        </Spin>
      </div>,
      document.getElementById(name));
  }
  // 展示 交叉表
  renderTable(name, dateSetList, mChart, styleConfig) {
    const spinning = this.state.spinning;
    let cssName = cssUtils.getBIContainer(mChart);
    const { dragactStyle } = JSON.parse(this.state.mDashboard.style_config);
    ReactDom.render(
      <div className={cssName}>
        <Spin spinning={spinning}>
          <Table
            dragactStyle={dragactStyle}
            editModel={this.state.editModel}
            mChart={mChart}
            dateSetList={dateSetList}
          />
        </Spin>
      </div>,
      document.getElementById(name));
  }
  // pivottable
  renderPivottable(name, dateSetList, mChart, styleConfig) {
    const spinning = this.state.spinning;
    let cssName = cssUtils.getBIContainer(mChart);
    const { dragactStyle } = JSON.parse(this.state.mDashboard.style_config);
    ReactDom.render(
      <div className={cssName}>
        <Spin spinning={spinning}>
          <Pivottable
            dragactStyle={dragactStyle}
            editModel={this.state.editModel}
            mChart={mChart}
            dateSetList={dateSetList}
          />
        </Spin>
      </div>,
      document.getElementById(name));
  }
  // perspective
  renderPerspective(name, dateSetList, mChart, styleConfig) {
    const spinning = this.state.spinning;
    let cssName = cssUtils.getBIContainer(mChart);
    const { dragactStyle } = JSON.parse(this.state.mDashboard.style_config);
    ReactDom.render(
      <div className={cssName}>
        <Spin spinning={spinning}>
          <Perspective
            dragactStyle={dragactStyle}
            editModel={this.state.editModel}
            mChart={mChart}
            dateSetList={dateSetList}
          />
        </Spin>
      </div>,
      document.getElementById(name));
  }
  // 展示 搜索框
  renderSearch(item, mChart) {
    const { name, chartId, styleConfig, relation } = item;
    const searchEnum = this.props.model.searchEnum;
    let cssName = cssUtils.getBIContainer(mChart);
    const { dragactStyle } = JSON.parse(this.state.mDashboard.style_config);
    ReactDom.render(
      <div className={cssName}
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
          dragactStyle={dragactStyle}
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

  // 延时刷新
  refreshDashboardTimeout = (time) => {
    if (null == time) {
      time = 100;
    }
    setTimeout(
      () => { this.refreshDashboard() },
      time
    );
  }

  // 添加新的图表chart
  addNewChart = (mChart) => {
    const { mDashboard } = this.state;
    // 新增
    reportBoardUtils.addNewChart(mChart, mDashboard);
    // 加上为搜索框全部Item自动配置和图表的关联 20181101
    reportBoardUtils.addSearchChartRelationAuto(mDashboard, this.props.model.tableIdColumns, this.props.model.idColumns, mChart, this.props.model.mCharts);
    this.setState({
      mDashboard: mDashboard,
    });
  }

  // 编辑展示把手
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
      // 延时刷新
      this.refreshDashboardTimeout(1000);
    } else {
      editModel = "true";
      this.props.dispatch({
        type: 'reportBoard/fetchEdit',
        payload: {
          boardId,
          callback: () => {
            const { searchItems, idColumns, tableIdColumns } = this.props.model;
            this.setState({
              searchItems,
              idColumns,
              tableIdColumns,
              editModel: editModel,
            });
            // 延时刷新
            this.refreshDashboardTimeout(1000);
          }
        }
      });
    }
  }
  onMouseEnterShow = (e) => {
    if (e.target.style.height === '180px') {
      e.target.style.opacity = 1;
      e.target.children[0].style.opacity = 1;
    } else {
      e.target.parentNode.style.opacity = 1;
      e.target.style.opacity = 1;
    }
  }
  onMouseLeaveHide = (e) => {
    if (this.state.editModel == "true") {
      return;
    }
    if (e.target.style.height === '180px') {
      e.target.style.opacity = 0;
      e.target.children[0].style.opacity = 0;
    } else {
      e.target.parentNode.style.opacity = 0;
      e.target.style.opacity = 0;
    }

  }
  /****************************************点击事件*****************************************************************/

  // 点击tab进行初始化数据查询
  tabOnChange = (activeKey) => {
    const { mDashboard_old, mDashboard, tagName, tagNames } = this.state;
    const mDashboardTmp = JSON.parse(JSON.stringify(mDashboard));
    const tagNameTmp = JSON.parse(JSON.stringify(tagName));
    let name = "";// 当前标签的name
    for (let key in tagName) {
      name = tagName[key];
    }
    // 如果是编辑模式先判断并且弹出保存确认框
    if (this.state.editModel == "true") {
      confirm({
        title: '',
        content: `是否保存对 ${name} 进行的修改？`,
        okText: 'Yes',
        okType: 'primary',
        cancelText: 'No',
        onOk() {
          reportBoardUtils.getMDashboard_oldByMDashboard(mDashboard_old, mDashboardTmp, tagNameTmp);
          message.success('保存成功');
        },
        onCancel() {
        },
      });
    }
    //请求后端数据dataList
    reportBoardUtils.getMDashboardByKey(mDashboard_old, mDashboard, activeKey);//生成新的mDashboard
    //更新state中的tab
    tabUtils.changeActiveKey(activeKey, tagName, tagNames, mDashboard_old);
    this.setState({
      tagName: tagName,
      mDashboard: mDashboard,
      spinning: true,
      mDashboard_old,
    });
    const boardId = this.boardId;
    this.fetchData(boardId, mDashboard);//使用初始化查询方法
  }

  // tab编辑事件
  onTabsEdit = (targetKey, action) => {
    const { mDashboard_old, mDashboard, tagName, tagNames, mCharts } = this.state;
    if (action == "remove") {
      // 删除
      tabUtils.removeTab(targetKey, mDashboard_old, mDashboard, tagName, tagNames);
      this.refreshDashboard();//刷新
    } else if (action == "add") {
      // 新建
      tabUtils.addTab(mCharts, mDashboard_old, mDashboard, tagName, tagNames);
    }
    this.setState({
      mDashboard_old: mDashboard_old,
      mDashboard: mDashboard,
      tagName: tagName,
      tagNames: tagNames,
    });
    const boardId = this.boardId;
    this.fetchData(boardId, mDashboard);//使用初始化查询方法
  }

  //修改tab的名称
  changeTabName = (key, value) => {
    const { mDashboard_old, mDashboard, tagName, tagNames } = this.state;
    //修改
    tabUtils.changeTabName(mDashboard_old, mDashboard, tagName, tagNames, key, value);
    this.setState({
      mDashboard_old: mDashboard_old,
      mDashboard: mDashboard,
      tagName: tagName,
      tagNames: tagNames,
    });
    // 刷新页面
    this.refreshDashboard();
  }

  //  点击搜索查询
  searchData = (value) => {
    // 搜索框查询清除plot
    if (null == value) {
      this.plotChartId = [];
    }
    // 搜索开始设置加载中
    this.setState({
      spinning: true,
    });
    // 请求数据
    this.props.dispatch({
      type: 'reportBoard/searchData',
      payload: {
        mDashboard: this.state.mDashboard,
        boardId: this.boardId,
        value: value,
        callback: () => {
          this.setState({
            dataList: this.props.model.dataList,
            spinning: false, // 数据加载完成取消加载中
            plotClickFlag: false,// plot点击置为false
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
  searchItemData = (id, chartId) => {
    // 思路 rs_column_conf 表中的  id  取得 rsc_name 便可查询  参数 配上 所有的搜索框参数
    //this.plotChartId = []; // 先清空 注释by wangliu 加了 图表数据没刷出来的时候点搜索框item会让图表一直处于加载状态
    //this.plotChartId.push(chartId); // 搜索框str下拉框查询数据,将chartId放入 20190103注释 会引起切换tab不刷新的Bug
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

  // 编辑界面点击保存
  saveDashBoard = () => {
    // 把单独的报表mDashboard拼成主题提交
    const { mDashboard_old, mDashboard, tagName, user_type } = this.state;
    // 保存当前tag
    reportBoardUtils.getMDashboard_oldByMDashboard(mDashboard_old, mDashboard, tagName);
    this.props.dispatch({
      type: 'reportBoard/saveDashBoard',
      payload: {
        mDashboard_porp: mDashboard_old,
        dashboard_type: user_type,
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

  // 用户拉取同步,从t_dashboard中刷到m_dashboard中
  pullSynchronization = () => {
    const { mDashboard_old, tagName } = this.state;
    const id = mDashboard_old.id;
    this.props.dispatch({
      type: 'reportBoard/pullSynchronizationTab',
      payload: {
        id,
        callback: (success) => {
          if (success) {
            message.success('同步成功,请刷新浏览器');
          } else {
            message.error('同步失败');
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
        // 没有就增加一个   relationFields:{"图表Id":[关联字段Id]}
        for (let i = 0; i < value_keys.length; i++) {
          let flag = false;
          for (let j = 0; j < relation_keys.length; j++) {
            if (value_keys[i] == relation_keys[j]) {
              flag = true;
            }
          }
          if (!flag) {
            // 增加一个Item，自动配置Item和已有的图表的关联关系
            reportBoardUtils.addSearchChartRelationAutoSearch(relation, id, value_keys[i], this.state.mDashboard, this.props.model.tableIdColumns, this.props.model.idColumns, this.props.model.mCharts);
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

  // 右侧搜索框配置关联关系  参数 searchItem 搜索框item的子项id
  changeSearchRelation = (id, searchItem, checkValue) => {
    const { mDashboard } = this.state;
    const { style_config } = mDashboard;
    const style_config_obj = JSON.parse(style_config);
    const md_children = style_config_obj.children;
    md_children.map((item, index) => {
      if (item.name == id) {
        // relation 关联关系
        const relation = item.relation;
        const relation_item = relation[searchItem]; // relation子项
        const relationFields = relation_item.relationFields;
        const keys = Object.keys(relationFields); // relationFields里的keys(其他图表的id)
        const value_keys = checkValue;// 点击后传过来的keys(图表Id) 因为怕重复所有后面加了searchItem
        // 本地有就删除
        for (let i = 0; i < keys.length; i++) {
          let flag = false;
          for (let j = 0; j < value_keys.length; j++) {
            if (keys[i] == value_keys[j]) {
              flag = true;
            }
          }
          if (!flag) {
            delete relationFields[keys[i]];
          }
        }
        // 本地没有就增加一个
        for (let i = 0; i < value_keys.length; i++) {
          let flag = false;
          for (let j = 0; j < keys.length; j++) {
            if (value_keys[i] == keys[j]) {
              flag = true;
            }
          }
          if (!flag) {
            // params relationFields,value_keys[i]:图表id,searchItem:搜索子项id,tableIdColumns数据集,idColumns
            reportBoardUtils.addSearchChartRelation(relationFields, value_keys[i], searchItem, this.state.mDashboard, this.props.model.tableIdColumns, this.props.model.idColumns, this.props.model.mCharts);
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
  addOrRemoveChart = (operateType, chartId) => {
    const { mDashboard } = this.state;
    const { style_config } = mDashboard;
    const style_config_obj = JSON.parse(style_config);
    const children = style_config_obj.children;
    const dragactStyle = style_config_obj.dragactStyle;
    if (operateType == "add") {
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
        if (children[i].chartId == chartId) {
          children.splice(i, 1);//  删除children数组
        }
        // 删除dragact样式
        for (let k = 0; k < dragactStyle.length; k++) {
          if (dragactStyle[k].key.toString() == chartId) {
            dragactStyle.splice(k, 1);
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
    // 如果是编辑或者是点击一次了不给点
    if (this.state.editModel == "true" || this.state.plotClickFlag == true) {
      return;
    }
    const origin = data._origin;
    const dimensionValue = origin["维度"];  //  图表维度的值
    const value = [];
    value.push(dimension);  // 图表维度的字段 id
    value.push(dimensionValue);  // 值
    value.push(chartId);  // 图表的名称(mchart表id)
    const plotChartId = this.plotChartId;
    // 修改plot查询图表id
    this.plotChartId = reportBoardUtils.changePlotChartId(plotChartId, chartId, this.state.mDashboard);
    if (this.plotChartId.length > 0) {
      this.searchData(value);
    }
    // 点击plot加一个用于加载的时候判断,plotChartId长度为0是点击搜索框
    this.plotChartId.push("007");
    this.setState({
      plotClickFlag: true,// plot点击置为true
    });
  }

  // 更新状态通用方法
  updateState = (...props) => {
    this.setState({
      ...props,
    });
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
        chart.h = cssUtils.changeSearchDragact(chart);// 搜索框控制要么一行要么两行
      }
      if (item.type != "fack") {// 如果是造的数据就不存储
        array.push(chart);
      }
    });
    const mDashboard = this.state.mDashboard;
    const { id, style_config } = mDashboard;
    const style_config_obj = JSON.parse(style_config);
    style_config_obj.dragactStyle = array;
    mDashboard.style_config = JSON.stringify(style_config_obj);
    // 给state赋值
    this.setState({
      mDashboard: mDashboard,
    });
    // 刷新页面
    this.refreshDashboard();
  }
  // 初始化的时候获取数据库里的 dragact数据
  getDragactData = () => {
    const fakeData = [
      { GridX: 8, GridY: 0, w: 1, h: 1, key: '1' }
    ];
    const style_config = this.state.mDashboard.style_config;
    if (style_config) {
      const data = JSON.parse(style_config).dragactStyle;
      const len = data.length; // add by wangliu 20190102 for:当组件少的时候手动增加假数据,不让dragact控件报错
      if (len < this.maxDragactCount) {
        const maxLen = this.maxDragactCount;
        for (let i = 0; i < maxLen - len; i++) {
          data.push({ GridX: 0, GridY: 0, w: 0, h: 0, key: `-${i}`, type: 'fack' });
        }
      } else {
        this.maxDragactCount = len;
      }
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
        //border: "1px solid #E8E8E8",
      }
    }
    // dragact样式
    const getblockStyle = isDragging => {
      return {
        background: isDragging ? '#ccc' : '#ccc'
      }
    }

    return (
      <div style={this.state.spinning == true ? { pointerEvents: 'none' } : {}}>{/*如果有图表在加载中那么就设置样式为不可点击状态*/}
        {/* 添加返回按钮的父级,根据权限参数控制是否显示 */}
        {this.state.user_auth == "1" ?
          <div style={{ marginLeft: (this.state.editModel == "true") ? "170px" : "0", width: 30, height: 180, opacity: 0, position: 'fixed', top: '50%', marginTop: -90, left: 0, zIndex: 1000, fontSize: 26, textAlign: 'center', cursor: 'pointer' }} onClick={this.changeEditeMode} onMouseEnter={this.onMouseEnterShow.bind(this)} onMouseLeave={this.onMouseLeaveHide.bind(this)}>
            <div style={{ marginLeft: (this.state.editModel == "true") ? "170px" : "0", width: 30, height: 60, opacity: '1 !important', border: '2px solid #ccc', borderRadius: 6, borderLeft: '1px solid #ccc', background: '#eee', color: '#000', position: 'fixed', top: '50%', marginTop: -30, left: 0, zIndex: 1000, fontSize: 26, textAlign: 'center', lineHeight: 2, cursor: 'pointer', }} >||</div>
          </div>
          :
          ""}
        {this.state.editModel == "true" ? <div className={styles['boardLeft']}>{this.disPlayLeft()} </div> : <div></div>}
        <div id="contents" className={`boardcenter_report`} ref={(instance) => { this.center = instance; }} style={{ paddingLeft: (this.state.editModel == "true") ? "200px" : "0", paddingRight: (this.state.editModel == "true") ? "200px" : "0", background: '#eee' }}>
          {this.renderTab()}
          <Dragact
            {...dragactInit}
            ref={node => node ? this.dragactNode = node : null}
            onDragEnd={this.handleOnDragEnd}>
            {(item, provided) => {
              let zIndex = 1;
              if (item.type && item.type == "search") {
                zIndex = 5;
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
                    zIndex: zIndex,
                    backgroundColor: this.state.editModel == "true" ? '#eee' : '#eee'
                  }}
                >
                  {this.state.editModel == "true" ?
                    <span
                      //调整大小
                      {...provided.resizeHandle}
                      style={{
                        position: 'absolute',
                        width: 10, height: 10, right: 6, bottom: 4, cursor: 'se-resize',
                        zIndex: 1,
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
          {/* 切换按钮start */}
          <div>
            <div>
              <Radio.Group defaultValue="drag" buttonStyle="solid" checked={this.state.dragMoveChecked} onChange={this.changeDragMoveChecked}>
                <Radio.Button value="drag" >拖拽</Radio.Button>
                <Radio.Button value="relation">关联</Radio.Button>
              </Radio.Group>
            </div>
          </div>
          {/* 切换按钮end */}
          <div style={{ border: '1px solid #ccc' }}>
            <div ref={(instance) => { this.rightRelation = instance; }}></div>
          </div>
        </div> : <div></div>
        }
      </div>
    );
  }
}
export default connect(state => ({
  model: state.reportBoard,
}))(ReportBoard);

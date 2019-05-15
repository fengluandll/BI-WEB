import { connect } from 'dva';
import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';

import { Drawer, message, Tabs, Button, Spin, Modal, Radio, Icon } from 'antd';
import { Dragact } from 'dragact';

import ReportBoardUtils from '../../utils/reportBoardUtils';
import ReportBoardmChartsUtils from '../../utils/reportBoardmChartsUtils';

import TabUtils from '../../utils/tabUtils';
import CssUtils from '../../utils/cssUtils';

import { ChartList, TabList } from '../../componentsPro/ChartList';
import { Relation, RelationChartsAuto, TabName, RelationTable, TabsUI } from '../../componentsPro/RelationUtil';
import { Bar, Pie, Line, Table, Pivottable, Perspective, Text, TextStandard, TableDiy, AntdTable, PivotDiy, TableDiy1 } from '../../componentsPro/Charts';
import { Print, SearchPro } from '../../componentsPro/ReportMethod';
import { Search } from '../../componentsPro/NewDashboard';

import ReportBoardUI from './ReportBoardUI';
import styles from './index.less';

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const reportBoardUtils = new ReportBoardUtils();
const reportBoardmChartsUtils = new ReportBoardmChartsUtils();
const reportBoardUI = new ReportBoardUI();
const tabUtils = new TabUtils();
const cssUtils = new CssUtils();
const print = new Print();

/***
 * 
 * 报表展示主入口
 * 
 * @author:wangliu
 * 
 * ***/
class ReportBoard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            mDashboard_old: {}, // m_dashboard原始数据 addby wangliu 20181130,这个为m_dashboard表原始数据,mDashboard是取得其中一个children
            mDashboard: {}, //m_dashboard表
            mCharts: {},    // m_charts表   控件表  主要放控件的配置
            dataList: {},    // 查询结束后所有的 图表的 数据  key：chartID  value:data  (数据是根据 mDashboard 中的 search 中的  props  参数  进行的有参数查询)
            dataList_one: {}, // 单个dataList
            idColumns: {},   // 每个图表所拥有的 维度 度量图例 和 搜索框的 子组件 所在 字段 的对应的表数据
            tableIdColumns: {},  // 每个图表 所拥有的 数据集 的 所有字段 的表数据
            tableConfig: {}, // 每个图表所拥有的所有数据集 的 table对象 key:数据集名称,value:table对象

            activeName: "",    //  每个报表的uuid名称,也就是m_dashboard中style_config的name
            fatherActiveName: "",    //  父组件 名称  root  或者 tab_panel 名称

            tagName: {}, // 当前tag的名称 {key,value}存储
            tagNames: [], // 所有tag的名称

            refreshUI: 0,   //   state 用来刷新ui 
            rightProps: {},      //   右侧选择框的参数 type mChart name(m_dashboard图表中的id)
            spinning: false,   // 是否显示加载中,这个state中的spinning用来控制全局是否可点击,图表的加载中spinning用的是局部变量spinning(有两个spinnng不一样)
            refreshType: "init",  // "init":初始化刷新图表显示fack数据,"search":搜索框查询开始填充真实数据,"plot"：plot点击查询,"pageLoade"是分页查询(鼠标下滑触发的查询),"export":excel导出
            // "bigScreen":大屏模式,"refreshAll":"全部刷新模式",
            searchPro: false, // 左侧组织树搜索框

            editModel: "false",   // 是否编辑模式
            dragMoveChecked: false,  // 是否静止dragact移动，移动就点击无法显示右侧的编辑界面。
            bigScreen: false, // 是否大屏模式

            user_type: "", // 权限控制,用户类型
            user_auth: "0", // 权限控制,是否有编辑权限,"1"有权限
        };
        // get boardId
        this.boardId = this.props.match.params.boardId;
        // 被plot点击查询的图表id
        this.plotChartId = [];
        // 本地刷新的数据个数
        this.dataListCount = 0;

        this.searchProData = []; // 组织树数据,因为只会加载一次所以不用放state里
        this.searchProParam = {}; // 组织树选中的参数,用来给查询接口拼接参数的
    }
    componentWillMount() {
        const boardId = this.boardId;

        // 初始化先请求结构数据
        this.props.dispatch({
            type: 'reportBoard/fetch',
            payload: {
                boardId,
                callback: () => {
                    const { mDashboard_old, tDashboard, mCharts, idColumns, user_type, user_auth } = this.props.model;
                    reportBoardUtils.addMfromT(mDashboard_old, tDashboard, user_type); //首先就将t_dashboard合进m_dashboard里面
                    const { tagName, tagNames } = this.state;
                    const mDashboard = reportBoardUtils.getStyle_configByOrder(mDashboard_old, mCharts, tagName, tagNames); //1.选出mDashboard,2.数据处理(把所有的props时间处理好)
                    this.setState({
                        mDashboard_old,
                        mDashboard,
                        mCharts,
                        idColumns,
                        tagName,
                        tagNames,
                        user_type,
                        user_auth,
                        spinning: true,// 初始化时候设置为加载中
                    });
                    this.fetchData(boardId, mDashboard, mDashboard_old, mCharts, idColumns);//查询数据
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
            this.disPlayRight(this.state.rightProps);
        }
        //  display  中间的图表
        this.disPlayCharts();
    }

    componentWillUnmount() {

    }
    /***
     * 初始化和切换tab时候请求数据
     * 
     * 
     * ***/
    fetchData = (boardId, mDashboard, mDashboard_old, mCharts, idColumns) => {
        // 请求回结构数据后再请求图表数据 数据先请求可以快0.5秒 add by wangliu 20190111 然而出现了bug 加载后数据要是快的话spinning消除不了
        // 初始化查询清除plot
        this.plotChartId = [];
        // 拼接查询参数
        const params = reportBoardUtils.getSearchJson("init", "", this.plotChartId, null, this.searchProParam, boardId, mDashboard, mDashboard_old, mCharts, idColumns);
        const { children } = params;
        this.dataListCount = children.length; // 把要查询的图表的个数赋值
        for (let key in children) {
            const params_one = {};
            params_one.report_id = params.report_id;
            params_one.name = params.name;
            params_one.dataSet = params.dataSet;
            params_one.dataSetRelation = params.dataSetRelation;
            params_one.search_id = params.search_id;
            const child = [];
            child.push(children[key]);
            params_one.children = child;
            // 请求数据
            this.props.dispatch({
                type: 'reportBoard/search',
                payload: {
                    params: params_one,
                    callback: (data) => {
                        const dataList = reportBoardUtils.addDataList(this.state.dataList, data);
                        this.setState({
                            dataList_one: data,
                            refreshType: "search", // 修改刷新类型
                            dataList, // 所有图表的数据
                        });
                    },
                },
            });
        }
        if (this.dataListCount == 0) { // 如果只有一个搜索框,那么就调用刷新,解决新增tab不刷新的问题
            this.refreshDashboard();
        }
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
        const { mDashboard, mCharts, mDashboard_old } = this.state;
        ReactDom.render(
            <ChartList
                mCharts={mCharts}
                mDashboard={mDashboard}
                addOrRemoveChart={this.addOrRemoveChart}
            />, chartList);
    }

    // 展示左侧搜索框
    disPlaySearchPro = () => {
        const { searchPro } = this.state;
        const data = this.searchProData;
        return (
            <div>
                <SearchPro
                    visible={searchPro}
                    data={data}
                    changeSearchPro={this.changeSearchPro}
                    changeSearchProParam={this.changeSearchProParam}
                />
            </div>
        );
    }


    /****************************************展示右侧仪表盘*****************************************************************/

    // 展示右侧的编辑框
    disPlayRight = (rightProps) => {
        const { type, mChart, name } = rightProps;
        if (type == "search") {
            this.disPlaySearch(mChart, name);
        } else if (type == "chart") {
            this.disPlayRightCharts(mChart, name);
        } else if (type == "tab") {
            this.displayTabName();
        } else if (type == "antdTable") {
            this.displayRightTable(mChart, name);
        }
    }

    /***
     * 搜索框关联
     * mChart
     * chartId:m_dashboard的图表id
     * ***/
    disPlaySearch(mChart, name) {
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
            if (item.type != "tab" && item.type != "search") {
                chart_children.push(item);
            }
        });

        ReactDom.render(
            <Relation
                name={name}
                mChart={mChart}
                mDashboard={this.state.mDashboard}
                mDashboard_old={this.state.mDashboard_old}
                tableConfig={this.state.tableConfig}
                relation={board_item}
                search_item={search_item}
                idColumns={this.props.model.idColumns}
                chart_children={chart_children}
                mCharts={this.props.model.mCharts}
                tableIdColumns={this.props.model.tableIdColumns}
                changeSearchItem={this.changeSearchItem}
                changeSearchRelation={this.changeSearchRelation}
                changeSearchDataSetName={this.changeSearchDataSetName}
            />, rightRelation);
    }

    /***
     * 图表关联
     * mChart
     * chartId:m_dashboard中图表的id
     * ***/
    disPlayRightCharts(mChart, name) {
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
            if (item.type != "tab" && item.type != "search" && item.name != name) {
                chart_children.push(item);
            }
        });

        ReactDom.render(
            <RelationChartsAuto
                mChart={mChart}
                relation={board_item}
                chart_children={chart_children}
                mCharts={this.props.model.mCharts}
                tableIdColumns={this.props.model.tableIdColumns}
                idColumns={this.props.model.idColumns}
                changeCheckRelation={this.changeCheckRelation}
                name={name}
            />, rightRelation);
    }

    // 展示table的关联
    displayRightTable = (mChart, name) => {
        //  如果不是编辑模式 右侧不相应监听事件
        if (this.state.editModel == "false") {
            return;
        }
        // 先清除右侧的样式
        ReactDom.render(<div></div>, this.rightRelation);
        const rightRelation = this.rightRelation;
        const { mDashboard, mCharts } = this.state;
        const { id, style_config } = mDashboard;
        const md_children = JSON.parse(style_config).children;
        // 找到和 图表一起的 图表
        let chart_children = [];//  和图表一起的图表的 集合
        let board_item;//  图表的 relation
        md_children.map((item, index) => {
            if (item.type != "tab" && item.type != "search" && item.name != name) {
                chart_children.push(item);
            }
            if (item.name == name) {
                board_item = item.relation;
            }
        });
        ReactDom.render(
            <RelationTable
                mChart={mChart}
                relation={board_item}
                mCharts={this.props.model.mCharts}
                tableIdColumns={this.props.model.tableIdColumns}
                idColumns={this.props.model.idColumns}
                chart_children={chart_children}
                changeCheckRelation={this.changeCheckRelation}
                name={name}
            />, rightRelation);
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
    /***
     * 所有图表的展示入口
     * 
     * spinning:是否显示加载中的转圈;refreshType页面刷新类型;
     * 接口设计原理:当页面初次加载、要刷新、查询数据时候,设置不同的refreshType走不同的路径,这里需要注意的时候 所有的if else控制都是为了
     * 让需要加载数据的图表出现转圈样式,最后数据经过 查询 返回的时候 refreshType设置为 search 最后一定会走 search那个分支。
     * 
     * ***/
    disPlayCharts() {
        const { mDashboard, bigScreen, refreshType } = this.state;
        const children = JSON.parse(this.state.mDashboard.style_config).children;
        if (children && children.length > 0) {
            let count = 0; // 图表加载的个数
            children.map((item, index) => { // 循环所有图表
                let spinning = true; // 加载中设为true
                const { type, name, chartId, styleConfig, relation } = item;
                if (refreshType == "refreshAll" || (refreshType == "bigScreen" && type != "search")) { // 切换普通全部刷新||大屏模式,不显示搜索框
                    spinning = false;
                    this.renderContent(item, spinning);
                } else if (refreshType != "bigScreen" && (type == "search" || type == "text" || this.state.editModel == "true")) { // 搜索框直接刷新,编辑模式也直接刷新
                    spinning = false;
                    this.renderContent(item, spinning);
                    if (this.dataListCount == 0) {// 只有搜索框没有图表的时候
                        this.setState({
                            spinning: false,
                        });
                    }
                } else if (this.state.refreshType == "init") { // 用来全部显示加载中的
                    spinning = true;
                    this.renderContent(item, spinning);
                } else if (this.state.refreshType == "search") { //只有查询返回数据的图表才会走这个(最终数据返回刷新一定会走这个)
                    const { dataList_one } = this.state;
                    let flag = false;
                    for (let key in dataList_one) {
                        if (key == chartId) {
                            flag = true;
                        }
                    }
                    if (flag) {
                        spinning = false;
                        this.renderContent(item, spinning);
                    }
                    count++; // 加载后计数加1
                    if (count >= this.dataListCount - 1) {
                        this.setState({
                            spinning: false,
                        });
                    }
                } else if (this.state.refreshType == "plot" && this.plotChartId.indexOf(chartId) > -1) { // 用来plot关联的显示加载中的
                    spinning = true;
                    this.renderContent(item, spinning);
                } else if (this.state.refreshType == "pageLoade" && this.plotChartId.indexOf(chartId) > -1) { // 分页加载数据,分页图表id暂时放在plptChartId中
                    spinning = true;
                    this.renderContent(item, spinning);
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
        const { tagName, tagNames, editModel, bigScreen } = this.state;
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
        if (bigScreen) { // 如果大屏就不显示tab
            return (
                <div></div>
            );
        }
        return (
            <div
                onClick={(ev) => {
                    this.displayTabName();
                }}


            // onDoubleClick={(e) => {
            //     this.displayTabName();
            //     if (this.state.editModel == 'true') {
            //         e.target.innerHTML += `<input type="text" autofocus="autofocus" name="input" placeholder="请输入"/>`;
            //         var box = document.getElementsByClassName('ant-tabs-tab-active ant-tabs-tab')[0].childNodes[0];
            //         var inp = box.childNodes[2];
            //         if (!inp) {
            //             return;
            //         }
            //         inp.onblur = (e) => {
            //             var box = document.getElementsByClassName('ant-tabs-tab-active ant-tabs-tab')[0].childNodes[0];
            //             var inp = box.childNodes[2];
            //             if (!inp.value) {
            //                 box.removeChild(box.childNodes[2]);
            //                 return;
            //             }
            //             const { mDashboard_old, mDashboard, tagName, tagNames } = this.state;
            //             tabUtils.changeTabName(mDashboard_old, mDashboard, tagName, tagNames, activeKey, inp.value);
            //             this.setState({
            //                 mDashboard_old: mDashboard_old,
            //                 mDashboard: mDashboard,
            //                 editModel: editModel,
            //                 tagName: tagName,
            //                 tagNames: tagNames,
            //             }, () => {
            //                 // 刷新页面
            //                 const text = box.childNodes[0];
            //                 const txt = document.createTextNode(inp.value);
            //                 box.replaceChild(txt, text);
            //                 box.removeChild(box.childNodes[2]);
            //             });

            //         }
            //     }
            // }}


            >
                <Tabs
                    onChange={this.tabOnChange}
                    activeKey={activeKey}
                    type={type}
                    onEdit={this.onTabsEdit}
                    size="small"
                    style={{ left: (this.state.editModel == "true") ? "200px" : "0", right: (this.state.editModel == "true") ? "200px" : "0" }}
                >
                    {panes.map(pane => <TabPane tab={pane.title} key={pane.key} closable={pane.closable}></TabPane>)}
                </Tabs>
            </div>
        );
    }

    //  循环自己 然后展示出所有的 图表
    renderContent(item, spinning) {
        const { type, name, chartId, styleConfig, relation } = item;
        // 从 datalist 中 根据 chartId 取出  数据
        let dateSetList = this.state.dataList_one[name];
        // 数据 如果单个数据是空的那就到所有数据中去取,实在没有再取假数据  add by wangliu 20181128  modify by wangliu 20190115
        if (null == dateSetList && null != this.state.dataList) {
            dateSetList = this.state.dataList[name];
        }
        if (null == dateSetList) {
            dateSetList = reportBoardUtils.getFakeData(type);
        }
        const mCharts = this.props.model.mCharts;
        // 根据 chartId 寻找 m_charts
        const mChart = reportBoardUtils.getMChartByChartId(mCharts, chartId);
        if (type == "line") {
            this.renderLine(name, dateSetList, mChart, spinning);
        } else if (type == "bar") {
            this.renderBar(name, dateSetList, mChart, spinning);
        } else if (type == "pie") {
            this.renderPie(name, dateSetList, mChart, spinning);
        } else if (type == "table") {
            this.renderTable(name, dateSetList, mChart, spinning);
        } else if (type == "search") {
            this.renderSearch(item, mChart);
        } else if (type == "pivottable") {
            this.renderPivottable(name, dateSetList, mChart, spinning);
        } else if (type == "perspective") {
            this.renderPerspective(name, dateSetList, mChart, spinning);
        } else if (type == "text") {
            this.renderText(item, dateSetList, mChart, spinning);
        } else if (type == "textStandard") {
            this.renderTextStandard(item, dateSetList, mChart, spinning);
        } else if (type == "tableDiy") {
            this.renderTableDiy(name, dateSetList, mChart, spinning);
        } else if (type == "antdTable") {
            this.renderAntdTable(item, dateSetList, mChart, spinning);
        } else if (type == "pivotDiy") {
            this.renderPivotDiy(name, dateSetList, mChart, spinning);
        } else if (type == "tableDiy1") {
            this.renderTableDiy1(name, dateSetList, mChart, spinning);
        }
    }
    /****************************************图形展示*****************************************************************/
    // 展示 折线图
    renderLine(name, dateSetList, mChart, spinning) {
        const { mDashboard, bigScreen } = this.state;
        let cssName = cssUtils.getBIContainer(mChart, bigScreen);
        const { dragactStyle } = JSON.parse(mDashboard.style_config);
        ReactDom.render(
            <div className={cssName}
                onClick={(ev) => {
                    //  讲展示右侧的变量参数放入 state 中
                    this.changeEditRightProps("chart", mChart, name);
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
    renderBar(name, dateSetList, mChart, spinning) {
        const { mDashboard, bigScreen } = this.state;
        let cssName = cssUtils.getBIContainer(mChart, bigScreen);
        const { dragactStyle } = JSON.parse(mDashboard.style_config);
        ReactDom.render(
            <div className={cssName}
                onClick={(ev) => {
                    //  讲展示右侧的变量参数放入 state 中
                    this.changeEditRightProps("chart", mChart, name);
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
    renderPie(name, dateSetList, mChart, spinning) {
        const { mDashboard, bigScreen } = this.state;
        let cssName = cssUtils.getBIContainer(mChart, bigScreen);
        const { dragactStyle } = JSON.parse(mDashboard.style_config);
        ReactDom.render(
            <div className={cssName}
                onClick={(ev) => {
                    //  讲展示右侧的变量参数放入 state 中
                    this.changeEditRightProps("chart", mChart, name);
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
    renderTable(name, dateSetList, mChart, spinning) {
        const { mDashboard, bigScreen } = this.state;
        let cssName = cssUtils.getBIContainer(mChart, bigScreen);
        const { dragactStyle } = JSON.parse(mDashboard.style_config);
        ReactDom.render(
            <div className={cssName}>
                <Spin spinning={spinning}>
                    <Table
                        dragactStyle={dragactStyle}
                        editModel={this.state.editModel}
                        mChart={mChart}
                        dateSetList={dateSetList}
                        onExport={this.onTableExport}
                    />
                </Spin>
            </div>,
            document.getElementById(name));
    }
    // pivottable
    renderPivottable(name, dateSetList, mChart, spinning) {
        const { mDashboard, bigScreen } = this.state;
        let cssName = cssUtils.getBIContainer(mChart, bigScreen);
        const { dragactStyle } = JSON.parse(mDashboard.style_config);
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
    renderPerspective(name, dateSetList, mChart, spinning) {
        const { mDashboard, bigScreen } = this.state;
        let cssName = cssUtils.getBIContainer(mChart, bigScreen);
        const { dragactStyle } = JSON.parse(mDashboard.style_config);
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
    // text文本控件
    renderText(item, dateSetList, mChart, spinning) {
        const { mDashboard, bigScreen } = this.state;
        let cssName = cssUtils.getBIContainer(mChart, bigScreen);
        const { dragactStyle } = JSON.parse(mDashboard.style_config);
        const { name, chartId, value } = item;
        // const { editModel } = this.state;
        ReactDom.render(
            <div className={cssName}>
                <Text
                    dragactStyle={dragactStyle}
                    editModel={this.state.editModel}
                    mChart={mChart}
                    dateSetList={dateSetList}
                    item={item}
                    onSave={this.saveText}
                // editModel={editModel}  
                />
            </div>,
            document.getElementById(name));
    }
    // 展示 标准文本控件
    renderTextStandard(item, dateSetList, mChart) {
        const { mDashboard, bigScreen } = this.state;
        let cssName = cssUtils.getBIContainer(mChart, bigScreen);
        const { dragactStyle } = JSON.parse(mDashboard.style_config);
        const { name, chartId, value } = item;
        ReactDom.render(
            <div className={cssName}>
                <TextStandard
                    dragactStyle={dragactStyle}
                    editModel={this.state.editModel}
                    mChart={mChart}
                    dateSetList={dateSetList}
                    item={item}
                    idColumns={this.state.idColumns}
                />
            </div>,
            document.getElementById(name));
    }
    // 展示 自定义表格
    renderTableDiy(name, dateSetList, mChart, spinning) {
        const { mDashboard, bigScreen } = this.state;
        let cssName = cssUtils.getBIContainer(mChart, bigScreen);
        const { dragactStyle } = JSON.parse(mDashboard.style_config);
        ReactDom.render(
            <div className={cssName}>
                <TableDiy
                    dragactStyle={dragactStyle}
                    editModel={this.state.editModel}
                    mChart={mChart}
                    dateSetList={dateSetList}
                />
            </div>,
            document.getElementById(name));
    }
    // antd table
    renderAntdTable(item, dateSetList, mChart, spinning) {
        const { mDashboard, bigScreen } = this.state;
        let cssName = cssUtils.getBIContainer(mChart, bigScreen);
        const { dragactStyle } = JSON.parse(mDashboard.style_config);
        const { type, name, chartId, styleConfig, relation } = item;
        ReactDom.render(
            <div className={cssName}
                onClick={(ev) => {
                    //  讲展示右侧的变量参数放入 state 中
                    this.changeEditRightProps("antdTable", mChart, name);
                }}
            >
                <Spin spinning={spinning}>
                    <AntdTable
                        dragactStyle={dragactStyle}
                        editModel={this.state.editModel}
                        mChart={mChart}
                        dateSetList={dateSetList}
                        idColumns={this.props.model.idColumns}
                        item={item}
                        onExport={this.onTableExport}
                        onPlotClickAntTable={this.onPlotClickAntTable}
                        searchData={this.searchData}
                    />
                </Spin>
            </div>,
            document.getElementById(name));
    }
    // antd pivotDiy
    renderPivotDiy(name, dateSetList, mChart, spinning) {
        const { mDashboard, bigScreen } = this.state;
        let cssName = cssUtils.getBIContainer(mChart, bigScreen);
        const { dragactStyle } = JSON.parse(mDashboard.style_config);
        ReactDom.render(
            <div className={cssName}>
                <Spin spinning={spinning}>
                    <PivotDiy
                        dragactStyle={dragactStyle}
                        editModel={this.state.editModel}
                        mChart={mChart}
                        dateSetList={dateSetList}
                        idColumns={this.props.model.idColumns}
                        onExport={this.onTableExport}
                    />
                </Spin>
            </div>,
            document.getElementById(name));
    }
    // tableDiy1
    renderTableDiy1 = (name, dateSetList, mChart, spinning) => {
        const { mDashboard, bigScreen } = this.state;
        let cssName = cssUtils.getBIContainer(mChart, bigScreen);
        const { dragactStyle } = JSON.parse(mDashboard.style_config);
        ReactDom.render(
            <div className={cssName}>
                <Spin spinning={spinning}>
                    <TableDiy1
                        dragactStyle={dragactStyle}
                        editModel={this.state.editModel}
                        mChart={mChart}
                        dateSetList={dateSetList}
                        idColumns={this.props.model.idColumns}
                        onExport={this.onTableExport}
                    />
                </Spin>
            </div>,
            document.getElementById(name));
    }
    // 展示 搜索框
    renderSearch(item, mChart) {
        const { name, chartId, styleConfig, relation } = item;
        const searchEnum = this.props.model.searchEnum;
        const { mDashboard, bigScreen } = this.state;
        let cssName = cssUtils.getBIContainer(mChart, bigScreen);
        const { dragactStyle } = JSON.parse(mDashboard.style_config);
        ReactDom.render(
            <div className={cssName}
                style={{ cursor: 'pointer' }}
                onClick={(ev) => {
                    if (ev.target.className.indexOf('query-container') >= 0 || ev.target.hasAttribute('data-reactroot')) {
                        //  讲展示右侧的变量参数放入 state 中
                        this.changeEditRightProps("search", mChart, name);
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
                    tagName={this.state.tagName}
                    onLoad={this.searchItemData}
                    searchEnum={searchEnum}
                    clickSearch={this.searchData}
                    changeProps={this.changeProps}
                    changeSearchPro={this.changeSearchPro}
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
            }, () => {
                this.refreshDashboard();
            });
        } else {
            editModel = "true";
            this.props.dispatch({
                type: 'reportBoard/fetchEdit',
                payload: {
                    boardId,
                    callback: () => {
                        const { tableIdColumns, tableConfig } = this.props.model;
                        this.setState({
                            tableIdColumns,
                            tableConfig,
                            editModel: editModel,
                        }, () => {
                            this.refreshDashboard();
                        });
                    }
                }
            });
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
            mDashboard_old,
            refreshType: "init",
        }, () => {
            const boardId = this.boardId;
            this.fetchData(boardId, mDashboard, mDashboard_old, this.state.mCharts, this.state.idColumns);//使用初始化查询方法
        });
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
            tabUtils.addTab(mCharts, mDashboard_old, mDashboard, tagName, tagNames, this.state.user_type);
        }
        this.setState({
            mDashboard_old: mDashboard_old,
            mDashboard: mDashboard,
            tagName: tagName,
            tagNames: tagNames,
            refreshType: "init",
        }, () => {
            const boardId = this.boardId;
            this.fetchData(boardId, mDashboard, mDashboard_old, this.state.mCharts, this.state.idColumns);//使用初始化查询方法
        });
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
        }, () => {
            // 刷新页面
            this.refreshDashboard();
        });
    }

    /***
     * 搜索查询 plot查询 分页查询 接口
     * param:{
     * value:plot的值,
     * searchAntdTable:分页查询参数,
     * }
     * 
     * ***/
    searchData = (value, searchAntdTable) => {
        let refreshType = "init"; // 刷新类型
        if (null != searchAntdTable) { // antdtable分页查询
            this.plotChartId = [];
            this.plotChartId = searchAntdTable.chartId; // 分页图表id暂时先放在plotChartId里面
            refreshType = "pageLoade";
        } else if (null != value) { // plot点击查询
            refreshType = "plot";
        } else { // 搜索框查询
            this.plotChartId = []; // 搜索框查询清除plot
        }
        // 跟新refreshType状态
        this.setState({
            refreshType, // 修改刷新类型
            spinning: true, // 设置不能点击
        });
        // 拼接查询参数
        const params = reportBoardUtils.getSearchJson("plot", value, this.plotChartId, searchAntdTable, this.searchProParam, this.boardId, this.state.mDashboard, this.state.mDashboard_old, this.state.mCharts, this.state.idColumns);
        const { children } = params;
        this.dataListCount = children.length; // 把要查询的图表的个数赋值
        if (this.dataListCount == 0 && refreshType == "plot") { // plot点击查询没有图表需要查询的时候
            this.setState({
                refreshType: "search", // 修改刷新类型
                spinning: false, // 设置可以点击
            });
        }
        for (let key in children) {
            const params_one = {};
            params_one.report_id = params.report_id;
            params_one.name = params.name;
            params_one.dataSet = params.dataSet;
            params_one.dataSetRelation = params.dataSetRelation;
            params_one.search_id = params.search_id;
            const child = [];
            child.push(children[key]);
            params_one.children = child;
            // 请求数据
            this.props.dispatch({
                type: 'reportBoard/search',
                payload: {
                    params: params_one,
                    callback: (data) => {
                        let data_mid = data; //中间处理数据
                        if (this.state.refreshType == "pageLoade") { // 如果是分页查询类型,就把数据拼接到原来的数据上面去
                            data_mid = reportBoardUtils.addDataListForPageLoadAntdTable(data, this.state.dataList);
                        }
                        const dataList = reportBoardUtils.addDataList(this.state.dataList, data_mid); // 查询的单个数据合并到总的数据里面去
                        this.setState({
                            dataList_one: data_mid,
                            refreshType: "search", // 修改刷新类型
                            dataList, // 所有图表的数据
                        });
                    },
                },
            });
        }
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
        this.refreshDashboard(); // 刷新页面，mDashboard修改state后页面没有刷新可能是因为它还是用的原来的对象。
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

    // 获取组织树的数据
    getSearchProData = () => {
        this.props.dispatch({
            type: 'reportBoard/getSearchData',
            payload: {
                id: this.boardId,
                callback: (data) => {
                    this.searchProData = JSON.parse(data.data); // 将string转成对象
                    this.changeSearchPro();
                },
            },
        });
    }

    // 修改搜索框的数据集
    changeSearchDataSetName = (value) => {
        const { mDashboard } = this.state;
        const { style_config } = mDashboard;
        const style_config_obj = JSON.parse(style_config);
        const md_children = style_config_obj.children;
        md_children.map((item, index) => {
            if (item.type == "search") {
                item.dataSetName = value;
            }
        });
        // md_children转回string  然后刷新state
        style_config_obj.children = md_children;
        mDashboard.style_config = JSON.stringify(style_config_obj);
        this.setState({
            mDashboard: mDashboard,
        });
        this.refreshDashboard(); // 刷新页面，mDashboard修改state后页面没有刷新可能是因为它还是用的原来的对象。
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
            //  刷新ui
            this.refreshDashboard();
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
            }, () => {
                // 刷新页面
                this.refreshDashboard();
            });
        }
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
        if (this.state.editModel == "true") {
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
            this.searchData(value, null);
        }
    }

    /***
     * antTable的点击事件
     * param: { id:字段id,value_param:参数的值,chartId:被点击的图表id }
     * 
     * ***/
    onPlotClickAntTable = (id, value_param, chartId) => {
        // 编辑模式返回
        if (this.state.editModel == "true") {
            return;
        }
        const value = [];
        value.push(id);  // 被点击的字段Id
        value.push(value_param);  // 值
        value.push(chartId);  // 图表的名称(mchart表id)
        const plotChartId = this.plotChartId;
        // 修改plot查询图表id
        this.plotChartId = reportBoardUtils.changePlotChartId(plotChartId, chartId, this.state.mDashboard);
        if (this.plotChartId.length > 0) {
            this.searchData(value, null);
        }
    }

    // 更新状态通用方法
    updateState = (props) => {
        this.setState({
            ...props,
        });
    }

    // 打印
    onPrint = () => {
        print.onPrint(this.divDom);
    }
    // 切换大屏
    changeBigScreen = () => {
        const { bigScreen } = this.state;
        this.setState({
            bigScreen: bigScreen ? false : true,
            refreshType: bigScreen ? "refreshAll" : "bigScreen",
        });
    }
    // 编辑界面点击图表修改right
    changeEditRightProps = (type, mChart, name) => {
        if (this.state.editModel == "true") { //如果是编辑模式
            const rightProps = {};
            rightProps.type = type;
            rightProps.mChart = mChart;
            rightProps.name = name;
            this.setState({
                rightProps,
            });
        }
    }
    // 修改组织树搜索框
    changeSearchPro = () => {
        const data = this.searchProData;
        if (data.length == 0) {
            this.getSearchProData();
        } else {
            this.setState({
                searchPro: this.state.searchPro ? false : true,
            });
        }
    }
    // 组织搜索参数回调
    changeSearchProParam = (param) => {
        this.searchProParam = param;
    }

    /*************************************************图表事件********************************************************/
    /***
     * 文本控件保存文本
     * ***/
    saveText = (value, item) => {
        const { mDashboard } = this.state;
        reportBoardmChartsUtils.saveTextValueToDashboard(value, item, mDashboard);
        this.setState({
            mDashboard,
        });
    }
    /***
     * 交叉表table导出excel
     * chart_id要导出的交叉表id
     * ***/
    onTableExport = (chart_id) => {
        // 跟新refreshType状态
        this.setState({
            refreshType: "plot", // 修改刷新类型,走plot类型,用this.plotChartId过滤图表
            spinning: true, // 设置不能点击
        });
        this.plotChartId.push(chart_id);
        // 拼接查询参数
        const params = reportBoardUtils.getSearchJson("export", null, [], null, this.searchProParam, this.boardId, this.state.mDashboard, this.state.mDashboard_old, this.state.mCharts, this.state.idColumns);
        const { children } = params;
        const params_one = {};
        params_one.report_id = params.report_id;
        params_one.name = params.name;
        params_one.dataSet = params.dataSet;
        params_one.dataSetRelation = params.dataSetRelation;
        params_one.search_id = params.search_id;
        const child = [];
        for (let key in children) {// 找到要导出的交叉表
            if (children[key].chart_id == chart_id) {
                child.push(children[key]);
            }
        }
        params_one.children = child;
        // 请求数据
        this.props.dispatch({
            type: 'reportBoard/onTableExport',
            payload: {
                params: params_one,
                callback: () => {
                    message.success('下载成功');
                    const dataList_one = {};
                    dataList_one[chart_id] = this.state.dataList[chart_id];
                    this.setState({
                        dataList_one: dataList_one, // 导出表格的时候刷新用的单个数据从之前所有数据中取
                        refreshType: "search", // 修改刷新类型
                    });
                },
            },
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
        }, () => {
            // 刷新页面
            this.refreshDashboard();
        });
    }
    // 初始化的时候获取数据库里的 dragact数据
    getDragactData = () => {
        const fakeData = [
            { GridX: 8, GridY: 0, w: 1, h: 1, key: '1' }
        ];
        const style_config = this.state.mDashboard.style_config;
        if (style_config) {
            const data = reportBoardUtils.getDragactData(JSON.parse(style_config).dragactStyle, this.state.bigScreen); // 获取dragact数据
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
        const { dragMoveChecked, spinning, editModel, bigScreen } = this.state;
        const data = this.getDragactData();
        //  设置dragact静止拖动  展示的时候和右侧开关为开的时候静止拖动
        if (editModel == "false" || dragMoveChecked == true) {
            data.map((item, index) => {
                item.static = "true";
            });
        }
        const dragactInit = {
            width: editModel == "true" ? document.getElementsByTagName('body')[0].offsetWidth - 400 : document.getElementsByTagName('body')[0].offsetWidth - 10,
            col: 40,
            rowHeight: 40,
            margin: [0, 0],
            className: bigScreen ? '' : 'plant-layout',
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
            <div style={(spinning == true && editModel == "false") ? { pointerEvents: 'none' } : {}}>{/*如果有图表在加载中那么就设置样式为不可点击状态*/}
                {
                    /***悬停按钮-里面有切换编辑模式,切换大屏,打印按钮***/
                    reportBoardUI.getMenue(this)
                }
                {
                    /***左侧编辑***/
                    editModel == "true" ? <div className={styles['boardLeft']}>{this.disPlayLeft()} </div> : <div></div>
                }
                {
                    /***左侧搜索框***/
                    this.disPlaySearchPro()
                }
                <div id="contents" className={bigScreen ? styles['boardcenter_bigScreen'] : styles['boardcenter']} ref={(instance) => { this.center = instance; }} style={{ paddingLeft: (editModel == "true") ? "200px" : "0", paddingRight: (editModel == "true") ? "200px" : "0" }}>
                    {this.renderTab()}
                    <div ref={(n) => { this.divDom = n; }}>
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
                                            backgroundColor: bigScreen ? '' : '#eee' // 大屏模式这个不加背景色
                                        }}
                                    >
                                        {editModel == "true" ?
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
                </div>
                {
                    /***右侧编辑***/
                    reportBoardUI.getEditBoxRight(this)
                }
            </div>
        );
    }
}
export default connect(state => ({
    model: state.reportBoard,
}))(ReportBoard);

import { connect } from 'dva';
import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { message } from 'antd';
import DashBoardUtils from '../../utils/dashboardUtils';
import MchartsList from '../../componentsPro/EditDashboard/MchartsList';
import EditAntdTable from '../../componentsPro/EditDashboard/EditAntdTable';
import EditPivotDiy from '../../componentsPro/EditDashboard/EditPivotDiy';
import NewCharts from '../../componentsPro/EditDashboard/NewCharts';
import { Bar, Pie, Line, Table, Pivottable, AntdTable, PivotDiy } from '../../componentsPro/Charts';
import ReportBoardUtils from '../../utils/reportBoardUtils';

import styles from './index.less';


const dashboardUtils = new DashBoardUtils();
const reportBoardUtils = new ReportBoardUtils();
/***
 * BI报表后台编辑界面
 * wangliu 20190116
 * 
 * ***/
class EditBoard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            mChartsList: {}, // 所有mCharts对象 key为chart_id,value为对象
            mchart_id: "", // 当前编辑的图表id
            idColumns: {}, // column id对象
            tDashboard: {}, // tDashboard对象
            dataSetList: {}, // 数据集对象
            refreshUI: 0, // 用来刷新页面的
        };
        // get t_dashboard_id
        this.t_dashboard_id = this.props.match.params.t_dashboard_id;
    }

    componentWillMount() {
        this.fetchData();
    }
    componentDidUpdate() {

    }
    componentWillUnmount() {

    }

    /************************************点击事件****************************************/
    // 请求数据
    fetchData = () => {
        const t_dashboard_id = this.t_dashboard_id;
        // 初始化加载数据
        this.props.dispatch({
            type: 'editBoard/getMchartsList',
            payload: {
                t_dashboard_id,
                callback: () => {
                    const { mChartsList, idColumns, tDashboard, dataSetList } = this.props.model;  // 所有mcharts对象
                    let mchart_id = "";  // 搜索框的id
                    for (let key in mChartsList) {
                        const mCharts = mChartsList[key];
                        if (mCharts.mc_type == "11") {
                            mchart_id = mCharts.id;
                        }
                    }
                    this.setState({
                        mChartsList: mChartsList,
                        mchart_id: mchart_id,
                        idColumns: idColumns,
                        tDashboard: tDashboard,
                        dataSetList: dataSetList,
                    });
                }
            }
        });
    }
    // 保存编辑
    saveConfig = (config, id) => {
        this.props.dispatch({
            type: 'editBoard/saveConfig',
            payload: {
                id,
                config,
                callback: (success) => {
                    // alert 保存成功
                    if (success == "success") {
                        message.success('保存成功');
                    } else {
                        message.error('保存失败');
                    }
                }
            }
        });
        // 刷新原有的state
        const { mChartsList } = this.state;
        const mCharts = mChartsList[id];
        mCharts.config = config;
        mChartsList[id] = mCharts;
        this.setState({
            mChartsList,
            refreshUI: this.state.refreshUI + 1,
        });
    }
    // 新建图表
    newCharts = (config) => {
        const id = this.t_dashboard_id;
        this.props.dispatch({
            type: 'editBoard/newCharts',
            payload: {
                id,
                config,
                callback: (success) => {
                    // alert 保存成功
                    if (success == "success") {
                        message.success('保存成功');
                        this.fetchData();
                        this.setState({
                            refreshUI: this.state.refreshUI + 1,
                        });
                    } else {
                        message.error('保存失败');
                    }
                }
            }
        });
    }

    /************************************mcharts列表****************************************/
    // 展示mCharts列表
    renderMchartsList = () => {
        const { mChartsList, mchart_id } = this.state;
        return (
            <div>
                <NewCharts
                    onNewCharts={this.newCharts}
                />
                <MchartsList
                    mChartsList={mChartsList}
                    mchart_id={mchart_id}
                    onChange={this.changeMcharts}
                />
            </div>
        );
    }
    // 点击切换mcharts
    changeMcharts = (mchart_id) => {
        this.setState({
            mchart_id: mchart_id,
        });
    }



    /****************************************UI显示*****************************************/
    // 展示中间的图表
    renderMchartUi = () => {
        const { mChartsList, mchart_id } = this.state;
        if (mchart_id == "") { // 如果刚进来没有值就返回
            return;
        }
        const mCharts = mChartsList[mchart_id];
        const type = mCharts.mc_type;
        const type_str = reportBoardUtils.changeTypeStrNum(type); // 转换type类型从num变成str
        const dateSetList = reportBoardUtils.getFakeData(type_str);
        let content;
        if (type == "0") {
            // 折线图
            content =
                <div>
                    <Line
                        mChart={mCharts}
                        dateSetList={dateSetList}
                    />
                </div>;
        } else if (type == "1") {
            // 柱状图
            content =
                <div>
                    <Bar
                        mChart={mCharts}
                        dateSetList={dateSetList}
                    />
                </div>;
        } else if (type == "2") {
            // 饼图
            content =
                <div>
                    <Pie
                        mChart={mCharts}
                        dateSetList={dateSetList}
                    />
                </div>;
        } else if (type == "3") {
            // 交叉表
            content =
                <div>
                    <Table
                        mChart={mCharts}
                        dateSetList={dateSetList}
                    />
                </div>;
        } else if (type == "4") {
            // privottable
            content =
                <div>
                    <Pivottable
                        mChart={mCharts}
                        dateSetList={dateSetList}
                    />
                </div>;
        } else if (type == "5") {
            content =
                <div>

                </div>;
        } else if (type == "21") {
            content =
                <div>
                    <AntdTable
                        mChart={mCharts}
                        dateSetList={dateSetList}
                        idColumns={this.state.idColumns}
                    />
                </div>;
        } else if (type == "222") {
            content =
                <div>
                    <PivotDiy
                        mChart={mCharts}
                        dateSetList={dateSetList}
                        idColumns={this.state.idColumns}
                    />
                </div>;
        } else if (type == "11") {
            // 搜索栏
            content =
                <div>

                </div>;
        }
        return (
            <div>
                {content}
            </div>
        );
    }



    /***************************************编辑模块****************************************/
    // 右侧编辑的整体布局
    renderEditContent = () => {
        const { mChartsList, mchart_id } = this.state;
        if (mchart_id == "") { // 如果刚进来没有值就返回
            return;
        }
        const mCharts = mChartsList[mchart_id];
        const type = mCharts.mc_type;
        if (type == "0" || type == "1" || type == "2") {
            // antdv图表 折线图、柱状图、饼图
            return (
                <div>

                </div>
            );
        } else if (type == "3") {
            // 交叉表
            return (
                <div>

                </div>
            );
        } else if (type == "21") {
            // antd table
            return (
                <div>
                    <EditAntdTable
                        mChart={mCharts}
                        tDashboard={this.state.tDashboard}
                        dataSetList={this.state.dataSetList}
                        idColumns={this.state.idColumns}
                        onSave={this.saveConfig}
                    />
                </div>
            );
        } else if (type == "22") {
            // pivotDiy 自定义antd透视表
            return (
                <div>
                    <EditPivotDiy
                        mChart={mCharts}
                        tDashboard={this.state.tDashboard}
                        dataSetList={this.state.dataSetList}
                        idColumns={this.state.idColumns}
                        onSave={this.saveConfig}
                    />
                </div>
            );
        } else if (type == "11") {
            // 搜索栏
            return (
                <div>

                </div>
            );
        }
    }


    /**************************************************************************************/

    /***
     * 展示内容
     * 
     * ***/
    renderContent = () => {
        return (
            <div>
                <div className={styles['boardLeft']} style={{ width: '600px', overflowY: 'auto' }}>
                    {/***左侧的mcharts列表***/}
                    {this.renderMchartsList()}
                </div>
                <div>
                    <div style={{ position: 'fixed', marginLeft: '600px', width: '600px', height: '100%' }}>
                        {/***图表demo展示***/}
                        {this.renderMchartUi()}
                    </div>
                    <div>
                        {/***暂时没想好用途***/}
                    </div>
                </div>
                <div className={styles['boardRight']} style={{ width: '600px', overflowY: 'auto' }}>
                    {/***右侧的mcharts编辑界面***/}
                    {this.renderEditContent()}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderContent()}
            </div>
        );
    }
}
export default connect(state => ({
    model: state.editBoard,
}))(EditBoard);

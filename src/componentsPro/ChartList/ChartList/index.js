import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Collapse, Modal, Icon } from 'antd';
import styles from './index.less';
import ReportBoardUtils from '../../../utils/reportBoardUtils';

const Panel = Collapse.Panel;
const confirm = Modal.confirm;
const reportBoardUtils = new ReportBoardUtils();

/***
 * 左侧图表list,用来添加删除图表
 * 
 * @author: wangliu
 * 
 * ***/
export default class Index extends PureComponent {
    constructor(props) {
        super(props);
        const { mCharts, mDashboard } = this.props;
        this.state = {
            mDashboard,
            refreshUI: 0,   //   state 用来刷新ui
            visible: false, // 编辑弹出框
            edit_type: "add", // 弹出框类型 add:新建;edie:编辑
            edit_id: "", // 编辑图表的id 
            title_line: true, // 折线图
            title_bar: true, // 柱状图
            title_barrow: true, // 条形图
            title_pie: true, // 饼图
            title_dashboard: true, // 仪表盘
            title_funnel: true, // 漏斗图
            title_antdTable: true, // antdTable
            title_pivotDiy: true, // 透视表
            title_text: true, // 文本控件
            title_else: true, // 其他
        }
    }

    componentWillReceiveProps(props) {
        const { mCharts, mDashboard } = props;
        this.setState({
            mDashboard,
            refreshUI: this.state.refreshUI + 1,
        });
    }

    /***
     * 
     * 展示图表
     * 
     * @param:param:图表类型
     * 
     * ***/
    renderChart = (param) => {
        const { mCharts } = this.props;
        const mCharts_para = []; // 符合的mChart
        for (let item of mCharts) {
            const type = reportBoardUtils.changeTypeStrNum(item.mc_type);
            if (param == "title_line") {
                if (type == "line") {
                    mCharts_para.push(item);
                }
            } else if (param == "title_bar") {
                if (type == "bar" || type == "waterfall" || type == "barLine") {
                    mCharts_para.push(item);
                }
            } else if (param == "title_barrow") {
                if (type == "barrow" || type == "groupedBar") {
                    mCharts_para.push(item);
                }
            } else if (param == "title_pie") {
                if (type == "pie" || type == "circular") {
                    mCharts_para.push(item);
                }
            } else if (param == "title_dashboard") {
                if (type == "dashboard") {
                    mCharts_para.push(item);
                }
            } else if (param == "title_funnel") {
                if (type == "funnel") {
                    mCharts_para.push(item);
                }
            } else if (param == "title_antdTable") {
                if (type == "antdTable" || type == "table") {
                    mCharts_para.push(item);
                }
            } else if (param == "title_pivotDiy") {
                if (type == "pivotDiy" || type == "pivottable") {
                    mCharts_para.push(item);
                }
            } else if (param == "title_text" || type == "textStandard") {
                if (type == "text") {
                    mCharts_para.push(item);
                }
            } else if (param == "title_else") {
                if (type == "perspective" || type == "tableDiy" || type == "tableDiy1") {
                    mCharts_para.push(item);
                }
            }
        }
        return (
            <div>
                {
                    mCharts_para.map((item, index) => {
                        const check = this.getMchartChecked(item);
                        return (
                            <li className={styles['titleTwo']} key={`${item.id}${index}`}>
                                <div className={styles['check']}><input type="checkbox" checked={check} onChange={this.onChange} value={item.id} /></div>
                                <div className={styles['title']}>{item.name}</div>
                                <div className={styles['edit']} onClick={this.editChart.bind(this, item.id)}>编辑</div>
                                <div className={styles['delete']} onClick={this.deleteChart.bind(this, item.id)}>删除</div>
                            </li>
                        );
                    })
                }
            </div>
        );
    }

    /***
     * 
     * 判断图表是否选中
     * 
     * ***/
    getMchartChecked = (mChart) => {
        const { mDashboard } = this.state;
        const { children } = JSON.parse(mDashboard.style_config);
        for (let item of children) {
            if (item.chartId == mChart.id) {
                return true;
            }
        }
        return false;
    }

    /***
     * 
     * 复选框切换事件
     * 
     * ***/
    onChange = (event) => {
        const value = event.target.value; // 图表Id
        const checked = event.target.checked; // 是否选中
        let operateType = "minus";
        if (checked) {
            operateType = "add";
        }
        // 调用父方法
        this.props.addOrRemoveChart(operateType, value);
    }

    /***
     * 
     * 组件展开事件
     * 
     * ***/
    onListCheck = (type) => {
        const { title_line, title_bar, title_barrow, title_pie, title_dashboard, title_funnel, title_antdTable, title_pivotDiy, title_text, title_else } = this.state;
        if (type == "line") {
            if (title_line) {
                this.line.style.display = 'none';
            } else {
                this.line.style.display = 'inline';
            }
            this.setState({
                title_line: title_line ? false : true,
            });
        } else if (type == "bar") {
            if (title_bar) {
                this.bar.style.display = 'none';
            } else {
                this.bar.style.display = 'inline';
            }
            this.setState({
                title_bar: title_bar ? false : true,
            });
        } else if (type == "barrow") {
            if (title_barrow) {
                this.barrow.style.display = 'none';
            } else {
                this.barrow.style.display = 'inline';
            }
            this.setState({
                title_barrow: title_barrow ? false : true,
            });
        } else if (type == "pie") {
            if (title_pie) {
                this.pie.style.display = 'none';
            } else {
                this.pie.style.display = 'inline';
            }
            this.setState({
                title_pie: title_pie ? false : true,
            });
        } else if (type == "dashboard") {
            if (title_dashboard) {
                this.dashboard.style.display = 'none';
            } else {
                this.dashboard.style.display = 'inline';
            }
            this.setState({
                title_dashboard: title_dashboard ? false : true,
            });
        } else if (type == "funnel") {
            if (title_funnel) {
                this.funnel.style.display = 'none';
            } else {
                this.funnel.style.display = 'inline';
            }
            this.setState({
                title_funnel: title_funnel ? false : true,
            });
        } else if (type == "antdTable") {
            if (title_antdTable) {
                this.antdTable.style.display = 'none';
            } else {
                this.antdTable.style.display = 'inline';
            }
            this.setState({
                title_antdTable: title_antdTable ? false : true,
            });
        } else if (type == "pivotDiy") {
            if (title_pivotDiy) {
                this.pivotDiy.style.display = 'none';
            } else {
                this.pivotDiy.style.display = 'inline';
            }
            this.setState({
                title_pivotDiy: title_pivotDiy ? false : true,
            });
        } else if (type == "text") {
            if (title_text) {
                this.text.style.display = 'none';
            } else {
                this.text.style.display = 'inline';
            }
            this.setState({
                title_text: title_text ? false : true,
            });
        } else if (type == "else") {
            if (title_else) {
                this.else.style.display = 'none';
            } else {
                this.else.style.display = 'inline';
            }
            this.setState({
                title_else: title_else ? false : true,
            });
        }
    }

    /***
     * 
     * 展示UI
     * 
     * ***/
    renderContent = () => {
        return (
            <div className={styles['leftSide']}>
                <div className={styles['sideContent']}>
                    <ul>
                        <li>
                            <div className={styles['titleOne']} >
                                <div className={styles['divInline']} onClick={this.onListCheck.bind(this, 'line')}>
                                    <div className={styles['icon']}>图标</div>
                                    <div className={styles['title']}><span className={styles['text']}>折线图</span></div>
                                </div>
                                <div className={styles['add']} onClick={this.newChart.bind(this)}>+</div>
                            </div>
                            <ul style={{}} ref={(instance) => { this.line = instance }}>
                                {this.renderChart("title_line")}
                            </ul>
                        </li>
                        <li>
                            <div className={styles['titleOne']}>
                                <div className={styles['divInline']} onClick={this.onListCheck.bind(this, 'bar')}>
                                    <div className={styles['icon']}>图标</div>
                                    <div className={styles['title']}><span className={styles['text']}>柱状图</span></div>
                                </div>
                                <div className={styles['add']} onClick={this.newChart.bind(this)}>+</div>
                            </div>
                            <ul style={{}} ref={(instance) => { this.bar = instance }}>
                                {this.renderChart("title_bar")}
                            </ul>
                        </li>
                        <li>
                            <div className={styles['titleOne']}>
                                <div className={styles['divInline']} onClick={this.onListCheck.bind(this, 'barrow')}>
                                    <div className={styles['icon']}>图标</div>
                                    <div className={styles['title']}><span className={styles['text']}>条形图</span></div>
                                </div>
                                <div className={styles['add']} onClick={this.newChart.bind(this)}>+</div>
                            </div>
                            <ul style={{}} ref={(instance) => { this.barrow = instance }}>
                                {this.renderChart("title_barrow")}
                            </ul>
                        </li>
                        <li>
                            <div className={styles['titleOne']}>
                                <div className={styles['divInline']} onClick={this.onListCheck.bind(this, 'pie')}>
                                    <div className={styles['icon']}>图标</div>
                                    <div className={styles['title']}><span className={styles['text']}>饼图</span></div>
                                </div>
                                <div className={styles['add']} onClick={this.newChart.bind(this)}>+</div>
                            </div>
                            <ul style={{}} ref={(instance) => { this.pie = instance }}>
                                {this.renderChart("title_pie")}
                            </ul>
                        </li>
                        <li>
                            <div className={styles['titleOne']}>
                                <div className={styles['divInline']} onClick={this.onListCheck.bind(this, 'dashboard')}>
                                    <div className={styles['icon']}>图标</div>
                                    <div className={styles['title']}><span className={styles['text']}>仪表盘</span></div>
                                </div>
                                <div className={styles['add']} onClick={this.newChart.bind(this)}>+</div>
                            </div>
                            <ul style={{}} ref={(instance) => { this.dashboard = instance }}>
                                {this.renderChart("title_dashboard")}
                            </ul>
                        </li>
                        <li>
                            <div className={styles['titleOne']}>
                                <div className={styles['divInline']} onClick={this.onListCheck.bind(this, 'funnel')}>
                                    <div className={styles['icon']}>图标</div>
                                    <div className={styles['title']}><span className={styles['text']}>漏斗图</span></div>
                                </div>
                                <div className={styles['add']} onClick={this.newChart.bind(this)}>+</div>
                            </div>
                            <ul style={{}} ref={(instance) => { this.funnel = instance }}>
                                {this.renderChart("title_funnel")}
                            </ul>
                        </li>
                        <li>
                            <div className={styles['titleOne']}>
                                <div className={styles['divInline']} onClick={this.onListCheck.bind(this, 'antdTable')}>
                                    <div className={styles['icon']}>图标</div>
                                    <div className={styles['title']}><span className={styles['text']}>表格</span></div>
                                </div>
                                <div className={styles['add']} onClick={this.newChart.bind(this)}>+</div>
                            </div>
                            <ul style={{}} ref={(instance) => { this.antdTable = instance }}>
                                {this.renderChart("title_antdTable")}
                            </ul>
                        </li>
                        <li>
                            <div className={styles['titleOne']}>
                                <div className={styles['divInline']} onClick={this.onListCheck.bind(this, 'pivotDiy')}>
                                    <div className={styles['icon']}>图标</div>
                                    <div className={styles['title']}><span className={styles['text']}>透视表</span></div>
                                </div>
                                <div className={styles['add']} onClick={this.newChart.bind(this)}>+</div>
                            </div>
                            <ul style={{}} ref={(instance) => { this.pivotDiy = instance }}>
                                {this.renderChart("title_pivotDiy")}
                            </ul>
                        </li>
                        <li>
                            <div className={styles['titleOne']}>
                                <div className={styles['divInline']} onClick={this.onListCheck.bind(this, 'text')}>
                                    <div className={styles['icon']}>图标</div>
                                    <div className={styles['title']}><span className={styles['text']}>文本</span></div>
                                </div>
                                <div className={styles['add']} onClick={this.newChart.bind(this)}>+</div>
                            </div>
                            <ul style={{}} ref={(instance) => { this.text = instance }}>
                                {this.renderChart("title_text")}
                            </ul>
                        </li>
                        <li>
                            <div className={styles['titleOne']}>
                                <div className={styles['divInline']} onClick={this.onListCheck.bind(this, 'else')}>
                                    <div className={styles['icon']}>图标</div>
                                    <div className={styles['title']}><span className={styles['text']}>其他</span></div>
                                </div>
                                <div className={styles['add']} onClick={this.newChart.bind(this)}>+</div>
                            </div>
                            <ul style={{}} ref={(instance) => { this.else = instance }}>
                                {this.renderChart("title_else")}
                            </ul>
                        </li>
                    </ul>
                </div>
                {this.renderEdit()}
            </div>
        );
    }

    /***
     * 
     * 编辑新建弹出框
     * 
     * ***/
    renderEdit = () => {
        const { edit_id, visible, edit_type } = this.state;
        return (
            <div>
                <Modal
                    title="Basic Modal"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    bodyStyle={{}}
                    width={700}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
            </div>
        );
    }
    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    /***
     * 
     * 新建图表
     * 
     * ***/
    newChart = () => {
        this.setState({
            edit_id: "",
            visible: true,
            edit_type: "add",
        });
    }

    /***
    * 
    * 编辑图表
    * 
    * ***/
    editChart = (id) => {
        this.setState({
            edit_id: id,
            visible: true,
            edit_type: "edit",
        });
    }

    /***
    * 
    * 删除图表
    * 
    * ***/
    deleteChart = (id) => {
        confirm({
            title: '确认要删除这个图表吗?',
            content: '删除将彻底不可恢复',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk() {
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    render() {
        return (
            <div>
                {this.renderContent()}
            </div>
        );
    }

}
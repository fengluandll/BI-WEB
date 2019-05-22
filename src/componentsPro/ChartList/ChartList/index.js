import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Collapse, Checkbox, Icon } from 'antd';
import styles from './index.less';
import ReportBoardUtils from '../../../utils/reportBoardUtils';

const Panel = Collapse.Panel;
const CheckboxGroup = Checkbox.Group;
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
            title_line: true, // 折线图
            title_bar: true, // 柱状图
            title_barrow: true, // 条形图
            title_pie: true, // 饼图
            title_dashboard: true, // 仪表盘
            title_funnel: true, // 漏斗图
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
            } else if (param == "title_else") {
                if (type == "") {
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
                                <div className={styles['edit']}>编辑</div>
                                <div className={styles['delete']} style={{}}>删除</div>
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
        const { title_line, title_bar, title_pie } = this.state;
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
        } else if (type == "pie") {
            if (title_pie) {
                this.pie.style.display = 'none';
            } else {
                this.pie.style.display = 'inline';
            }
            this.setState({
                title_pie: title_pie ? false : true,
            });
        }
    }

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
                                <div className={styles['add']}>+</div>
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
                                <div className={styles['add']}>+</div>
                            </div>
                            <ul style={{}} ref={(instance) => { this.bar = instance }}>
                                {this.renderChart("title_bar")}
                            </ul>
                        </li>
                        <li>
                            <div className={styles['titleOne']}>
                                <div className={styles['divInline']} onClick={this.onListCheck.bind(this, 'pie')}>
                                    <div className={styles['icon']}>图标</div>
                                    <div className={styles['title']}><span className={styles['text']}>饼图</span></div>
                                </div>
                                <div className={styles['add']}>+</div>
                            </div>
                            <ul style={{}} ref={(instance) => { this.pie = instance }}>
                                {this.renderChart("title_pie")}
                            </ul>
                        </li>
                    </ul>
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
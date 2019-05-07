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
        this.state = {
            mCharts: {},
            mDashboard: {},

            chartIdArrayLine: [],
            chartIdArrayBar: [],
            chartIdArrayPie: [],
            chartIdArrayTable: [],
            chartIdArrayPivottable: [],
            chartIdArrayPerspective: [],
            chartIdArrayText: [],
            chartIdArrayTextStandard: [],
            chartIdArrayTableDiy: [],
            chartIdArrayAntdTable: [],
            chartIdArrayPivotDiy: [],
            chartIdArrayTableDiy1: [],

            arrLine: [],
            arrBar: [],
            arrPie: [],
            arrTable: [],
            arrPivottable: [],
            arrPerspective: [],
            arrText: [],
            arrTextStandard: [],
            arrTableDiy: [],
            arrAntdTable: [],
            arrPivotDiy: [],
            arrTableDiy1: [],
            refreshUI: 0, // 刷新ui
        }
    }

    componentWillReceiveProps(nextProps) {
        this.changeState(nextProps);
    }

    componentDidMount() {
        this.changeState(this.props);
    }

    /***
     * 
     * 给state赋值
     * 
     * 
     * 
     * ***/
    changeState = (props) => {
        const { mCharts, mDashboard } = props;
        // 选中图表
        const chartIdArrayLine = [];
        const chartIdArrayBar = [];
        const chartIdArrayPie = [];
        const chartIdArrayTable = [];
        const chartIdArrayPivottable = [];
        const chartIdArrayPerspective = [];
        const chartIdArrayText = [];
        const chartIdArrayTextStandard = [];
        const chartIdArrayTableDiy = [];
        const chartIdArrayAntdTable = [];
        const chartIdArrayPivotDiy = [];
        const chartIdArrayTableDiy1 = [];
        // 全部图表
        const arrLine = [];
        const arrBar = [];
        const arrPie = [];
        const arrTable = [];
        const arrPivottable = [];
        const arrPerspective = [];
        const arrText = [];
        const arrTextStandard = [];
        const arrTableDiy = [];
        const arrAntdTable = [];
        const arrPivotDiy = [];
        const arrTableDiy1 = [];
        const style_config = JSON.parse(mDashboard.style_config);
        const { children } = style_config;
        // 制造选中图表
        children.map((item, index) => {
            const type = reportBoardUtils.getTypeByChartId(mCharts, item.chartId);// 获取图表类型
            if (type == "0") {
                chartIdArrayLine.push(item.chartId);
            } else if (type == "1") {
                chartIdArrayBar.push(item.chartId);
            } else if (type == "2") {
                chartIdArrayPie.push(item.chartId);
            } else if (type == "3") {
                chartIdArrayTable.push(item.chartId);
            } else if (type == "4") {
                chartIdArrayPivottable.push(item.chartId);
            } else if (type == "5") {
                chartIdArrayPerspective.push(item.chartId);
            } else if (type == "6") {
                chartIdArrayText.push(item.chartId);
            } else if (type == "61") {
                chartIdArrayTextStandard.push(item.chartId);
            } else if (type == "7") {
                chartIdArrayTableDiy.push(item.chartId);
            } else if (type == "21") {
                chartIdArrayAntdTable.push(item.chartId);
            } else if (type == "22") {
                chartIdArrayPivotDiy.push(item.chartId);
            } else if (type == "23") {
                chartIdArrayTableDiy1.push(item.chartId);
            }
        });
        // 制造全部图表
        mCharts.map((item, index) => {
            const type = reportBoardUtils.getTypeByChartId(mCharts, item.id.toString());// 获取图表类型
            if (type == "0") {
                arrLine.push({
                    "label": item.name,
                    "value": item.id.toString(),
                });
            } else if (type == "1") {
                arrBar.push({
                    "label": item.name,
                    "value": item.id.toString(),
                });
            } else if (type == "2") {
                arrPie.push({
                    "label": item.name,
                    "value": item.id.toString(),
                });
            } else if (type == "3") {
                arrTable.push({
                    "label": item.name,
                    "value": item.id.toString(),
                });
            } else if (type == "4") {
                arrPivottable.push({
                    "label": item.name,
                    "value": item.id.toString(),
                });
            } else if (type == "5") {
                arrPerspective.push({
                    "label": item.name,
                    "value": item.id.toString(),
                });
            } else if (type == "6") {
                arrText.push({
                    "label": item.name,
                    "value": item.id.toString(),
                });
            } else if (type == "61") {
                arrTextStandard.push({
                    "label": item.name,
                    "value": item.id.toString(),
                });
            } else if (type == "7") {
                arrTableDiy.push({
                    "label": item.name,
                    "value": item.id.toString(),
                });
            } else if (type == "21") {
                arrAntdTable.push({
                    "label": item.name,
                    "value": item.id.toString(),
                });
            } else if (type == "22") {
                arrPivotDiy.push({
                    "label": item.name,
                    "value": item.id.toString(),
                });
            } else if (type == "23") {
                arrTableDiy1.push({
                    "label": item.name,
                    "value": item.id.toString(),
                });
            }
        });
        // 更新state
        this.setState({
            mCharts,
            mDashboard,

            chartIdArrayLine,
            chartIdArrayBar,
            chartIdArrayPie,
            chartIdArrayTable,
            chartIdArrayPivottable,
            chartIdArrayPerspective,
            chartIdArrayText,
            chartIdArrayTextStandard,
            chartIdArrayTableDiy,
            chartIdArrayAntdTable,
            chartIdArrayPivotDiy,
            chartIdArrayTableDiy1,

            arrLine,
            arrBar,
            arrPie,
            arrTable,
            arrPivottable,
            arrPerspective,
            arrText,
            arrTextStandard,
            arrTableDiy,
            arrAntdTable,
            arrPivotDiy,
            arrTableDiy1,
            refreshUI: this.state.refreshUI + 1,
        });
    }

    //  点击事件  增加或删除 chart
    addOrRemoveChart = (type, checkValue) => {
        let operateType;// 增加或者减少类型
        let chartId; // 图表Id
        let arr = [];
        const { chartIdArrayLine, chartIdArrayBar, chartIdArrayPie, chartIdArrayTable, chartIdArrayPivottable, chartIdArrayPerspective, chartIdArrayText, chartIdArrayTextStandard, chartIdArrayTableDiy, chartIdArrayAntdTable, chartIdArrayPivotDiy, chartIdArrayTableDiy1 } = this.state;
        if (type == "0") {
            arr = chartIdArrayLine;
        } else if (type == "1") {
            arr = chartIdArrayBar;
        } else if (type == "2") {
            arr = chartIdArrayPie;
        } else if (type == "3") {
            arr = chartIdArrayTable;
        } else if (type == "4") {
            arr = chartIdArrayPivottable;
        } else if (type == "5") {
            arr = chartIdArrayPerspective;
        } else if (type == "6") {
            arr = chartIdArrayText;
        } else if (type == "61") {
            arr = chartIdArrayTextStandard;
        } else if (type == "7") {
            arr = chartIdArrayTableDiy;
        } else if (type == "21") {
            arr = chartIdArrayAntdTable;
        } else if (type == "22") {
            arr = chartIdArrayPivotDiy;
        } else if (type == "23") {
            arr = chartIdArrayTableDiy1;
        }
        //增加
        if (checkValue.length > arr.length) {
            operateType = "add";
            // 找出增加的chartId
            for (let i = 0; i < checkValue.length; i++) {
                let flag = true;
                for (let j = 0; j < arr.length; j++) {
                    if (checkValue[i] == arr[j]) {
                        flag = false;
                    }
                }
                if (flag) {
                    chartId = checkValue[i];
                }
            }
        } else {// 减少
            operateType = "minus";
            for (let i = 0; i < arr.length; i++) {
                let flag = true;
                for (let j = 0; j < checkValue.length; j++) {
                    if (arr[i] == checkValue[j]) {
                        flag = false;
                    }
                }
                if (flag) {
                    chartId = arr[i];
                }
            }
        }
        // 调用父方法
        this.props.addOrRemoveChart(operateType, chartId);
    };

    handleFieldContent = (key, n) => {
        this[`fieldContent${key}`] = n;
    };

    toogle = (key, ev) => {
        const target = ev.target;
        if (ev.target.className === 'anticon anticon-down') {
            target.className = 'anticon anticon-up';
            this[`fieldContent${key}`].style.display = 'block';
        } else {
            target.className = 'anticon anticon-down';
            this[`fieldContent${key}`].style.display = 'none';
        }
    };

    renderChart() {
        const {
            chartIdArrayLine,
            chartIdArrayBar,
            chartIdArrayPie,
            chartIdArrayTable,
            chartIdArrayPivottable,
            chartIdArrayPerspective,
            chartIdArrayText,
            chartIdArrayTextStandard,
            chartIdArrayTableDiy,
            chartIdArrayAntdTable,
            chartIdArrayPivotDiy,
            chartIdArrayTableDiy1,
            arrLine,
            arrBar,
            arrPie,
            arrTable,
            arrPivottable,
            arrPerspective,
            arrText,
            arrTextStandard,
            arrTableDiy,
            arrAntdTable,
            arrPivotDiy,
            arrTableDiy1,
        } = this.state;

        return (
            <div>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={<div><span>组件列表</span></div>} key="1">
                        <div className="search-config-selection">
                            <div className={styles['field-name']} title="折线图">
                                <i className="anticon anticon-up" onClick={this.toogle.bind(this, 'line')} style={{ cursor: 'pointer' }} />折线图
                            </div>
                            <div className={styles['field-content']} ref={this.handleFieldContent.bind(this, 'line')}>
                                <CheckboxGroup
                                    options={arrLine}
                                    defaultValue={chartIdArrayLine}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "0")}
                                />
                            </div>
                            <div className={styles['field-name']} title="柱状图">
                                <i className="anticon anticon-up" onClick={this.toogle.bind(this, 'bar')} style={{ cursor: 'pointer' }} />柱状图
                            </div>
                            <div className={styles['field-content']} ref={this.handleFieldContent.bind(this, 'bar')}>
                                <CheckboxGroup
                                    options={arrBar}
                                    defaultValue={chartIdArrayBar}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "1")}
                                />
                            </div>
                            <div className={styles['field-name']} title="饼图">
                                <i className="anticon anticon-up" onClick={this.toogle.bind(this, 'pie')} style={{ cursor: 'pointer' }} />饼图
                            </div>
                            <div className={styles['field-content']} ref={this.handleFieldContent.bind(this, 'pie')}>
                                <CheckboxGroup
                                    options={arrPie}
                                    defaultValue={chartIdArrayPie}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "2")}
                                />
                            </div>
                            <div className={styles['field-name']} title="交叉表">
                                <i className="anticon anticon-up" onClick={this.toogle.bind(this, 'table')} style={{ cursor: 'pointer' }} />交叉表
                            </div>
                            <div className={styles['field-content']} ref={this.handleFieldContent.bind(this, 'table')}>
                                <CheckboxGroup
                                    options={arrTable}
                                    defaultValue={chartIdArrayTable}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "3")}
                                />
                            </div>
                            <div className={styles['field-name']} title="透视表A">
                                <i className="anticon anticon-up" onClick={this.toogle.bind(this, 'pivot')} style={{ cursor: 'pointer' }} />透视表A
                            </div>
                            <div className={styles['field-content']} ref={this.handleFieldContent.bind(this, 'pivot')}>
                                <CheckboxGroup
                                    options={arrPivottable}
                                    defaultValue={chartIdArrayPivottable}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "4")}
                                />
                            </div>
                            <div className={styles['field-name']} title="透视表B">
                                <i className="anticon anticon-up" onClick={this.toogle.bind(this, 'perspective')} style={{ cursor: 'pointer' }} />透视表B
                            </div>
                            <div className={styles['field-content']} ref={this.handleFieldContent.bind(this, 'perspective')}>
                                <CheckboxGroup
                                    options={arrPerspective}
                                    defaultValue={chartIdArrayPerspective}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "5")}
                                />
                            </div>
                            <div className={styles['field-name']} title="文本控件">
                                <i className="anticon anticon-up" onClick={this.toogle.bind(this, 'text')} style={{ cursor: 'pointer' }} />文本控件
                            </div>
                            <div className={styles['field-content']} ref={this.handleFieldContent.bind(this, 'text')}>
                                <CheckboxGroup
                                    options={arrText}
                                    defaultValue={chartIdArrayText}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "6")}
                                />
                            </div>
                            <div className={styles['field-name']} title="标准文本控件">
                                <i className="anticon anticon-up" onClick={this.toogle.bind(this, 'textStandard')} style={{ cursor: 'pointer' }} />标准文本控件
                            </div>
                            <div className={styles['field-content']} ref={this.handleFieldContent.bind(this, 'textStandard')}>
                                <CheckboxGroup
                                    options={arrTextStandard}
                                    defaultValue={chartIdArrayTextStandard}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "61")}
                                />
                            </div>
                            <div className={styles['field-name']} title="自定义table">
                                <i className="anticon anticon-up" onClick={this.toogle.bind(this, 'tableDiy')} style={{ cursor: 'pointer' }} />自定义table
                            </div>
                            <div className={styles['field-content']} ref={this.handleFieldContent.bind(this, 'tableDiy')}>
                                <CheckboxGroup
                                    options={arrTableDiy}
                                    defaultValue={chartIdArrayTableDiy}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "7")}
                                />
                            </div>
                            <div className={styles['field-name']} title="antdTable">
                                <i className="anticon anticon-up" onClick={this.toogle.bind(this, 'antdTable')} style={{ cursor: 'pointer' }} />antdTable
                            </div>
                            <div className={styles['field-content']} ref={this.handleFieldContent.bind(this, 'antdTable')}>
                                <CheckboxGroup
                                    options={arrAntdTable}
                                    defaultValue={chartIdArrayAntdTable}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "21")}
                                />
                            </div>
                            <div className={styles['field-name']} title="pivotDiy">
                                <i className="anticon anticon-up" onClick={this.toogle.bind(this, 'pivotDiy')} style={{ cursor: 'pointer' }} />pivotDiy
                            </div>
                            <div className={styles['field-content']} ref={this.handleFieldContent.bind(this, 'pivotDiy')}>
                                <CheckboxGroup
                                    options={arrPivotDiy}
                                    defaultValue={chartIdArrayPivotDiy}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "22")}
                                />
                            </div>
                            <div className={styles['field-name']} title="tableDiy1">
                                <i className="anticon anticon-up" onClick={this.toogle.bind(this, 'tableDiy1')} style={{ cursor: 'pointer' }} />tableDiy1
                            </div>
                            <div className={styles['field-content']} ref={this.handleFieldContent.bind(this, 'tableDiy1')}>
                                <CheckboxGroup
                                    options={arrTableDiy1}
                                    defaultValue={chartIdArrayTableDiy1}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "23")}
                                />
                            </div>
                        </div>
                    </Panel>
                </Collapse>
                {/* 页签权限start */}
                <Collapse defaultActiveKey={['2']}>
                    <Panel header={<div><span>页签权限</span></div>} key="1" style={{ pointerEvents: "none" }}>

                    </Panel>
                </Collapse>
                {/* 页签权限end */}
            </div>
        );

    }

    render() {
        return (
            <div>
                {this.renderChart()}
            </div>
        )
    }
}

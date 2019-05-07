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

            type_line: "down",
            type_bar: "down",
            type_pie: "down",
            type_table: "down",
            type_pivottable: "down",
            type_perspective: "down",
            type_text: "down",
            type_textStandard: "down",
            type_tableDiy: "down",
            type_antdTable: "down",
            type_pivotDiy: "down",
            type_tableDiy1: "down",
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

    /***
     * 展开和收起列表
     * 
     * ***/
    toogle = (key, ev) => {
        const {
            type_line,
            type_bar,
            type_pie,
            type_table,
            type_pivottable,
            type_perspective,
            type_text,
            type_textStandard,
            type_tableDiy,
            type_antdTable,
            type_pivotDiy,
            type_tableDiy1,
        } = this.state;
        if (key == "line") {
            this.setState({
                type_line: type_line == "right" ? "down" : "right",
            });
        } else if (key == "bar") {
            this.setState({
                type_bar: type_bar == "right" ? "down" : "right",
            });
        } else if (key == "pie") {
            this.setState({
                type_pie: type_pie == "right" ? "down" : "right",
            });
        } else if (key == "table") {
            this.setState({
                type_table: type_table == "right" ? "down" : "right",
            });
        } else if (key == "pivottable") {
            this.setState({
                type_pivottable: type_pivottable == "right" ? "down" : "right",
            });
        } else if (key == "perspective") {
            this.setState({
                type_perspective: type_perspective == "right" ? "down" : "right",
            });
        } else if (key == "text") {
            this.setState({
                type_text: type_text == "right" ? "down" : "right",
            });
        } else if (key == "textStandard") {
            this.setState({
                type_textStandard: type_textStandard == "right" ? "down" : "right",
            });
        } else if (key == "tableDiy") {
            this.setState({
                type_tableDiy: type_tableDiy == "right" ? "down" : "right",
            });
        } else if (key == "antdTable") {
            this.setState({
                type_antdTable: type_antdTable == "right" ? "down" : "right",
            });
        } else if (key == "pivotDiy") {
            this.setState({
                type_pivotDiy: type_pivotDiy == "right" ? "down" : "right",
            });
        } else if (key == "tableDiy1") {
            this.setState({
                type_tableDiy1: type_tableDiy1 == "right" ? "down" : "right",
            });
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
            type_line,
            type_bar,
            type_pie,
            type_table,
            type_pivottable,
            type_perspective,
            type_text,
            type_textStandard,
            type_tableDiy,
            type_antdTable,
            type_pivotDiy,
            type_tableDiy1,
        } = this.state;

        return (
            <div>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={<div><span>组件列表</span></div>} key="1">
                        <div className="search-config-selection">
                            <div className={styles['field-name']} title="折线图">
                                <Icon type={type_line} onClick={this.toogle.bind(this, 'line')} style={{ cursor: 'pointer' }} />折线图
                            </div>
                            <div className={styles['field-content']} style={type_line == "down" ? { display: 'block' } : { display: 'none' }}>
                                <CheckboxGroup
                                    options={arrLine}
                                    value={chartIdArrayLine}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "0")}
                                />
                            </div>
                            <div className={styles['field-name']} title="柱状图">
                                <Icon type={type_bar} onClick={this.toogle.bind(this, 'bar')} style={{ cursor: 'pointer' }} />柱状图
                            </div>
                            <div className={styles['field-content']} style={type_bar == "down" ? { display: 'block' } : { display: 'none' }}>
                                <CheckboxGroup
                                    options={arrBar}
                                    value={chartIdArrayBar}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "1")}
                                />
                            </div>
                            <div className={styles['field-name']} title="饼图">
                                <Icon type={type_pie} onClick={this.toogle.bind(this, 'pie')} style={{ cursor: 'pointer' }} />饼图
                            </div>
                            <div className={styles['field-content']} style={type_pie == "down" ? { display: 'block' } : { display: 'none' }}>
                                <CheckboxGroup
                                    options={arrPie}
                                    value={chartIdArrayPie}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "2")}
                                />
                            </div>
                            <div className={styles['field-name']} title="交叉表">
                                <Icon type={type_table} onClick={this.toogle.bind(this, 'table')} style={{ cursor: 'pointer' }} />交叉表
                            </div>
                            <div className={styles['field-content']} style={type_table == "down" ? { display: 'block' } : { display: 'none' }}>
                                <CheckboxGroup
                                    options={arrTable}
                                    value={chartIdArrayTable}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "3")}
                                />
                            </div>
                            <div className={styles['field-name']} title="透视表A">
                                <Icon type={type_pivottable} onClick={this.toogle.bind(this, 'pivottable')} style={{ cursor: 'pointer' }} />透视表A
                            </div>
                            <div className={styles['field-content']} style={type_pivottable == "down" ? { display: 'block' } : { display: 'none' }}>
                                <CheckboxGroup
                                    options={arrPivottable}
                                    value={chartIdArrayPivottable}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "4")}
                                />
                            </div>
                            <div className={styles['field-name']} title="透视表B">
                                <Icon type={type_perspective} onClick={this.toogle.bind(this, 'perspective')} style={{ cursor: 'pointer' }} />透视表B
                            </div>
                            <div className={styles['field-content']} style={type_perspective == "down" ? { display: 'block' } : { display: 'none' }}>
                                <CheckboxGroup
                                    options={arrPerspective}
                                    value={chartIdArrayPerspective}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "5")}
                                />
                            </div>
                            <div className={styles['field-name']} title="文本控件">
                                <Icon type={type_text} onClick={this.toogle.bind(this, 'text')} style={{ cursor: 'pointer' }} />文本控件
                            </div>
                            <div className={styles['field-content']} style={type_text == "down" ? { display: 'block' } : { display: 'none' }}>
                                <CheckboxGroup
                                    options={arrText}
                                    value={chartIdArrayText}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "6")}
                                />
                            </div>
                            <div className={styles['field-name']} title="标准文本控件">
                                <Icon type={type_textStandard} onClick={this.toogle.bind(this, 'textStandard')} style={{ cursor: 'pointer' }} />标准文本控件
                            </div>
                            <div className={styles['field-content']} style={type_textStandard == "down" ? { display: 'block' } : { display: 'none' }}>
                                <CheckboxGroup
                                    options={arrTextStandard}
                                    value={chartIdArrayTextStandard}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "61")}
                                />
                            </div>
                            <div className={styles['field-name']} title="自定义table">
                                <Icon type={type_tableDiy} onClick={this.toogle.bind(this, 'tableDiy')} style={{ cursor: 'pointer' }} />自定义table
                            </div>
                            <div className={styles['field-content']} style={type_tableDiy == "down" ? { display: 'block' } : { display: 'none' }}>
                                <CheckboxGroup
                                    options={arrTableDiy}
                                    value={chartIdArrayTableDiy}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "7")}
                                />
                            </div>
                            <div className={styles['field-name']} title="antdTable">
                                <Icon type={type_antdTable} onClick={this.toogle.bind(this, 'antdTable')} style={{ cursor: 'pointer' }} />antdTable
                            </div>
                            <div className={styles['field-content']} style={type_antdTable == "down" ? { display: 'block' } : { display: 'none' }}>
                                <CheckboxGroup
                                    options={arrAntdTable}
                                    value={chartIdArrayAntdTable}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "21")}
                                />
                            </div>
                            <div className={styles['field-name']} title="pivotDiy">
                                <Icon type={type_pivotDiy} onClick={this.toogle.bind(this, 'pivotDiy')} style={{ cursor: 'pointer' }} />pivotDiy
                            </div>
                            <div className={styles['field-content']} style={type_pivotDiy == "down" ? { display: 'block' } : { display: 'none' }}>
                                <CheckboxGroup
                                    options={arrPivotDiy}
                                    value={chartIdArrayPivotDiy}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "22")}
                                />
                            </div>
                            <div className={styles['field-name']} title="tableDiy1">
                                <Icon type={type_tableDiy1} onClick={this.toogle.bind(this, 'tableDiy1')} style={{ cursor: 'pointer' }} />tableDiy1
                            </div>
                            <div className={styles['field-content']} style={type_tableDiy1 == "down" ? { display: 'block' } : { display: 'none' }}>
                                <CheckboxGroup
                                    options={arrTableDiy1}
                                    value={chartIdArrayTableDiy1}
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

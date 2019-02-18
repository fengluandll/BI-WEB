import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Collapse, Checkbox } from 'antd';
import styles from './index.less';
import ReportBoardUtils from '../../../utils/reportBoardUtils';

const Panel = Collapse.Panel;
const CheckboxGroup = Checkbox.Group;
const reportBoardUtils = new ReportBoardUtils();

//  仪表板 左侧的  图表列表 组件
export default class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            chartIdArrayLine: [],// 选中的列表
            chartIdArrayBar: [],
            chartIdArrayPie: [],
            chartIdArrayTable: [],
            chartIdArrayPivottable: [],
            chartIdArrayPerspective: [],
            chartIdArrayText: [],
            chartIdArrayTableDiy: [],
            chartIdArrayAntdTable: [],
        };
    }

    componentDidMount() {
        this.renderChart();
    }

    //  点击事件  增加或删除 chart
    addOrRemoveChart = (type, checkValue) => {
        let operateType;// 增加或者减少类型
        let chartId; // 图表Id
        let arr = [];
        const { chartIdArrayLine, chartIdArrayBar, chartIdArrayPie, chartIdArrayTable, chartIdArrayPivottable, chartIdArrayPerspective, chartIdArrayText, chartIdArrayTableDiy, chartIdArrayAntdTable } = this.state;
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
        } else if (type == "7") {
            arr = chartIdArrayTableDiy;
        } else if (type == "21") {
            arr = chartIdArrayAntdTable;
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
        const { mCharts, mDashboard } = this.props;
        const node = this.node;
        const arrLine = [];
        const arrBar = [];
        const arrPie = [];
        const arrTable = [];
        const arrPivottable = [];
        const arrPerspective = [];
        const arrText = [];
        const arrTableDiy = [];
        const arrAntdTable = [];
        //  列表全部数据  mCharts 表中的
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
            }
        });
        //  列表选中数据  mDashboard 表中的
        const chartIdArrayLine = [];
        const chartIdArrayBar = [];
        const chartIdArrayPie = [];
        const chartIdArrayTable = [];
        const chartIdArrayPivottable = [];
        const chartIdArrayPerspective = [];
        const chartIdArrayText = [];
        const chartIdArrayTableDiy = [];
        const chartIdArrayAntdTable = [];
        const children = JSON.parse(mDashboard.style_config).children;
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
            } else if (type == "7") {
                chartIdArrayTableDiy.push(item.chartId);
            } else if (type == "21") {
                chartIdArrayAntdTable.push(item.chartId);
            }
        });
        // 放入state中让点击后可以有比较对象
        this.setState({
            chartIdArrayLine,
            chartIdArrayBar,
            chartIdArrayPie,
            chartIdArrayTable,
            chartIdArrayPivottable,
            chartIdArrayPerspective,
            chartIdArrayText,
            chartIdArrayTableDiy,
            chartIdArrayAntdTable,
        });
        const content = (
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
                                    onChange={this.addOrRemoveChart.bind(this, "7")}
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
        ReactDom.render(content, node);
    }
    render() {
        return (
            <div>
                <div ref={(instance) => { this.node = instance; }} />
            </div>
        )
    }
}

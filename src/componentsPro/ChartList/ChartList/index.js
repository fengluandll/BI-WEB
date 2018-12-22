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
        const { chartIdArrayLine, chartIdArrayBar, chartIdArrayPie, chartIdArrayTable, chartIdArrayPivottable } = this.state;
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

            }
        });
        //  列表选中数据  mDashboard 表中的
        const chartIdArrayLine = [];
        const chartIdArrayBar = [];
        const chartIdArrayPie = [];
        const chartIdArrayTable = [];
        const chartIdArrayPivottable = [];
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

            }
        });
        // 放入state中让点击后可以有比较对象
        this.setState({
            chartIdArrayLine,
            chartIdArrayBar,
            chartIdArrayPie,
            chartIdArrayTable,
            chartIdArrayPivottable,
        });
        const content = (
            <div>
                {/* logo标题start */}
                <div style={{ height: '50px', position: 'relative', lineHeight: '50px', textAlign: 'center', borderRight: '1px solid #ccc', background: '#eee', overflow: 'hidden' }}><h1 style={{ color: '#1890ff' }}>编辑模式</h1></div>
                {/* logo标题end */}
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
                            <div className={styles['field-name']} title="pivot表">
                                <i className="anticon anticon-up" onClick={this.toogle.bind(this, 'pivot')} style={{ cursor: 'pointer' }} />pivot表
                            </div>
                            <div className={styles['field-content']} ref={this.handleFieldContent.bind(this, 'pivot')}>
                                <CheckboxGroup
                                    options={arrPivottable}
                                    defaultValue={chartIdArrayPivottable}
                                    style={{ display: 'block' }}
                                    onChange={this.addOrRemoveChart.bind(this, "4")}
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
                {/* 标准页签start */}
                <Collapse defaultActiveKey={['3']}>
                    <Panel header={<div><span>标准页签</span></div>} key="1" style={{ pointerEvents: "none" }}>

                    </Panel>
                </Collapse>
                {/* 标准页签end */}
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

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
    componentDidMount() {
        this.renderChart();
    }

    //  点击事件  增加或删除 chart
    addOrRemoveChart = (checkValue) => {
        this.props.addOrRemoveChart(checkValue);
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
            }
        });
        //  列表选中数据  mDashboard 表中的
        const chartIdArrayLine = [];
        const chartIdArrayBar = [];
        const chartIdArrayPie = [];
        const chartIdArrayTable = [];
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
            }
        });
        const content = (
            <div>
                {/* logo标题start */}
                <div style={{ height: '50px', position: 'relative', lineHeight: '50px', textAlign: 'center', borderRight: '1px solid #ccc', background: '#eee', overflow: 'hidden' }}><h1 style={{color:'#1890ff'}}>编辑模式</h1></div>
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
                                    onChange={this.addOrRemoveChart}
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
                                    onChange={this.addOrRemoveChart}
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
                                    onChange={this.addOrRemoveChart}
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
                                    onChange={this.addOrRemoveChart}
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

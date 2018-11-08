import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Collapse, List, Avatar, Tag, Card, Icon, Button, message, Input, Dropdown, Menu, Checkbox } from 'antd';


const Panel = Collapse.Panel;
const CheckboxGroup = Checkbox.Group;

//  仪表板 左侧的  图表列表 组件
export default class Index extends PureComponent {
    componentDidMount() {
        this.renderChart();
    }

    //  点击事件  增加或删除 chart
    addOrRemoveChart = (checkValue) => {
        this.props.addOrRemoveChart(checkValue);
    };

    renderChart() {
        const { mCharts, mDashboard } = this.props;
        const node = this.node;
        const data = [];
        const arr = [];
        //  列表全部数据  mCharts 表中的
        mCharts.map((item, index) => {
            data.push(item.name);
            arr.push({
                "label": item.name,
                "value": item.id.toString(),
            });
        });
        //  列表选中数据  mDashboard 表中的
        const chartIdArray = [];
        const children = JSON.parse(mDashboard.style_config).children;
        children.map((item, index) => {
            const chartId = item.chartId;
            chartIdArray.push(chartId);
        });
        const content = (
            <div>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={<div><span>组件列表</span></div>} key="1">
                        {/* <List
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={item => (
                                <List.Item>{item}</List.Item>
                            )}
                        /> */}
                        <CheckboxGroup
                            options={arr}
                            defaultValue={chartIdArray}
                            style={{ display: 'block' }}
                            onChange={this.addOrRemoveChart}
                        />
                    </Panel>
                </Collapse>
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

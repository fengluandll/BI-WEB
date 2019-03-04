import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { List, Avatar, Button, Modal, Input, Select, Form } from 'antd';

class NewCharts extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            newChart: false,
        };
    }

    componentDidMount() {
    }
    componentDidUpdate() {
    }

    // 新建图表ui
    renderNewChart = () => {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        };
        return (
            <div>
                <Button type="primary" onClick={this.showNewChart}>
                    新建chart
                </Button>
                <Modal
                    title="新建chart"
                    visible={this.state.newChart}
                    onOk={this.handleNewChartOk}
                    onCancel={this.handleNewChartCancel}
                >
                    <Form layout={'horizontal'}>
                        <Form.Item
                            label="图表名称"
                            {...formItemLayout}
                        >
                            <Input placeholder="输入名称" onChange={this.handleChangeInput.bind(this, "name")} />
                        </Form.Item>
                        <Form.Item
                            label="图表类型"
                            {...formItemLayout}
                        >
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="选择一个数据集"
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onChange={this.handleChangeInput.bind(this, "dataSetName")}
                            >
                                <Select.Option key={0} value={"0"}>折线图</Select.Option>
                                <Select.Option key={1} value={"1"}>柱状图图</Select.Option>
                                <Select.Option key={2} value={"2"}>饼图</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
    // 新建图表回调
    handleNewChartOk = () => {
        this.setState({
            newChart: false,
        });
    }
    handleNewChartCancel = () => {
        this.setState({
            newChart: false,
        });
    }
    showNewChart = () => {
        this.setState({
            newChart: true,
        });
    }
    handleChangeInput = () => {

    }



    render() {
        return (
            <div>
                {this.renderNewChart()}
            </div>
        );
    }
}

export default NewCharts;

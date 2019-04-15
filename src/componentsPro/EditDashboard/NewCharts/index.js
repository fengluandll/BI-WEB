import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { List, message, Button, Modal, Input, Select, Form } from 'antd';

class NewCharts extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            newChart: false, //新建图表弹框
            name: "", // 新建图表的名称
            type: "0", // 新建图表的类型
        };
    }

    componentDidMount() {

    }
    componentDidUpdate() {

    }

    // 新建图表回调
    handleNewChartOk = () => {
        const { onNewCharts } = this.props;
        const config = this.getConfig();
        if (null == config) {
            this.setState({
                newChart: false,
            });
            return;
        }
        onNewCharts(config); // 调用新建方法
        this.setState({
            newChart: false,
            name: "",
            type: "0",
        });
    }
    // 取消新建
    handleNewChartCancel = () => {
        this.setState({
            newChart: false,
            name: "",
            type: "0",
        });
    }
    // 展示新建图表弹框
    showNewChart = () => {
        this.setState({
            newChart: true,
        });
    }
    // input框回调事件
    handleChangeInput = (key, event) => {
        if (key == "name") {
            this.setState({
                name: event.target.value,
            });
        } else if (key == "type") {
            this.setState({
                type: event,
            });
        }
    }

    // 根据类型制造config
    getConfig = () => {
        const { name, type } = this.state;
        if (name == "") {
            message.success('name不能为空');
            return;
        }
        const config = {};
        config.name = name;
        config.type = type;
        config.dataSetName = "";
        config.head = "1";
        config.title = "1";
        if (type == "0" || type == "1" || type == "2") { // 折线图 // 柱状图  // 饼图
            config.padding = "";
            config.forceFit = "0";
            config.legend = "0";
            config.tooltip = "0";
            config.border = "1";
            config.scrollX = "0";
            config.dimension = "";
            config.measure = "";
            config.color = "";
        } else if (type == "3") {//  交叉表

        } else if (type == "4") {// pivot

        } else if (type == "5") {// perspective

        } else if (type == "6") {// text文本控件

        } else if (type == "7") {// 自定义table

        } else if (type == "21") {// antdTable
            config.forceFit = "0"; // 默认不要自适应
            config.column = ""; // 显示的字段，为column表的id
            config.border = "1"; // 是否显示边框, 1:显示
            config.columnUrl = ""; // 显示为url跳转的字段，格式为数组
            config.columnUrlStr = ""; //跳转的url地址
            config.fixed_left = ""; // 在左侧固定的字段
            config.fixed_right = ""; // 在右侧固定的字段
            config.columnUrlParam = ""; // url的参数字段
            config.pagination = "0"; // 分页
        } else if (type == "22") {// pivotDiy
            config.border = "1";
            config.forceFit = "0";
            config.column = ""; // 显示的字段，为column表的id
            config.base_column = ""; // 行组，显示在头部的固定列
            config.col_column = ""; // 列组,显示在右侧的头部大标题
            config.cal_column = ""; // 指标组，用来计算的组
            config.sum_col = ""; // 全局列汇总,Y是汇总，N是不汇总
            config.sum_row = ""; // 全局行汇总,Y是汇总，N是不会总
            config.formula = []; // 计算公式
        } else if (type == "11") {//  搜索框

        }
        return JSON.stringify(config);
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
                            <Input placeholder="输入名称" value={this.state.name} onChange={this.handleChangeInput.bind(this, "name")} />
                        </Form.Item>
                        <Form.Item
                            label="图表类型"
                            {...formItemLayout}
                        >
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="选择图表类型"
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                value={this.state.type}
                                onChange={this.handleChangeInput.bind(this, "type")}
                            >
                                <Select.Option key={0} value={"0"}>折线图</Select.Option>
                                <Select.Option key={1} value={"1"}>柱状图</Select.Option>
                                <Select.Option key={2} value={"2"}>饼图</Select.Option>
                                <Select.Option key={3} value={"3"}>交叉表</Select.Option>
                                <Select.Option key={4} value={"4"}>pivot</Select.Option>
                                <Select.Option key={5} value={"5"}>perspective</Select.Option>
                                <Select.Option key={6} value={"6"}>text文本控件</Select.Option>
                                <Select.Option key={7} value={"7"}>自定义table</Select.Option>
                                <Select.Option key={21} value={"21"}>antdTable</Select.Option>
                                <Select.Option key={22} value={"22"}>pivotDiy</Select.Option>
                                <Select.Option key={11} value={"11"}>搜索框</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
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

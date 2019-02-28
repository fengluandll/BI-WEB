import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Form, Input, Button, Radio, Select, Switch, Checkbox, Row, Col } from 'antd';

class EditAntdTable extends PureComponent {
    constructor(props) {
        super(props);
        const { mChart } = this.props;
        const config = JSON.parse(mChart.config);
        this.state = {
            mChart,
            config,
            refreshUI: 0, // 用来刷新页面的
        };
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    componentWillReceiveProps(nextProps) {
        const { mChart } = nextProps;
        const config = JSON.parse(mChart.config);
        this.state = {
            mChart,
            config,
            refreshUI: 0, // 用来刷新页面的
        };
    }

    /************************input框回调函数*****************************/
    // input
    handleChangeInput = (key, event) => {
        const { config } = this.state;
        if (key == "name") {
            config.name = event.target.value;
        } else if (key == "dataSetName") {
            config.dataSetName = event;
        } else if (key == "border") {
            if (event) {
                config.border = "1";
            } else {
                config.border = "0";
            }
        } else if (key == "forceFit") {
            if (event) {
                config.forceFit = "1";
            } else {
                config.forceFit = "0";
            }
        } else if (key == "head") {
            if (event) {
                config.head = "1";
            } else {
                config.head = "0";
            }
        } else if (key == "title") {
            if (event) {
                config.title = "1";
            } else {
                config.title = "0";
            }
        } else if (key == "pagination") {
            if (event) {
                config.pagination = "1";
            } else {
                config.pagination = "0";
            }
        }
        this.setState({
            config,
            refreshUI: this.state.refreshUI + 1,
        });
    }

    // select
    handleChangeSelect = () => {

    }

    // Switch
    handleChangeSwitch = () => {

    }

    // Checkbox
    handleChangeCheckbox = () => {

    }

    /*******************************************************************/

    render() {
        const { config } = this.state;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        };
        const buttonItemLayout = {
            wrapperCol: { span: 14, offset: 4 },
        };
        return (
            <div>
                <Form layout={'horizontal'}>
                    <Form.Item
                        label="名称(name)"
                        {...formItemLayout}
                    >
                        <Input placeholder="输入名称" value={config.name} onChange={this.handleChangeInput.bind(this, "name")} />
                    </Form.Item>
                    <Form.Item
                        label="数据集名称"
                        {...formItemLayout}
                    >
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="选择一个数据集"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            value={config.dataSetName}
                            onChange={this.handleChangeInput.bind(this, "dataSetName")}
                        >
                            <Select.Option value="jack">Jack</Select.Option>
                            <Select.Option value="lucy">Lucy</Select.Option>
                            <Select.Option value="tom">Tom</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="边框"
                        {...formItemLayout}
                    >
                        <Switch checked={config.border == "1" ? true : false} onChange={this.handleChangeInput.bind(this, "border")} />
                    </Form.Item>
                    <Form.Item
                        label="自适应"
                        {...formItemLayout}
                    >
                        <Switch checked={config.forceFit == "1" ? true : false} onChange={this.handleChangeInput.bind(this, "forceFit")} />
                    </Form.Item>
                    <Form.Item
                        label="显示头部"
                        {...formItemLayout}
                    >
                        <Switch checked={config.head == "1" ? true : false} onChange={this.handleChangeInput.bind(this, "head")} />
                    </Form.Item>
                    <Form.Item
                        label="显示标题"
                        {...formItemLayout}
                    >
                        <Switch checked={config.title == "1" ? true : false} onChange={this.handleChangeInput.bind(this, "title")} />
                    </Form.Item>
                    <Form.Item
                        label="显示分页"
                        {...formItemLayout}
                    >
                        <Switch checked={config.pagination == "1" ? true : false} onChange={this.handleChangeInput.bind(this, "pagination")} />
                    </Form.Item>
                    <Form.Item
                        label="选择显示的字段"
                        {...formItemLayout}
                    >
                        <Checkbox.Group style={{ width: '100%' }}>
                            <Row>
                                <Col span={8}><Checkbox value="A">A</Checkbox></Col>
                                <Col span={8}><Checkbox value="B">B</Checkbox></Col>
                                <Col span={8}><Checkbox value="C">C</Checkbox></Col>
                                <Col span={8}><Checkbox value="D">D</Checkbox></Col>
                                <Col span={8}><Checkbox value="E">E</Checkbox></Col>
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>

                    <Form.Item {...buttonItemLayout}>
                        <Button type="primary">保存</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default EditAntdTable;

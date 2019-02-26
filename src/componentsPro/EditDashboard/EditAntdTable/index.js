import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Form, Input, Button, Radio, Select, Switch, Checkbox, Row, Col } from 'antd';

class EditAntdTable extends PureComponent {

    componentDidMount() {
    }
    componentDidUpdate() {
    }

    renderEmpty = () => {
        return (<div className={styles.empty}><span>数据返回为空</span></div>);
    };

    render() {
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
                        <Input placeholder="输入名称" />
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
                        >
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                            <Option value="tom">Tom</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="边框"
                        {...formItemLayout}
                    >
                        <Switch defaultChecked />
                    </Form.Item>
                    <Form.Item
                        label="自适应"
                        {...formItemLayout}
                    >
                        <Switch defaultChecked />
                    </Form.Item>
                    <Form.Item
                        label="显示头部"
                        {...formItemLayout}
                    >
                        <Switch defaultChecked />
                    </Form.Item>
                    <Form.Item
                        label="显示标题"
                        {...formItemLayout}
                    >
                        <Switch defaultChecked />
                    </Form.Item>
                    <Form.Item
                        label="显示分页"
                        {...formItemLayout}
                    >
                        <Switch defaultChecked />
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

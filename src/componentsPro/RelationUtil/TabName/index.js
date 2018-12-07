import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Form, Input, Collapse, Button } from 'antd';

export default class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: "", //输入框的值
        };
    }

    componentWillReceiveProps(props) {
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    // 输入框回调
    changeValue = (inputValue) => {
        const value = inputValue.target.value;
        this.setState({
            value,
        });
    }

    // 确认电视时间
    conform = (key, value) => {
        this.props.changeTabName(key, value);
    }

    renderContent = () => {
        const FormItem = Form.Item;
        const Panel = Collapse.Panel;
        const { tagName } = this.props;
        let name = ""; // tab名称
        let uuuid = "";
        for (let key in tagName) {
            uuuid = key;
            name = tagName[key];
        }
        let value = name; // 参数tab名称
        if (this.state.value != "") {
            value = this.state.value;
        }
        return (
            <div>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={<div><span>编辑tab名称</span></div>} key="1">
                        <Form>
                            <FormItem>
                                <Input size="small" placeholder="Basic usage" defaultValue={name} onChange={this.changeValue.bind(this)} />
                            </FormItem>
                            <FormItem>
                                <Button type="primary" onClick={this.conform.bind(this, uuuid, value)}>保存名称</Button>
                            </FormItem>
                        </Form>
                    </Panel>
                </Collapse>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderContent()}
            </div>
        )
    }
}
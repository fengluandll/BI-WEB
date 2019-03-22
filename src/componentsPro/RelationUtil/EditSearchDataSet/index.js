import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Form, Select, Button } from 'antd';

/***
 * 编辑搜索框的数据集
 * wangliu
 * 
 * ***/
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
    changeValue = (value) => {
        this.setState({
            value: value,
        });
    }

    // 确认修改
    conform = (value) => {
        this.props.changeDataSetName(value);
    }

    renderContent = () => {
        const FormItem = Form.Item;
        const { dataSetName, mDashboard, mDashboard_old, tableConfig } = this.props; // 搜索框的数据集，m_dashboard的数据集
        let value = ""; // 数据集名称
        const style_config = JSON.parse(mDashboard.style_config);
        const style_config_old = JSON.parse(mDashboard_old.style_config);
        const { children } = style_config;
        const { dataSet } = style_config_old; // dataSet要从mDashboard_old里面取，里面的没更新
        for (let key in children) { //找到搜索框中的数据集名称
            const child = children[key];
            if (child.type == "search") {
                value = child.dataSetName;
            }
        }
        if (null == value || value == "") {
            value = dataSetName; // mchart里的数据集名称
        }
        if (this.state.value != "") {
            value = this.state.value; // 最后如果state里有值就用state里的
        }
        const dataSet_arr = []; //用来展示的数据集数组
        for (let key in dataSet) { // 将m_dashboard中的数据集Id转换成数据集名称
            for (let k in tableConfig) {
                const table = tableConfig[k];
                if (dataSet[key] == table.id) {
                    dataSet_arr.push(table);
                }
            }
        }
        return (
            <div>
                <Form>
                    <FormItem>
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="选择一个数据集"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            value={value}
                            onChange={this.changeValue.bind(this)}
                        >
                            {dataSet_arr.map((item, index) => {
                                return (
                                    <Select.Option key={index} value={item.ds_name}>{item.ds_display}</Select.Option>
                                );
                            })}
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={this.conform.bind(this, value)}>保存</Button>
                    </FormItem>
                </Form>
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
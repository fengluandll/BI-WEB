import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Form, Input, Button, Modal, Select, Switch, Checkbox, Row, Col } from 'antd';
import SelectColumn from '../SelectColumn';

/***
 * 搜索框配置
 * 
 * ***/
class EditSearch extends PureComponent {
    constructor(props) {
        super(props);
        const { mChart } = this.props;
        const config = JSON.parse(mChart.config);
        this.state = {
            config, // config对象
            refreshUI: 0, // 用来刷新页面的
        };
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    componentWillReceiveProps(nextProps) {
    }

    /************************input框回调函数*****************************/
    // input
    handleChangeInput = (key, event) => {
        this.setState({
            config,
            refreshUI: this.state.refreshUI + 1,
        });
    }
    /************************数据集选择回调函数*****************************/
    handleChangeDataSetName = (value) => {
        const { config } = this.state;
        config.dataSetName = value;
        this.setState({
            config,
            refreshUI: this.state.refreshUI + 1,
        });
    }
    /************************字段选择回调函数*****************************/
    handleChangeItem = () => {

    }

    /*************************************************************/


    /***保存***/
    onSave = () => {
        const { mChart, onSave } = this.props;
        const { config } = this.state;
        onSave(JSON.stringify(config), mChart.id);
    }

    /*******************************************************************/

    render() {
        const { config } = this.state;
        const { dataSetList } = this.props; // 数据集 ds_name-obj数组
        const dataSetArr = []; // 所有的数据集选择对象
        for (let key in dataSetList) {
            dataSetArr.push(<Select.Option key={key}>{dataSetList[key].ds_display}</Select.Option>);
        }
        const { dataSetName } = this.state.config;
        const children_item = []; // 选择字段时候先选数据集需要的参数对象
        for (let key in dataSetName) {
            children_item.push(<Option key={key} value={dataSetName[key]}>{dataSetName[key]}</Option>);
        }


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
                        label="数据集选择"
                        {...formItemLayout}
                    >
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            defaultValue={config.dataSetName}
                            onChange={this.handleChangeDataSetName}
                        >
                            {dataSetArr}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="选择字段"
                        {...formItemLayout}
                    >
                        <Select
                            style={{ width: '100%', minWidth: '120px' }}
                            onChange={this.handleChangeItem}
                        >
                            {children_item}
                        </Select>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default EditSearch;

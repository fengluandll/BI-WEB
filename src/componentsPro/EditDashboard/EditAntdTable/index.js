import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Form, Input, Button, Modal, Select, Switch, Checkbox, Row, Col } from 'antd';
import SelectColumn from '../SelectColumn';

class EditAntdTable extends PureComponent {
    constructor(props) {
        super(props);
        const { mChart } = this.props;
        const config = JSON.parse(mChart.config);
        this.state = {
            mChart, // mChart对象
            config, // config对象
            column: false, // 显示字段的弹出框是否开启
            columnUrl: false, // 跳转地址
            columnUrlParam: false,
            fixed_left: false,
            fixed_right: false,
            columnCheckbox: config.column, // checkbox弹出框的临时值
            columnUrlCheckbox: config.columnUrl, // checkbox弹出框的临时值
            columnUrlParamCheckbox: config.columnUrlParam, // checkbox弹出框的临时值
            fixed_leftCheckbox: config.fixed_left,
            fixed_rightCheckbox: config.fixed_right,
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
        } else if (key == "columnUrlStr") {
            config.columnUrlStr = event.target.value;
        }
        this.setState({
            config,
            refreshUI: this.state.refreshUI + 1,
        });
    }
    /************************字段column*****************************/
    // Checkbox
    handleChangeCheckbox = (checkedList) => {
        let columnCheckbox = "";
        for (let key in checkedList) {
            columnCheckbox = columnCheckbox + checkedList[key] + ",";
        }
        columnCheckbox = columnCheckbox.substring(0, columnCheckbox.length - 1);
        this.setState({
            columnCheckbox: columnCheckbox,
        });
    }
    // ref
    onRefSelectColumn = (ref) => {
        this.selectColumn = ref;
    }

    // 显示字段 弹出框
    showColumn = () => {
        this.setState({
            column: true,
        });
    }
    // 显示字段回调函数
    handleColumnOk = () => {
        const { config, columnCheckbox } = this.state;
        config.column = columnCheckbox;
        this.setState({
            column: false,
            config,
            refreshUI: this.state.refreshUI + 1,
        });
    }
    // 取消
    handleColumnCancel = () => {
        const { config } = this.state;
        this.setState({
            column: false,
            columnCheckbox: config.column,
            refreshUI: this.state.refreshUI + 1,
        });
        this.selectColumn.refreshUI(); // 取消就调用子的方法刷新
    }

    /************************字段columnUrl*****************************/

    // Checkbox
    handleChangeCheckboxColumnUrl = (checkedList) => {
        let str = "";
        for (let key in checkedList) {
            str = str + checkedList[key] + ",";
        }
        str = str.substring(0, str.length - 1);
        this.setState({
            columnUrlCheckbox: str,
        });
    }
    // ref
    onRefSelectColumnUrl = (ref) => {
        this.selectColumnUrl = ref;
    }
    // 显示字段 弹出框
    showColumnUrl = () => {
        this.setState({
            columnUrl: true,
        });
    }
    // 显示字段回调函数
    handleColumnUrlOk = () => {
        const { config, columnUrlCheckbox } = this.state;
        config.columnUrl = columnUrlCheckbox;
        this.setState({
            columnUrl: false,
            config,
            refreshUI: this.state.refreshUI + 1,
        });
    }
    // 取消
    handleColumnUrlCancel = () => {
        const { config } = this.state;
        this.setState({
            columnUrl: false,
            columnUrlCheckbox: config.columnUrl,
            refreshUI: this.state.refreshUI + 1,
        });
        this.selectColumnUrl.refreshUI(); // 取消就调用子的方法刷新
    }

    /************************字段columnUrlParam*****************************/

    // Checkbox
    handleChangeCheckboxColumnUrlParam = (checkedList) => {
        let str = "";
        for (let key in checkedList) {
            str = str + checkedList[key] + ",";
        }
        str = str.substring(0, str.length - 1);
        this.setState({
            columnUrlParamCheckbox: str,
        });
    }
    // ref
    onRefSelectColumnUrlParam = (ref) => {
        this.selectColumnUrlParam = ref;
    }
    // 显示字段 弹出框
    showColumnUrlParam = () => {
        this.setState({
            columnUrlParam: true,
        });
    }
    // 显示字段回调函数
    handleColumnUrlParamOk = () => {
        const { config, columnUrlParamCheckbox } = this.state;
        config.columnUrlParam = columnUrlParamCheckbox;
        this.setState({
            columnUrlParam: false,
            config,
            refreshUI: this.state.refreshUI + 1,
        });
    }
    // 取消
    handleColumnUrlParamCancel = () => {
        const { config } = this.state;
        this.setState({
            columnUrlParam: false,
            columnUrlParamCheckbox: config.columnUrl,
            refreshUI: this.state.refreshUI + 1,
        });
        this.selectColumnUrlParam.refreshUI(); // 取消就调用子的方法刷新
    }

    /************************字段fixed_left*****************************/

    // Checkbox
    handleChangeCheckboxFixed_left = (checkedList) => {
        let str = "";
        for (let key in checkedList) {
            str = str + checkedList[key] + ",";
        }
        str = str.substring(0, str.length - 1);
        this.setState({
            fixed_leftCheckbox: str,
        });
    }
    // ref
    onRefSelectFixed_left = (ref) => {
        this.selectFixed_left = ref;
    }
    // 显示字段 弹出框
    showFixed_left = () => {
        this.setState({
            fixed_left: true,
        });
    }
    // 显示字段回调函数
    handleFixed_leftOk = () => {
        const { config, fixed_leftCheckbox } = this.state;
        config.fixed_left = fixed_leftCheckbox;
        this.setState({
            fixed_left: false,
            config,
            refreshUI: this.state.refreshUI + 1,
        });
    }
    // 取消
    handleFixed_leftCancel = () => {
        const { config } = this.state;
        this.setState({
            fixed_left: false,
            fixed_leftCheckbox: config.fixed_left,
            refreshUI: this.state.refreshUI + 1,
        });
        this.selectFixed_left.refreshUI(); // 取消就调用子的方法刷新
    }


    /************************字段fixed_right*****************************/

    // Checkbox
    handleChangeCheckboxFixed_right = (checkedList) => {
        let str = "";
        for (let key in checkedList) {
            str = str + checkedList[key] + ",";
        }
        str = str.substring(0, str.length - 1);
        this.setState({
            fixed_rightCheckbox: str,
        });
    }
    // ref
    onRefSelectFixed_right = (ref) => {
        this.selectFixed_right = ref;
    }
    // 显示字段 弹出框
    showFixed_right = () => {
        this.setState({
            fixed_right: true,
        });
    }
    // 显示字段回调函数
    handleFixed_rightOk = () => {
        const { config, fixed_rightCheckbox } = this.state;
        config.fixed_right = fixed_rightCheckbox;
        this.setState({
            fixed_right: false,
            config,
            refreshUI: this.state.refreshUI + 1,
        });
    }
    // 取消
    handleFixed_rightCancel = () => {
        const { config } = this.state;
        this.setState({
            fixed_right: false,
            fixed_rightCheckbox: config.fixed_right,
            refreshUI: this.state.refreshUI + 1,
        });
        this.selectFixed_right.refreshUI(); // 取消就调用子的方法刷新
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
        const { dataSetList } = this.props;
        const dataSetArr = [];
        for (let key in dataSetList) {
            dataSetArr.push(dataSetList[key]);
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
                            {dataSetArr.map((item, index) => {
                                return (
                                    <Select.Option key={index} value={item.ds_name}>{item.ds_display}</Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="边框"
                        {...formItemLayout}
                    >
                        <Switch checked={config.border == "1" ? true : false} onChange={this.handleChangeInput.bind(this, "border")} />
                    </Form.Item>
                    {/* <Form.Item
                        label="自适应"
                        {...formItemLayout}
                    >
                        <Switch checked={config.forceFit == "1" ? true : false} onChange={this.handleChangeInput.bind(this, "forceFit")} />
                    </Form.Item> */}
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
                        <Button type="primary" onClick={this.showColumn}>
                            编辑显示字段
                        </Button>
                        <Modal
                            title="显示字段"
                            visible={this.state.column}
                            onOk={this.handleColumnOk}
                            onCancel={this.handleColumnCancel}
                        >
                            <SelectColumn
                                type="column"
                                dataSetList={this.props.dataSetList}
                                idColumns={this.props.idColumns}
                                config={this.state.config}
                                onChange={this.handleChangeCheckbox}
                                ref={this.onRefSelectColumn}
                            />
                        </Modal>
                    </Form.Item>
                    <Form.Item
                        label="跳转url地址"
                        {...formItemLayout}
                    >
                        <Input placeholder="输入url地址" value={config.columnUrlStr} onChange={this.handleChangeInput.bind(this, "columnUrlStr")} />
                    </Form.Item>
                    <Form.Item
                        label="选择显示的跳转字段"
                        {...formItemLayout}
                    >
                        <Button type="primary" onClick={this.showColumnUrl}>
                            编辑要跳转的字段
                        </Button>
                        <Modal
                            title="跳转字段"
                            visible={this.state.columnUrl}
                            onOk={this.handleColumnUrlOk}
                            onCancel={this.handleColumnUrlCancel}
                        >
                            <SelectColumn
                                type="columnUrl"
                                dataSetList={this.props.dataSetList}
                                idColumns={this.props.idColumns}
                                config={this.state.config}
                                onChange={this.handleChangeCheckboxColumnUrl}
                                ref={this.onRefSelectColumnUrl}
                            />
                        </Modal>
                    </Form.Item>
                    <Form.Item
                        label="跳转参数字段"
                        {...formItemLayout}
                    >
                        <Button type="primary" onClick={this.showColumnUrlParam}>
                            编辑要跳转的字段
                        </Button>
                        <Modal
                            title="跳转参数"
                            visible={this.state.columnUrlParam}
                            onOk={this.handleColumnUrlParamOk}
                            onCancel={this.handleColumnUrlParamCancel}
                        >
                            <SelectColumn
                                type="columnUrlParam"
                                dataSetList={this.props.dataSetList}
                                idColumns={this.props.idColumns}
                                config={this.state.config}
                                onChange={this.handleChangeCheckboxColumnUrlParam}
                                ref={this.onRefSelectColumnUrlParam}
                            />
                        </Modal>
                    </Form.Item>
                    <Form.Item
                        label="固定左侧"
                        {...formItemLayout}
                    >
                        <Button type="primary" onClick={this.showFixed_left}>
                            固定左侧列
                        </Button>
                        <Modal
                            title="固定左侧列"
                            visible={this.state.fixed_left}
                            onOk={this.handleFixed_leftOk}
                            onCancel={this.handleFixed_leftCancel}
                        >
                            <SelectColumn
                                type="fixed_left"
                                dataSetList={this.props.dataSetList}
                                idColumns={this.props.idColumns}
                                config={this.state.config}
                                onChange={this.handleChangeCheckboxFixed_left}
                                ref={this.onRefSelectFixed_left}
                            />
                        </Modal>
                    </Form.Item>
                    <Form.Item
                        label="固定右侧"
                        {...formItemLayout}
                    >
                        <Button type="primary" onClick={this.showFixed_right}>
                            固定右侧列
                        </Button>
                        <Modal
                            title="固定右侧列"
                            visible={this.state.fixed_right}
                            onOk={this.handleFixed_rightOk}
                            onCancel={this.handleFixed_rightCancel}
                        >
                            <SelectColumn
                                type="fixed_right"
                                dataSetList={this.props.dataSetList}
                                idColumns={this.props.idColumns}
                                config={this.state.config}
                                onChange={this.handleChangeCheckboxFixed_right}
                                ref={this.onRefSelectFixed_right}
                            />
                        </Modal>
                    </Form.Item>

                    <Form.Item {...buttonItemLayout}>
                        <Button type="primary" onClick={this.onSave}>保存</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default EditAntdTable;

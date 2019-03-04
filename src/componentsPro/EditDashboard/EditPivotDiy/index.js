import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Form, Input, Button, Modal, Select, Switch, Checkbox, Row, Col } from 'antd';
import SelectColumn from '../SelectColumn';

class EditPivotDiy extends PureComponent {
    constructor(props) {
        super(props);
        const { mChart } = this.props;
        const config = JSON.parse(mChart.config);
        this.state = {
            mChart, // mChart对象
            config, // config对象
            column: false, // 显示字段的弹出框是否开启
            base_column: false, // 行组，显示在头部的固定列
            col_column: false, // 列组,显示在右侧的头部大标题
            cal_column: false, // 指标组，用来计算的组
            columnCheckbox: config.column, // checkbox弹出框的临时值
            base_columnCheckbox: config.base_column,
            col_columnCheckbox: config.col_column,
            cal_columnCheckbox: config.cal_column,
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
        } else if (key == "sum_col") {
            if (event) {
                config.sum_col = "1";
            } else {
                config.sum_col = "0";
            }
        } else if (key == "sum_row") {
            if (event) {
                config.sum_row = "1";
            } else {
                config.sum_row = "0";
            }
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

    /*****************************base_column********************************/

    // Checkbox
    handleChangeCheckboxBase_column = (checkedList) => {
        let str = "";
        for (let key in checkedList) {
            str = str + checkedList[key] + ",";
        }
        str = str.substring(0, str.length - 1);
        this.setState({
            base_columnCheckbox: str,
        });
    }
    // ref
    onRefSelectBase_column = (ref) => {
        this.selectBase_column = ref;
    }

    // 显示字段 弹出框
    showBase_column = () => {
        this.setState({
            base_column: true,
        });
    }
    // 显示字段回调函数
    handleBase_columnOk = () => {
        const { config, base_columnCheckbox } = this.state;
        config.base_column = base_columnCheckbox;
        this.setState({
            base_column: false,
            config,
            refreshUI: this.state.refreshUI + 1,
        });
    }
    // 取消
    handleBase_columnCancel = () => {
        const { config } = this.state;
        this.setState({
            base_column: false,
            base_columnCheckbox: config.base_column,
            refreshUI: this.state.refreshUI + 1,
        });
        this.selectBase_column.refreshUI(); // 取消就调用子的方法刷新
    }

    /*****************************col_column********************************/
    // Checkbox
    handleChangeCheckboxCol_column = (checkedList) => {
        let str = "";
        for (let key in checkedList) {
            str = str + checkedList[key] + ",";
        }
        str = str.substring(0, str.length - 1);
        this.setState({
            col_columnCheckbox: str,
        });
    }
    // ref
    onRefSelectCol_column = (ref) => {
        this.selectCol_column = ref;
    }

    // 显示字段 弹出框
    showCol_column = () => {
        this.setState({
            col_column: true,
        });
    }
    // 显示字段回调函数
    handleCol_columnOk = () => {
        const { config, col_columnCheckbox } = this.state;
        config.col_column = col_columnCheckbox;
        this.setState({
            col_column: false,
            config,
            refreshUI: this.state.refreshUI + 1,
        });
    }
    // 取消
    handleCol_columnCancel = () => {
        const { config } = this.state;
        this.setState({
            col_column: false,
            col_columnCheckbox: config.col_column,
            refreshUI: this.state.refreshUI + 1,
        });
        this.selectCol_column.refreshUI(); // 取消就调用子的方法刷新
    }

    /*****************************cal_column********************************/

    // Checkbox
    handleChangeCheckboxCal_column = (checkedList) => {
        let str = "";
        for (let key in checkedList) {
            str = str + checkedList[key] + ",";
        }
        str = str.substring(0, str.length - 1);
        this.setState({
            cal_columnCheckbox: str,
        });
    }
    // ref
    onRefSelectCal_column = (ref) => {
        this.selectCal_column = ref;
    }

    // 显示字段 弹出框
    showCal_column = () => {
        this.setState({
            cal_column: true,
        });
    }
    // 显示字段回调函数
    handleCal_columnOk = () => {
        const { config, cal_columnCheckbox } = this.state;
        config.cal_column = cal_columnCheckbox;
        this.setState({
            cal_column: false,
            config,
            refreshUI: this.state.refreshUI + 1,
        });
    }
    // 取消
    handleCal_columnCancel = () => {
        const { config } = this.state;
        this.setState({
            cal_column: false,
            cal_columnCheckbox: config.cal_column,
            refreshUI: this.state.refreshUI + 1,
        });
        this.selectCal_column.refreshUI(); // 取消就调用子的方法刷新
    }


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
                        label="全局列汇总"
                        {...formItemLayout}
                    >
                        <Switch checked={config.sum_col == "1" ? true : false} onChange={this.handleChangeInput.bind(this, "sum_col")} />
                    </Form.Item>
                    <Form.Item
                        label="全局行汇总"
                        {...formItemLayout}
                    >
                        <Switch checked={config.sum_row == "1" ? true : false} onChange={this.handleChangeInput.bind(this, "sum_row")} />
                    </Form.Item>
                    <Form.Item
                        label="显示的字段"
                        {...formItemLayout}
                    >
                        <Button type="primary" onClick={this.showColumn}>
                            显示字段
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
                        label="固定列"
                        {...formItemLayout}
                    >
                        <Button type="primary" onClick={this.showBase_column}>
                            固定列
                        </Button>
                        <Modal
                            title="固定列"
                            visible={this.state.base_column}
                            onOk={this.handleBase_columnOk}
                            onCancel={this.handleBase_columnCancel}
                        >
                            <SelectColumn
                                type="base_column"
                                dataSetList={this.props.dataSetList}
                                idColumns={this.props.idColumns}
                                config={this.state.config}
                                onChange={this.handleChangeCheckboxBase_column}
                                ref={this.onRefSelectBase_column}
                            />
                        </Modal>
                    </Form.Item>
                    <Form.Item
                        label="大标题"
                        {...formItemLayout}
                    >
                        <Button type="primary" onClick={this.showCol_column}>
                            大标题
                        </Button>
                        <Modal
                            title="大标题"
                            visible={this.state.col_column}
                            onOk={this.handleCol_columnOk}
                            onCancel={this.handleCol_columnCancel}
                        >
                            <SelectColumn
                                type="col_column"
                                dataSetList={this.props.dataSetList}
                                idColumns={this.props.idColumns}
                                config={this.state.config}
                                onChange={this.handleChangeCheckboxCol_column}
                                ref={this.onRefSelectCol_column}
                            />
                        </Modal>
                    </Form.Item>
                    <Form.Item
                        label="指标列"
                        {...formItemLayout}
                    >
                        <Button type="primary" onClick={this.showCal_column}>
                            指标列
                        </Button>
                        <Modal
                            title="指标列"
                            visible={this.state.cal_column}
                            onOk={this.handleCal_columnOk}
                            onCancel={this.handleCal_columnCancel}
                        >
                            <SelectColumn
                                type="cal_column"
                                dataSetList={this.props.dataSetList}
                                idColumns={this.props.idColumns}
                                config={this.state.config}
                                onChange={this.handleChangeCheckboxCal_column}
                                ref={this.onRefSelectCal_column}
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

export default EditPivotDiy;

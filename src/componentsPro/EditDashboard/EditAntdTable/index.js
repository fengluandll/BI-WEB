import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Form, Input, Button, Modal, Select, Switch, List, Checkbox, Row, Col } from 'antd';
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
            warning_row: false, // 值预警-行
            warning_col: false, // 值预警-列
            column_order: false, // 字段排序
            columnCheckbox: config.column, // checkbox弹出框的临时值
            columnUrlCheckbox: config.columnUrl, // checkbox弹出框的临时值
            columnUrlParamCheckbox: config.columnUrlParam, // checkbox弹出框的临时值
            fixed_leftCheckbox: config.fixed_left, // checkbox弹出框的临时值
            fixed_rightCheckbox: config.fixed_right, // checkbox弹出框的临时值
            column_orderCheckbox: config.column_order, // column_order弹出框的临时值
            warning_rowData: config.warning_row == null ? [] : config.warning_row, // warning_row的临时值
            warning_row_row: "", // warning_row row临时值
            warning_row_formula: "", // formula 临时值
            warning_colData: config.warning_col, // warning_col的临时值
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
            mChart, // mChart对象
            config, // config对象
            column: false, // 显示字段的弹出框是否开启
            columnUrl: false, // 跳转地址
            columnUrlParam: false,
            fixed_left: false,
            fixed_right: false,
            warning_row: false, // 值预警-行
            warning_col: false, // 值预警-列
            column_order: false, // 字段排序
            columnCheckbox: config.column, // checkbox弹出框的临时值
            columnUrlCheckbox: config.columnUrl, // checkbox弹出框的临时值
            columnUrlParamCheckbox: config.columnUrlParam, // checkbox弹出框的临时值
            fixed_leftCheckbox: config.fixed_left, // checkbox弹出框的临时值
            fixed_rightCheckbox: config.fixed_right, // checkbox弹出框的临时值
            column_orderCheckbox: config.column_order, // column_order弹出框的临时值
            warning_rowData: config.warning_row == null ? [] : config.warning_row, // warning_row的临时值
            warning_row_row: "", // warning_row row临时值
            warning_row_formula: "", // formula 临时值
            warning_colData: config.warning_col, // warning_col的临时值
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
        } else if (key == "warning_row_row") {
            this.setState({
                warning_row_row: event.target.value,
            });
        } else if (key == "warning_row_formula") {
            this.setState({
                warning_row_formula: event.target.value,
            });
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

    /*****************************warning_row********************************/

    // 显示字段 弹出框
    showWarning_row = () => {
        this.setState({
            warning_row: true,
        });
    }
    // 显示字段回调函数
    handleWarning_rowOk = () => {
        const { warning_row_row, warning_row_formula, warning_rowData } = this.state;
        const obj = { "row": warning_row_row, "formula": warning_row_formula };
        warning_rowData.push(obj);
        this.setState({
            warning_row: false,
            warning_rowData,
            warning_row_row: "",
            warning_row_formula: "",
            refreshUI: this.state.refreshUI + 1,
        });
    }
    // 取消
    handleWarning_rowCancel = () => {
        this.setState({
            warning_row: false,
            warning_row_row: "",
            warning_row_formula: "",
            refreshUI: this.state.refreshUI + 1,
        });
    }
    // 删除计算字段
    deleteWarning_row = (row) => {
        let { warning_rowData } = this.state;
        let index = 0; //要删除的下标
        for (let key in warning_rowData) {
            if (warning_rowData[key].row == row) {
                index = key;
            }
        }
        warning_rowData.splice(index, 1); //删除
        this.setState({
            warning_row: false,
            warning_rowData,
            refreshUI: this.state.refreshUI + 1,
        });
    }
    /************************字段column_order*****************************/

    // Checkbox
    handleChangeCheckboxColumn_order = (checkedList) => {
        let str = "";
        for (let key in checkedList) {
            str = str + checkedList[key] + ",";
        }
        str = str.substring(0, str.length - 1);
        this.setState({
            column_orderCheckbox: str,
        });
    }
    // ref
    onRefSelectColumn_order = (ref) => {
        this.selectColumn_order = ref;
    }
    // 显示字段 弹出框
    showColumn_order = () => {
        this.setState({
            column_order: true,
        });
    }
    // 显示字段回调函数
    handleColumn_orderOk = () => {
        const { config, column_orderCheckbox } = this.state;
        config.column_order = column_orderCheckbox;
        this.setState({
            column_order: false,
            config,
            refreshUI: this.state.refreshUI + 1,
        });
    }
    // 取消
    handleColumn_orderCancel = () => {
        const { config } = this.state;
        this.setState({
            column_order: false,
            column_orderCheckbox: config.column_order,
            refreshUI: this.state.refreshUI + 1,
        });
        this.selectColumn_order.refreshUI(); // 取消就调用子的方法刷新
    }
    /*************************************************************/


    /***保存***/
    onSave = () => {
        const { mChart, onSave } = this.props;
        const { config, warning_rowData } = this.state;
        config.warning_row = warning_rowData; // 如果config里没有warning_row需要手动配置,如果有,因为warning_row是config里取出来的,所有引用类型改变原来config里的值
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
                    <Form.Item
                        label="值预警"
                        {...formItemLayout}
                    >
                        <Button type="primary" onClick={this.showWarning_row}>
                            值预警-行
                        </Button>
                        <div>
                            <List
                                itemLayout="horizontal"
                                dataSource={this.state.warning_rowData}
                                renderItem={item => (
                                    <List.Item actions={[<a href="javascript:void(0);" onClick={this.deleteWarning_row.bind(this, item.row)}>delete</a>]}>
                                        <List.Item.Meta
                                            title={item.row}
                                            description={`行数:${item.row}-公式:${item.formula}`}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                        <Modal
                            title="值预警-行"
                            visible={this.state.warning_row}
                            onOk={this.handleWarning_rowOk}
                            onCancel={this.handleWarning_rowCancel}
                        >
                            <Form.Item
                                label="行数"
                                {...formItemLayout}
                            >
                                <Input placeholder="输入行数" value={this.state.warning_row_row} onChange={this.handleChangeInput.bind(this, "warning_row_row")} />
                            </Form.Item>
                            <Form.Item
                                label="公式"
                                {...formItemLayout}
                            >
                                <Input placeholder="输入公式内容" value={this.state.warning_row_formula} onChange={this.handleChangeInput.bind(this, "warning_row_formula")} />
                            </Form.Item>
                        </Modal>
                    </Form.Item>
                    <Form.Item
                        label="排序字段"
                        {...formItemLayout}
                    >
                        <Button type="primary" onClick={this.showColumn_order}>
                            选择排序字段
                        </Button>
                        <Modal
                            title="排序字段"
                            visible={this.state.column_order}
                            onOk={this.handleColumn_orderOk}
                            onCancel={this.handleColumn_orderCancel}
                        >
                            <SelectColumn
                                type="column_order"
                                dataSetList={this.props.dataSetList}
                                idColumns={this.props.idColumns}
                                config={this.state.config}
                                onChange={this.handleChangeCheckboxColumn_order}
                                ref={this.onRefSelectColumn_order}
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

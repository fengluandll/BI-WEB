import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Form, Input, Button, Modal, Select, Switch, List, Avatar, Row, Col } from 'antd';
import ReportBoardUtils from '../../../utils/reportBoardUtils';


const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
};
const buttonItemLayout = {
    wrapperCol: { span: 14, offset: 4 },
};

const reportBoardUtils = new ReportBoardUtils();


class EditTableDiy1 extends PureComponent {
    constructor(props) {
        super(props);
        const { mChart } = this.props;
        const config = JSON.parse(mChart.config);
        this.state = {
            mChart, // mChart对象
            config, // config对象

            modal_column: false, // column弹窗

            uuuid: "", // 当前uuuid,编辑的时候才有值
            id: "", // 字段弹出框-id
            type: "normal", // 字段弹出框-类型
            type_id: "", // 字段弹出框-类型id
            type_value: "", // 字段弹出框-分类值
            type_title_id: "", // 字段弹出框-类型二级标题id
            merge: "sum", // 字段弹出框-聚合方式
            show_id: "", // 展示字段
            model_type: "new", // 弹出框类型, new edite

            refreshUI: 0, // 用来刷新页面的
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    /********************************点击事件**************************************/

    // input 回调
    handleChangeInput = (key, event) => {
        const { config } = this.state;
        if (key == "name") {
            config.name = event.target.value;
        } else if (key == "dataSetName") {
            config.dataSetName = event;
        } else if (key == "id") { // 字段弹出框-id
            this.setState({
                id: event,
            });
        } else if (key == "type_id") { // 字段弹出框-id
            this.setState({
                type_id: event,
            });
        } else if (key == "type") { // 字段弹出框-类型
            this.setState({
                type: event,
            });
        } else if (key == "type_value") { // 字段弹出框-类型值
            this.setState({
                type_value: event.target.value,
            });
        } else if (key == "merge") { // 字段弹出框-聚合方式
            this.setState({
                merge: event,
            });
        } else if (key == "show_id") { // 展示字段
            this.setState({
                show_id: event,
            });
        } else if (key == "type_title_id") { // 字段弹出框-二级标题id
            this.setState({
                type_title_id: event,
            });
        }
        this.setState({
            config,
            refreshUI: this.state.refreshUI + 1,
        });
    }

    /***保存***/
    onSave = () => {
        const { onSave } = this.props;
        const { mChart, config } = this.state;

        /** 保存前先制作column字段 **/
        const { column_obj } = config;
        let column = ""; // 先清空column
        for (let item of column_obj) {
            const { type, id, type_id, type_title_id, show_id } = item;
            if (type == "normal" || type == "normalback") {
                column = column + id + ",";
            } else if (type == "type") {
                column = column + type_id + "," + type_title_id + ",";
            } else if (type == "show") {
                column = column + show_id + ",";
            }
        }
        if (column.length > 0) {
            column = column.substring(0, column.length - 1);
        }
        config.column = column;
        /*********************************/

        onSave(JSON.stringify(config), mChart.id);
    }

    /********************************column**************************************/

    // 显示字段 弹出框
    showColumn = () => {
        this.setState({
            uuuid: "",
            id: "",
            type: "normal",
            type_id: "",
            type_value: "",
            type_title_id: "",
            merge: "sum",
            show_id: "",
            model_type: "new", // 弹出类型 新建
            modal_column: true,
            refreshUI: this.state.refreshUI + 1,
        });
    }
    // 弹窗ok回调
    handleColumnOk = () => {
        const { uuuid, id, type, type_value, type_id, type_title_id, show_id, merge, model_type, config } = this.state;
        const { column_obj } = config;
        if (model_type == "new") { // 新建
            const uuuid = reportBoardUtils.getUUUID();
            // 制造json
            const obj = { uuuid: uuuid, id: id, type: type, type_id: type_id, type_value: type_value, type_title_id: type_title_id, show_id: show_id, merge: merge };
            column_obj.push(obj); // 放入column_obj
        } else if (model_type == "edite") { // 编辑
            for (let item of column_obj) {
                if (item.uuuid == uuuid) {
                    item.id = id;
                    item.type = type;
                    item.type_value = type_value;
                    item.type_id = type_id;
                    item.merge = merge;
                    item.show_id = show_id;
                    item.type_title_id = type_title_id;
                }
            }
        }
        this.setState({
            modal_column: false,
            config,
            refreshUI: this.state.refreshUI + 1,
        });
    }
    // 弹窗cancel回调
    handleColumnCancel = () => {
        this.setState({
            modal_column: false,
            refreshUI: this.state.refreshUI + 1,
        });
    }

    // 编辑单个字段
    editeColumn = (uuuid) => {
        const { id, type, type_value, type_id, type_title_id, merge, config } = this.state;
        const { column_obj } = config;
        let obj = {};
        for (let item of column_obj) {
            if (item.uuuid == uuuid) {
                obj = item;
            }
        }
        this.setState({
            uuuid: uuuid,
            id: obj.id,
            type: obj.type,
            type_id: obj.type_id,
            type_value: obj.type_value,
            type_title_id: obj.type_title_id,
            merge: obj.merge,
            show_id: obj.show_id,
            model_type: "edite", // 弹出类型 编辑
            modal_column: true, // 打开弹出框
            refreshUI: this.state.refreshUI + 1,
        });
    }

    // 删除单个字段
    deleteColumn = (uuuid) => {
        const { id, type, type_value, type_id, merge, config } = this.state;
        const { column_obj } = config;
        for (let key in column_obj) {
            if (column_obj[key].uuuid == uuuid) {
                column_obj.splice(key, 1); // 删除
            }
        }
        this.setState({
            config,
            modal_column: false, // 打开弹出框
            refreshUI: this.state.refreshUI + 1,
        });
    }

    // column 显示list 
    getItemTitle = (item) => {
        const { dataSetList, idColumns } = this.props;
        const type = item.type;
        let rsc_display = "";
        if (type == "normal" || type == "normalback") {
            rsc_display = idColumns[item.id].rsc_display;
        } else if (type == "type") {
            rsc_display = idColumns[item.type_id].rsc_display;
        } else if (type == "show") {
            rsc_display = idColumns[item.show_id].rsc_display;
        }
        return rsc_display;
    }
    getItemDescription = (item) => {
        const { dataSetList, idColumns } = this.props;
        const type = item.type;
        let rsc_display = "";
        if (type == "normal" || type == "normalback") {
            rsc_display = item.id;
        } else if (type == "type") {
            rsc_display = item.type_id;
        } else if (type == "show") {
            rsc_display = item.show_id;
        }
        return rsc_display;
    }

    /****************************************************************************/

    // 展示弹出框的ui
    renderModel = () => {
        const { id, type, type_value, type_id, type_title_id, show_id, merge, config } = this.state;
        const { dataSetList, idColumns } = this.props;
        const { dataSetName } = config;
        const dataSet = dataSetList[dataSetName]; // 当前数据集的对象
        if (null == dataSet) {
            return;
        }

        const id_arr = []; // id显示数组
        const type_id_arr = []; // 分类id显示数组
        for (let key in idColumns) {
            const column_obj = idColumns[key];  // 每个字段的对象
            if (column_obj.rs_t_id == dataSet.id) { // 字段的table_id 等于 数据集id
                id_arr.push(<Option key={key} value={column_obj.id}>{column_obj.rsc_display}</Option>);
                type_id_arr.push(<Option key={key} value={column_obj.id}>{column_obj.rsc_display}</Option>);
            }
        }

        if (type == "normal" || type == "normalback") {
            return (
                <div>
                    <Form.Item
                        label="ID"
                        {...formItemLayout}
                    >
                        <Select
                            size="default"
                            value={id}
                            onChange={this.handleChangeInput.bind(this, "id")}
                            style={{ width: 200 }}
                        >
                            {id_arr}
                        </Select>
                    </Form.Item>
                </div>
            );
        } else if (type == "type") {
            return (
                <div>
                    <Form.Item
                        label="类型字段"
                        {...formItemLayout}
                    >
                        <Select
                            size="default"
                            value={type_id}
                            onChange={this.handleChangeInput.bind(this, "type_id")}
                            style={{ width: 200 }}
                        >
                            {type_id_arr}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="二级标题字段"
                        {...formItemLayout}
                    >
                        <Select
                            size="default"
                            value={type_title_id}
                            onChange={this.handleChangeInput.bind(this, "type_title_id")}
                            style={{ width: 200 }}
                        >
                            {type_id_arr}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="分类值"
                        {...formItemLayout}
                    >
                        <Input placeholder="输入分类值" value={type_value} onChange={this.handleChangeInput.bind(this, "type_value")} />
                    </Form.Item>
                    <Form.Item
                        label="聚合"
                        {...formItemLayout}
                    >
                        <Select defaultValue="none" value={merge} onChange={this.handleChangeInput.bind(this, "merge")}>
                            <Option value="sum">sum</Option>
                            <Option value="count">count</Option>
                        </Select>
                    </Form.Item>
                </div>
            );
        } else if (type == "show") { // 展示字段
            return (
                <div>
                    <Form.Item
                        label="展示字段"
                        {...formItemLayout}
                    >
                        <Select
                            size="default"
                            value={show_id}
                            onChange={this.handleChangeInput.bind(this, "show_id")}
                            style={{ width: 200 }}
                        >
                            {type_id_arr}
                        </Select>
                    </Form.Item>
                </div>
            );
        }
    }

    render() {
        const { config, type } = this.state;
        const { dataSetList, idColumns } = this.props;
        const dataSetArr = [];
        for (let key in dataSetList) {
            dataSetArr.push(dataSetList[key]);
        }
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
                        label="字段"
                        {...formItemLayout}
                    >
                        <Button type="primary" onClick={this.showColumn}>
                            添加字段
                        </Button>
                        <div>
                            <List
                                itemLayout="horizontal"
                                dataSource={this.state.config.column_obj}
                                renderItem={item => (
                                    <List.Item actions={[
                                        <a href="javascript:void(0);" onClick={this.editeColumn.bind(this, item.uuuid)}>edite</a>,
                                        <a href="javascript:void(0);" onClick={this.deleteColumn.bind(this, item.uuuid)}>delete</a>
                                    ]}>
                                        <List.Item.Meta
                                            title={this.getItemTitle(item)}
                                            description={this.getItemDescription(item)}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                        <Modal
                            title="添加字段"
                            visible={this.state.modal_column}
                            onOk={this.handleColumnOk}
                            onCancel={this.handleColumnCancel}
                        >
                            <Form.Item
                                label="字段"
                                {...formItemLayout}
                            >
                                <Select value={type} onChange={this.handleChangeInput.bind(this, "type")}>
                                    <Option value="normal">普通字段-前</Option>
                                    <Option value="normalback">显示字段-后</Option>
                                    <Option value="type">类型字段</Option>
                                    <Option value="show">显示字段</Option>
                                </Select>
                            </Form.Item>
                            {this.renderModel()}
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

export default EditTableDiy1;
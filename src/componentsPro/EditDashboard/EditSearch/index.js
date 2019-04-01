import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Form, Input, Button, Modal, Select, Switch, Checkbox, Row, Col } from 'antd';
import SelectColumn from '../SelectColumn';
import ReactDnd from './reactDnd';
import Example from './example'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

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
        const { config } = this.state;
        if (key == "name") {
            config.name = event.target.value;
        } else if (key == "dataSetName") {
            config.dataSetName = event;
        }
        this.setState({
            config,
            refreshUI: this.state.refreshUI + 1,
        });
    }
    /************************数据集选择回调函数*****************************/


    /************************字段选择回调函数*****************************/


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
        const { mChart, tDashboard, dataSetList, idColumns, tableIdColumns, tableConfig, onSave } = this.props;

        // 取出所有数据集 从tableConfig取出所有的数据集
        const dataSetArr = [];
        for (let key in tableConfig) {
            dataSetArr.push(tableConfig[key]);
        }

        const { dataSetName, searchItem } = this.state.config;
        const children_item = []; // 选择字段时候先选数据集需要的参数对象
        for (let key in dataSetName) {
            children_item.push(<Option key={key} value={dataSetName[key]}>{dataSetName[key]}</Option>);
        }

        let idColumns_id_arr = []; // 搜索框子项id数组
        for (let key in searchItem) { // searchItem是key:数据集名称,value：id组成的str
            const arr = searchItem[key].split(",");
            idColumns_id_arr = idColumns_id_arr.concat(arr);
        }
        let idColumns_arr = []; // 搜索框子项对象数组
        let idColumns_searchItem_arr = []; // 搜索框子项Id的对象 key:id,value:obj
        for (let key in idColumns_id_arr) {
            const value = idColumns_id_arr[key];
            idColumns_arr.push(idColumns[value]);
            idColumns_searchItem_arr.push(idColumns[value]);
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
                    {/* <Form.Item>
                        <ReactDnd
                            idColumns_arr={idColumns_arr}
                            idColumns_searchItem_arr={idColumns_searchItem_arr}
                        />
                    </Form.Item> */}
                    <Form.Item>
                        <DragDropContextProvider backend={HTML5Backend}>
                            <Example
                                idColumns_arr={idColumns_arr}
                                idColumns_searchItem_arr={idColumns_searchItem_arr}
                            />
                        </DragDropContextProvider>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default EditSearch;

import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Form, Input, Button, Modal, Select, Switch, Checkbox, Row, Col } from 'antd';
import SelectColumn from '../SelectColumn';
import ReactDnd from './reactDnd';

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
        const { config, dataSetName_idColumns } = this.state;
        const { dataSetList, idColumns, tableIdColumns } = this.props; // 数据集 ds_name-obj数组; ds_name - id_columns list对象
        const dataSetArr = []; // 所有的数据集选择对象
        for (let key in dataSetList) {
            dataSetArr.push(<Select.Option key={key}>{dataSetList[key].ds_display}</Select.Option>);
        }
        const { dataSetName, searchItem } = this.state.config;
        const children_item = []; // 选择字段时候先选数据集需要的参数对象
        for (let key in dataSetName) {
            children_item.push(<Option key={key} value={dataSetName[key]}>{dataSetName[key]}</Option>);
        }

        // const searchItem_arr = searchItem.split(","); // 搜索框子项id数组
        // let idColumns_searchItem_arr = []; // 搜索框子项Id的对象 key:id,value:obj
        // for (let key in searchItem_arr) {
        //     const value = searchItem_arr[key];
        //     idColumns_searchItem_arr.push(idColumns[value]);
        // }


        let idColumns_arr = []; // 当前数据集所有的字段数组
        if (null != dataSetName_idColumns && dataSetName_idColumns != "") {
            idColumns_arr = tableIdColumns[dataSetName_idColumns];
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

                </Form>
            </div>
        );
    }
}

export default EditSearch;

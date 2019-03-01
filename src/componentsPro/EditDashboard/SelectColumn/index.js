import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

class SelectColumn extends PureComponent {
    constructor(props) {
        super(props);
        const { config, type } = this.props; // type是调用组件的类型,就是config里面的字段名称
        const column = config[type];
        let checkedList = [];
        if (null != column) {
            checkedList = column.split(",");
        }
        this.state = {
            checkedList: checkedList, // 选中的字段
            indeterminate: true,
            checkAll: false,
            refreshUI: 0, // 用来刷新页面的
        };
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    componentWillReceiveProps(nextProps) {
        const { config, type } = nextProps;
        const column = config[type];
        let checkedList = [];
        if (null != column) {
            checkedList = column.split(",");
        }
        this.state = {
            checkedList: checkedList, // 选中的字段
        };
    }

    // change
    onChange = (checkedList) => {
        const { onChange } = this.props;
        const options = this.getOptions();
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < options.length),
            checkAll: checkedList.length === options.length,
        });
        onChange(checkedList);
    }
    // 全选按钮
    onCheckAllChange = (e) => {
        const { onChange } = this.props;
        const options = this.getOptions();
        const options_value = []; // 从option里制造出value的值
        for (let key in options) {
            options_value.push(options[key].value);
        }
        const checkedList = e.target.checked ? options_value : [];
        this.setState({
            checkedList: checkedList,
            indeterminate: false,
            checkAll: e.target.checked,
        });
        onChange(checkedList);
    }

    // 刷新页面
    refreshUI = () => {
        this.setState({
            refreshUI: this.state.refreshUI + 1,
        });
    }

    /*******************************************************************/
    // 获取数据
    getOptions = () => {
        const options = []; // 所有待选id
        const { dataSetList, idColumns, config } = this.props;
        const { dataSetName } = config;
        const dataSet = dataSetList[dataSetName]; // 当前数据集的对象
        for (let key in idColumns) {
            const column = idColumns[key];  // 每个字段的对象
            if (column.rs_t_id == dataSet.id) { // 字段的table_id 等于 数据集id
                const obj = { label: column.rsc_display, value: column.id }
                options.push(obj);
            }
        }
        return options;
    }

    render() {
        const options = this.getOptions();
        return (
            <div>
                <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                    <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={this.state.checkAll}
                    >
                        全选
                    </Checkbox>
                </div>
                <br />
                <CheckboxGroup options={options} value={this.state.checkedList} onChange={this.onChange} />
            </div>
        );
    }
}

export default SelectColumn;

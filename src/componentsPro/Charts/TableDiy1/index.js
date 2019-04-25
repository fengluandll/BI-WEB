import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Table, Divider, Icon, Tooltip } from 'antd';
import CalData from './calData'

import styles from '../index.less';

const calData = new CalData();

/***
 * 自定义table1
 * 
 * 基本就是行转列
 * 
 * @author:wangliu
 * 
 * ***/
class TableDiy1 extends PureComponent {
    constructor(props) {
        super(props);

    }
    componentDidMount() {
    }

    componentDidUpdate() {
    }

    /***
     * 
     * 制造参数和列
     * 
     * ***/
    getTableData = () => {
        const { mChart, dateSetList, editModel, dragactStyle, idColumns } = this.props;
        const config = JSON.parse(mChart.config);
        const { header, body } = dateSetList;

        const tableDate = calData.getData(this.props);

        return tableDate;
    }

    /***
    * 
    * 获取高度
    * 
    * ***/
    getHeight = () => {

    }

    /***
    * 
    * 获取滑动长度
    * 
    * ***/
    getScroll = () => {

    }

    render() {
        const tableDate = this.getTableData();

        return (
           <div></div>
        );
    }
}
export default TableDiy1;
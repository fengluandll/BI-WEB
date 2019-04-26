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
        const { mChart, dateSetList, editModel, dragactStyle, idColumns } = this.props;
        const config = JSON.parse(mChart.config);
        let height = 600;
        if (null != dragactStyle && dragactStyle.length > 0) {
            const array = dragactStyle;
            array.map((item, index) => {
                if (item.key == mChart.id.toString()) {
                    if (editModel == "true") {
                        height = item.h * 40 - 40;
                    } else {
                        height = item.h * 40 - 40;
                    }
                    if (config.head != "1") { // 没有头部的时候
                        height = item.h * 40 - 13;
                    }
                }
            });
        }
        return height;
    }

    /***
    * 
    * 获取滑动长度
    * 
    * ***/
    getScroll = () => {
        const { data } = this.getTableData();
        const width = Object.keys(data[0]).length * 157;
        const height = this.getHeight();
        const scroll = { x: width, y: height - 58 };// x轴滚动是列个数乘200,y轴是根据dragact算出的高度减去图表控件额外的高度。
        return scroll;
    }

    render() {
        const tableDate = this.getTableData();
        const { columns, data } = tableDate;
        const height = this.getHeight();
        const scroll = this.getScroll();
        return (
            <div style={{ overflow: 'auto', height: height }}>
                <Table
                    columns={columns}
                    dataSource={data}
                    scroll={scroll}
                    pagination={false}
                />
            </div>
        );
    }
}
export default TableDiy1;
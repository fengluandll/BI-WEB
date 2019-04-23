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
     * 展示ui
     * 
     * ***/
    renderContent = () => {

    }

    render() {
        return (
            <div>
                {this.renderContent()}
            </div>
        );
    }
}
export default TableDiy1;
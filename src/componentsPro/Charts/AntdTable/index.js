import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Table, Divider, Icon } from 'antd';

import styles from '../index.less';

class AntdTable extends PureComponent {

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  renderEmpty = () => {
    return (<div className={styles.empty}><span>数据返回为空</span></div>);
  };

  /***导出excel***/
  onExport = () => {
    const { mChart, dateSetList, editModel, dragactStyle, onExport } = this.props;
    onExport(mChart.id);
  }
  /***制造参数和列***/
  getTableData = () => {
    const { mChart, dateSetList, editModel, dragactStyle, idColumns } = this.props;
    const config = JSON.parse(mChart.config);
    const { header, body } = dateSetList;

    // f1 url跳转功能
    const columnUrl = config.columnUrl.split(",");
    const columnUrl_name = []; // url跳转的字段中文数组
    if (null != columnUrl && columnUrl != "") {
      for (let key in columnUrl) {
        const value = columnUrl[key];
        if (null != value && value != "") {
          const name = idColumns[value].rsc_display;
          columnUrl_name.push(name);
        }
      }
    }
    // f2 固定单元格
    const { fixed_left, fixed_right } = config;
    const left_name = []; // 固定左侧的中文数组
    const right_name = []; // 固定右侧的中文数组
    if (null != fixed_left && fixed_left != "") {
      const left = fixed_left.split(",");
      for (let key in left) {
        const value = left[key];
        if (null != value && value != "") {
          const name = idColumns[value].rsc_display;
          left_name.push(name);
        }
      }
    }
    if (null != fixed_right && fixed_right != "") {
      const right = fixed_right.split(",");
      for (let key in right) {
        const value = right[key];
        if (null != value && value != "") {
          const name = idColumns[value].rsc_display;
          right_name.push(name);
        }
      }
    }
    // f3 设置每列的宽度
    const col_value_count_arr = []; // 每列的最大字符数量
    const body_first = body[0]; // 第一行的数据
    const col_count = body_first.length; // 数据总共有多少列
    for (let i = 0; i < col_count; i++) {  // 按照列循环
      const col_value = []; // 每列的所有数据数组
      for (let key in body) {
        const body_line = body[key]; // 每行数据
        col_value.push(body_line[i]); // 每行数据的当前列数据放入数组
      }
      // 计算出每列数据的最大的字符个数
      let col_value_count = 0;
      for (let key in col_value) {
        let tmp_count = 0;
        const value = col_value[key];
        for (var j = 0; j < value.length; j++) {
          var a = value.charAt(i);
          if (a.match(/[^\x00-\xff]/ig) != null) {
            tmp_count += 2;
          }
          else {
            tmp_count += 1;
          }
        }
        if (tmp_count > col_value_count) {
          col_value_count = tmp_count;
        }
      }
      col_value_count_arr.push(col_value_count);
    }

    const tableDate = {}; // 拼接好的参数对象
    /***制造列***/
    const columns = [];
    for (let key in header) {
      const value = header[key];
      const obj = { "title": value, "dataIndex": value, "key": value };
      // f1 判断并添加url跳转
      if (columnUrl_name.length > 0) {
        for (let key in columnUrl_name) {
          if (value == columnUrl_name[key]) {
            obj.render = (text) => (
              <a href="javascript:;">{text}</a>
            );
          }
        }
      }
      // f2 固定单元格
      if (left_name.length > 0) {
        for (let key in left_name) {
          if (value == left_name[key]) {
            obj.fixed = 'left';
            if (col_value_count_arr[key]) { // 如果是固定列那么这一列是要加上宽度的不然就会出现列的重叠
              obj.width = col_value_count_arr[key] * 10;
            }
          }
        }
      }
      if (right_name.length > 0) {
        for (let key in right_name) {
          if (value == right_name[key]) {
            obj.fixed = 'right';
            if (col_value_count_arr[key]) {
              obj.width = col_value_count_arr[key] * 10;
            }
          }
        }
      }
      // f3 设置最大宽度
      if (col_value_count_arr[key] && config.forceFit != "1") {  // 只有不是自适应宽度的时候才要每行都要赋值
        //obj.width = col_value_count_arr[key] * 10;
      }
      columns.push(obj);
    }
    /***制造数据***/
    const data = [];
    for (let key in body) {
      const obj = { "key": key };
      const body_line = body[key];
      for (let body_line_key in body_line) {
        obj[header[body_line_key]] = body_line[body_line_key];
      }
      data.push(obj);
    }
    tableDate["columns"] = columns;
    tableDate["data"] = data;
    return tableDate;
  }

  /***获取头部***/
  getHeadDiv = () => {
    const { mChart } = this.props;
    const config = JSON.parse(mChart.config);
    if (config.head == "1") {
      return (
        <div style={{ height: '25px', lineHeight: '25px' }}>
          <div className={styles['chart-title', 'chart-titleTable']} ref={this.handleTitle}>
            {config.name ? config.name : ''}
          </div>
          <Icon type="download" style={{ fontSize: 16, color: '#08c', position: 'absolute', right: '20px', top: '2.5px' }}
            onClick={() => {
              this.onExport();
            }}
          />
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }
  }
  /***获取高度***/
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
  // 获取scroll
  getScroll = () => {
    const { mChart } = this.props;
    const config = JSON.parse(mChart.config);
    let scroll = {};
    if (config.forceFit == "1") {
      scroll = { x: '100%' };
    } else {
      scroll = { x: 3000 };
    }
    return scroll;
  }

  renderContent() {
    const tableDate = this.getTableData();
    const { columns, data } = tableDate;
    const { mChart } = this.props;
    const config = JSON.parse(mChart.config);
    const height = this.getHeight();
    const scroll = this.getScroll();
    /***展示table控件***/
    return (
      <div>
        <div>
          {/***head***/}
          {this.getHeadDiv()}
        </div>
        <div style={{ overflow: 'auto', height: height }}>
          <Table
            columns={columns}
            dataSource={data}
            scroll={scroll}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderContent()}
      </div>
    )
  }
}

export default AntdTable;

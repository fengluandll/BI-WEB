import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Table, Divider, Icon, Tooltip } from 'antd';
import PivotUtils from './pivotUtils';
import styles from '../index.less';

const pivotUtils = new PivotUtils();

class PivotDiy extends PureComponent {

  componentDidMount() {
  }

  componentDidUpdate() {
  }

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

      pivotUtils.getData(this.props);
    

    const tableDate = {}; // 拼接好的参数对象
    /***制造列***/
    const columns = [];
    for (let key in header) {
      const value = header[key];
      const obj = { "title": value, "dataIndex": value, "key": value };
      columns.push(obj);
    }
    /***制造数据***/
    const data = [];
    for (let key in body) {
      const obj = { "key": key };
      const body_line = body[key];
      for (let body_line_key in body_line) {
        let value = body_line[body_line_key];
        if (value.length > 12 && config.forceFit != "1") { // 如果字符大于12个的时候那就隐藏用Tooltip提示
          value = (
            <Tooltip title={value} placement="top">
              <span>{value.substring(0, 12) + "..."}</span>
            </Tooltip>
          );
        }
        obj[header[body_line_key]] = value;
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
    const tableDate = this.getTableData();
    const { columns, data } = tableDate;
    const height = this.getHeight();
    const scroll = { x: columns.length * 200, y: height - 117 };// x轴滚动是列个数乘200,y轴是根据dragact算出的高度减去图表控件额外的高度。
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

export default PivotDiy;

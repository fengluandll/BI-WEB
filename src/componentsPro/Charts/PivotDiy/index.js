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

    const tableDate = pivotUtils.getData(this.props);

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
    const { column, base_column, col_column, cal_column, sum_col, sum_row, formula } = config;
    const base_column_arr = base_column.split(",");
    const col_column_arr = col_column.split(",");
    const cal_column_arr = cal_column.split(",");
    let width = (base_column_arr.length + col_column_arr.length * cal_column_arr.length) * 500;
    const height = this.getHeight();
    const scroll = { x: width, y: height - 163 };// x轴滚动是列个数乘200,y轴是根据dragact算出的高度减去图表控件额外的高度。
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

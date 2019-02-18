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
    const { mChart, dateSetList, editModel, dragactStyle } = this.props;
    const { header, body } = dateSetList;
    const tableDate = {}; // 拼接好的参数对象
    /***制造列***/
    const columns = [];
    for (let key in header) {
      const obj = { "title": header[key], "dataIndex": header[key] };
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

  renderContent() {
    const tableDate = this.getTableData();
    const { columns, data } = tableDate;
    const { mChart } = this.props;
    const config = JSON.parse(mChart.config);
    /***展示table控件***/
    return (
      <div>
        <div>
          {/***head***/}
          {this.getHeadDiv()}
        </div>
        <Table
          columns={columns}
          dataSource={data}
        />
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

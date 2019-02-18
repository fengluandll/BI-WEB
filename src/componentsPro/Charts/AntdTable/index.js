import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Table, Divider, Tag } from 'antd';

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
    const tableDate = {}; // 拼接好的参数对象
    let columns = this.getColumns(dateSetList);
    let data = this.getData(dateSetList);
    tableDate["columns"] = columns;
    tableDate["data"] = data;
    return tableDate;
  }
  /***制造列***/
  getColumns = (dateSetList) => {
    const { header, body } = dateSetList;
    const columns = [];
    for (let key in header) {
      const obj = { "title": header[key], "dataIndex": header[key] };
      columns.push(obj);
    }
    return columns;
  }

  /***制造数据***/
  getData = (dateSetList) => {
    const { header, body } = dateSetList;
    const data = [];
    for (let key in body) {
      const obj = { "key": key };
      const body_line = body[key];
      for (let body_line_key in body_line) {
        obj[header[body_line_key]] = body_line[body_line_key];
      }
      data.push(obj);
    }
    return data;
  }

  renderContent() {
    const tableDate = this.getTableData();
    const { columns, data } = tableDate;

    /******/
    return (
      <div>
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

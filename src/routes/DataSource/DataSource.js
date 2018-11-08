import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Input, Button, Tooltip } from 'antd';

import styles from './index.less';

const { Search } = Input;
const ButtonGroup = Button.Group;

class DataSource extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'ds/fetch',
      payload: {
        page: this.page,
        name: this.name,
        pageSize: this.pageSize,
      },
    });
  }
  name = '';
  page = 1;
  pageSize = 10;
  columns = [{
    title: '表名',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name > b.name,
    render: (text, record) => {
      return (
        <div className="ant-list-item-meta-content">
          <h4 className="ant-list-item-meta-title">{text}</h4>
          <div className="ant-list-item-meta-description">{record.code}</div>
        </div>
      );
    },
  }, {
    title: '备注',
    dataIndex: 'description',
    key: 'description',
  }, {
    title: '操作',
    key: 'action',
    width: 100,
    render: (text, record) => (
      <ButtonGroup>
        <Tooltip placement="top" title="新建数据集">
          <Button icon="plus" onClick={this.jumpToBl} data-id={record.id} />
        </Tooltip>
      </ButtonGroup>
    ),
  }];
  search = (name) => {
    this.name = name;
    this.page = 1;
    this.fetch();
  };
  fetch = () => {
    this.props.dispatch({
      type: 'ds/fetch',
      payload: {
        page: this.page,
        name: this.name,
        pageSize: this.pageSize,
      },
    });
  };
  jumpToBl = (event) => {
    const id = event.target.getAttribute('data-id');
    this.props.dispatch({
      type: 'ds/addDl',
      payload: { id },
    });
  };
  handleChange = (event) => {
    this.name = event.target.value;
  };
  handleTableChange = (pagination) => {
    this.page = pagination.current;
    this.fetch();
  };
  renderTable = () => {
    const { pager } = this.props;
    const pagination = {
      showQuickJumper: true,
      pageSize: this.pageSize,
      current: this.page,
      total: 10,
    };
    let list = [];
    if (pager.data) {
      pagination.total = pager.data.total;
      list = pager.data.list;
    }
    return (<Table
      columns={this.columns}
      dataSource={list}
      pagination={pagination}
      rowKey="id"
      loading={pager.loading}
      onChange={this.handleTableChange}
    />);
  };

  render() {
    return (
      <div>
        <div className={styles.dataSourceHeader}>
          <Search
            className={styles.extraContentSearch}
            placeholder="请输入"
            onChange={this.handleChange}
            onSearch={this.search}
          />
        </div>
        {this.renderTable()}
      </div>
    );
  }
}

export default connect(state => ({
  pager: state.ds,
}))(DataSource);

import { connect } from 'dva';
import { Link } from 'dva/router';
import React, { PureComponent } from 'react';
import { Table, Input, Button, Tooltip, Icon } from 'antd';
import DateUtil from '../../utils/dateUtils';

import styles from './index.less';

const { Search } = Input;
const ButtonGroup = Button.Group;

class Dashboard extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'dashboard/fetch',
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
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name > b.name,
    render: (text, record) => {
      const url = `/newDashboard/${record.pageId}`;
      return (
        <div className="ant-list-item-meta-content">
          <h4 className="ant-list-item-meta-title">
            <Link to={url}>{text}</Link>
          </h4>
        </div>
      );
    },
  }, {
    title: '创建时间',
    dataIndex: 'createDate',
    key: 'createDate',
    render: (text) => {
      return DateUtil.format(new Date(text), 'yyyy-MM-dd hh:mm:ss');
    },
  }, {
    title: '操作',
    key: 'action',
    width: 100,
    render: (text, record) => (
      <ButtonGroup>
        <Tooltip placement="top" title="删除">
          <Button icon="delete" onClick={this.delete.bind(this, record.id)} />
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
      type: 'dashboard/fetch',
      payload: {
        page: this.page,
        name: this.name,
        pageSize: this.pageSize,
      },
    });
  };
  delete = (id) => {
    this.props.dispatch({
      type: 'dashboard/del',
      payload: {
        page: this.page,
        name: this.name,
        pageSize: this.pageSize,
        id,
      },
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
          <Link className="ant-btn" to="/newDashboard" style={{ marginLeft: '5px' }}><Icon type="plus" />新建仪表板</Link>
        </div>
        {this.renderTable()}
      </div>
    );
  }
}

export default connect(state => ({
  pager: state.dashboard,
}))(Dashboard);

import React, { PureComponent } from 'react';
import { Input, List } from 'antd';

const Search = Input.Search;

/**
 * 带搜索栏的列表
 */
export default class SearchList extends PureComponent {
  componentDidUpdate = () => {
    if (this.props.visible) {
      this.search.focus();
    }
  };
  search = (value) => {
    this.setState({
      data: this.props.data.filter((item) => {
        const v = item.value;
        return v.indexOf(value) >= 0;
      }),
    });
  };
  itemClick = (item) => {
    this.props.onSelect(item.value, item);
  };
  render() {
    const { visible } = this.props;
    const dsName = this.props.val ? this.props.val.dsDisplay : '';
    const searchKey = this.props.val ? this.props.val.id : '';
    return (
      <div
        style={{ zIndex: '1', display: visible ? 'block' : 'none', position: 'absolute', width: '100%', maxHeight: '300px', overflow: 'auto' }}
      >
        <Search
          key={searchKey}
          disabled
          placeholder=""
          defaultValue={dsName}
          onSearch={this.search}
          onBlur={this.props.onBlur}
          ref={(instance) => { this.search = instance; }}
        />
        <List
          style={{ maxHeight: '200px', overflow: 'auto', backgroundColor: '#fff' }}
          size="small"
          bordered
          dataSource={this.props.data}
          renderItem={item => (<List.Item style={{ cursor: 'pointer' }} onClick={this.itemClick.bind(this, item)}>{item.value}</List.Item>)}
        />
      </div>
    );
  }
}

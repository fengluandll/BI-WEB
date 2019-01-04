import React, { PureComponent } from 'react';
import { Input } from 'antd';
import MultiSelect from './MultiSelect/MultiSelect';

import styles from '../Search/index.less';

/**
 * 仪表板-查询控件-字符筛选
 */
export default class Index extends PureComponent {
  constructor(props) {
    super(props);
    const { rela, relaJson, data } = this.props;
    this.state = {
      rela,
      relaJson,
      data,
    };
  }
  onChange = (e) => {
    const val = e.target.value;
    const rest = val && val !== '' ? [val] : null;
    this.props.onChange(rest);
  };
  singleChange = (value) => {
    this.props.onChange([value.name]);
  };
  multiChange = (values) => {
    const arr = [];
    for (const o of values) {
      arr.push(o.name);
    }
    this.props.onChange(arr);
  };
  componentWillReceiveProps(nextProps) {
    const { rela, relaJson, data } = nextProps;
    this.state = {
      rela,
      relaJson,
      data,
    };
  }
  renderContent = () => {
    const { load } = this.props;
    const { rela, relaJson, data } = this.state;
    const { str_type } = relaJson;
    if (str_type == "0") {
      return (<Input addonBefore="匹配" onChange={this.onChange} value={rela.props} />);
    } else if (str_type == "1") {
      return (
        <MultiSelect
          type="single"
          onChange={this.singleChange}
          data={data}
          load={load}
          value={rela.props}
        />
      );
    } else {
      return (
        <MultiSelect
          type="multi"
          onChange={this.multiChange}
          data={data}
          load={load}
          value={rela.props}
        />
      );
    }
  }
  render() {
    return (
      <div className={styles['query-field']}>
        {this.renderContent()}
      </div>
    );
  }
}

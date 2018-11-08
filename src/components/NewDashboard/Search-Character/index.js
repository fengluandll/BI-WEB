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
    this.state = {
      value: this.props.val,
    };
  }
  onChange = (e) => {
    const val = e.target.value;
    this.setState({
      value: val,
    });
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
  render() {
    const { data, load } = this.props;
    const type = this.props.rule.value;
    let control = null;
    switch (type) {
    case '0':
      control = (<Input addonBefore="匹配" onChange={this.onChange} value={this.state.value} />);
      break;
    case '1':
      control = (<MultiSelect
        type="single"
        onChange={this.singleChange}
        data={data}
        load={load}
        value={this.props.val}
      />);
      break;
    default:
      control = (<MultiSelect
        type="multi"
        onChange={this.multiChange}
        data={data}
        load={load}
        value={this.props.val}
      />);
    }
    return (
      <div className={styles['query-field']}>
        { control }
      </div>
    );
  }
}

import React, { PureComponent } from 'react';
import { Input } from 'antd';

export default class NumericInput extends PureComponent {
  onChange = (e) => {
    // 是否只允许输入自然数
    const { onlyNatural } = this.props;
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    const flag = onlyNatural ? value === '' : value === '' || value === '-';
    if ((!isNaN(value) && reg.test(value)) || flag) {
      this.props.onChange(value);
    }
  };
  render() {
    return (
      <Input
        {...this.props}
        onChange={this.onChange}
        maxLength="25"
      />
    );
  }
}

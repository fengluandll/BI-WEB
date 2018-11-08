import React, { PureComponent } from 'react';
import NumericInput from './NumbericInput';

/**
 * 数值输入控件
 */
export default class Index extends PureComponent {
  constructor(props) {
    super(props);
    const value = !isNaN(this.props.defaultValue) ? this.props.defaultValue : '';
    this.state = { value };
  }
  onChange = (value) => {
    this.setState({ value });
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };
  render() {
    return (
      <NumericInput
        {...this.props}
        value={this.state.value}
        onChange={this.onChange}
      />
    );
  }
}

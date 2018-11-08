import React, { PureComponent } from 'react';
import moment from 'moment';
import { Icon } from 'antd';
import YearPanel from './YearPanel';
import DecadePanel from './DecadePanel';

import './index.less';


export default class YearPicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showYearPanel: false,
      mode: 'year',
      value: this.props.defaultValue || this.props.value || null,
    };
    this.defaultValue = moment();
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        value: nextProps.value,
      });
    }
  }
  // 选择十年面板点击回调并切换回年面板
  onDecadeSelect = (value) => {
    this.setState({
      mode: 'year',
      value,
    });
  };
  // 选择年回调
  onYearSelect = (value) => {
    this.setState({ showYearPanel: false, value });
    this.props.onChange(value);
  };
  // 切换选择十年面板
  showDecadePanel = () => {
    this.setState({
      mode: 'decade',
    });
  };
  // 清空选择时间
  clearSelection = () => {
    this.setState({ showYearPanel: false, value: null });
    this.props.onChange(null);
  };
  // 打开面板
  open = () => {
    this.setState({ showYearPanel: true });
  };
  // 关闭面板
  close = (ev) => {
    const target = ev.currentTarget;
    const relatedTarget = ev.relatedTarget;
    // 确保同组件input获取焦点不会互斥
    if (target.localName === 'input' && (relatedTarget === null || (relatedTarget.localName === 'input' && relatedTarget.className === 'ant-calendar-picker-input ant-input'))) {
      this.setState({ showYearPanel: false, mode: 'year' });
    }
    if (target.localName === 'div' && relatedTarget === null) {
      this.setState({ showYearPanel: false, mode: 'year' });
    }
  };
  render() {
    const { disabled = false, allowClear = true } = this.props;
    let panel = null;
    const locale = this.props.locale;
    const prefixCls = 'ant-calendar';
    const value = this.state.value ? this.state.value.year() : '';
    const showYearPanel = this.state.showYearPanel ? 'block' : 'none';
    if (this.state.mode === 'year') {
      panel = (
        <YearPanel
          locale={locale}
          defaultValue={this.defaultValue}
          rootPrefixCls={prefixCls}
          onSelect={this.onYearSelect}
          onDecadePanelShow={this.showDecadePanel}
          allowClear={false}
        />
      );
    }
    if (this.state.mode === 'decade') {
      panel = (
        <DecadePanel
          locale={locale}
          defaultValue={this.defaultValue}
          rootPrefixCls={prefixCls}
          onSelect={this.onDecadeSelect}
          allowClear={false}
        />
      );
    }
    const clearIcon = (!disabled && allowClear && this.state.value && !this.state.showYearPanel) ? (
      <Icon
        type="cross-circle"
        className={`${prefixCls}-picker-clear`}
        onClick={this.clearSelection}
      />
    ) : null;
    return (
      <span className={`${prefixCls}-picker`}>
        <div>
          <input readOnly="" value={value} placeholder="请选择日期" className={`${prefixCls}-picker-input ant-input`} onFocus={this.open} onBlur={this.close} onChange={() => {}} />
          {clearIcon}
          <span className={`${prefixCls}-picker-icon`} />
        </div>
        <div className={`${prefixCls}-picker-container ${prefixCls}-picker-container-placement-bottomLeft`} style={{ left: '-2px', top: '-2px', display: showYearPanel }} >
          <div
            className={`${prefixCls} ${prefixCls}-month ${prefixCls}-month-calendar`}
            ref={(n) => { this.panel = n; }}
            tabIndex="0"
            onBlur={this.close}
          >
            <div className={`${prefixCls}-month-calendar-content`}>
              <div className={`${prefixCls}-month-header-wrap`}>
                <div className={`${prefixCls}-header`}>
                  {panel}
                </div>
              </div>
            </div>
          </div>
        </div>
      </span>
    );
  }
}

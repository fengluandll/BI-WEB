import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import YearPicker from './YearPicker/YearPicker';
import locale from './zh_CN';
import objectUtils from '../../../utils/objectUtils';

import styles from '../Search/index.less';

const { MonthPicker, WeekPicker } = DatePicker;
/**
 * 仪表板-查询控件-时间类型筛选
 */
export default class Index extends PureComponent {
  constructor(props) {
    super(props);
    const { val, rule } = props;
    const arr = this.calcDate(val, rule);
    this.state = {
      startTime: arr[0],
      endTime: arr[1],
    };
  }
  componentWillReceiveProps(nextProps) {
    const { val, rule } = nextProps;
    const arr = this.calcDate(val, rule);
    this.setState({
      startTime: arr[0],
      endTime: arr[1],
    });
  }
  calcDate = (val, rule) => {
    const { timeType, relativeItems, dateType } = rule;
    let startTime = null;
    let endTime = null;
    if (timeType === '0') {
      let type = '';
      switch (dateType) {
        case '0':
          type = 'days';
          break;
        case '1':
          type = 'weeks';
          break;
        case '2':
          type = 'months';
          break;
        case '4':
          type = 'months';
          break;
        default:
          type = 'years';
      }
      startTime = objectUtils.isNumber(relativeItems[0])
        ? moment().subtract(relativeItems[0], type)
        : (val[0] ? moment(val[0]) : null);
      endTime = objectUtils.isNumber(relativeItems[1])
        ? moment().subtract(relativeItems[1], type)
        : (val[1] ? moment(val[1]) : null);
    } else {
      startTime = val[0] ? moment(val[0]) : null;
      endTime = val[1] ? moment(val[0]) : null;
    }
    return [startTime, endTime];
  };
  changeDate = (index, date) => {
    const { val, rule } = this.props;
    val[index] = date ? date.toDate() : null;
    rule.relativeItems[index] = null;
    if (index === 0) {
      this.setState({
        startTime: date,
      });
    } else {
      this.setState({
        endTime: date,
      });
    }
    this.props.onChange(val);
  };
  render() {
    const { rule } = this.props;
    const opts = {
      showToday: false,
      locale,
      placeholder: '请选择日期',
    };
    switch (rule.dateType) {
      case '0':
        return (<div className={styles['query-field']}>
          <DatePicker
            {...opts}
            showToday={false}
            value={this.state.startTime}
            onChange={this.changeDate.bind(this, 0)}
            allowClear={false}
          />
          {rule.rangeType === '0' && <span className={styles['time-join']}>-</span>}
          {rule.rangeType === '0' && <DatePicker {...opts} showToday={false} value={this.state.endTime} onChange={this.changeDate.bind(this, 1)} allowClear={false} />}
        </div>);
      case '1':
        return (<div className={styles['query-field']}>
          <WeekPicker
            {...opts}
            value={this.state.startTime}
            onChange={this.changeDate.bind(this, 0)}
            allowClear={false}
          />
          {rule.rangeType === '0' && <span className={styles['time-join']}>-</span>}
          {rule.rangeType === '0' && <WeekPicker {...opts} value={this.state.endTime} onChange={this.changeDate.bind(this, 1)} allowClear={false} />}
        </div>);
      case '2':
        return (<div className={styles['query-field']}>
          <MonthPicker
            {...opts}
            value={this.state.startTime}
            onChange={this.changeDate.bind(this, 0)}
            allowClear={false}
          />
          {rule.rangeType === '0' && <span className={styles['time-join']}>-</span>}
          {rule.rangeType === '0' && <MonthPicker {...opts} value={this.state.endTime} onChange={this.changeDate.bind(this, 1)} allowClear={false} />}
        </div>);
      case '4':
        return (<div className={styles['query-field']}>
          <MonthPicker
            {...opts}
            value={this.state.startTime}
            onChange={this.changeDate.bind(this, 0)}
            allowClear={false}
            monthCellContentRender={(current) => {
              const data = current._d.toString();
              let content = "一季度";
              if (data.indexOf("Jan") != -1) {
                content = "一季度";
                return (
                  <div className="ant-calendar-date" >
                    {content}
                  </div>
                );
              } else if (data.indexOf("Apr") != -1) {
                content = "二季度";
                return (
                  <div className="ant-calendar-date" >
                    {content}
                  </div>
                );
              } else if (data.indexOf("Jul") != -1) {
                content = "三季度";
                return (
                  <div className="ant-calendar-date" >
                    {content}
                  </div>
                );
              } else if (data.indexOf("Oct") != -1) {
                content = "四季度";
                return (
                  <div className="ant-calendar-date" >
                    {content}
                  </div>
                );
              }
            }}
          />
          {rule.rangeType === '0' && <span className={styles['time-join']}>-</span>}
          {rule.rangeType === '0' && <MonthPicker {...opts} value={this.state.endTime} onChange={this.changeDate.bind(this, 1)} allowClear={false}
            monthCellContentRender={(current) => {
              const data = current._d.toString();
              let content = "一季度";
              if (data.indexOf("Jan") != -1) {
                content = "一季度";
                return (
                  <div className="ant-calendar-date" >
                    {content}
                  </div>
                );
              } else if (data.indexOf("Apr") != -1) {
                content = "二季度";
                return (
                  <div className="ant-calendar-date" >
                    {content}
                  </div>
                );
              } else if (data.indexOf("Jul") != -1) {
                content = "三季度";
                return (
                  <div className="ant-calendar-date" >
                    {content}
                  </div>
                );
              } else if (data.indexOf("Oct") != -1) {
                content = "四季度";
                return (
                  <div className="ant-calendar-date" >
                    {content}
                  </div>
                );
              }
            }}
          />}
        </div>);
      default:
        return (<div className={styles['query-field']}>
          <YearPicker
            {...opts}
            value={this.state.startTime}
            onChange={this.changeDate.bind(this, 0)}
            allowClear={false}
          />
          {rule.rangeType === '0' && <span className={styles['time-join']}>-</span>}
          {rule.rangeType === '0' && <YearPicker {...opts} value={this.state.endTime} onChange={this.changeDate.bind(this, 1)} allowClear={false} />}
        </div>);
    }
  }
}

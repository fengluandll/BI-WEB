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
    const { rela, relaJson } = this.props;
    const arr = this.calcDate(rela.props, relaJson);
    // 参数先放到state里
    this.state = {
      startTime: arr[0],
      endTime: arr[1],
    };
  }
  componentWillReceiveProps(nextProps) {
    const { rela } = nextProps;
    const {relaJson} = this.props;
    const arr = this.calcDate(rela.props, relaJson);
    // 参数先放到state里
    this.state = {
      startTime: arr[0],
      endTime: arr[1],
    };
  }
  calcDate = (val, relaJson) => {
    const { from_type, time_from,time_to, date_type,time_type } = relaJson;
    let startTime = null;
    let endTime = null;
    if (time_type === '0') {
      let type = '';
      switch (date_type) {
      case '0':
        type = 'days';
        break;
      case '1':
        type = 'weeks';
        break;
      case '2':
        type = 'months';
        break;
      default:
        type = 'years';
      }
      startTime = objectUtils.isNumber(time_from)
        ? moment().subtract(time_from, type)
        : (val[0] ? moment(val[0]) : null);
      endTime = objectUtils.isNumber(time_to)
        ? moment().subtract(time_to, type)
        : (val[1] ? moment(val[1]) : null);
    } else {
      startTime = val[0] ? moment(val[0]) : null;
      endTime = val[1] ? moment(val[0]) : null;
    }
    return [startTime, endTime];
  };

  changeDate = (index, date) => {
    const { rela, relaJson } = this.props;
    //  时间的参数为 数组
    rela.props[index] = date ? date : null;
    if (index === 0) {
      this.setState({
        startTime: date,
      });
    } else {
      this.setState({
        endTime: date,
      });
    }
    this.props.onChange(rela.props);
  };
  render() {
    const { relaJson } = this.props;
    const opts = {
      showToday: false,
      locale,
      placeholder: '请选择日期',
    };
    switch (relaJson.date_type) {
      case '0':
        return (<div className={styles['query-field']}>
          <DatePicker
            {...opts}
            showToday={false}
            value={this.state.startTime}
            onChange={this.changeDate.bind(this, 0)}
          />
          {relaJson.from_type === '0' && <span className={styles['time-join']}>-</span>}
          {relaJson.from_type === '0' && <DatePicker {...opts} showToday={false} value={this.state.endTime} onChange={this.changeDate.bind(this, 1)} />}
        </div>);
      case '1':
        return (<div className={styles['query-field']}>
          <WeekPicker
            {...opts}
            value={this.state.startTime}
            onChange={this.changeDate.bind(this, 0)}
          />
          {relaJson.from_type === '0' && <span className={styles['time-join']}>-</span>}
          {relaJson.from_type === '0' && <WeekPicker {...opts} value={this.state.endTime} onChange={this.changeDate.bind(this, 1)} />}
        </div>);
      case '2':
        return (<div className={styles['query-field']}>
          <MonthPicker
            {...opts}
            value={this.state.startTime}
            onChange={this.changeDate.bind(this, 0)}
          />
          {relaJson.from_type === '0' && <span className={styles['time-join']}>-</span>}
          {relaJson.from_type === '0' && <MonthPicker {...opts} value={this.state.endTime} onChange={this.changeDate.bind(this, 1)} />}
        </div>);
      default:
        return (<div className={styles['query-field']}>
          <YearPicker
            {...opts}
            value={this.state.startTime}
            onChange={this.changeDate.bind(this, 0)}
          />
          {relaJson.from_type === '0' && <span className={styles['time-join']}>-</span>}
          {relaJson.from_type === '0' && <YearPicker {...opts} value={this.state.endTime} onChange={this.changeDate.bind(this, 1)} />}
        </div>);
    }
  }
}

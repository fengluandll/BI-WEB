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
/***
 * 查询逻辑:初始化的时候取当前时间的偏移量，接受参数的时候取参数值
 * ***/
export default class Index extends PureComponent {
  constructor(props) {
    super(props);
    const { rela, relaJson, onChange } = this.props;
    let arr = "";
    let startTimeDemo = "";
    let endTimeDemo = "";
    let quarter_flag = "quarter";
    if (relaJson.date_type == 4) { // 季度的情况
      arr = this.calcDate(rela.props, relaJson, quarter_flag);
      startTimeDemo = this.startTiemAndEndTime(moment(arr[0]).format());
      endTimeDemo = this.startTiemAndEndTime(moment(arr[1]).format());
    } else {
      quarter_flag = "";
      arr = this.calcDate(rela.props, relaJson, quarter_flag);
      startTimeDemo = arr[0];
      endTimeDemo = arr[1];
    }
    // 参数先放到state里
    this.state = {
      startTime: startTimeDemo,
      endTime: endTimeDemo,
    };
    // 将计算好的时候同步到父组件中
    onChange([moment(arr[0]).format(), moment(arr[1]).format()]);
  }

  /***
   * 返回季度方法,这个返回的值是直接给控件用的,传递给查询参数的不能用这个。
   * 
   * ***/
  startTiemAndEndTime(date) {
    let time = null;
    if (date) {
      if ([3, 4, 5].includes(moment(date).month())) {
        time = moment(date).year() + '-2';
      } else if ([6, 7, 8].includes(moment(date).month())) {
        time = moment(date).year() + '-3';
      } else if ([9, 10, 11].includes(moment(date).month())) {
        time = moment(date).year() + '-4';
      } else if ([0, 1, 2].includes(moment(date).month())) {
        time = moment(date).year() + '-1';
      }
    }
    // 组件中只能使用日期对象，因time返回为字符串形式例: '2018-1', 使用moment转为日期对象格式
    return moment(time);
  }

  // 运行时调用这个方式 所以设置下开始与结束时间 20190102 addby wangliu 切换tab的时候传新参数进来
  componentWillReceiveProps(nextProps) {
    const { rela, relaJson, onChange } = nextProps;
    let arr = this.calcDateProps(rela.props, relaJson);
    const startTimeDemo = relaJson.date_type == 4 ? this.startTiemAndEndTime(moment(arr[0]).format()) : arr[0];
    const endTimeDemo = relaJson.date_type == 4 ? this.startTiemAndEndTime(moment(arr[1]).format()) : arr[1];
    // 参数先放到state里
    this.state = {
      startTime: startTimeDemo,
      endTime: endTimeDemo,
    };
    // 将计算好的时候同步到父组件中  add by wangliu 去掉这行因为季度修改后不刷新
    // onChange([startTimeDemo, endTimeDemo]);
  }
  /***
   * 初始化的时候计算时间
   * ***/
  calcDate = (val, relaJson, quarter_flag) => {
    const { from_type, time_from, time_to, date_type, time_type } = relaJson;
    let startTime = null;
    let endTime = null;
    if (time_type === '0') {//相对时间，有偏移量
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
        case '4':
          type = 'months';
          break;
        default:
          type = 'years';
      }
      // 相对时间永远只选当前时间进行偏移,moment(val[0])=>moment()
      // 如果有偏移值就用偏移值,没有就用当前时间
      // add by wangliu 逻辑有时间搜索框必须时间有值，为空就去当前时间
      startTime = objectUtils.isNumber(time_from)
        ? moment().subtract(time_from, type)
        : moment();
      endTime = objectUtils.isNumber(time_to)
        ? moment().subtract(time_to, type)
        : moment();
      if (quarter_flag == "quarter") {
        let time_start = moment(); // 当前时间开始
        let time_end = moment(); // 当前时间结束
        if (objectUtils.isNumber(time_from)) {
          time_start = moment().subtract(time_from * 3, type); // 时间偏移,季度要乘3
        }
        if (objectUtils.isNumber(time_to)) {
          time_end = moment().subtract(time_to * 3, type);
        }
        let currentQuarter_start = time_start.quarter(); // 当前是第几季度
        let currentYear_start = time_start.year(); // 当前年
        let currentQuarter_end = time_end.quarter(); // 当前是第几季度
        let currentYear_end = time_end.year(); // 当前年
        startTime = moment(moment(currentYear_start + '-01-01').toDate()).quarter(currentQuarter_start); // 本季度第一天
        endTime = moment(moment(currentYear_end + '-01-01').toDate()).quarter(currentQuarter_end); // 本季度第一天
      }
    } else {// 绝对时间
      startTime = val[0] ? moment(val[0]) : moment();
      endTime = val[1] ? moment(val[1]) : moment();
    }
    return [startTime, endTime];
  };

  /***
   * 组件传参进来的时候,计算时间
   * 
   * ***/
  calcDateProps = (val, relaJson) => {
    let startTime = null;
    let endTime = null;
    startTime = val[0] ? moment(val[0]) : moment();
    endTime = val[1] ? moment(val[1]) : moment();
    return [startTime, endTime];
  }

  /***
   * 点击切换时间
   * 
   * ***/
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
  /***
   * 点击切换时间(季度)
   * 
   * ***/
  onChangeQuarter = (index, date, dateString) => {
    const { rela, relaJson } = this.props;
    //  时间的参数为 数组
    rela.props[index] = date ? date : null;
    if (index === 0) {
      this.setState({
        startTime: relaJson.date_type == 4 ? this.startTiemAndEndTime(dateString) : date,
      });
    } else {
      this.setState({
        endTime: relaJson.date_type == 4 ? this.startTiemAndEndTime(dateString) : date,
      });
    }
    this.props.onChange(rela.props);
  }
  render() {
    const monthFormat = 'YYYY-M';
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
      case '4':
        return (<div className={styles['query-field']}>
          <MonthPicker
            {...opts}
            value={this.state.startTime}
            format={monthFormat}
            dropdownClassName="jidu"
            // onChange时间季度
            onChange={this.onChangeQuarter.bind(this, 0)}
            // 季度
            monthCellContentRender={(current) => {
              const data = current._d.toString();
              let content = "一季度";
              const style = {};
              style.width = '278px';
              if (data.indexOf("Jan") != -1) {
                content = "一季度";
                return (
                  <div style={style}>
                    {content}
                  </div>
                );
              } else if (data.indexOf("Apr") != -1) {
                content = "二季度";
                const style = {};
                style.width = '278px';
                return (
                  <div style={style}>
                    {content}
                  </div>
                );
              } else if (data.indexOf("Jul") != -1) {
                content = "三季度";
                const style = {};
                style.width = '278px';
                return (
                  <div style={style}>
                    {content}
                  </div>
                );
              } else if (data.indexOf("Oct") != -1) {
                content = "四季度";
                const style = {};
                style.width = '278px';
                return (
                  <div style={style}>
                    {content}
                  </div>
                );
              }
            }}

          />
          {relaJson.from_type === '0' && <span className={styles['time-join']}>-</span>}
          {relaJson.from_type === '0' &&
            <MonthPicker {...opts} value={this.state.endTime}
              format={monthFormat}
              dropdownClassName="jidu"
              onChange={this.onChangeQuarter.bind(this, 1)}
              monthCellContentRender={(current) => {
                const data = current._d.toString();
                let content = "一季度";
                if (data.indexOf("Jan") != -1) {
                  content = "一季度";
                  const style = {};
                  style.width = '278px';
                  return (
                    <div style={style}>
                      {content}
                    </div>
                  );
                } else if (data.indexOf("Apr") != -1) {
                  content = "二季度";
                  const style = {};
                  style.width = '278px';
                  return (
                    <div style={style}>
                      {content}
                    </div>
                  );
                } else if (data.indexOf("Jul") != -1) {
                  content = "三季度";
                  const style = {};
                  style.width = '278px';
                  return (
                    <div style={style}>
                      {content}
                    </div>
                  );
                } else if (data.indexOf("Oct") != -1) {
                  content = "四季度";
                  const style = {};
                  style.width = '278px';
                  return (
                    <div style={style}>
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
          />
          {relaJson.from_type === '0' && <span className={styles['time-join']}>-</span>}
          {relaJson.from_type === '0' && <YearPicker {...opts} value={this.state.endTime} onChange={this.changeDate.bind(this, 1)} />}
        </div>);
    }
  }
}

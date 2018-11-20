import React, { PureComponent } from 'react';
import { Radio } from 'antd';
import moment from 'moment';
import NumberInput from '../../NumberInput';
import Constant from '../../../common/constant';
import objectUtils from '../../../utils/objectUtils';

import styles from './index.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const constant = new Constant();

/**
 * 仪表板-数据筛选面板
 */
export default class Index extends PureComponent {
  constructor(props) {
    super(props);
    const fieldRelation = this.getFiledRelation();
    const { label } = fieldRelation;
    this.state = {
      label,
    };
  }
  // 获取查询项关联
  getFiledRelation = () => {
    const { comp, child } = this.props;
    return comp.relation[child.id];
  };
  // 修改标签名
  changeLabel = (ev) => {
    const val = ev.currentTarget.value;
    const fieldRelation = this.getFiledRelation();
    fieldRelation.label = val;
    this.setState({
      label: val,
    });
    this.props.onChange();
  };
  // 修改数值比较类型
  changeNumberScreenType = (ev) => {
    const val = ev.currentTarget.value;
    const { props } = this.getFiledRelation();
    props.rule = constant.findNumRule(val);
    this.props.onChange();
  };
  // 修改字符筛选类型
  changeCharacterScreenType = (ev) => {
    const val = ev.target.value;
    const { props } = this.getFiledRelation();
    props.rule = constant.findCharacterRule(val);
    this.props.onChange();
  };
  // 修改日期筛选类型
  changeDateScreenType = (name, ev) => {
    const val = ev.target.value;
    const { props } = this.getFiledRelation();
    props.rule[name] = val;
    this.calcDate();
    this.props.onChange();
  };
  // 修改日期相对时间计算因子
  changeRelativeItems = (index, val) => {
    const { props } = this.getFiledRelation();
    props.rule.relativeItems[index] = val;
    this.calcDate();
    this.props.onChange();
  };
  // 修改日期相对时间计算因子 新的季度的 addby wangliu  20171114
  changeRelativeItemsQuarter = (index, val) => {
    const { props } = this.getFiledRelation();
    props.rule.relativeItemsQuarter[0] = val;
    this.calcDate();
    this.props.onChange();
  };

  // 计算日期
  calcDate = () => {
    const { props } = this.getFiledRelation();
    const { rule } = props;
    const { relativeItems, dateType, timeType, rangeType } = rule;
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
      props.val[0] = objectUtils.isNumber(relativeItems[0])
        ? moment().subtract(relativeItems[0], type).toDate()
        : null;
      props.val[1] = objectUtils.isNumber(relativeItems[1]) && rangeType === '0'
        ? moment().subtract(relativeItems[1], type).toDate()
        : null;
    }
  };
  renderNumberScreen = () => {
    const relation = this.getFiledRelation();
    return (
      <div className={styles['select']}>
        <select onChange={this.changeNumberScreenType} value={relation.props.rule.value}>
          {constant.getNumRule().map((item) => {
            return (<option value={item.value} key={item.value}>{item.label}</option>);
          })}
        </select>
      </div>
    );
  };
  renderDateScreen = () => {
    const relation = this.getFiledRelation();
    const { rule } = relation.props;
    return (
      <div>
        <div className={styles['screen-panel-row']}>
          <RadioGroup defaultValue={rule.dateType} onChange={this.changeDateScreenType.bind(this, 'dateType')}>
            <RadioButton value="0">日</RadioButton>
            <RadioButton value="1">周</RadioButton>
            <RadioButton value="2">月</RadioButton>
            <RadioButton value="4">季</RadioButton>
            <RadioButton value="3">年</RadioButton>
          </RadioGroup>
        </div>
        <div className={styles['screen-panel-row']}>
          <RadioGroup defaultValue={rule.rangeType} onChange={this.changeDateScreenType.bind(this, 'rangeType')}>
            <RadioButton value="0">日期区间</RadioButton>
            <RadioButton value="1">日期</RadioButton>
          </RadioGroup>
        </div>
        <div className={styles['screen-panel-row']}>
          <RadioGroup defaultValue={rule.timeType} onChange={this.changeDateScreenType.bind(this, 'timeType')}>
            <RadioButton value="0">相对时间</RadioButton>
            <RadioButton value="1">绝对时间</RadioButton>
          </RadioGroup>
        </div>
        {rule.timeType === '0' ? (
          <div className={styles['screen-panel-row']}>
            <span>设置数据日期的默认显示范围</span>
            {rule.rangeType === '0' ? (
              <div className={styles['time-tip']}>
                <span> T -</span>
                <NumberInput
                  defaultValue={rule.relativeItems[0]}
                  onlyNatural
                  onChange={this.changeRelativeItems.bind(this, 0)}
                />
                <span className="time-tip-split">~</span>
                <span> T -</span>
                <NumberInput
                  defaultValue={rule.relativeItems[1]}
                  onlyNatural
                  onChange={this.changeRelativeItems.bind(this, 1)}
                />
              </div>
            ) : (
                <div className={styles['time-tip']}>
                  <span> T -</span>
                  <NumberInput
                    defaultValue={rule.relativeItems[0]}
                    onlyNatural
                    onChange={this.changeRelativeItems.bind(this, 0)}
                  />
                </div>
              )}
            <p>T代表今年，示例:T-0代表今年,T-1代表上一年</p>
          </div>
        ) : (
            <div className={styles['screen-panel-row']}>
              <p>绝对时间请直接选择默认时间并保存</p>
            </div>
          )
        }
        <div className={styles['screen-panel-row']}>
          <span>设置季度偏移量一旦设了，其他月的设置不起作用</span>
          <div className={styles['time-tip']}>
            <span> T -</span>
            <NumberInput
              defaultValue={rule.relativeItemsQuarter != null ? rule.relativeItemsQuarter[0] : null}
              onlyNatural
              onChange={this.changeRelativeItemsQuarter.bind(this, 0)}
            />
          </div>
        </div>
      </div>
    );
  };
  renderCharacterScreen = () => {
    const relation = this.getFiledRelation();
    return (
      <RadioGroup
        defaultValue={relation.props.rule.value}
        onChange={this.changeCharacterScreenType}
      >
        {constant.getCharacterRule().map((item) => {
          return (<RadioButton value={item.value} key={item.value}>{item.label}</RadioButton>);
        })}
      </RadioGroup>
    );
  };
  render() {
    const { comp, child } = this.props;
    let row = null;
    switch (child.rscType) {
      case 1:
        row = this.renderNumberScreen();
        break;
      case 2:
        row = this.renderCharacterScreen();
        break;
      default:
        row = this.renderDateScreen();
    }
    return (
      <div className={styles['screen-panel']} id={`screen-${comp.name}`}>
        <div className={styles['screen-panel-head']}>
          <label htmlFor={`label${child.id}`}>
            标签名
            <input name="labelName" type="text" id={`label${child.id}`} onChange={this.changeLabel} value={this.state.label} />
          </label>
        </div>
        <div className={styles['screen-panel-row']}>
          {row}
        </div>
      </div>
    );
  }
}

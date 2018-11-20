import objectUtils from '../utils/objectUtils';

// 数值比较运算规则
const numRule = [{
  label: '大于',
  value: '>',
}, {
  label: '大于等于',
  value: '>=',
}, {
  label: '小于',
  value: '<',
}, {
  label: '小于等于',
  value: '<=',
}, {
  label: '不等于',
  value: '!=',
}, {
  label: '等于',
  value: '=',
}];
const characterRule = [{
  label: '精确匹配',
  value: '0',
}, {
  label: '单选',
  value: '1',
}, {
  label: '复选',
  value: '2',
}];
const dateRule = {
  rangeType: '0', // 0-日期区间，1-日期
  dateType: '0', // 0-日 1-周 2-月 3-年
  timeType: '0',  // 0-相对 1-绝对
  relativeItems: ['', ''],  // 相对时间对应计算因子
  relativeItemsQuarter:[''],  // 给季度用的  addbywangliu  20181114
};
export default class Constant {
  getNumRule = () => {
    return objectUtils.deepClone(numRule);
  };
  getCharacterRule = () => {
    return objectUtils.deepClone(characterRule);
  };
  getDateRule = () => {
    return objectUtils.deepClone(dateRule);
  };
  findNumRule = (val) => {
    return objectUtils.deepClone(numRule.find((item) => {
      return item.value === val;
    }));
  };
  findCharacterRule = (val) => {
    return objectUtils.deepClone(characterRule.find((item) => {
      return item.value === val;
    }));
  };
}

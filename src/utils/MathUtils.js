
// todo 这里需要一个插件实现类似java中decimalFormat的效果
export default {
  /**
   * 四舍五入保留两位小数
   * 在小数位数不足两位时不作强制补0的操作
   * @param x
   */
  toDecimal: (x) => {
    if (isNaN(x)) {
      return;
    }
    return Math.round(x * 100) / 100;
  },
};

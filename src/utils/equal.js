/* eslint eqeqeq: 0 */

// 对象引用比较
function equal(old, target) {
  let r = true;
  for (const prop in old) {
    if (typeof old[prop] === 'function' && typeof target[prop] === 'function') {
      if (old[prop].toString() != target[prop].toString()) {
        r = false;
      }
    } else if (old[prop] != target[prop]) {
      r = false;
    }
  }
  return r;
}
// 对象深度比较
function compare(origin, target) {
  if (typeof target === 'object') {
    if (typeof origin !== 'object') return false;
    if (!target) return true;
    // 判断是否是数组
    if (target instanceof Array) {
      if (!(origin instanceof Array)) return false;
      if (target.length !== origin.length) return false;
      for (let i = 0; i < target.length; i += 1) {
        if (!compare(origin[i], target[i])) return false;
      }
    } else {
      for (const key of Object.keys(target)) {
        if (!compare(origin[key], target[key])) return false;
      }
    }
    return true;
  } else return origin === target;
}
export default { equal, compare };


/***
 * 
 * 常用的js对象方法
 * 
 * ***/
class JsUtils {

    /***
     * 
     * 用逗号隔开的字符串转成数组
     * 
     * ***/
    getStrToArr = (str) => {
        let arr = str.split(',');
        if (null == arr || arr.length == 0) {
            return [];
        }
        for (let key in arr) {
            const item = arr[key];
            if (null == item || item == "") { // 有空就删除,防止str开头或结尾有逗号
                arr.splice(key, 1);
            }
        }
        return arr;
    }

}
export default JsUtils;
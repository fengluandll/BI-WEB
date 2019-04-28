


class BrowSerUtils {

    /***
     * 
     * 获取浏览器信息
     * 
     * 
     * ***/
    getBrowserInfo = () => {
        let height = 0;
        let width = 0;
        if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
            height = document.documentElement.clientHeight;
            width = document.documentElement.clientWidth;
        }
        const json = { height, width };
        return json;
    }

}
export default BrowSerUtils;
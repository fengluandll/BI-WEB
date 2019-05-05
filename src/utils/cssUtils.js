class CssUtils {

    /***
     * 
     * 获取bi-container
     * 
     * 参数: mChart,bigScreen:大屏状态
     * 
     * ***/
    getBIContainer = (mChart, bigScreen) => {
        const config = JSON.parse(mChart.config);
        const border = config.border;
        if (bigScreen) { // 大屏
            return 'bi-container-bigScreen';
        } else {
            if (border == null) {
                return 'bi-container';
            } else if (border == "0") {
                return 'bi-container-noBorder';
            } else if (border == "1") {
                return 'bi-container';
            }
        }
    }

    // 修改seacrch的高度,要么一行高度要么两行高度
    changeSearchDragact = (chart) => {
        let h = chart.h;
        if (h > 0 && h <= 2) {
            h = 2;
        } else if (h > 2 && h <= 4) {
            h = 4;
        } else if (h > 4 && h <= 6) {
            h = 6;
        }
        return h;
    }
}

export default CssUtils;
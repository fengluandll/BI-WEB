class CssUtils {

    // 获取bi-container
    getBIContainer = (mChart) => {
        const config = JSON.parse(mChart.config);
        const border = config.border;
        // 0就是不 1就是是
        if (border == null) {
            return 'bi-container';
        } else if (border == "0") {
            return 'bi-container-noBorder';
        } else if (border == "1") {
            return 'bi-container';
        }
    }
}

export default CssUtils;
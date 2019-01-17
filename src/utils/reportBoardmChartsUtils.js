
class ReportBoardmChartsUtils {
    /***
     * 将text控件中的数据保存到mDashboard中
     * ***/
    saveTextValueToDashboard = (value, item, mDashboard) => {
        const { name, chartId, } = item;
        const style_config = JSON.parse(mDashboard.style_config);
        const { children } = style_config;
        children.map((item_child, index) => {
            if (item_child.chartId == chartId) {
                item_child.value = value;
            }
        });
        style_config.children = children;
        mDashboard.style_config = JSON.stringify(style_config);
    }
}

export default ReportBoardmChartsUtils;
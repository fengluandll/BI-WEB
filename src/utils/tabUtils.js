import ReportBoardUtils from './reportBoardUtils';

const reportBoardUtils = new ReportBoardUtils();
class TabUtils {

    // tab点击切换当前tab
    changeActiveKey = (activeKey, tagName, tagNames, mDashboard_old) => {
        for (let key in tagName) {
            delete tagName[key];
        }
        tagName[activeKey] = tagNames[activeKey];//设置当前的tagName
        // 设置整体的默认tagName
        const style_config = JSON.parse(mDashboard_old.style_config);
        style_config.currentTag = activeKey;
        mDashboard_old.style_config = JSON.stringify(style_config);
    }

    // 增加一个tab
    addTab = (mCharts, mDashboard_old, mDashboard, tagName, tagNames) => {
        let mChart = reportBoardUtils.getMChartOfSearch(mCharts); //找到搜索框mChart
        // 新建一个mDashboard
        const style_config = {};//style_config
        style_config.name = "新建tab";
        style_config.type = "root";
        style_config.order = this.getMaxBorder(mDashboard_old) + 1; // 取最大的order
        const children = [];//children
        const searchObj = {};//搜索框
        searchObj.name = mChart.id.toString();
        searchObj.chartId = mChart.id.toString();
        searchObj.type = "search";
        searchObj.styleConfig = "";
        searchObj.relation = {};
        children.push(searchObj);
        style_config.children = children;
        const dragactStyle = [];// 布局样式
        const dragct = { "GridX": 0, "GridY": 0, "w": 39, "h": 2, "key": mChart.id.toString(), "type": "search" };
        dragactStyle.push(dragct);
        style_config.dragactStyle = dragactStyle;
        style_config.dataSet = JSON.parse(mDashboard_old.style_config).dataSet; //dataSet
        style_config.dataSetRelation = JSON.parse(mDashboard_old.style_config).dataSetRelation; //dataSetRelation
        // 修改mDashboard
        mDashboard.style_config = JSON.stringify(style_config);
        // 修改mDashboard_old
        const style_config_old = JSON.parse(mDashboard_old.style_config);
        const uuuid = reportBoardUtils.getUUUID();
        style_config_old.children[uuuid] = style_config;
        mDashboard_old.style_config = JSON.stringify(style_config_old);
        //修改tagNames
        tagNames[uuuid] = style_config.name;
        //修改tagName
        this.changeActiveKey(uuuid, tagName, tagNames, mDashboard_old);
    }

    // 删除一个tab
    removeTab = (targetKey, mDashboard_old, mDashboard, tagName, tagNames) => {
        // 如果只剩一个不能删除
        let count = [];
        for (let key in tagNames) {
            count.push(key);
        }
        if (count.length <= 1) {
            return;
        }
        // 删除 tagNames
        for (let key in tagNames) {
            if (key == targetKey) {
                delete tagNames[key];
            }
        }
        // 修改tagName
        const arr = [];
        for (let key in tagNames) {
            arr.push(key);
        }
        this.changeActiveKey(arr[0], tagName, tagNames, mDashboard_old);// 取第一个
        // 删除mDashboard_old
        const style_config_old = JSON.parse(mDashboard_old.style_config);
        const children = style_config_old.children;
        delete children[targetKey];
        mDashboard_old.style_config = JSON.stringify(style_config_old);
        // 修改mDashboard
        let uuuid = "";
        for (let key in tagName) {
            uuuid = key;
        }
        reportBoardUtils.getMDashboardByKey(mDashboard_old, mDashboard, uuuid);
    }

    // 修改当前tab的名称
    changeTabName = (mDashboard_old, mDashboard, tagName, tagNames, key, value) => {
        // 修改tagName
        for (let k in tagName) {
            delete tagName[k];
        }
        tagName[key] = value;
        // 修改tagNames
        tagNames[key] = value;
        // 修改mDashboard
        const style_config = JSON.parse(mDashboard.style_config);
        style_config.name = value;
        mDashboard.style_config = JSON.stringify(style_config);
        // 修改mDashboard_old
        const style_config_old = JSON.parse(mDashboard_old.style_config);
        const children = style_config_old.children;
        for (let k in children) {
            if (k == key) {
                const child = children[k];
                child.name = value;
            }
        }
        mDashboard_old.style_config = JSON.stringify(style_config_old);
    }
    /******************************utils**************************************/
    // 取图表中的最大orderid
    getMaxBorder = (mDashboard_old) => {
        const style_config = JSON.parse(mDashboard_old.style_config);
        const children = style_config.children;
        let orders = [];
        for (let key in children) {
            const id = children[key].order;
            orders.push(id);
        }
        // 取最大id
        let maxId = orders[0] || 0;
        for (let i = 0; i < orders.length; i++) {
            if (orders[i] > maxId) {
                maxId = orders[i];
            } else if (orders.length > maxId) {
                maxId = orders.length;
            }
        }
        return maxId;
    }
}

export default TabUtils;
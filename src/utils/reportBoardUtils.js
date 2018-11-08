class ReportBoardUtils {

    // 新增一个图表时，为搜索框的每个item自动关联上和图表的关联
    // 参数  mChart 新加的图表的mChart
    addSearchChartRelationAuto = (mDashboard, tableIdColumns, mChart) => {
        const { style_config } = mDashboard;
        const style_config_obj = JSON.parse(style_config);
        const md_children = style_config_obj.children;
        // 找到search
        let searchChart;   // 搜索图表
        md_children.map((item, index) => {
            if (item.type == "search") {
                searchChart = item;
            }
        });
        const relation = searchChart.relation;// search图表的关联json
        // 循环relation
        for (let key in relation) {
            //  "1794":{"relationFields":{"68":[11342]}}
            const relationFields = relation[key].relationFields;
            const mChartId = mChart.id;  //  example "68"
            // 寻找图表id后面的字段的id,要从数据集表中取
            const searchName = searchChart.name; // 搜索框的name
            const tableIdColumnsSearchList = tableIdColumns[searchName]; // 搜索框所在的数据集
            const tableIdColumnsChartList = tableIdColumns[mChartId];  // 新增的图表所有的数据集
            let rsColumnConfSearch;   //搜索框每个item所在的字段表
            let rsColumnConfChart;    // 新增图表的和Item相同rsc_name的字段
            tableIdColumnsSearchList.map((rsColumn, index) => {
                if (rsColumn.id == key) {
                    rsColumnConfSearch = rsColumn;
                }
            });
            // 判断新增图表的所有字段里有没有和搜索框item的rsc_name是一样的
            tableIdColumnsChartList.map((rsColumn, index) => {
                if (rsColumn.rsc_name == rsColumnConfSearch.rsc_name) {
                    rsColumnConfChart = rsColumn;
                }
            });
            // 拼接relationFields json
            const idColumnValue = [];
            idColumnValue.push(rsColumnConfChart.id);
            relationFields[mChartId.toString()] = idColumnValue;
        }

        // md_children转回string  然后刷新state
        style_config_obj.children = md_children;
        style_config_obj.dragactStyle = dragactStyle;
        mDashboard.style_config = JSON.stringify(style_config_obj);
    }
}

export default ReportBoardUtils;
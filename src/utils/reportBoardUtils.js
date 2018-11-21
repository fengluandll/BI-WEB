class ReportBoardUtils {

    // 新增一个图表时，为搜索框的每个item自动关联上和图表的关联
    // 参数  mChart 新加的图表的mChart
    addSearchChartRelationAuto = (mDashboard, tableIdColumns, mChart, mCharts) => {
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
            const config = mChart.config;
            const dataSetName = JSON.parse(config).dataSetName;
            // 寻找图表id后面的字段的id,要从数据集表中取
            const searchName = searchChart.name; // 搜索框的name,也就是chartId
            let search_chart; //搜索框的mChart
            // 根据 searchName 寻找搜索框的 m_chart 
            mCharts.map((obj) => {
                if (obj.id == searchName) {
                    search_chart = obj;
                }
            });
            const tableIdColumnsSearchList = tableIdColumns[JSON.parse(search_chart.config).dataSetName]; // 搜索框所在的数据集
            const tableIdColumnsChartList = tableIdColumns[dataSetName];  // 新增的图表所有的数据集
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
        mDashboard.style_config = JSON.stringify(style_config_obj);
    }

    // 新增一个搜索框item的时候，为搜索框的每个item自动关联上和图表的关联
    addSearchChartRelationAutoSearch = (relation, key, mDashboard, idColumns) => {
        // 拼接relationItem存入
        const relationItem = { label: "", relationFields: {}, props: [] }
        // 获取item的idColumn
        const itemIdColumn = idColumns[key];
        const children = JSON.parse(mDashboard.style_config).children;
        //  循环children
        children.map((item, index) => {
            // 如果是搜索框自己就return
            if (item.name == key) {
                return;
            }
            const relation = item.relation;
            for (let relaKey in relation) {
                const relaIdColumn = idColumns[relaKey];//每个children里的字段
                //判断每个children里的字段是否和item的字段名称相同
                if (itemIdColumn.rsc_name == relaIdColumn.rsc_name) {
                    // 拼接relationFields json
                    const idColumnValue = [];
                    idColumnValue.push(relaIdColumn.id);
                    relationItem.relationFields[relaKey.toString()] = idColumnValue;
                }
            }
        });
        relation[key] = relationItem;
    }



    /***************************通用方法***************************************/

    // 根据 chartId  children里name  获取  mChart
    getMChartByChartId = (mCharts, chartId) => {
        let mChart;
        mCharts.map((item, index) => {
            if (item.id.toString() == chartId) {
                mChart = item;
            }
        });
        return mChart;
    }

    // 根据 chartId 获取 dataSet (dataSetName在mChart中)
    getDataSetByChartId = (mCharts, tableIdColumns, chartId) => {
        let mChart;
        mCharts.map((item, index) => {
            if (item.id.toString() == chartId) {
                mChart = item;
            }
        });
        const dataSetName = JSON.parse(mChart.config).dataSetName;
        return tableIdColumns[dataSetName];
    }


}

export default ReportBoardUtils;
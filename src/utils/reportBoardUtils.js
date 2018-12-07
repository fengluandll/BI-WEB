class ReportBoardUtils {

    // 新增一个图表时，为搜索框的每个item自动关联上和图表的关联
    // 参数  mChart 新加的图表的mChart
    addSearchChartRelationAuto = (mDashboard, tableIdColumns, idColumns, mChart, mCharts) => {
        const { style_config } = mDashboard;
        const style_config_obj = JSON.parse(style_config);
        const md_children = style_config_obj.children;
        const dataSetRelation = style_config_obj.dataSetRelation;
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
            const tableIdColumnsChartList = tableIdColumns[dataSetName];  // 新增的图表所有的数据集
            let rsColumnConfSearch = idColumns[key];   //搜索框每个item所在的字段表
            // 判断新增图表的所有字段里有没有和搜索框item的rsc_name是一样的
            tableIdColumnsChartList.map((rsColumn, index) => {
                if (rsColumn.rsc_name == rsColumnConfSearch.rsc_name) {
                    // 拼接relationFields json
                    const idColumnValue = [];
                    idColumnValue.push(rsColumn.id);
                    relationFields[mChartId.toString()] = idColumnValue;
                } else {
                    //  根据 dataSetRelation 添加关联关系
                    if (this.getColumnYNrelationed(rsColumnConfSearch.id, rsColumn.id, dataSetRelation)) {
                        // 如果 两个字段有关联关系 拼接relationFields json
                        const idColumnValue = [];
                        idColumnValue.push(rsColumn.id);
                        relationFields[mChartId.toString()] = idColumnValue;
                    }
                }
            });
        }

        // md_children转回string  然后刷新state
        style_config_obj.children = md_children;
        mDashboard.style_config = JSON.stringify(style_config_obj);
    }

    // 新增一个搜索框item的时候，为搜索框的每个item自动关联上和图表的关联
    // param id:搜索框图表id,key:搜索框字段id
    addSearchChartRelationAutoSearch = (relation, id, key, mDashboard, tableIdColumns, idColumns, mCharts) => {
        // 拼接relationItem存入
        const relationItem = { label: "", relationFields: {}, props: [] }
        // 获取item的idColumn
        const itemIdColumn = idColumns[key];
        const children = JSON.parse(mDashboard.style_config).children;
        const dataSetRelation = JSON.parse(mDashboard.style_config).dataSetRelation;
        //  循环children
        children.map((item, index) => {
            // 如果是搜索框自己就return
            if (item.name == id) {
                return;
            }
            // 找到 mChart
            const mChart = this.getMChartByChartId(mCharts, item.chartId);
            const itemDataSet = tableIdColumns[JSON.parse(mChart.config).dataSetName]; //children里的数据集
            itemDataSet.map((rsColumn, index) => {
                if (rsColumn.rsc_name == itemIdColumn.rsc_name) {
                    // 拼接relationFields json
                    const idColumnValue = [];
                    idColumnValue.push(rsColumn.id);
                    relationItem.relationFields[mChart.id.toString()] = idColumnValue;
                } else {
                    //  根据 dataSetRelation 添加关联关系
                    if (this.getColumnYNrelationed(itemIdColumn.id, rsColumn.id, dataSetRelation)) {
                        // 如果 两个字段有关联关系 拼接relationFields json
                        const idColumnValue = [];
                        idColumnValue.push(rsColumn.id);
                        relationItem.relationFields[mChart.id.toString()] = idColumnValue;
                    }
                }
            });
        });
        relation[key] = relationItem;
    }

    // 手动增加搜索框和图表的关联
    addSearchChartRelation = (relationFields, id, searchItem, mDashboard, tableIdColumns, idColumns, mCharts) => {
        // 思路 根据searchItem找到rs_column_conf 再找到图表(id)的数据集 判断有没有名称相同或者有关联关系的字段 就赋值给item[]
        // "relationFields":{"70":[11343]}
        const item = [];
        const relation_key_column = idColumns[searchItem];// relation的key字段表
        const mChart = this.getMChartByChartId(mCharts, id);
        const tableDataSet = tableIdColumns[JSON.parse(mChart.config).dataSetName];//图表的数据集
        const dataSetRelation = JSON.parse(mDashboard.style_config).dataSetRelation;
        tableDataSet.map((rsColumn, index) => {
            if (rsColumn.rsc_name == relation_key_column.rsc_name) {
                // 如果有相同名称的字段就赋值item
                item.push(rsColumn.id);
            } else {
                // 根据 dataSetRelation 添加关联关系
                if (this.getColumnYNrelationed(relation_key_column.id, rsColumn.id, dataSetRelation)) {
                    item.push(rsColumn.id);
                }
            }
        });
        relationFields[id] = item;
    }


    /******************************数据操作**************************************/

    // 根据图表类型返回相应的假数据
    getFakeData = (type) => {
        let fakeData;
        if (type == "line") {
            fakeData =
                [{ x: '1991', y: 3 },
                { x: '1992', y: 4 },
                { x: '1993', y: 3.5 },
                { x: '1994', y: 5 },
                { x: '1995', y: 4.9 },
                { x: '1996', y: 6 },
                { x: '1997', y: 7 },
                { x: '1998', y: 9 },
                { x: '1999', y: 13 },];
        } else if (type == "bar") {
            fakeData =
                [{ x: '1951 年', y: 38 },
                { x: '1952 年', y: 52 },
                { x: '1956 年', y: 61 },
                { x: '1957 年', y: 145 },
                { x: '1958 年', y: 48 },
                { x: '1959 年', y: 38 },
                { x: '1960 年', y: 38 },
                { x: '1962 年', y: 38 }];
        } else if (type == "pie") {
            fakeData =
                [{ x: '事例一', y: 40 },
                { x: '事例二', y: 21 },
                { x: '事例三', y: 17 },
                { x: '事例四', y: 13 },
                { x: '事例五', y: 9 },];
        } else if (type == "table") {
            fakeData = {
                header: ['Tesla', 'Nissan', 'Toyota', 'Honda', 'Mazda', 'Ford'],
                body: [
                    [10, 11, 12, 13, 15, 16],
                    [10, 11, 12, 13, 15, 16],
                    [10, 11, 12, 13, 15, 16],
                    [10, 11, 12, 13, 15, 16],
                    [10, 11, 12, 13, 15, 16],
                ],
            };
        }
        return fakeData;
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
    //  找到搜索框的chart
    getMChartOfSearch = (mCharts) => {
        let mChart;
        mCharts.map((item, index) => {
            const config = JSON.parse(item.config);
            if (config.type == "11") {
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

    // 判断两个字段在数据集字段关联中是否有关联  "dataSetRelation":[[],[]],
    getColumnYNrelationed = (column1, column2, dataSetRelation) => {
        for (let i = 0; i < dataSetRelation.length; i++) {
            const arr = dataSetRelation[i];
            let flag1 = false;   // 第一个字段是否在关联子项的flag
            let flag2 = false;   // 第二个字段是否在关联子项的flag
            for (let j = 0; j < arr.length; j++) {
                if (arr[j] == column1) {
                    flag1 = true;
                } else if (arr[j] == column2) {
                    flag2 = true;
                }
            }
            //  如果一个循环里两个字段都有,那就返回true,说明两个字段是关联的
            if (flag1 && flag2) {
                return true;
            }
        }
        return false;
    }

    // m_dashboard取第一次进来时候,order最小值的
    getStyle_configByOrder = (mDashboard_old, tagName, tagNames) => {
        let style_config = JSON.parse(mDashboard_old.style_config);
        let children = style_config.children;//m_dashboard中的children
        const child = []; // children中的每个报表
        const keys = [];
        for (let key in children) {
            child.push(children[key]);
            keys.push(key);
        }
        // 设置当前 tagName
        tagName[keys[0]] = child[0].name;
        // 设置所有 tagName
        for (let i = 0; i < keys.length; i++) {
            tagNames[keys[i]] = child[i].name;
        }
        // 拼接 mDashboard
        let mDashboard = {};
        mDashboard.id = mDashboard_old.id;
        mDashboard.name = mDashboard_old.name;
        mDashboard.style_config = JSON.stringify(child[0]);
        mDashboard.template_id = mDashboard_old.template_id;
        mDashboard.group_id = mDashboard_old.group_id;
        mDashboard.privilege = mDashboard_old.privilege;
        return mDashboard;
    }

    // mDashboard_old加上当前的mDashboard
    getMDashboard_oldByMDashboard = (mDashboard_old, mDashboard, tagName) => {
        let style_config = mDashboard_old.style_config;
        const style_config_obj = JSON.parse(style_config);
        // mDashboard
        const style_config_m = mDashboard.style_config;
        const style_config_obj_m = JSON.parse(style_config_m);
        let name = "";// 子报表的uuuid
        for (let key in tagName) {
            name = key;
        }
        // 合并
        style_config_obj.children[name] = style_config_obj_m;
        mDashboard_old.style_config = JSON.stringify(style_config_obj);
    }

    // 从mDashboard_old根据key获取mDashboard
    getMDashboardByKey = (mDashboard_old, mDashboard, activeKey) => {
        const style_config = mDashboard_old.style_config;
        const style_config_obj = JSON.parse(style_config);
        const children = style_config_obj.children;
        const value = children[activeKey];// 取好的值
        const style_config_m = mDashboard.style_config;
        let style_config_obj_m = JSON.parse(style_config_m);
        style_config_obj_m = value;
        // 合并到mDashboard
        mDashboard.style_config = JSON.stringify(style_config_obj_m);
    }

    /***************************通用方法***************************************/

    // 获取uuuid
    getUUUID = () => {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }

}

export default ReportBoardUtils;
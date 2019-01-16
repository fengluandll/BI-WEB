import moment from 'moment';

class ReportBoardUtils {

    // 添加新的图表chart
    addNewChart = (mChart, mDashboard) => {
        // 获取接受的数据
        const chartId = mChart.id;
        const config = JSON.parse(mChart.config);
        const { type } = config;
        let tmpType;

        // 制造json数据 
        // relation:{ id:{ label:,relationFields:[],props:[], }},
        const relation = {};
        let dragactW;  // dragact宽度
        let dragactH;  // dragact高度
        if (type == "0") {
            // 折线图
            tmpType = "line";
            const dimension = config.dimension;
            const measure = config.measure;
            const color = config.color;
            const item = {};
            item.relationFields = {};
            relation[dimension] = item;
            relation[measure] = item;
            relation[color] = item;
            dragactW = 20;
            dragactH = 10;
        } else if (type == "1") {
            // 柱状图
            tmpType = "bar";
            const dimension = config.dimension;
            const measure = config.measure;
            const color = config.color;
            const item = {};
            item.relationFields = {};
            relation[dimension] = item;
            relation[measure] = item;
            relation[color] = item;
            dragactW = 20;
            dragactH = 10;
        } else if (type == "2") {
            // 饼图
            tmpType = "pie";
            const dimension = config.dimension;
            const measure = config.measure;
            const item = {};
            item.relationFields = {};
            relation[dimension] = item;
            relation[measure] = item;
            dragactW = 20;
            dragactH = 10;
        } else if (type == "3") {
            //  交叉表
            tmpType = "table";
            const column = config.column;
            relation.column = column;
            dragactW = 20;
            dragactH = 10;
        } else if (type == "4") {
            // pivot
            tmpType = "pivottable";
            const column = config.column;
            relation.column = column;
            dragactW = 20;
            dragactH = 10;
        } else if (type == "5") {
            // perspective
            tmpType = "perspective";
            const column = config.column;
            relation.column = column;
            dragactW = 20;
            dragactH = 10;
        } else if (type == "6") {
            // text文本控件
        } else if (type == "11") {
            //  搜索框
            tmpType = "search";
            const searchJson = config.searchJson;
            const keys = Object.keys(searchJson);
            for (let i; i < keys.length; i++) {
                const search = searchJson[keys[i]];
                const label = search.name;
                const item = {};
                item.label = label;
                item.relationFields = {};
                item.props = [];
                relation[keys[i]] = item;
            }

        }
        const item = {
            name: chartId.toString(),
            type: tmpType,
            chartId: chartId.toString(),
            fatherName: "root",
            styleConfig: "",
            relation: relation,
        };
        //  放入children
        const { style_config } = mDashboard;
        const style_config_obj = JSON.parse(style_config);
        const md_children = style_config_obj.children;
        md_children.push(item);
        // 增加dragact样式
        const dragactStyle = style_config_obj.dragactStyle;
        const dragact_item = { GridX: 0, GridY: 25, w: dragactW, h: dragactH, key: chartId.toString() };
        dragactStyle.push(dragact_item);
        // md_children转回string  然后刷新state
        style_config_obj.children = md_children;
        style_config_obj.dragactStyle = dragactStyle;
        mDashboard.style_config = JSON.stringify(style_config_obj);
    }

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
        const relationItem = { label: "", relationFields: {}, props: [], order: 0 }
        let order = this.getMaxOrderSearch(relation);
        relationItem.order = order + 1;// 新增的item的order要比之前大
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
                header: ['列一', '列二', '列三', '列四', '列五', '列六'],
                body: [
                    [10, 11, 12, 13, 15, 16],
                    [10, 11, 12, 13, 15, 16],
                    [10, 11, 12, 13, 15, 16],
                    [10, 11, 12, 13, 15, 16],
                    [10, 11, 12, 13, 15, 16],
                ],
            };
        } else if (type == "pivottable") {
            //fakeData = [['attribute', 'attribute2'], ['value1', 'value2']]; // 原始假数据
            fakeData = {
                header: ['attribute1', 'attribute2', 'attribute3', 'attribute4'],
                body: [
                    [10, 11, 12, 13],
                    [10, 11, 12, 13],
                    [10, 11, 12, 13],
                    [10, 11, 12, 13],
                    [10, 11, 12, 13],
                ],
            };
        } else if (type == "perspective") {
            fakeData = {
                header: ['attribute1', 'attribute2', 'attribute3', 'attribute4'],
                body: [
                    [10, 11, 12, 13],
                    [10, 11, 12, 13],
                    [10, 11, 12, 13],
                    [10, 11, 12, 13],
                    [10, 11, 12, 13],
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
    // 根据chartId获取chart类型
    getTypeByChartId = (mCharts, chartId) => {
        let type;
        mCharts.map((item, index) => {
            if (item.id.toString() == chartId) {
                const config = JSON.parse(item.config);
                type = config.type;
            }
        });
        return type;
    }

    // 判断两个字段在数据集字段关联中是否有关联 根据关联关系判断  "dataSetRelation":[[],[]],
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
    /***
     * 判断搜索框字段和图表字段是否存在关联关系
     * column1:搜索框column_id
     * column2:图表column_id
     * ***/
    getSearchChartsColumnYNrelationed = (column1, column2, idColumns) => {
        let tableSearch = idColumns[column1];
        let tableChart = idColumns[column2];
        if (null != tableSearch && null != tableChart && tableSearch.rsc_name == tableChart.rsc_name) {
            return true;
        }
        return false;
    }

    // m_dashboard取第一次进来时候,order最小值的
    getStyle_configByOrder = (mDashboard_old, tagName, tagNames) => {
        let style_config = JSON.parse(mDashboard_old.style_config);
        let children = style_config.children;//m_dashboard中的children
        const keys = [];
        for (let key in children) {// 循环每个图表
            keys.push(key);
        }
        // js数组排序
        for (let i = 0; i < keys.length - 1; i++) {
            for (let j = 0; j < keys.length - i - 1; j++) {
                if (children[keys[j]].order > children[keys[j + 1]].order) {
                    let tmp = keys[j + 1];
                    keys[j + 1] = keys[j];
                    keys[j] = tmp;
                }
            }
        }
        // 获取默认tag
        const currentTag = style_config.currentTag;
        let tag = ""; //当前应该显示的tag名称,给下面用的变量
        if (null != currentTag && currentTag != "") {
            tag = currentTag;
        } else {
            tag = keys[0];
        }
        // 设置当前 tagName
        tagName[tag] = children[tag].name;
        // 设置所有 tagName
        for (let i = 0; i < keys.length; i++) {
            tagNames[keys[i]] = children[keys[i]].name;
        }
        // 拼接 mDashboard
        let mDashboard = {};
        mDashboard.id = mDashboard_old.id;
        mDashboard.name = mDashboard_old.name;
        mDashboard.style_config = JSON.stringify(children[tag]);
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
        // 合并到mDashboard
        mDashboard.style_config = JSON.stringify(value);
    }

    // 获取搜索框item的排序的最大值order
    getMaxOrderSearch = (relation) => {
        let maxId = 0;
        const keys = []; //放item的key
        for (let key in relation) {
            keys.push(key);
            if (relation[key].order != null && relation[key].order > maxId) {
                maxId = relation[key].order;
            }
        }
        if (keys.length > maxId) {
            maxId = keys.length;
        }
        return maxId;
    }

    // 添加dataList_one到所有里面
    addDataList = (dataList, dataList_one) => {
        for (let key in dataList_one) {
            dataList[key] = dataList_one[key];
        }
        return dataList;
    }

    /***************************plot***************************************/
    // 将点击plot后要查询的图表id放入plotChartId
    changePlotChartId = (plotChartId, chartId, mDashboard) => {
        plotChartId = [];
        const style_config = JSON.parse(mDashboard.style_config);
        const children = style_config.children;
        children.map((item, index) => {
            if (item.chartId == chartId) {
                const relation = item.relation;
                for (let key in relation) { // relation中的字段
                    const relationFields = relation[key].relationFields; // 字段关联的图表id
                    for (let k in relationFields) {
                        plotChartId.push(k);
                    }
                }
            }
        });
        return plotChartId;
    }


    /************************************************************************/

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

    /*****************************search_start*****************************************/
    /***
     * 拼接查询所需要的json
     * param: search_type{ "search":初始化和搜索框查询,"plot":"点击plot查询"}
     * value_plot{ 被点击的chart的参数[字段id,值,mchartid],没点击就是空}
     * report_id { 请求的reportId }
     * search_id { 搜索框图表的id }
     * mDashboard { 你懂的 }
     * **/
    getSearchJson = (search_type, value_plot, plotChartId, report_id, mDashboard, mDashboard_old, mCharts, idColumns) => {
        const style_config = JSON.parse(mDashboard.style_config);
        const style_config_old = JSON.parse(mDashboard_old.style_config);
        const json = { report_id: report_id, name: style_config.name, children: [], dataSet: style_config_old.dataSet, dataSetRelation: style_config_old.dataSetRelation }; // 总的json
        const { children } = style_config;
        // 先循环每个chart找到搜索框的chart中的relation
        let relation_search;
        let search_time_param; // 搜索框时间item的column_id
        let search_time_value; // 搜索框时间item的值
        for (let i = 0; i < children.length; i++) {
            const { chartId, name, relation, type } = children[i];
            if (type == "search") {
                relation_search = relation;
                json.search_id = chartId; // 搜索框图表的id
                // 找到搜索框的mchart,用来去里面找到时间item的id
                const mChart = this.getMChartByChartId(mCharts, chartId);
                const config = JSON.parse(mChart.config);
                if (config.type == "11") { // 是搜索框
                    const { searchJson } = config; // item对象
                    for (let searchJson_key in searchJson) {
                        if (searchJson[searchJson_key].type == "3") { // 找到时间Item
                            search_time_param = searchJson_key; // item的column id
                            const { name, date_type, time_type, from_type, time_from, time_to } = searchJson[searchJson_key];
                            // date_type日期类型 time_type:0相对时间 from_type:0日期区间 time_from:偏移量
                            // 目前时间的值写固定的就是用偏移量
                            if (time_type === '0') {//相对时间，有偏移量
                                let type = '';
                                switch (date_type) {
                                    case '0':
                                        type = 'days';
                                        break;
                                    case '1':
                                        type = 'weeks';
                                        break;
                                    case '2':
                                        type = 'months';
                                        break;
                                    case '4':
                                        type = 'months';
                                        break;
                                    default:
                                        type = 'years';
                                }
                                search_time_value = [moment().subtract(time_from, type), moment().subtract(time_to, type)];
                            }
                        }
                    }
                }
            }
        }
        // 再循环每个chart找到点击plot的relation
        let relation_plot;
        if (search_type == "plot" && null != value_plot) {
            const column_id = value_plot[0];
            const value = value_plot[1];
            const chart_id_plot = value_plot[2];
            for (let i = 0; i < children.length; i++) {
                const { chartId, name, relation, type } = children[i];
                if (chartId == chart_id_plot) {
                    relation_plot = relation;
                }
            }
        }
        // 开始循环每个chart图表
        for (let i = 0; i < children.length; i++) {
            const { chartId, name, relation, type } = children[i];
            // 排除搜索框和 点击plot的时候没有被关联的图表
            if (type == "search" || (search_type == "plot" && null != value_plot && plotChartId.indexOf(chartId) < 0)) {
                continue;
            }
            const json_chart = { chart_id: chartId, name: name, params_search: {}, params_plot: {} }; // 每个chart图表的json
            // 先放入搜索框中的参数
            /***
             * 逻辑解释: isDateSetsRelationed是判断多个数据集的时候两个字段是否是字段名称相同
             * key_child == chartId:被关联的图表id是被循环的图表的id
             * relationFields[key_child]:是被关联的字段id
             * json_chart.params_search: 第一种情况,自己是被关联的图表的时候，并且参数的值不是空，搜索类型是plot（点击搜索框和点击plot关联）
             * 第二种情况:自己是被关联的时候，并且是 init 初始化进来的时候，要在之前上面先找到搜索框中item是时间的item的Id即search_time_param,并且判断是否关联,
             * (search_time_param == relationFields[key_child] || isDateSetsRelationed)：判断字段的的id是否相等||判断字段的rsc_name是否相等
             * 好，扯太多了，总的来说分两种情况
             * 第一种:点击搜索框和点击plot关联查询:判断自己的图表的id是否是搜索框item中关联的图表的chartid，判断参数不是空就直接放入,这个没什么问题
             * 第二种:初始化的时候，由于时间搜索框是空的，所以只要手动拼时间参数其他参数不放入,search_time_param时间Item的id是在之前查好的。然后判断时间item的rsc_name和图表被关联的字段rsc_name是否相等
             * ***/
            for (let key in relation_search) { // 每个key是每个搜索框子项
                const { label, order, relationFields, props } = relation_search[key];
                for (let key_child in relationFields) { // 每个key_child是搜索框子项关联的chart的id
                    const isDateSetsRelationed = this.getSearchChartsColumnYNrelationed(search_time_param, relationFields[key_child], idColumns);
                    if (key_child == chartId && null != props && null != props[0] && search_type == "plot") { // 如果搜索框的子项有关联这个chart
                        json_chart.params_search[relationFields[key_child]] = props;  // 放入搜索框参数{key:value}:{"字段id":"参数值"}
                    } else if (key_child == chartId && null != search_time_param && (search_time_param == relationFields[key_child] || isDateSetsRelationed) && search_type == "init") { // 如果搜索框里有时间item,那就把他参数放进去 ps:时间参数是[],但是空的也传
                        json_chart.params_search[relationFields[key_child]] = search_time_value;
                    }
                }
            }
            // 再放plot点击的参数
            if (search_type == "plot" && null != value_plot) {
                const column_id = value_plot[0];// 关联字段id
                const value = value_plot[1]; // 参数值
                const chart_id_plot = value_plot[2]; // 被点击图表chart id
                for (let key in relation_plot) { // 每个key是每个搜索框子项
                    const { label, order, relationFields } = relation_plot[key];
                    for (let key_child in relationFields) { // 每个key_child是搜索框子项关联的chart的id
                        if (key_child == chartId && null != value) { // 如果搜索框的子项有关联这个chart
                            json_chart.params_plot[column_id] = value;  // 放入搜索框参数{key:value}:{"字段id":"参数值"}
                        }
                    }
                }
            }
            // 最后把chart放入总json
            json.children.push(json_chart);
        }
        return json;
    }

    /*****************************search_end*****************************************/

}

export default ReportBoardUtils;
export default class Index extends PureComponent {
    // ReportBoard.js 临时不用的类进行备份

    /*************************右侧每个数据集的参数都可以选的关联方法**********************************/
    // 关联关系点击回调
    // 修改 搜索的 item 增加或减少
    // id 是当前图表的uuuid  
    changeSearchItem = (id, value) => {
        // 思路 看 relation里有没有 name,有就删除，没有就新增一个空的
        const { mDashboard } = this.state;
        const { style_config } = mDashboard;
        const style_config_obj = JSON.parse(style_config);
        const md_children = style_config_obj.children;
        md_children.map((item, index) => {
            if (item.name == id) {
                // relation 关联关系
                const relation = item.relation;
                const relation_keys = Object.keys(relation);
                const value_keys = value;
                // 有就删除
                for (let i = 0; i < relation_keys.length; i++) {
                    let flag = false;
                    for (let j = 0; j < value_keys.length; j++) {
                        if (relation_keys[i] == value_keys[j]) {
                            flag = true;
                        }
                    }
                    if (!flag) {
                        delete relation[relation_keys[i]];
                    }
                }
                // 没有就增加一个   relationFields:"图表uuuid,columnid"
                for (let i = 0; i < value_keys.length; i++) {
                    let flag = false;
                    for (let j = 0; j < relation_keys.length; j++) {
                        if (value_keys[i] == relation_keys[j]) {
                            flag = true;
                        }
                    }
                    if (!flag) {
                        const relationItem = { label: "", relationFields: {}, props: [] }
                        relation[value_keys[i]] = relationItem;
                    }
                }
            }
        });
        // md_children转回string  然后刷新state
        style_config_obj.children = md_children;
        mDashboard.style_config = JSON.stringify(style_config_obj);
        this.setState({
            mDashboard: mDashboard,
        });
        // 重新调用展示右侧
        const rightProps = this.state.rightProps;
        this.disPlayRight(rightProps[0], rightProps[1]);
        // 更新ui(主要是搜索框的子项个数)
        this.refreshDashboard();
    }

    // 修改图表之间的关联关系
    // 参数  id search里面的itemid(rsc_column_config), name  children里 每个图表的uuuid , value   relation里拼好的  "name":{ label:,relationFields:{"chart_item_name":[value]},props:, }
    changeCheckRelation = (id, name, chart_item_name, value) => {
        const { mDashboard } = this.state;
        const { style_config } = mDashboard;
        const style_config_obj = JSON.parse(style_config);
        const md_children = style_config_obj.children;
        let type;// 图表的类型
        md_children.map((item, index) => {
            if (item.name == id) {
                // relation 关联关系
                const relation = item.relation;
                const object = relation[name];
                const relationFields = object.relationFields;
                type = item.type;
                // 拼接 relationFields 里的关联关系  relationFields ["uuuid,columnid"]
                //const field = `${chart_item_name},${value}`;
                // 拼接 relationFields 里的关联关系  relationFields {"uuuid":"columnid"}
                //relationFields[chart_item_name] = value;

                const oldValue = relationFields[chart_item_name];
                if (value.length == 0) {
                    relationFields[chart_item_name] = value;
                } else if (value.length > 0) {
                    value.map((value_item, index) => {
                        if (oldValue != value_item) {
                            const value_array = [];
                            value_array.push(value_item);
                            relationFields[chart_item_name] = value_array;
                        }
                    });
                }
            }
        });

        // md_children转回string  然后刷新state
        style_config_obj.children = md_children;
        mDashboard.style_config = JSON.stringify(style_config_obj);
        this.setState({
            mDashboard: mDashboard,
        });

        // 重新调用展示右侧
        if (type == "search") {
            const rightProps = this.state.rightProps;
            this.disPlayRight(rightProps[0], rightProps[1]);
        } else if (type != "search" && type != "tab") {
            const rightProps = this.state.rightProps;
            this.disPlayRightCharts(rightProps[0], rightProps[1]);
        }
    }
}
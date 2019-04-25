/***
 * 数据中间层
 * 根据配置将后端查询的数据拼成中间层json
 * 
 * ***/
export default class CalData {



    /***
     * 
     * 返回table可以使用的json数据
     * 
     * ***/
    getData = (props) => {
        const { mChart, dateSetList, editModel, dragactStyle, idColumns } = props;
    }

    /***
     * 
     * 处理原始查询数据
     * 
     * ***/
    calData = (props) => {
        const { mChart, dateSetList, editModel, dragactStyle, idColumns } = props;
        const { header, head, body } = dateSetList;
        // 0 找到固定列、分类列、二级标题列、显示列的下标
        // 1 获取基本列set,分类字段值放入set, 然后将数据根据基础列set数据分组{key:所有基础列相加,value:所有数据}
        // 2 拼接标题json:先取基础列,然后取类别做一级标题,然后一级标题下取二级标题
        // 3 拼接数据: 循环每坨分类数据,分类数据一坨就是最终的一行数据。先去基础列数据,然后循环分类值,在里面再循环取和分类值相等的显示列的数据

        // 所有的变量全部在这里!!!!!
        let base_column_arr = []; // 基本列字段数组
        let type_column_id = []; // 类型列字段
        let type_column_title_id = []; // 类型列二级标题
        let type_column_value = []; // 类型列字段值
        let show_column_id = []; // 展示列
        let base_column_data = {}; // 基本列为key的分类数据
        let type_value_set = new Set(); // 分类字段值set
        let head_json = []; // 头部数据json
        let body_data = []; // boay部分拼接好的数据
        let data = { head_json, body_data }; // 最终的返回数据
        // 解析配置
        const { colomn, column_obj } = JSON.parse(mChart.config);
        for (let item of column_obj) {
            if (item.type == "normal") {
                base_column_arr.push(item.id);
            } else if (item.type == "type") {
                type_column_id = [];
                type_column_id.push(item.type_id); // 类型id只要一个
                type_column_title_id = [];
                type_column_title_id.push(item.type_title_id);
                type_value_set.add(type_value);
                type_column_value.push(item.type_value); // 类型值是多个
            } else if (item.type == "show") {
                show_column_id.push(item.show_id);
            }
        }
        // 0 找到固定列、分类、显示列的下标
        const base_column_index = this.getIndex(idColumns, header, base_column_arr); // 固定列
        const type_column_index = this.getIndex(idColumns, header, type_column_id); // 类别列
        const title_column_index = this.getIndex(idColumns, header, type_column_id); // 类别列
        const show_column_index = this.getIndex(idColumns, header, show_column_id); // 显示列

        // 1 数据分组放入set,key:基本列,value:数据数组
        const base_column_set = new Set(); // 基本列set
        for (let line of body) {
            let name = ""; // 所有基础列合并的名称
            for (let index of base_column_index) {
                name = name + index;
            }
            base_column_set.add(name);
        }
        for (let item of base_column_set) {
            let value = []; // value值
            for (let line of body) {
                let name = ""; // 所有基础列合并的名称
                for (let index of base_column_index) {
                    name = name + index;
                }
                if (item == name) {
                    value.push(line);
                }
            }
            base_column_data[item] = value;
        }

        // 拼接head中间层json
        // json格式: [{"name":value},{"name":value,"children":[]}]  外边为一级标题,children里面为二级标题
        for (let item of base_column_arr) { // 基本列的标题
            const name = idColumns[item].rsc_display;
            const json = { "name": name };
            head_json.push(json);
        }
        const base_column_data_first = base_column_data[Object.keys(base_column_data)[0]]; // 分类数据的第一个数据
        for (let item of type_value_set) {
            const json = { "name": item, "children": [] };
            for (let line of base_column_data_first) {
                const second_name = line[title_column_index]; // 找到第二级标题名称,就是show_column
                json.children.push(second_name);
            }
            head_json.push(json);
        }

        // 拼接数据
        for (let base_column_data_single of base_column_data) { // 循环分类好的数据
            const data = []; // 每一行的数据
            for (let index of base_column_index) { // 先取每一行的基础列的数据
                data.push(base_column_data_single[0][index]); // 前面固定列直接取每坨数据的第一行然后按下标取
            }
            for (let value of type_value_set) { // 循环分类的类别
                for (let item of base_column_data_single) { // 循环分类数据的每一坨 base_column_data_single是一坨数据,它是个数组
                    if (item[type_column_index] == value) { // 如果每一行数据的类别列的数据和type_value_set里的相等,就放入显示列的值
                        data.push(item[show_column_index]);
                    }
                }
            }
            body_data.push(data);
        }
        return data;
    }

    /***
     * 获取字段所在数据的下标数组
     * 把选中的Id数组传进来，根据idColumns取出对应的名称，然后和header数组中文的中文名称对应取出原始字段的下标数组。
     * ***/
    getIndex = (idColumns, header, column) => {
        const column_arr = column.split(",");
        const column_index = []; // 字段在数据中所在的下标
        for (let key in column_arr) {
            const name = idColumns[column_arr[key]].rsc_display; // 每个column字段的中文名称
            for (let key in header) {
                if (header[key] == name) {
                    column_index.push(key);
                }
            }
        }
        return column_index;
    }

}
import JsUtils from '../../../utils/jsUtils'



const jsUtils = new JsUtils();

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
        const cal_data = this.calData(props);
        //console.log(JSON.stringify(cal_data) + "------tableDiy1数据-----------------");

        //制造antdTable需要的json
        const columns = [];
        const data = [];
        const tableDate = { columns, data };
        const { head_json, body_data } = cal_data;
        const head_for_data = []; //每个行所有字段的中文用来给下面的data拼接做key引导的
        // 制造head
        for (let item of head_json) {
            const { name, children } = item;
            if (null == children) { // 基础列
                const obj = { "title": name, "dataIndex": name, "key": name, "align": "center", "width": 300 };
                columns.push(obj);
                head_for_data.push(name);
            } else { // 复杂标题
                const obj = { "title": name, children: [] };
                for (let key in children) {
                    const value = children[key];
                    const child = { "title": value, "dataIndex": value + key, "key": value + key, "align": "center", "width": 300 };
                    obj.children.push(child);
                    head_for_data.push(value + key);
                }
                columns.push(obj);
            }
        }
        // 后面加一列没用的因为实在是对不齐没办法
        const obj = { "title": "", "dataIndex": "", "key": "", "align": "center" };
        columns.push(obj);
        // 制造body
        for (let key in body_data) {
            const obj = { "key": key };
            const body_line = body_data[key];
            for (let k in body_line) {
                let value = body_line[k];
                obj[head_for_data[k]] = value;
            }
            data.push(obj);
        }

        return tableDate;
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
        let base_column_arr = []; // 基本列字段数组-前
        let base_column_back_arr = []; // 基本列字段数组-后
        let type_column_id = []; // 类型列字段
        let type_column_title_id = []; // 类型列二级标题
        let merge = ""; // sum count none 类型
        let type_value_set = new Set(); // 类型字段值set
        let second_title_arr = []; // 二级标题名称数组,里面放set
        let show_column_id = []; // 展示列
        let base_column_data = {}; // 基本列为key的分类数据
        let head_json = []; // 头部数据json
        let body_data = []; // boay部分拼接好的数据
        let data = { head_json, body_data }; // 最终的返回数据
        // 解析配置
        const { colomn, column_obj } = JSON.parse(mChart.config);
        for (let item of column_obj) {
            if (item.type == "normal") {
                base_column_arr.push(item.id);
            } if (item.type == "normalback") {
                base_column_back_arr.push(item.id);
            } else if (item.type == "type") {
                merge = item.merge;
                type_column_id = [];
                type_column_id.push(item.type_id); // 类型id只要一个
                type_column_title_id = [];
                type_column_title_id.push(item.type_title_id);
                const type_value = jsUtils.getStrToArr(item.type_value); // 分类值放入set
                for (let value of type_value) {
                    type_value_set.add(value);
                }
            } else if (item.type == "show") {
                show_column_id.push(item.show_id);
            }
        }
        // 0 找到固定列、分类、显示列的下标
        const base_column_index = this.getIndex(idColumns, header, base_column_arr); // 固定列-前
        const base_column_back_index = this.getIndex(idColumns, header, base_column_back_arr); // 固定列-后
        const type_column_index = this.getIndex(idColumns, header, type_column_id); // 类别列
        const title_column_index = this.getIndex(idColumns, header, type_column_title_id); // 二级标题列
        const show_column_index = this.getIndex(idColumns, header, show_column_id); // 显示列

        // 1 数据分组放入set,key:基本列,value:数据数组
        const base_column_set = new Set(); // 基本列set
        for (let line of body) {
            let name = ""; // 所有基础列合并的名称
            for (let index of base_column_index) {
                name = name + line[index];
            }
            base_column_set.add(name);
        }
        for (let item of base_column_set) {
            let value = []; // value值
            for (let line of body) {
                let name = ""; // 所有基础列合并的名称
                for (let index of base_column_index) {
                    name = name + line[index];
                }
                if (item == name) {
                    value.push(line);
                }
            }
            base_column_data[item] = value;
        }

        // 拼接head中间层json
        // json格式: [{"name":value},{"name":value,"children":[]}]  外边为一级标题,children里面为二级标题
        for (let item of base_column_arr) { // 基本列的标题-前
            const name = idColumns[item].rsc_display;
            const json = { "name": name };
            head_json.push(json);
        }
        const base_column_data_first = base_column_data[Object.keys(base_column_data)[0]]; // 分类数据的第一个数据
        for (let item of type_value_set) { // 找到二级标题的名称
            const json = { "name": item, "children": [] };
            const second_title_set = new Set();
            for (let line of base_column_data_first) {
                if (line[type_column_index] == item) {
                    const second_name = line[title_column_index]; // 找到第二级标题名称,就是show_column
                    second_title_set.add(second_name);
                }
            }
            second_title_arr.push(second_title_set);
        }
        let second_title_count = 0; // 给下面type_value_set标识循环次数然后能从second_title_arr里找数据
        for (let item of type_value_set) { // 把二级标题名称放入set
            const json = { "name": item, "children": [] };
            const second_title_set = second_title_arr[second_title_count];
            for (let second_name of second_title_set) {
                json.children.push(second_name);
            }
            head_json.push(json);
            second_title_count++; // 用完了再自加
        }
        for (let item of base_column_back_arr) { // 基本列的标题-后
            const name = idColumns[item].rsc_display;
            const json = { "name": name };
            head_json.push(json);
        }

        // 拼接数据
        for (let key in base_column_data) { // 循环分类好的数据
            let base_column_data_single = base_column_data[key];
            base_column_data_single = this.getDataSum(base_column_data_single, merge, type_value_set, second_title_arr, type_column_index, title_column_index, show_column_index);
            const data = []; // 每一行的数据
            for (let index of base_column_index) { // 先取每一行的基础列的数据
                data.push(base_column_data_single[0][index]); // 前面固定列直接取每坨数据的第一行然后按下标取
            }
            for (let item of type_value_set) { // 循环分类的类别
                for (let line of base_column_data_single) { // 循环分类数据的每一坨 base_column_data_single是一坨数据,它是个数组
                    if (line[type_column_index] == item) { // 如果每一行数据的类别列的数据和type_value_set里的相等,就放入显示列的值
                        data.push(line[show_column_index]);
                    }
                }
            }
            for (let index of base_column_back_index) { // 先取每一行的基础列的数据
                data.push(base_column_data_single[0][index]); // 前面固定列直接取每坨数据的第一行然后按下标取
            }
            body_data.push(data);
        }
        return data;
    }

    /***
     * 获取字段所在数据的下标数组
     * 把选中的Id数组传进来，根据idColumns取出对应的名称，然后和header数组中文的中文名称对应取出原始字段的下标数组。
     * ***/
    getIndex = (idColumns, header, column_arr) => {
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

    /***
     * 
     * 数据进行 sum count none 处理
     * 
     * 参数
     * base_column_data_single:每一坨的数据
     * merge: 聚合方式
     * type_value_set:类型值set
     * second_title_arr:二级标题名称
     * type_column_index:类别下标
     * title_column_index:类别值下标
     * show_column_index:显示列下标
     * 
     * ***/
    getDataSum = (base_column_data_single, merge, type_value_set, second_title_arr, type_column_index, title_column_index, show_column_index) => {
        const data = []; // 总数据
        // 1 拆出second_title_arr中所有的数据
        const second_name = []; // 二级标题名称
        for (let key in second_title_arr) {
            const arr = second_title_arr[key];
            for (let item of arr) {
                second_name.push(item);
            }
        }
        // 2 循环 类别值 循环 二级标题 两者相加找复合的行
        for (let item of type_value_set) {
            for (let value of second_name) {
                const data_line = []; // 每一个 类别+类别值 下的数据集合
                const name = item + value; // 类别+类别值
                // 循环所有行数据,找出符合的数据
                for (let line of base_column_data_single) {
                    const line_name = line[type_column_index] + line[title_column_index]; // 类别+类别值
                    if (name == line_name) {
                        data_line.push(line);
                    }
                }
                // 开始做sum count 处理
                if (merge == "sum" && data_line.length > 0) {
                    let sum = 0;
                    for (let o of data_line) {
                        sum = (sum * 1000 + o[show_column_index] * 1000) / 1000; // 解决js相加丢失精度问题
                    }
                    let tmp_line = data_line[0];
                    tmp_line[show_column_index] = sum;
                    data.push(tmp_line);
                } else if (merge == "count" && data_line.length > 0) {
                    let tmp_line = data_line[0];
                    tmp_line[show_column_index] = data_line.length;
                    data.push(tmp_line);
                }
            }
        }
        return data;
    }

}
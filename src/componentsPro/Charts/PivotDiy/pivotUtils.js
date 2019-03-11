import { Tooltip } from 'antd';

class PivotUtils {
    /*** 制造透视表所需要的列和数据***
     * 
     *  透视表的样式目前只选用固定的，要求固定表头，列要有滚动条自由滑动。
     * 
     * ***/
    getData = (props) => {
        const { mChart, dateSetList, editModel, dragactStyle, idColumns } = props;
        const config = JSON.parse(mChart.config);
        const { header, body } = dateSetList;
        // 字段列，基础列，大标题，指标列，全局列汇总，全局行汇总，计算字段
        const { column, base_column, col_column, cal_column, sum_col, sum_row, formula } = config;

        const base_column_index = this.getIndex(idColumns, header, base_column); // 固定列的下标组成的数组
        const col_column_index = this.getIndex(idColumns, header, col_column); // 大标题的下标组成的数组，个数为一个
        const cal_column_index = this.getIndex(idColumns, header, cal_column); // 计算字段下标组成的数组

        console.log("---------------------------------------------pivotDiy转换数据-----------------------------------------------------------");
        //console.log(JSON.stringify(header)+"--------header---------------");
        //console.log(JSON.stringify(body)+"--------body---------------");

        /***
         * 找到数据的唯一键，固定列做一个key，固定列+大标题做一个key
         * ***/
        const base_column_set_nameMap = {}; // 存放固定列字段,key为所有固定列字段相加
        const base_column_set = new Set(); // 固定列的中文名称数组
        for (let key in body) {
            const body_line = body[key]; //body数据中每一行的数据
            let name = ""; // 固定列的名称相加组成的名称
            const name_arr = []; // 固定列数组
            for (let index in base_column_index) {
                const value = body_line[base_column_index[index]];
                name = name + value;
                name_arr.push(value);
            }
            base_column_set.add(name);
            base_column_set_nameMap[name] = name_arr;
        }
        const col_column_set = new Set(); // 大标题的中文名称数组
        for (let key in body) {
            const body_line = body[key]; //body数据中每一行的数据
            col_column_set.add(body_line[col_column_index[0]]);
        }

        /***
         * 开始拼接数据
         * 
         * ***/
        let body_arr = []; // 拼接完成后的数据
        let body_arr_final = []; //最终数据
        for (let item of base_column_set) {
            const base_column_data_arr = []; // 根据固定列分组的数据
            const cal_column_line_arr = []; // 指标汇总数据的数组
            const cal_column_line_add = []; // 指标汇总数据的行求和
            let cal_column_line_total = [];  // 指标汇总数据一整行的数据
            for (let key in body) {
                const body_line = body[key];
                let name = ""; // 固定列的名称相加组成的名称
                for (let index in base_column_index) {
                    name = name + body_line[base_column_index[index]];
                }
                if (item == name) {
                    base_column_data_arr.push(body_line);
                }
            }
            for (let item_col of col_column_set) {
                const col_column_data_arr = []; // 每个固定列行里面的每个大标题的数据
                for (let key in base_column_data_arr) {
                    const value = base_column_data_arr[key];
                    if (item_col == value[col_column_index[0]]) { // 每个大标题的类别等于数据中的 大标题下标做处的字段
                        col_column_data_arr.push(value);
                    }
                }
                // 先把每个分类里的数据汇总
                const cal_column_line = [];  // 指标汇总数据，也就是每一个行数据的 一部分(大标题分类的)
                for (let index in cal_column_index) {
                    const value = cal_column_index[index];
                    let add_tmp = 0; // 
                    for (let key in col_column_data_arr) {
                        add_tmp = add_tmp + col_column_data_arr[key][value];
                    }
                    cal_column_line.push(add_tmp);
                }
                // 再跟进运算公式把每个分类的数据运算好
                const formula_column = []; // 计算公式算出的结果数组
                for (let key in formula) { // 计算公式的数组
                    const value_str = formula[key].value;
                    const value_arr = value_str.split('');
                    let value = "";
                    let number_flag = false; //判断下标数字,当前如果是#设置为true，那么下个值就是根据下标的数字去取值
                    for (let key_child in value_arr) {
                        let tmp_value = value_arr[key_child];
                        if (tmp_value == "#") { //如果这个字符以#开头那么这个就是下标数字,改变number_flag为true等下个字符的时候就选择下标位的值
                            number_flag = true;
                        } else {
                            if (number_flag) { // 如果是下标数字
                                const ret = /^[0-9]+.?[0-9]*$/; // 正则表达式判断是否是数字
                                if (ret.test(tmp_value)) {
                                    tmp_value = cal_column_line[tmp_value];
                                }
                            }
                            value = value + tmp_value;
                            number_flag = false;
                        }
                    }
                    formula_column.push(eval(value));
                }
                // 把计算完的字段放到指标汇总数据末尾
                for (let key in formula_column) {
                    cal_column_line.push(formula_column[key]);
                }
                cal_column_line_arr.push(cal_column_line); // 每个指标汇总数据放入总的数组里面
            }

            // 算出每行数据的求和
            const tmp_value = cal_column_line_arr[0];
            for (let index = 0; index < tmp_value.length - formula.length; index++) { // 后面几位不要
                let add_tmp = 0; // 
                for (let key in cal_column_line_arr) {
                    const value = cal_column_line_arr[key];
                    add_tmp = add_tmp + value[index];
                }
                cal_column_line_add.push(add_tmp);
            }
            // 再把每行求和的数据用计算公式计算
            const formula_column = []; // 计算公式算出的结果数组
            for (let key in formula) { // 计算公式的数组
                const value_str = formula[key].value;
                const value_arr = value_str.split('');
                let value = "";
                let number_flag = false; //判断下标数字,当前如果是#设置为true，那么下个值就是根据下标的数字去取值
                for (let key_child in value_arr) {
                    let tmp_value = value_arr[key_child];
                    if (tmp_value == "#") { //如果这个字符以#开头那么这个就是下标数字,改变number_flag为true等下个字符的时候就选择下标位的值
                        number_flag = true;
                    } else {
                        if (number_flag) { // 如果是下标数字
                            const ret = /^[0-9]+.?[0-9]*$/; // 正则表达式判断是否是数字
                            if (ret.test(tmp_value)) {
                                tmp_value = cal_column_line_add[tmp_value];
                            }
                        }
                        value = value + tmp_value;
                        number_flag = false;
                    }
                }
                formula_column.push(eval(value));
            }
            // 把计算完的字段放到指标汇总数据末尾
            for (let key in formula_column) {
                cal_column_line_add.push(formula_column[key]);
            }
            // 最后算出一整行的数据
            cal_column_line_total = cal_column_line_add;//先加上前面的求和数据
            for (let key in cal_column_line_arr) {
                cal_column_line_total = cal_column_line_total.concat(cal_column_line_arr[key]);
            }
            body_arr.push(cal_column_line_total); // 每一行完整的数据放入总数据中
        }

        //把最终查出来的数据行汇总
        const final_line = []; //最后的一行数据
        const tmp_line = body_arr[0];
        for (let index in tmp_line) {
            let add_tmp = 0; // 
            for (let key in body_arr) {
                const value = body_arr[key];
                add_tmp = add_tmp + value[index];
            }
            final_line.push(add_tmp);
        }
        // 循环分类的个数
        for (let i = 0; i < col_column_set.size + 1; i++) { //循环每一个类别
            for (let key in formula) {
                const value_str = formula[key].value;
                const value_arr = value_str.split('');
                let value = "";
                let number_flag = false; //判断下标数字,当前如果是#设置为true，那么下个值就是根据下标的数字去取值
                for (let key_child in value_arr) {
                    let tmp_value = value_arr[key_child];
                    if (tmp_value == "#") { //如果这个字符以#开头那么这个就是下标数字,改变number_flag为true等下个字符的时候就选择下标位的值
                        number_flag = true;
                    } else {
                        if (number_flag) { // 如果是下标数字
                            const ret = /^[0-9]+.?[0-9]*$/; // 正则表达式判断是否是数字
                            if (ret.test(tmp_value)) {// 如果是number那么这个就是数组的下标
                                tmp_value = (this.getArrByStr(cal_column).length + formula.length) * i + tmp_value;
                                tmp_value = final_line[tmp_value];
                            }
                        }
                        value = value + tmp_value;
                        number_flag = false;
                    }
                }
                final_line.push(eval(value));
            }
        }
        let final_line_final = [];
        const final_line_tmp_arr = [];
        for (let i = 0; i < this.getArrByStr(base_column).length; i++) {
            final_line_tmp_arr.push("");
        }
        final_line_final = final_line_tmp_arr.concat(final_line);

        let line_index = 0;
        for (let item of base_column_set) {
            const name_arr = base_column_set_nameMap[item];
            const body_arr_line = body_arr[line_index];
            const arr = name_arr.concat(body_arr_line);
            body_arr_final.push(arr);
            line_index++;
        }
        body_arr_final.push(final_line_final);

        /*****返回数据****
         * 
         * 
         * 
         * **/
        const tableDate = {};
        const columns = [];
        const data = [];
        tableDate["columns"] = columns;
        tableDate["data"] = data;

        /*****拼接列*******
        * 
        * 根据mChart中的配置，取出固定的列和要度量的列和要透视的列，然后把它们拼接成复杂的头部样式。
        * 
        * ******/
        const head_base_name = []; // 头部基础列中文名称
        const head_col_name = ["合计"]; // 后面大标题的中文名称
        const head_cal_name = []; // 计算字段中文名称
        const head_for_data = []; //每个行所有字段的中文用来给下面的data拼接做key引导的
        for (let key in base_column_index) {
            const value = header[key];
            head_base_name.push(value);
        }
        for (let item of col_column_set) {
            head_col_name.push(item);
        }
        for (let key in cal_column_index) {
            const value = header[cal_column_index[key]];
            head_cal_name.push(value);
        }
        for (let key in formula) {
            head_cal_name.push(formula[key].name);
        }
        // 开始拼接头
        for (let key in head_base_name) {
            const value = head_base_name[key];
            const obj = { "title": value, "dataIndex": value, "key": value, "align": "center", "width": 300 };
            columns.push(obj);
            head_for_data.push(value);
        }
        for (let key in head_col_name) {
            const value = head_col_name[key];
            const obj = { "title": value, children: [] };
            for (let k in head_cal_name) {
                const va = head_cal_name[k] + key;
                const child = { "title": head_cal_name[k], "dataIndex": va, "key": va, "align": "center", "width": 100 };
                obj.children.push(child);
                head_for_data.push(va);
            }
            columns.push(obj);
        }

        /*****拼接数据********
         * 
         * 数据需要经过复杂的转化和计算
         * 
         * **/
        for (let key in body_arr_final) {
            const obj = { "key": key };
            const body_line = body_arr_final[key];
            for (let k in body_line) {
                let value = body_line[k];
                if (value.length > 12 && config.forceFit != "1") { // 如果字符大于12个的时候那就隐藏用Tooltip提示
                    value = (
                        <Tooltip title={value} placement="top">
                            <span>{value.substring(0, 12) + "..."}</span>
                        </Tooltip>
                    );
                }
                obj[head_for_data[k]] = value;
            }
            data.push(obj);
        }

        return tableDate;
    }

    /***
     * 获取字段所在数据的下标数组
     * 
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
    /***
     * str转arr
     * 
     * ***/
    getArrByStr = (value) => {
        const arr = value.split(",");
        return arr;
    }

}
export default PivotUtils;
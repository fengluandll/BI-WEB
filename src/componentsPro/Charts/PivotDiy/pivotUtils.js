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
         * A步骤: 做好准备数据，所有固定列字段相加，固定列中文名，大标题中文名
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
         * B步骤：开始拼接中间的数据
         * 开始拼接数据
         * 
         * ***/
        let body_arr = []; // 拼接好的所有行数据(除了最后一行的数据)
        let body_arr_final = []; //最终数据
        for (let item of base_column_set) { // 步骤1：循环每行唯一的key
            const base_column_data_arr = []; // 根据固定列分组的数据
            const cal_column_line_arr = []; // 指标汇总数据的数组
            const cal_column_line_add = []; // 指标汇总数据的行求和
            let cal_column_line_total = [];  // 指标汇总数据一整行的数据
            // 步骤2：把固定列分组的数据放入数组
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
            for (let item_col of col_column_set) { // 步骤3：循环数据的大标题
                const col_column_data_arr = []; // 每个固定列行里面的每个大标题的数据
                for (let key in base_column_data_arr) {
                    const value = base_column_data_arr[key];
                    if (item_col == value[col_column_index[0]]) { // 每个大标题的类别等于数据中的 大标题下标做处的字段
                        col_column_data_arr.push(value);
                    }
                }
                // 步骤4：找到每行的每个大标题下的计算字段数据
                const cal_column_line = [];  // 计算字段数据，也就是每一个行数据的 一部分(大标题分类的)
                for (let index in cal_column_index) {
                    const value = cal_column_index[index];
                    let add_tmp = 0; // 
                    for (let key in col_column_data_arr) {
                        add_tmp = add_tmp + col_column_data_arr[key][value];
                    }
                    cal_column_line.push(add_tmp);
                }
                // 步骤5：把每行的每个大标题下的计算公式字段给算好
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
                    value = eval(value);
                    formula_column.push(value);
                }
                // 把计算完的字段放到指标汇总数据末尾
                for (let key in formula_column) {
                    cal_column_line.push(formula_column[key]);
                }
                // 步骤6：把每行的每个大标题下的拼接好的数据 放入到整体的数组里面 方便以后使用。
                cal_column_line_arr.push(cal_column_line); // 每行的每个大标题下的计算好的数据放入总的数组里面
            }

            // 步骤7：算出每行的 求和大标题 里面的 行数据(也就是列汇总功能)
            // 先计算拼接处前面的计算字段汇总数据
            const tmp_value = cal_column_line_arr[0];
            for (let index = 0; index < tmp_value.length - formula.length; index++) { // 后面几位不要
                let add_tmp = 0; // 
                for (let key in cal_column_line_arr) {
                    const value = cal_column_line_arr[key];
                    add_tmp = add_tmp + value[index];
                }
                cal_column_line_add.push(add_tmp);
            }
            // 再根据计算公式算出后面的计算公式字段
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
                value = eval(value);
                formula_column.push(value);
            }
            // 把计算字段数组中的数据拼接到 汇总 大标题下的数组数据里面
            for (let key in formula_column) {
                cal_column_line_add.push(formula_column[key]);
            }
            // 步骤8：拼接出一整行的数据。
            cal_column_line_total = cal_column_line_add;//先加上前面的求和数据
            for (let key in cal_column_line_arr) {
                cal_column_line_total = cal_column_line_total.concat(cal_column_line_arr[key]);
            }
            // 步骤9：把每一行的数据放入到 行数据 数组里面给后面使用。
            body_arr.push(cal_column_line_total); // 每一行完整的数据放入总数据中
        }

        /***
         * C步骤：计算出最后一行数据，也就是行数据汇总数据
         * 
         * 把最终查出来的数据行汇总,算出最后一行的汇总数据
         * 
         * ***/
        let final_line = []; //最后一行数据
        const final_line_cal_arr = []; //最后的一行数据的计算字段部分
        const tmp_line = body_arr[0];
        for (let index in tmp_line) {
            let add_tmp = 0; // 
            for (let key in body_arr) {
                const value = body_arr[key];
                add_tmp = add_tmp + value[index];
            }
            final_line_cal_arr.push(add_tmp);
        }
        // 计算字段部分的计算公式列要用计算公式的结果替代
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
                                const cal_length = this.getArrByStr(cal_column).length; // 计算字段的个数
                                const index = (parseInt(cal_length) + parseInt(formula.length)) * i + parseInt(tmp_value); // 替换字段的下标
                                tmp_value = final_line_cal_arr[index];
                            }
                        }
                        value = value + tmp_value;
                        number_flag = false;
                    }
                }
                const cal_length = this.getArrByStr(cal_column).length; // 计算字段的个数
                const cal_index = parseInt(key); // 计算公式index
                const index = parseInt(cal_length * parseInt(i + 1)) + formula.length * i + cal_index; // 要替换的汇总行数据的下标
                final_line_cal_arr[index] = eval(value); // 替换计算公式列的值
            }
        }
        const final_line_base_arr = []; // 最后一行数据的基础字段部分
        for (let i = 0; i < this.getArrByStr(base_column).length; i++) { // 最后一行前面的基础列里面的数据前面用空最后一个用合计
            if (i == this.getArrByStr(base_column).length - 1) {
                final_line_base_arr.push("合计");
            } else {
                final_line_base_arr.push("");
            }
        }
        final_line = final_line_base_arr.concat(final_line_cal_arr); // 最终拼接处最后一行数据,用前面基础列+后面的计算字段列

        /***
         * 
         * D步骤：把最后所有的数据放入到一个总的数据数组里面。
         * 
         * 拼接出最终的所有数据,按照没行的数据放入总的数据数组。
         * 
         * ***/
        let line_index = 0;
        for (let item of base_column_set) { // 先放基础的每个行数据
            const name_arr = base_column_set_nameMap[item];
            const body_arr_line = body_arr[line_index];
            const arr = name_arr.concat(body_arr_line);
            body_arr_final.push(arr);
            line_index++;
        }
        body_arr_final.push(final_line); // 再放最后一行的数据

        /***
         * E步骤：根据计算公式字段的json将计算字段的值格式化
         * 
         * ***/
        // 计算出计算字段在总数据中的下标
        const base_length = this.getArrByStr(base_column).length; //固定列字段长度
        const cal_length = this.getArrByStr(cal_column).length; // 计算字段长度
        const col_length = col_column_set.size; // 大标题长度
        const formula_length = parseInt(formula.length); //计算公式字段长度
        for (let key = 0; key < col_length + 1; key++) {
            for (let k in formula) {
                const index = parseInt(base_length) + parseInt(cal_length * (key + 1)) + parseInt(formula_length * key) + parseInt(k); //计算公式字段下标
                for (let m in body_arr_final) {
                    let body_line = body_arr_final[m]; //所有最终数据中的每行数据
                    body_line[index] = this.getFormat(body_line[index], formula[k]);
                }
            }
        }

        /*****返回数据****
         * 
         * F步骤：制造返回数据，拼接antdtable所需要的columns和data数据json
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
        for (let key in base_column_index) { // 放入基础字段名称
            const value = header[key];
            head_base_name.push(value);
        }
        for (let item of col_column_set) { // 放入大标题字段名称
            head_col_name.push(item);
        }
        for (let key in cal_column_index) { // 放入计算字段的名称
            const value = header[cal_column_index[key]];
            head_cal_name.push(value);
        }
        for (let key in formula) { // 放入计算字段的名称
            head_cal_name.push(formula[key].name);
        }
        // 开始拼接头
        for (let key in head_base_name) { // 先拼基础列的头部
            const value = head_base_name[key];
            const obj = { "title": value, "dataIndex": value, "key": value, "align": "center", "width": 300 };
            columns.push(obj);
            head_for_data.push(value);
        }
        for (let key in head_col_name) { // 再拼后面计算字段的列的头部
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
         * 制造antdtable所需要的data json
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
    /***
     * str转arr
     * 
     * ***/
    getArrByStr = (value) => {
        const arr = value.split(",");
        return arr;
    }
    /***
     * 计算公式字段格式化
     * param: 结果值、formula格式化json
     * ***/
    getFormat = (ret, formula) => {
        const { name, value, decimal, format } = formula;
        // 判断保留小数位
        let num = 1;
        const r = /^[0-9]+.?[0-9]*$/; // 正则表达式判断是否是数字
        if (null != decimal && decimal != "0" && r.test(parseInt(decimal))) {
            num = 10 * parseInt(decimal);
            ret = Math.round(ret * num) / num;
        }
        // 先判断有没有%
        if (format == "%") {
            ret = ret * 100 + '%';
        }
        return ret;
    }

}
export default PivotUtils;
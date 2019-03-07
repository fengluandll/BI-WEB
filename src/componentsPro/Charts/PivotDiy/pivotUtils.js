
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
        // 字段列，基础列，大标题，指标列，全局列汇总，全局行汇总
        const { column, base_column, col_column, cal_column, sum_col, sum_row, formula } = config;

        const base_column_index = this.getIndex(idColumns, header, base_column); // 固定列的下标组成的数组
        const col_column_index = this.getIndex(idColumns, header, col_column); // 大标题的下标组成的数组，个数为一个
        const cal_column_index = this.getIndex(idColumns, header, cal_column); // 计算字段下标组成的数组

        const base_column_set = new Set(); // 固定列的中文名称数组
        for (let key in body) {
            const body_line = body[key]; //body数据中每一行的数据
            let name = ""; // 固定列的名称相加组成的名称
            for (let index in base_column_index) {
                name = name + body_line[base_column_index[index]];
            }
            base_column_set.add(name);
        }
        const col_column_set = new Set(); // 大标题的中文名称数组
        for (let key in body) {
            const body_line = body[key]; //body数据中每一行的数据
            col_column_set.add(body_line[col_column_index[0]]);
        }

        // 开始拼接数据
        let body_arr = []; // 拼接完成后的数据
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
                    for (let key_child in value_arr) {
                        let tmp_value = value_arr[key_child];
                        if (typeof (tmp_value) == 'number') {
                            tmp_value = cal_column_line[tmp_value];
                        }
                        value = value + tmp_value;
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
            for (let index = 0; index++; index < tmp_value.length - formula.length) { // 后面几位不要
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
                for (let key_child in value_arr) {
                    let tmp_value = value_arr[key_child];
                    if (typeof (tmp_value) == 'number') {
                        tmp_value = cal_column_line_add[tmp_value];
                    }
                    value = value + tmp_value;
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
        for (let i = 0; i < col_column_set.length + 1; i++) { //循环每一个类别
            for (let key in formula) {
                const value_str = formula[key].value;
                const value_arr = value_str.split('');
                let value = "";
                for (let key_child in value_arr) {
                    let tmp_value = value_arr[key_child];
                    if (typeof (tmp_value) == 'number') {// 如果是number那么这个就是数组的下标
                        tmp_value = (cal_column.length + formula.length) * i + tmp_value;
                        tmp_value = final_line[tmp_value];
                    }
                    value = value + tmp_value;
                }
                final_line.push(eval(value));
            }
        }
        body_arr.push(final_line); // 加了最后汇总的所有数据
        console.log(JSON.stringify(body_arr));

        /*****拼接列*******
         * 
         * 根据mChart中的配置，取出固定的列和要度量的列和要透视的列，然后把它们拼接成复杂的头部样式。
         * 
         * ******/


        /*****拼接数据********
         * 
         * 数据需要经过复杂的转化和计算
         * 
         * **/

        /*****返回数据****
         * 
         * 
         * 
         * **/
        const tableDate = {};
        const columns = {};
        const data = {};
        tableDate["columns"] = columns;
        tableDate["data"] = data;
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

}
export default PivotUtils;
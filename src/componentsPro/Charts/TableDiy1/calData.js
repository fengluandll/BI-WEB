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
        // 0 找到 固定列 和 分类  和 显示 列 的下标
        // 1 set 获取基本列 数据分组 key 为 基本列name   value 为  所有数据

        // 2 找到 分类字段 放入 set

        // 3 拿1里面的第一个数据 根据2 拼接好 标题名称

        // 4 数据 根据1 按顺序取

        // 解析配置
        const { colomn, column_obj } = JSON.parse(mChart.config);
        const base_column_arr = []; // 基本列字段数组
        let type_column_id = []; // 类型列字段
        const type_column_value = []; // 类型列字段值
        const show_column_id = []; // 展示列
        for (let item of column_obj) {
            if (item.type == "normal") {
                base_column_arr.push(item.id);
            } else if (item.type == "type") {
                type_column_id = [];
                type_column_id.push(item.type_id); // 类型id只要一个
                type_column_value.push(item.type_value); // 类型值是多个
            } else if (item.type == "show") {
                show_column_id.push(item.show_id);
            }
        }
        // 0 找到固定列、分类、显示列的下标
        const base_column_index = this.getIndex(idColumns, header, base_column_arr); // 固定列
        const type_column_index = this.getIndex(idColumns, header, type_column_id); // 类别列
        const show_column_index = this.getIndex(idColumns, header, show_column_id); // 显示列

        // 1 数据分组放入set,key:基本列,value:数据数组
        const base_column_set = new Set(); // 基本列set

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
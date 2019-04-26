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
        console.log(JSON.stringify(cal_data) + "------data-----------------");

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
                const obj = { "title": name, "dataIndex": name, "key": name, "align": "center", "width": 300, "fixed": "left" };
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
        // 制造body
        for (let key in body_data) {
            const obj = { "key": key };
            const body_line = body_arr_final[key];
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
        let { mChart, dateSetList, editModel, dragactStyle, idColumns } = props;
        dateSetList = { "head": [{ "sn_id": 15170, "id": "07d007aa5e944f191819e74ad466e5ef", "rs_t_id": "029b749e006798a5290bb3546b1c9810", "is_calc": "Y", "rsc_display": "名称", "rsc_formatter": null, "rsc_id": null, "rsc_name": "name_emp", "rsc_array": null, "rsc_type": 21, "rsc_sort": 11, "rsc_remark": null, "is_active": "Y", "create_date": 1555948800000, "modify_date": 1555948800000, "rsTableConf": null }, { "sn_id": 15167, "id": "0efda271d622446b7e9fec1a7c0dc3ad", "rs_t_id": "029b749e006798a5290bb3546b1c9810", "is_calc": "Y", "rsc_display": "工资项名称", "rsc_formatter": null, "rsc_id": null, "rsc_name": "str_name", "rsc_array": null, "rsc_type": 21, "rsc_sort": 30, "rsc_remark": null, "is_active": "Y", "create_date": 1555948800000, "modify_date": 1555948800000, "rsTableConf": null }, { "sn_id": 15171, "id": "180b8e0db35e9f9c15844a0985c31475", "rs_t_id": "029b749e006798a5290bb3546b1c9810", "is_calc": "Y", "rsc_display": "薪资项类型", "rsc_formatter": null, "rsc_id": null, "rsc_name": "type", "rsc_array": null, "rsc_type": 3, "rsc_sort": 5, "rsc_remark": null, "is_active": "Y", "create_date": 1555948800000, "modify_date": 1555948800000, "rsTableConf": null }, { "sn_id": 15169, "id": "0d2e3d8907500cf18c5a64a2b4d8c0c0", "rs_t_id": "029b749e006798a5290bb3546b1c9810", "is_calc": "Y", "rsc_display": "金额", "rsc_formatter": null, "rsc_id": null, "rsc_name": "num_amount", "rsc_array": null, "rsc_type": 11, "rsc_sort": 18, "rsc_remark": null, "is_active": "Y", "create_date": 1555948800000, "modify_date": 1555948800000, "rsTableConf": null }], "searchAntdTable": { "start": 0, "end": 50, "total": 123 }, "header": ["名称", "工资项名称", "薪资项类型", "金额"], "body": [["沈维", "考勤扣款", "明细", 0], ["沈维", "基本工资", "明细", 7000], ["沈维", "岗位补贴", "明细", 1000], ["沈维", "绩效工资基数", "明细", 2000], ["沈维", "绩效工资", "明细", 2000], ["沈维", "提成工资", "明细", 400], ["沈维", "薪酬调差", "明细", 0], ["郑翔", "行政处罚扣款", "明细", 0], ["郑翔", "养老保险（个人）", "明细", 342.4], ["郑翔", "养老保险（公司）", "明细", 855.8], ["郑翔", "医疗保险（个人）", "明细", 85.6], ["郑翔", "医疗保险（公司）", "明细", 406.6], ["郑翔", "失业保险（个人）", "明细", 21.4], ["郑翔", "失业保险（公司）", "明细", 21.4], ["郑翔", "生育保险（公司）", "明细", 42.8], ["郑翔", "工伤保险（公司）", "明细", 8.6], ["郑翔", "残障金（公司）", "明细", 0], ["郑翔", "重大疾病（公司）", "明细", 0], ["郑翔", "大额医疗（个人）", "明细", 0], ["郑翔", "大额医疗（公司）", "明细", 0], ["郑翔", "服务费（社保代缴）", "明细", 0], ["郑翔", "住房公积金（个人）", "明细", 168], ["郑翔", "住房公积金（公司）", "明细", 168], ["郑翔", "个税专项扣除月度抵扣项", "明细", 0], ["郑翔", "税后其它应扣", "明细", 0], ["郑翔", "报销", "明细", 0], ["郑翔", "事假扣款", "明细", 0], ["高哲", "行政处罚扣款", "明细", 0], ["高哲", "养老保险（个人）", "明细", 400], ["高哲", "养老保险（公司）", "明细", 1000], ["高哲", "医疗保险（个人）", "明细", 100], ["高哲", "医疗保险（公司）", "明细", 475], ["高哲", "失业保险（个人）", "明细", 25], ["高哲", "失业保险（公司）", "明细", 25], ["高哲", "生育保险（公司）", "明细", 50], ["高哲", "工伤保险（公司）", "明细", 10], ["高哲", "残障金（公司）", "明细", 0], ["高哲", "重大疾病（公司）", "明细", 0], ["高哲", "大额医疗（个人）", "明细", 0], ["高哲", "大额医疗（公司）", "明细", 0], ["高哲", "服务费（社保代缴）", "明细", 0], ["高哲", "住房公积金（个人）", "明细", 308], ["高哲", "住房公积金（公司）", "明细", 308], ["高哲", "个税专项扣除月度抵扣项", "明细", 0], ["高哲", "税后其它应扣", "明细", 0], ["高哲", "报销", "明细", 3500], ["高哲", "事假扣款", "明细", 0], ["高哲", "病假扣款", "明细", 0], ["沈维", "病假扣款", "明细", 0], ["沈维", "社保补缴金额", "明细", 0], ["沈维", "季度绩效工资基数", "明细", 0], ["沈维", "季度绩效工资", "明细", 0], ["沈维", "请假扣款", "小计", 0], ["沈维", "应发合计", "小计", 10400], ["沈维", "个人应缴社保合计", "小计", 517.06], ["沈维", "公司应缴社保合计", "小计", 1121.81], ["沈维", "税前应扣合计", "小计", 0], ["沈维", "应税合计", "小计", 9882.94], ["沈维", "个人所得税", "明细", 146.49], ["沈维", null, "未知", 0], ["沈维", "实发合计", "总计", 9736.45], ["沈维", "实发合计（含报销）", "小计", 9736.45], ["郑翔", "基本工资", "明细", 6000], ["郑翔", "岗位补贴", "明细", 1200], ["郑翔", "绩效工资基数", "明细", 1800], ["郑翔", "绩效工资", "明细", 1800], ["郑翔", "提成工资", "明细", 500], ["郑翔", "薪酬调差", "明细", 0], ["郑翔", "考勤扣款", "明细", 0], ["郑翔", "病假扣款", "明细", 0], ["郑翔", "社保补缴金额", "明细", 0], ["郑翔", "季度绩效工资基数", "明细", 0], ["郑翔", "季度绩效工资", "明细", 0], ["郑翔", "请假扣款", "小计", 0], ["郑翔", "应发合计", "小计", 9500], ["郑翔", "个人应缴社保合计", "小计", 617.4], ["郑翔", "公司应缴社保合计", "小计", 1503.2], ["郑翔", "税前应扣合计", "小计", 0], ["郑翔", "应税合计", "小计", 8882.6], ["郑翔", "个人所得税", "明细", 116.48], ["郑翔", null, "未知", 0], ["郑翔", "实发合计", "总计", 8766.12], ["郑翔", "实发合计（含报销）", "小计", 8766.12], ["高哲", "基本工资", "明细", 8800], ["高哲", "岗位补贴", "明细", 3000], ["高哲", "绩效工资基数", "明细", 4700], ["高哲", "绩效工资", "明细", 4700], ["高哲", "提成工资", "明细", 0], ["高哲", "薪酬调差", "明细", 0], ["高哲", "考勤扣款", "明细", 140], ["高哲", "社保补缴金额", "明细", 0], ["高哲", "季度绩效工资基数", "明细", 0], ["高哲", "季度绩效工资", "明细", 0], ["高哲", "请假扣款", "小计", 0], ["高哲", "应发合计", "小计", 20000], ["高哲", "个人应缴社保合计", "小计", 833], ["高哲", "公司应缴社保合计", "小计", 1868], ["高哲", "税前应扣合计", "小计", 140], ["高哲", "应税合计", "小计", 15527], ["高哲", "个人所得税", "明细", 315.81], ["高哲", null, "未知", 0], ["高哲", "实发合计", "总计", 15211.19], ["高哲", "实发合计（含报销）", "小计", 18711.19], ["沈维", "行政处罚扣款", "明细", 0], ["沈维", "养老保险（个人）", "明细", 271.97], ["沈维", "养老保险（公司）", "明细", 645.92], ["沈维", "医疗保险（个人）", "明细", 67.99], ["沈维", "医疗保险（公司）", "明细", 271.97], ["沈维", "失业保险（个人）", "明细", 10.2], ["沈维", "失业保险（公司）", "明细", 23.8], ["沈维", "生育保险（公司）", "明细", 23.8], ["沈维", "工伤保险（公司）", "明细", 16.32], ["沈维", "残障金（公司）", "明细", 0], ["沈维", "重大疾病（公司）", "明细", 0], ["沈维", "大额医疗（个人）", "明细", 7], ["沈维", "大额医疗（公司）", "明细", 0], ["沈维", "服务费（社保代缴）", "明细", 19.9], ["沈维", "住房公积金（个人）", "明细", 140], ["沈维", "住房公积金（公司）", "明细", 140], ["沈维", "个税专项扣除月度抵扣项", "明细", 0], ["沈维", "税后其它应扣", "明细", 0], ["沈维", "报销", "明细", 0], ["沈维", "事假扣款", "明细", 0]] };
        const { header, head, body } = dateSetList;
        // 0 找到固定列、分类列、二级标题列、显示列的下标
        // 1 获取基本列set,分类字段值放入set, 然后将数据根据基础列set数据分组{key:所有基础列相加,value:所有数据}
        // 2 拼接标题json:先取基础列,然后取类别做一级标题,然后一级标题下取二级标题
        // 3 拼接数据: 循环每坨分类数据,分类数据一坨就是最终的一行数据。先去基础列数据,然后循环分类值,在里面再循环取和分类值相等的显示列的数据

        // 所有的变量全部在这里!!!!!
        let base_column_arr = []; // 基本列字段数组
        let type_column_id = []; // 类型列字段
        let type_column_title_id = []; // 类型列二级标题
        let type_value_set = new Set(); // 类型字段值set
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
            } else if (item.type == "type") {
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
        const base_column_index = this.getIndex(idColumns, header, base_column_arr); // 固定列
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
        for (let item of base_column_arr) { // 基本列的标题
            const name = idColumns[item].rsc_display;
            const json = { "name": name };
            head_json.push(json);
        }
        const base_column_data_first = base_column_data[Object.keys(base_column_data)[0]]; // 分类数据的第一个数据
        for (let item of type_value_set) {
            const json = { "name": item, "children": [] };
            for (let line of base_column_data_first) {
                if (line[type_column_index] == item) {
                    const second_name = line[title_column_index]; // 找到第二级标题名称,就是show_column
                    json.children.push(second_name);
                }
            }
            head_json.push(json);
        }

        // 拼接数据
        for (let key in base_column_data) { // 循环分类好的数据
            const base_column_data_single = base_column_data[key];
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

}
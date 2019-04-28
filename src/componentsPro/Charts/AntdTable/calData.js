import { Tooltip } from 'antd';
import BrowserUtils from '../../../utils/browserUtils';


const browserUtils = new BrowserUtils();

/***
 * 数据中间层
 * 根据配置将后端查询的数据拼成中间层json
 * 
 * ***/
export default class CalData {

    /***
     * 拼接中间层json
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * ***/
    cal = (props) => {
        const { mChart, dateSetList, editModel, dragactStyle, idColumns, item } = props;
        const config = JSON.parse(mChart.config);
        const { columnUrl, columnUrlStr, columnUrlParam, fixed_left, fixed_right, column, forceFit, warning_row } = config;
        const { head, body } = dateSetList;
        const head_ret = []; // 返回值head
        const body_ret = []; // 返回值body
        const width = this.getTableWidth(head.length); // 每列宽度
        // 列数据
        const noWidthKey = this.findNoWidth(head, mChart); //不用设置宽度的head的key
        for (let key in head) {
            const rsColumnConf = head[key];
            const { id } = rsColumnConf;
            const obj = { "rsColumnConf": rsColumnConf, "align": "center" };
            // f1 判断是否url跳转列
            const columnUrl_arr = columnUrl.split(",");
            if (columnUrl_arr.indexOf(id) >= 0) { // 该列是跳转url列
                const obj_url = { param_id: columnUrlParam, param_url: columnUrlStr }; // url的json
                obj.url = obj_url;
            }
            // f2 固定列
            const fixed_left_arr = fixed_left.split(",");
            const fixed_right_arr = fixed_right.split(",");
            if (fixed_left_arr.indexOf(id) >= 0) { // 该列是固定到左侧的列
                obj.fixed = "left";
                obj.width = width;
            } else if (fixed_right_arr.indexOf(id) >= 0) { // 该列是固定到右侧的列
                obj.fixed = "right";
                obj.width = width;
            } else {
                obj.fixed = "none";
            }
            // f3 设置每列的宽度
            if (fixed_left_arr.indexOf(id) < 0 && fixed_right_arr.indexOf(id) < 0 && forceFit != "1" && key != noWidthKey) { // 如果不是自适应的情况下要显固定头部那么除了最后一列不舍宽度，其他都要设置宽度
                obj.width = width;  // 后期改成根据每列的最大字符数来控制
            }
            // f4 被关联字段要加特殊样式 和 点击事件
            const { type, name, chartId, styleConfig, relation } = item;
            if (null != id) { // 假数据的时候rsColumnConf里面没有值,自己后来造的字段也没有rsColumnConf
                if (null == relation[id]) {
                    head_ret.push(obj); // 返回之前json数据还是要放的
                    continue;
                }
                const { relationFields } = relation[id]; // 取出当前字段所在的relationFields
                if (null != relationFields && Object.keys(relationFields).length > 0) { // 该列字段是关联了其他的图表(relationFields里面有对象)
                    const style = { backgroundColor: '#F4F4F4' };
                    obj.style = style; // 样式
                    obj.plotParam = id; // 点击参数是当前id
                }
            }
            head_ret.push(obj); // 最后放入列数据
        }
        // body数据
        for (let key in body) { // body 第一层循环,循环行
            const line = body[key]; // 每行数据
            const line_obj = []; // 返回的每行的数组
            for (let k in line) { // body 第二层循环,循环列
                let value = line[k] == null ? "" : line[k]; // 每个数据的值,处理空字符串
                value = value.toString().replace('\n', ' '); // 替换换行符
                const obj = { value: value }; // 每个数据 拼成对象
                // f5 超过12个中文字符的后面用...表示,并用提示框提示全部内容
                const cat = this.getUseTooltip(value); // cat==0 : 不用显示tooltip
                if (cat > 0 && config.forceFit != "1") { // 如果中文字符大于12个的时候那就隐藏用Tooltip提示
                    const tooltip = value.substring(0, cat) + "...";
                    obj.tooltip = tooltip;
                }
                // f6 值预警,公式比较符合的就要不同颜色显示
                const formula = this.warningRow(key, warning_row); // 获取判断公式
                try {
                    let value_cal = value.replace(/%/g, ""); // 计算value, 先去掉%
                    const ret = /^[0-9]+.?[0-9]*$/; // 正则表达式判断是否是数字
                    if (null != formula && "" != formula && ret.test(value_cal) && eval(value_cal + formula)) { // 如果满足判断公式 value+公式 执行了为true
                        const style = { color: "red" };
                        obj.style = style;
                    }
                } catch (e) { // 打印异常信息
                    console.log(" antdTable f6 eval error, and messege is : " + e);
                }
                line_obj.push(obj);
            }
            body_ret.push(line_obj); // 返回的行数据放入返回的总数据里面
        }
        const data = { head: head_ret, body: body_ret };
        return data;
    }

    /***
     * 
     * 拼接antdtable需要的json
     * 
     * 
     * ***/
    getTableData = (dataParam, props) => {
        const { onPlotClickAntTable, mChart, idColumns } = props;
        const { head, body } = dataParam;
        const tableDate = {}; // 拼接好的参数对象
        /***制造列***/
        const columns = [];
        const first_col = {
            title: () => '序号不重复', // 这么写不会有其他字段中文重复,哈哈
            width: '50px',
            dataIndex: '序号不重复',
            key: '序号不重复',
            fixed: 'left',
            render: (text, record, index) => {
                return (
                    <div style={{ textAlign: 'center', backgroundColor: '#f3f3f3', marginLeft: '-5px', marginRight: '-5px' }}>{`${index + 1}`}</div>
                )
            },
        };
        columns.push(first_col); // 放入第一行的序号列
        for (let key in head) {
            const obj_head = head[key];
            const { rsColumnConf, url, fixed, width, plotParam, style } = obj_head;
            const rsc_display = rsColumnConf == null ? key : rsColumnConf.rsc_display; // 防止rsColumnConf为空
            let rsc_display_title = rsc_display; // 表头-如果表头标题大于8个字符直接用tooltip
            if (null != rsc_display && rsc_display.length > 8) {
                rsc_display_title = <div key={rsc_display}>
                    <Tooltip title={rsc_display} placement="top">
                        <span>{rsc_display.substring(0, 8) + "..."}</span>
                    </Tooltip>
                </div>;
            }
            const obj = { "title": rsc_display_title, "dataIndex": rsc_display, "key": rsc_display, "align": obj_head.align };
            // f1 判断跳转
            if (null != url) {
                const { param_id, param_url } = url;
                obj.render = (text, record, index) => {
                    const value = record[idColumns[param_id].rsc_display]; // 拿出参数列的参数
                    const src = param_url + value.key; // tootip外层套了div取它的key
                    return (
                        <a target="_blank" href={src}>{text}</a>
                    );
                }
            }
            // f2 固定单元格
            if (null != fixed && fixed != "none") {
                obj.fixed = fixed;
            }
            // f3 宽度
            if (null != width) {
                obj.width = width;
            }
            // f4 被关联字段要加特殊样式 和 点击事件
            if (null != plotParam) {
                obj.render = (text, record, index) => {
                    return (
                        <div style={style} onClick={onPlotClickAntTable.bind(this, plotParam, text.key, mChart.id)}>{text}</div>
                    );
                }
            }
            columns.push(obj);
        }
        /***制造数据***/
        const data = [];
        for (let key in body) {
            const obj = { "key": key }; // antd需要的每行json
            const body_line = body[key]; // 每行的中间数据
            for (let k in body_line) {
                const { rsColumnConf } = head[k]; // 每列数据取出列标题中文
                const line_obj = body_line[k]; // 每个中间数据
                let { value, style, tooltip } = line_obj;
                let content = <div key={value}>{value}</div>; // 默认值
                if (null != style) { // 加样式--可能是值预警的样式
                    content =
                        <div key={value}>
                            <span style={style}>
                                {value}
                            </span>
                        </div>;
                }
                if (null != tooltip) { // 显示tooltip
                    content =
                        <div key={value}>
                            <Tooltip title={value} placement="top">
                                <span>{tooltip}</span>
                            </Tooltip>
                        </div>;
                }
                obj[rsColumnConf.rsc_display] = content; // 最终没什么特殊情况就是普通的显示值就行了
            }
            data.push(obj);
        }
        tableDate["columns"] = columns;
        tableDate["data"] = data;
        return tableDate;
    }

    /***
     * 找到一个不用设置宽度的列
     * 
     * ***/
    findNoWidth = (head, mChart) => {
        let ret = 100; //返回值
        const config = JSON.parse(mChart.config);
        const { columnUrl, columnUrlStr, columnUrlParam, fixed_left, fixed_right, column, forceFit } = config;
        const fixed_left_arr = fixed_left.split(",");
        const fixed_right_arr = fixed_right.split(",");
        for (let key in head) {
            const rsColumnConf = head[key];
            const { id } = rsColumnConf;
            if (fixed_left_arr.indexOf(id) < 0 && fixed_right_arr.indexOf(id) < 0) { // 不是固定列
                ret = key; // 不是固定列的最后一个字段
            }
        }
        return ret;
    }
    /***
     * 判断这行是否要行预警
     * 
     * ***/
    warningRow = (key, warning_row) => {
        let ret = ""; // 返回值
        for (let index in warning_row) {
            const obj = warning_row[index];
            const { row, formula } = obj;
            if (key == parseInt(row)) { // 如果行的下标等于row的值
                ret = formula;
            }
        }
        return ret;
    }

    /***
     * 
     * 获取表格每列的宽度
     * 
     * 如果列数多有滚动条就是200,否则每列平均宽度
     * 
     * 参数:size : 列的个数
     * 
     * ***/
    getTableWidth = (size) => {
        let width = 200;
        const json = browserUtils.getBrowserInfo();
        const total_px = parseInt(size) * 200; // 现有列数乘以200的值
        if (json.width > 0 && total_px < json.width) { // 平均分配宽度
            width = (json.width - 50) / size; // 网页宽度-序号列宽度50 然后除以列个数
        } else {
            width = 200;
        }
        return width;
    }

    /***
     * 
     * 获取是否要启用tootip
     * 
     * 中文单位2,英文单位1,总数大于20开始显示tooltip
     * 
     * 参数: value 字符串值
     * 
     * 返回值: 0:不用启动tooltip,其他数字后面subString 的参数
     * 
     * ***/
    getUseTooltip = (value) => {
        let cat = 0; // 返回值,要截取的位数
        let count = 0; // 计数
        const ret = /^[\u4e00-\u9fa5],{0,}$/; // 正则表达式判断是否是中文
        for (let v of value) {
            if (ret.test(v)) {
                count = count + 2;
                cat++;
            } else {
                count = count + 1;
                cat++;
            }
            if (count >= 24) {
                break;
            }
        }
        if (count < 24) {
            cat = 0; // 没有count>20的cat为0
        }
        return cat;
    }
}
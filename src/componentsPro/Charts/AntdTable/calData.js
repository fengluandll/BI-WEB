
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
        const { columnUrl, columnUrlStr, columnUrlParam, fixed_left, fixed_right, column, forceFit } = config;
        const { head, body } = dateSetList;
        const head_ret = []; // 返回值head
        const body_ret = []; // 返回值body
        // 列数据
        for (let key in head) {
            const rsColumnConf = head[key];
            const { id, rsc_display } = rsColumnConf;
            const obj = { "title": rsc_display, "dataIndex": rsc_display, "key": rsc_display, "align": "center" };
            // f1 判断是否url跳转列
            const columnUrl_arr = columnUrl.split(",");
            if (columnUrl_arr.indexOf(id) > 0) { // 该列是跳转url列
                const obj_url = { param: columnUrlParam, url: columnUrlStr }; // url的json
                obj.url = obj_url;
            }
            // f2 固定列
            const fixed_left_arr = fixed_left.split(",");
            const fixed_right_arr = fixed_right.split(",");
            if (fixed_left_arr.indexOf(id) > 0) { // 该列是固定到左侧的列
                obj.fixed = "left";
                obj.width = 300;
            } else if (fixed_right_arr.indexOf(id) > 0) { // 该列是固定到右侧的列
                obj.fixed = "right";
                obj.width = 300;
            } else {
                obj.fixed = "none";
            }
            // f3 设置每列的宽度
            if (forceFit != "1" && key != header.length - 1) { // 如果不是自适应的情况下要显固定头部那么除了最后一列不舍宽度，其他都要设置宽度
                obj.width = 200;  // 后期改成根据每列的最大字符数来控制
            }
            // f4 被关联字段要加特殊样式 和 点击事件
            const { type, name, chartId, styleConfig, relation } = item;
            const relation_keys = Object.keys(relation);
            if (relation_keys.indexOf(id) > 0) { // 该列字段是关联了其他的图表
                const style = { backgroundColor: '#F4F4F4' };
                obj.style = style; // 样式
                obj.plotParam = id; // 点击参数是当前id
            }
            head_ret.push(obj); // 最后放入列数据
        }
        // body数据
        for (let key in body) { // body 第一层循环,循环行
            const line = body[key]; // 每行数据
            const line_obj = []; // 返回的每行的数组
            for (let k in line) { // body 第二层循环,循环列
                const value = line[k]; // 每个数据的值
                const obj = { value: value }; // 每个数据 拼成对象
                // f5 超过12个字符的后面用...表示,并用提示框提示全部内容
                if (value.length > 12 && config.forceFit != "1") { // 如果字符大于12个的时候那就隐藏用Tooltip提示
                    const tooltip = value.substring(0, 12) + "...";
                    obj.tooltip = tooltip;
                }
                // f6 值预警,公式比较符合的就要不同颜色显示
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
    getTableData = (dataParam) => {
        const { head, body } = dataParam;
        const tableDate = {}; // 拼接好的参数对象
        /***制造列***/
        const columns = [];
        const first_col = {
            title: () => '序号',
            width: '50px',
            dataIndex: '序号',
            key: '序号',
            render: (text, record, index) => {
                return (
                    <div style={{ textAlign: 'center', backgroundColor: '#f3f3f3', marginLeft: '-5px', marginRight: '-5px' }}>{`${index + 1}`}</div>
                )
            },
        };
        columns.push(first_col); // 放入第一行的序号列
        for (let key in head) {
            const obj_head = head[key];
            const { url, fixed, width, plotParam, style } = obj_head;
            const obj = { "title": obj_head.title, "dataIndex": obj_head.dataIndex, "key": obj_head.key, "align": obj_head.align };
            // f1 判断跳转
            if (null != url) {
                const { param, url } = url;
                obj.render = (text, record, index) => {
                    const src = url + "/" + record[param];
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
                        <div style={style} onClick={this.onPlotClickAntTable.bind(this, id, text)}>{text}</div>
                    );
                }
            }
        }
        /***制造数据***/
        const data = [];
        for (let key in body) {
            const obj = { "key": key }; // antd需要的每行json
            const body_line = body[key]; // 每行的中间数据
            for (let k in body_line) {
                const { title } = head[k]; // 每列数据取出列标题中文
                const line_obj = body_line[k]; // 每个中间数据
                let { value, style, tooltip } = line_obj;
                if (null != style) { // 加样式--可能是值预警的样式
                    value = (
                        <span style={style}>
                            {value}
                        </span>
                    );
                }
                if (null != tooltip) { // 显示tooltip
                    value = (
                        <Tooltip title={value} placement="top">
                            <span>{tooltip}</span>
                        </Tooltip>
                    );
                }
                obj[title] = value; // 最终没什么特殊情况就是普通的显示值就行了
            }
            data.push(obj);
        }
        tableDate["columns"] = columns;
        tableDate["data"] = data;
        return tableDate;
    }
}
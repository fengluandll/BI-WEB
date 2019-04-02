
/***
 * 数据中间层
 * 根据配置将后端查询的数据拼成中间层json
 * 
 * ***/
export default class CalData {

    /***
     * 拼接中间层json
     * 
     * ***/
    cal = (props) => {
        const { mChart, dateSetList, editModel, dragactStyle, idColumns, item } = props;
        const config = JSON.parse(mChart.config);
        const { header, body } = dateSetList;
    }
}
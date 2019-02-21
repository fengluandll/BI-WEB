import { Icon, Tooltip } from 'antd';

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
        tableDate["columns"] = columns;
        tableDate["data"] = data;
        return tableDate;
    }

    /***根据字段id取得在数据中的下标***/
    getIndex = (idColumns, mChart, id) => {

    }

}
export default PivotUtils;
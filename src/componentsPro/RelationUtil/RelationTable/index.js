import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Collapse, Checkbox, Icon } from 'antd';
import ReportBoardUtils from '../../../utils/reportBoardUtils';
import styles from './index.less';

const Panel = Collapse.Panel;
const CheckboxGroup = Checkbox.Group;
const reportBoardUtils = new ReportBoardUtils();

/***
 * antdTable关联
 * 
 * @author:wangliu
 * 
 * 要求:所有table的字段都去判断其他图表是否可以被关联,选了关联再点击table的字段就可以关联查询。
 * 
 * ***/
class RelationTable extends PureComponent {
    constructor(props) {
        super(props);
        const { mChart, relation, mCharts, tableIdColumns, idColumns, chart_children, changeCheckRelation } = this.props;
        this.state = {
            mChart, relation, mCharts, tableIdColumns, idColumns, chart_children, changeCheckRelation,
            type_map: {}, // 下拉切换图标,{key:index下标,value:"icon值"}
            refreshUI: 0,   //   state 用来刷新ui
        }
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    componentWillReceiveProps(nextProps) {
        const { mChart, relation, mCharts, tableIdColumns, idColumns, chart_children, changeCheckRelation } = nextProps;
        this.setState({
            mChart, relation, mCharts, tableIdColumns, idColumns, chart_children, changeCheckRelation,
        });
    }

    /****************************点击事件*********************************/

    /***
     * 展开和收起列表
     * 
     * ***/
    toogle = (searchIndex, ev) => {
        const { type_map } = this.state;
        let type_index = type_map[searchIndex] == null ? "down" : type_map[searchIndex];
        type_index = type_index == "right" ? "down" : "right";
        type_map[searchIndex] = type_index;
        this.setState({
            type_map,
            refreshUI: this.state.refreshUI + 1,
        });
    };

    // 修改图表之间的关联关系  参数 name:维度id
    changeCheckRelation = (column_id, checkValue) => {
        // 选中图表的uuuid
        const id = this.props.name;
        this.props.changeCheckRelation(id, column_id, checkValue);
    }


    /*******************************************************************/

    renderContent = () => {
        const { mChart, relation, mCharts, tableIdColumns, idColumns, chart_children, changeCheckRelation, type_map } = this.state;
        const { column } = JSON.parse(mChart.config);
        const column_id_arr = column.split(","); // table字段id的数组


        return (
            <div>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={<div><span>配置关联关系</span></div>} key="1">
                        <div className="search-config-selection">
                            {/* 选择字段后显示关联列表 */}
                            {
                                // 第一层循环，循环table的所有字段
                                column_id_arr.map((item, index) => {
                                    const idColumn = this.props.idColumns[item]; // 找到当前字段的对象
                                    const arr = []; // 所有图表
                                    for (let i = 0; i < chart_children.length; i++) {
                                        const chart_item = chart_children[i];
                                        const chartId = chart_item.chartId; // 当前图表的id
                                        const mChart_item = reportBoardUtils.getMChartByChartId(mCharts, chartId); // 根据id找到当前图表对象
                                        const dataSetName_item = JSON.parse(mChart_item.config).dataSetName; // 当前图表的数据集名称
                                        const dataSetName = JSON.parse(mChart.config).dataSetName; // 被点击图表的数据集名称
                                        const columns_item = tableIdColumns[dataSetName_item]; // 当前图表的所有字段
                                        const columns = tableIdColumns[dataSetName]; // 被点击图表的所有字段
                                        for (let i = 0; i < columns_item.length; i++) { // 循环当前图表的所有字段和当前字段进行匹配
                                            if (columns_item[i].rsc_name == idColumn.rsc_name) {
                                                //存在相同名称字段的情况下,将数组中放入值
                                                arr.push({
                                                    "label": mChart_item.name,
                                                    "value": `${mChart_item.id}:${columns_item[i].id}`,
                                                });
                                            }
                                        }
                                    }
                                    const value = []; // 选中的图表
                                    if (relation[item]) {
                                        const relationFields = relation[item].relationFields;
                                        for (let key in relationFields) {
                                            value.push(relationFields[key][0]);
                                        }
                                    }
                                    const type_index = type_map[index] == null ? "down" : type_map[index]; // icon下标值
                                    return (
                                        <div className={styles['field-relation']} key={index}>
                                            <div className={styles['field-name']} title={`源字段-${idColumn.rsc_display}`}>
                                                <Icon type={type_index} onClick={this.toogle.bind(this, index)} style={{ cursor: 'pointer' }} />{`源字段-${idColumn.rsc_display}`}
                                            </div>
                                            <div className={styles['field-content']} style={type_index == "down" ? { display: 'block' } : { display: 'none' }}>
                                                <CheckboxGroup
                                                    options={arr}
                                                    value={value}
                                                    style={{ display: 'block' }}
                                                    onChange={this.changeCheckRelation.bind(this, item)}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </Panel>
                </Collapse>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderContent()}
            </div>
        );
    }
}

export default RelationTable;

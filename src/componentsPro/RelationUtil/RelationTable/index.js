import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Collapse, Checkbox } from 'antd';
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
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    componentWillReceiveProps(nextProps) {
    }

    /****************************点击事件*********************************/

    handleFieldContent = (key, n) => {
        this[`fieldContent${key}`] = n;
    };

    toogle = (key, ev) => {
        const target = ev.target;
        if (ev.target.className === 'anticon anticon-down') {
            target.className = 'anticon anticon-up';
            this[`fieldContent${key}`].style.display = 'block';
        } else {
            target.className = 'anticon anticon-down';
            this[`fieldContent${key}`].style.display = 'none';
        }
    };


    handleComponentContent = (key, n) => {
        this[`componentContent${key}`] = n;
    };

    toogleComponent = (key, ev) => {
        const target = ev.target;
        if (ev.target.className === 'anticon anticon-down') {
            target.className = 'anticon anticon-up';
            this[`componentContent${key}`].style.display = 'block';
        } else {
            target.className = 'anticon anticon-down';
            this[`componentContent${key}`].style.display = 'none';
        }
    };

    // 修改图表之间的关联关系  参数 name:维度id
    changeCheckRelation = (column_id, checkValue) => {
        // 选中图表的uuuid
        const id = this.props.name;
        this.props.changeCheckRelation(id, column_id, checkValue);
    }


    /*******************************************************************/

    renderContent = () => {
        const { mChart, relation, mCharts, tableIdColumns, idColumns, chart_children, changeCheckRelation } = this.props;
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
                                    return (
                                        <div className={styles['field-relation']} key={index}>
                                            <div className={styles['field-name']} title={`源字段-${idColumn.rsc_display}`}>
                                                <i className="anticon anticon-down" onClick={this.toogle.bind(this, index)} style={{ cursor: 'pointer' }} />{`源字段-${idColumn.rsc_display}`}
                                            </div>
                                            <div className={styles['field-content']} ref={this.handleFieldContent.bind(this, index)}>
                                                <CheckboxGroup
                                                    options={arr}
                                                    defaultValue={value}
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

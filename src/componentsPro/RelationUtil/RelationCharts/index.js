import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Collapse, Tag, Card, Icon, Button, message, Input, Dropdown, Menu, Checkbox } from 'antd';
import styles from './index.less';

const Panel = Collapse.Panel;
const CheckboxGroup = Checkbox.Group;

/***
 * 该类被废弃使用了
 * wangliu
 * 
 * ***/
export default class Index extends PureComponent {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        this.renderRelationChart();
    }

    componentDidUpdate() {
        this.renderRelationChart();
    }


    /*************************************点击事件***********************************************/

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

    // 修改图表之间的关联关系  参数 name 图表的uuuid
    changeCheckRelation = (name, chart_item_name, checkValue) => {
        // 选中图表的uuuid
        const id = this.props.name;
        this.props.changeCheckRelation(id, name, chart_item_name, checkValue);
    }


    /********************************************************************************************/


    // 图表的关联UI
    renderRelationChart() {
        const node = this.node;// node 显示节点
        const { mChart } = this.props;
        const mChart_config = JSON.parse(mChart.config);
        const type = mChart_config.type;//  type:0折线图、1柱状图、2饼图、3交叉表、11搜索框
        let total_column;//所有的维度度量 用来显示右侧的配置框个数
        if (type == "0") {
            const dimension = mChart_config.dimension;//维度
            const measure = mChart_config.measure; // 度量
            const color = mChart_config.color; // 图例
            total_column = dimension + "," + measure + "," + color;
        } else if (type == "1") {
            const dimension = mChart_config.dimension;//维度
            const measure = mChart_config.measure; // 度量
            const color = mChart_config.color; // 图例
            total_column = dimension + "," + measure + "," + color;
        } else if (type == "2") {
            const dimension = mChart_config.dimension;//维度
            const measure = mChart_config.measure; // 度量
            total_column = dimension + "," + measure;
        } else if (type == "3") {
            const column = mChart_config.column;// table 字段
            total_column = column;
        }
        let total_array = total_column.split(",");
        // 删除数组中为空的元素
        for (let i = 0; i < total_array.length; i++) {
            if (total_array[i] == "") {
                total_array.splice(i, 1);
            }
        }

        let relation;
        relation = (
            <div>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={<div><span>配置关联关系</span></div>} key="1">

                        <div className="search-config-selection">
                            <div className={styles['search-config-selection-row']}>源数据集</div>

                            {/* 选择字段后显示关联列表 */}
                            {
                                total_array.map((item, index) => {
                                    // 找到当前图表的mchart
                                    const idColumn = this.props.idColumns[item];
                                    return (
                                        <div className={styles['field-relation']} key={index}>
                                            <div className={styles['field-name']} title={`源字段-${idColumn.rsc_display}`}>
                                                <i className="anticon anticon-down" onClick={this.toogle.bind(this, index)} style={{ cursor: 'pointer' }} />{`源字段-${idColumn.rsc_display}`}
                                            </div>
                                            <div className={styles['field-content']} ref={this.handleFieldContent.bind(this, index)}>
                                                {
                                                    /* 开始展示搜索框 选中的子项 对应的 同一起的 图表   下面就是图表*/
                                                    this.props.chart_children.map((chart_item, chart_index) => {
                                                        const chartId = chart_item.chartId;
                                                        const mCharts = this.props.mCharts;
                                                        let mChart;
                                                        mCharts.map((m_item, m_index) => {
                                                            if (m_item.id == chartId) {
                                                                mChart = m_item;
                                                            }
                                                        });
                                                        // mchart 的config
                                                        const config = JSON.parse(mChart.config);
                                                        // 取 数据集的 名称
                                                        const dataSetName = config.dataSetName;
                                                        // 数据集的数组 找到每个chart_children  对应的数据集
                                                        const tableIdColumns = this.props.tableIdColumns;
                                                        const tableIdColumn = tableIdColumns[dataSetName];
                                                        // 从 rs_column_config 中制造数据给下面的  CheckboxGroup  options用
                                                        const arr = [];
                                                        tableIdColumn.map((t_item, t_index) => {
                                                            arr.push({
                                                                "label": t_item.rsc_display,
                                                                "value": `${this.props.name}:${t_item.id}`,
                                                            });
                                                        });
                                                        //  制造    CheckboxGroup 默认选中的数据
                                                        const relation = this.props.relation;
                                                        let value = [];
                                                        if (relation[item]) {
                                                            value = relation[item].relationFields[chart_item.name];
                                                        }
                                                        // 下面是 展示 UI的代码
                                                        return (
                                                            <div key={chart_index}>
                                                                <div className={styles['component-name']} title={mChart.name}>
                                                                    <i className="anticon anticon-down" onClick={this.toogleComponent.bind(this, `${index}${chart_index}`)} style={{ cursor: 'pointer' }} />{mChart.name}
                                                                </div>
                                                                <div className={styles['component-content']} ref={this.handleComponentContent.bind(this, `${index}${chart_index}`)} >
                                                                    <CheckboxGroup
                                                                        options={arr}
                                                                        defaultValue={value}
                                                                        style={{ display: 'block' }}
                                                                        onChange={this.changeCheckRelation.bind(this, item, chart_item.name)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                }
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





        ReactDom.render(relation, node);
    }

    render() {
        return (
            <div>
                <div ref={(instance) => { this.node = instance; }} />
            </div>
        )
    }
}

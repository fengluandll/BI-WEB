import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Collapse, Checkbox, Icon } from 'antd';
import ReportBoardUtils from '../../../utils/reportBoardUtils';
import styles from './index.less';

const Panel = Collapse.Panel;
const CheckboxGroup = Checkbox.Group;
const reportBoardUtils = new ReportBoardUtils();


/***
 * 图表
 * 配置图表和其他图表的关联关系
 * 
 * @author:wangliu
 * 
 * 要求:根据数据集判断是否有字段名相同的(就是可以关联的),找出所有可关联的图表,点击选择程序自动关联上。
 * 
 * ***/
export default class Index extends PureComponent {
    constructor(props) {
        super(props);
        const { chart_children, mChart, relation } = this.props;
        this.state = {
            chart_children,
            mChart,
            relation,
            refreshUI: 0,   //   state 用来刷新ui
        }
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }
    componentWillReceiveProps(props) {
        const { chart_children, mChart, relation } = props;
        this.setState({
            chart_children,
            mChart,
            relation,
            refreshUI: this.state.refreshUI + 1,
        });
    }


    /*************************************点击事件***********************************************/

    // 修改图表之间的关联关系  参数 name:维度id
    changeCheckRelation = (dimension, checkValue) => {
        // 选中图表的uuuid
        const id = this.props.name;
        this.props.changeCheckRelation(id, dimension, checkValue);
    }


    /********************************************************************************************/


    // 图表的关联UI
    renderContent = () => {
        const { chart_children, mChart, relation } = this.state;
        const mChart_config = JSON.parse(mChart.config);
        const type = mChart_config.type;//  type:0折线图、1柱状图、2饼图、3交叉表、11搜索框
        //所有的维度度量 用来显示右侧的配置框个数,modify by wangliu 新版只需要关联维度
        let dimension = mChart_config.dimension;//维度


        // 找到当前id字段的记录
        const idColumn = this.props.idColumns[dimension];
        // 找到其他图表拼接checkbox数据
        const arr = [];
        let value = [];
        chart_children.map((chart_item, chart_index) => {
            // 找到图表的数据集并判断是否有相同名称的字段可以关联不行就不给关联
            const mCharts = this.props.mCharts;
            // 找到被点击图表的数据集
            const plotChart = mChart;
            // plotchart 的config
            const plotConfig = JSON.parse(plotChart.config);
            // 取 数据集的 名称
            const plotDataSetName = plotConfig.dataSetName;
            // 找到当前图表的数据集
            const chartId = chart_item.chartId;
            let mChart_t;
            mCharts.map((m_item, m_index) => {
                if (m_item.id == chartId) {
                    mChart_t = m_item;
                }
            });
            // 没有数据集的图表也return
            if (reportBoardUtils.getIsNoDataSet(reportBoardUtils.changeTypeStrNum(mChart_t.mc_type))) {
                return;
            }
            // mchart 的config
            const config = JSON.parse(mChart_t.config);
            // 取 数据集的 名称
            const dataSetName = config.dataSetName;
            // 判断两个数据集是否有相同的字段名  todo  读取m_dashboard中配置的字段关联
            const tableIdColumns = this.props.tableIdColumns;
            const plotColumns = tableIdColumns[plotDataSetName];
            const columns = tableIdColumns[dataSetName];
            for (let i = 0; i < plotColumns.length; i++) {
                // 找到dimension 所在的数据库列
                if (plotColumns[i].id.toString() == dimension) {
                    const plotSrc_name = plotColumns[i].rsc_name;
                    for (let j = 0; j < columns.length; j++) {
                        if (columns[j].rsc_name == plotSrc_name) {
                            //存在相同名称字段的情况下,将数组中放入值
                            arr.push({
                                "label": mChart_t.name,
                                "value": `${mChart_t.id}:${columns[j].id}`,
                            });
                        }
                    }
                }
            }

        });
        //  制造    CheckboxGroup 默认选中的数据
        if (relation[dimension]) {
            const relationFields = relation[dimension].relationFields;
            for (let key in relationFields) {
                value.push(relationFields[key][0]);
            }
        }
        return (
            <div>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={<div><span>配置关联关系</span></div>} key="1">
                        <div className="search-config-selection">
                            {/* 选择字段后显示关联列表 */}
                            <div className={styles['field-relation']} >
                                <div className={styles['field-name']} title={`源字段-${idColumn.rsc_display}`}>
                                    <Icon type={"down"} />{`源字段-${idColumn.rsc_display}`}
                                </div>
                                <div className={styles['field-content']}>
                                    <CheckboxGroup
                                        options={arr}
                                        value={value}
                                        style={{ display: 'block' }}
                                        onChange={this.changeCheckRelation.bind(this, dimension)}
                                    />
                                </div>
                            </div>
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
        )
    }
}

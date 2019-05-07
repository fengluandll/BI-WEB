import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Collapse, Checkbox, message, Icon } from 'antd';
import styles from './index.less';
import ReportBoardUtils from '../../../utils/reportBoardUtils';
import { EditSearchDataSet } from '../';

const Panel = Collapse.Panel;
const CheckboxGroup = Checkbox.Group;
const reportBoardUtils = new ReportBoardUtils();


/***
 * 搜索框
 * 配置搜索框和其他图表的关联关系
 * 
 * @author:wangliu
 * 
 * ***/
export default class Index extends PureComponent {
    constructor(props) {
        super(props);
        // relation 关联关系中的 search  idColumns 所有搜索子项的  rs_column_config表   chart_children 和搜索框一起的其他图表
        const { name, mChart, mDashboard, tableConfig, relation, search_item, idColumns, chart_children, mCharts, tableIdColumns } = this.props;
        this.state = {
            name: {},
            mChart: {},
            mDashboard: {},
            mDashboard_old: {},
            tableConfig: {},
            relation: {},
            search_item: {},
            idColumns: {},
            chart_children: {},
            mCharts: {},
            tableIdColumns: {},
            searchItemIds: {},   // 搜索框 子项的 id
            searchItemsAll: {},   // 所有搜索框 子项的数据
            type_map: {}, // 下拉切换图标,{key:index下标,value:"icon值"}
            refreshUI: 0,   //   state 用来刷新ui
        };
    }

    componentWillReceiveProps(props) {
        this.makeData(props);
    }

    componentDidMount() {
        this.makeData(this.props);
    }

    componentDidUpdate() {

    }

    // 制造数据
    makeData = (props) => {
        const { name, mChart, mDashboard, mDashboard_old, tableConfig, relation, search_item, idColumns, chart_children, mCharts, tableIdColumns } = props;
        const keys = Object.keys(relation);
        // mchart 的config
        const config = JSON.parse(mChart.config);
        const searchItem_obj = config.searchItem; // {"数据集名称:str"}
        let searchItem_str = ""; // 所有ids的str
        let search_dataSetName = search_item.dataSetName; // 从m_dashboard中的搜索框对象中找到数据集名称
        if (null == search_dataSetName || search_dataSetName == "") { //如果没有值那就从mcharts表里取
            search_dataSetName = config.dataSetName;
        }
        searchItem_str = searchItem_obj[search_dataSetName];
        if (null == searchItem_str) {
            message.success('该数据集字段没有再配置后台配置');
        }
        const searchItemIds = searchItem_str.split(",");

        const len = searchItemIds.length;
        const arr = [];
        for (let j = 0; j < len; j += 1) {
            const searchItem_id = searchItemIds[j]; // 每个字段的id
            if (null == searchItem_id || searchItem_id == "") { // add by wangliu 搜索框多数据源后可能有的数据源没有选字段，导致split成数组后id为"".
                continue;
            }
            const searchItem = idColumns[searchItem_id];
            arr.push({
                "label": searchItem.rsc_display,
                "value": searchItem.id.toString(),
            });
        }

        this.setState({
            name,
            mChart,
            mDashboard,
            mDashboard_old,
            tableConfig,
            relation,
            search_item,
            idColumns,
            chart_children,
            mCharts,
            tableIdColumns,
            searchItemIds: keys,   // 搜索框 子项的 id
            searchItemsAll: arr,   // 所有搜索框 子项的数据
        });
    }


    /*************************************点击事件***********************************************/

    /***
     * 展开和收起列表
     * 
     * ***/
    toogle = (searchIndex, ev) => {
        const { type_map } = this.state;
        let type_index = type_map[searchIndex] == null ? "right" : type_map[searchIndex];
        type_index = type_index == "right" ? "down" : "right";
        type_map[searchIndex] = type_index;
        this.setState({
            type_map,
            refreshUI: this.state.refreshUI + 1,
        });
    };


    // 修改 搜索的 item 增加或减少  参数 id  图表的 uuuid
    changeSearchItem = (checkValue) => {
        // 选中图表的uuuid
        const id = this.props.name;
        this.props.changeSearchItem(id, checkValue);
    };

    // 修改搜索框和图表的关联  参数 searchItem 搜索框item的子项id
    changeSearchRelation = (searchItem, checkValue) => {
        // 选中图表的uuuid
        const id = this.props.name;
        this.props.changeSearchRelation(id, searchItem, checkValue);
    }


    /********************************************************************************************/

    //  搜索框的关联UI
    renderContent() {
        const { changeSearchItem, changeSearchRelation, changeSearchDataSetName } = this.props;
        const { name, mChart, mDashboard, mDashboard_old, tableConfig, relation, search_item, idColumns, chart_children, mCharts, tableIdColumns,
            searchItemIds, searchItemsAll, type_map } = this.state;
        if (null == mChart.config) { // 初始化的时候state没有值,setState之后才有值
            return;
        }
        const mChart_config = JSON.parse(mChart.config);
        const { searchJson, dataSetName } = mChart_config;
        const keys = Object.keys(searchJson);
        const len = keys.length;
        // search
        //  {[{ "label": "Name", "value": "5411" }, { "label": "Status", "value": "5412" }]}
        return (
            <div>
                <Collapse defaultActiveKey={['1', '2']}>
                    <Panel header={<div><span>修改搜索框数据集</span></div>} key="1">
                        <EditSearchDataSet
                            dataSetName={dataSetName}
                            mDashboard={mDashboard}
                            mDashboard_old={mDashboard_old}
                            tableConfig={tableConfig}
                            changeDataSetName={changeSearchDataSetName}
                        />
                    </Panel>
                    <Panel header={<div><span>配置关联关系</span></div>} key="2">

                        <div className="search-config-selection">
                            <div className={styles['check-box-group-container']}>
                                <div className={styles['check-box-group']}>
                                    <CheckboxGroup
                                        options={searchItemsAll}
                                        defaultValue={searchItemIds}
                                        style={{ display: 'block' }}
                                        onChange={this.changeSearchItem}
                                    />
                                </div>
                            </div>

                            {/* 选择字段后显示关联列表 */}

                            {searchItemIds ? searchItemIds.map((searchItem, searchIndex) => {
                                // 搜索框子项 的 rs_column_config 表数据
                                const searchColumn = this.props.idColumns[searchItem];
                                const { relation, mCharts, idColumns, chart_children, search_item } = this.props;
                                // 配置下拉图表的数据
                                const arr = [];
                                chart_children.map((item, index) => {
                                    const chartId = item.chartId;
                                    const mChart = reportBoardUtils.getMChartByChartId(mCharts, chartId);
                                    // 没有数据集的图表也return
                                    if (reportBoardUtils.getIsNoDataSet(reportBoardUtils.changeTypeStrNum(mChart.mc_type))) {
                                        return;
                                    }
                                    arr.push({
                                        "label": mChart.name,
                                        "value": chartId, // tips  为了不和其他的冲突所以后缀加了 searchItem `${chartId}:${searchItem}`
                                    });
                                });
                                const relationFields = relation[searchItem].relationFields;//当前搜索Item的关联
                                const keys = Object.keys(relationFields);// 默认选中值
                                const value = [];
                                keys.map((item, index) => {
                                    value.push(item);// `${item}:${searchItem}`
                                });
                                const type_index = type_map[searchIndex] == null ? "right" : type_map[searchIndex]; // icon下标值
                                return (
                                    <div className={styles['field-relation']} key={searchIndex}>
                                        <div className={styles['field-name']} title={`源字段-${searchColumn.rsc_display}`}>
                                            <Icon type={type_index} onClick={this.toogle.bind(this, searchIndex)} style={{ cursor: 'pointer' }} />{`源字段-${searchColumn.rsc_display}`}
                                        </div>
                                        <div className={styles['field-content']} style={type_index == "down" ? { display: 'block' } : { display: 'none' }}>
                                            <CheckboxGroup
                                                options={arr}
                                                defaultValue={value}
                                                style={{ display: 'block' }}
                                                onChange={this.changeSearchRelation.bind(this, searchItem)}
                                            />
                                        </div>
                                    </div>
                                )
                            }) : ""}

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

import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Collapse, Checkbox } from 'antd';
import styles from './index.less';
import ReportBoardUtils from '../../../utils/reportBoardUtils';

const Panel = Collapse.Panel;
const CheckboxGroup = Checkbox.Group;
const reportBoardUtils = new ReportBoardUtils();

//  仪表板 右侧的  图表列表 组件
export default class Index extends PureComponent {
    constructor(props) {
        super(props);
        // relation 关联关系中的 search  idColumns 所有搜索子项的  rs_column_config表   chart_children 和搜索框一起的其他图表
        const { relation, mCharts, idColumns, chart_children, search_item } = this.props;
        const keys = Object.keys(relation);
        const chartId = search_item.chartId;
        let mChart;
        mCharts.map((item, index) => {
            if (item.id == chartId) {
                mChart = item;
            }
        });
        // mchart 的config
        const config = JSON.parse(mChart.config);
        const searchItemIds = config.searchItem.split(",");
        const len = searchItemIds.length;
        const arr = [];
        for (let j = 0; j < len; j += 1) {
            const searchItem = idColumns[searchItemIds[j]];
            arr.push({
                "label": searchItem.rsc_display,
                "value": searchItem.id.toString(),
            });
        }

        this.state = {
            searchItemIds: keys,   // 搜索框 子项的 id
            searchItemsAll: arr,   // 所有搜索框 子项的数据
        };
    }

    componentWillReceiveProps(props) {
        const relation = props.relation;
        const keys = Object.keys(relation);
        this.setState({
            searchItemIds: keys,
        });
    }

    componentDidMount() {
        this.renderRelationSearch();
    }

    componentDidUpdate() {
        this.renderRelationSearch();
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


    // 修改 搜索的 item 增加或减少  参数 id  图表的 uuuid
    changeSearchItem = (checkValue) => {
        // 先清除右侧的样式
        ReactDom.render(<div></div>, this.node);
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
    renderRelationSearch() {
        const { mChart } = this.props;
        const mChart_config = JSON.parse(mChart.config);
        const searchJson = mChart_config.searchJson;
        const keys = Object.keys(searchJson);
        const len = keys.length;


        const node = this.node;
        // 判断 是search  还是 chart

        let relation;
        // search
        //  {[{ "label": "Name", "value": "5411" }, { "label": "Status", "value": "5412" }]}
        relation = (
            <div>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={<div><span>配置关联关系</span></div>} key="1">

                        <div className="search-config-selection">
                            <div className={styles['check-box-group-container']}>
                                <div className={styles['check-box-group']}>
                                    <CheckboxGroup
                                        options={this.state.searchItemsAll}
                                        defaultValue={this.state.searchItemIds}
                                        style={{ display: 'block' }}
                                        onChange={this.changeSearchItem}
                                    />
                                </div>
                            </div>

                            {/* 选择字段后显示关联列表 */}

                            {this.state.searchItemIds ? this.state.searchItemIds.map((searchItem, searchIndex) => {
                                // 搜索框子项 的 rs_column_config 表数据
                                const searchColumn = this.props.idColumns[searchItem];
                                const { relation, mCharts, idColumns, chart_children, search_item } = this.props;
                                // 配置下拉图表的数据
                                const arr = [];
                                chart_children.map((item, index) => {
                                    const chartId = item.chartId;
                                    const mChart = reportBoardUtils.getMChartByChartId(mCharts, chartId);
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
                                return (
                                    <div className={styles['field-relation']} key={searchIndex}>
                                        <div className={styles['field-name']} title={`源字段-${searchColumn.rsc_display}`}>
                                            <i className="anticon anticon-down" onClick={this.toogle.bind(this, searchIndex)} style={{ cursor: 'pointer' }} />{`源字段-${searchColumn.rsc_display}`}
                                        </div>
                                        <div className={styles['field-content']} ref={this.handleFieldContent.bind(this, searchIndex)}>
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

import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Collapse, Tag, Card, Icon, Button, message, Input, Dropdown, Menu, Checkbox } from 'antd';
import styles from './index.less';

const Panel = Collapse.Panel;
const CheckboxGroup = Checkbox.Group;


//  仪表板 右侧的  图表列表 组件
export default class Index extends PureComponent {
    constructor(props) {
        super(props);
        // relation 关联关系中的 search  searchItems 所有搜索子项的  rs_column_config表   chart_children 和搜索框一起的其他图表
        const { relation, mCharts, searchItems, chart_children, search_item } = this.props;
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
            const searchItem = searchItems[searchItemIds[j]];
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
        // 选中图表的uuuid
        const id = this.props.name;
        this.props.changeSearchItem(id, checkValue);
    };

    // 修改图表之间的关联关系  参数 name 图表的uuuid
    changeCheckRelation = (name, chart_item_name, checkValue) => {
        // 选中图表的uuuid
        const id = this.props.name;
        this.props.changeCheckRelation(id, name, chart_item_name, checkValue);
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
                        </div>
                    </Panel>
                </Collapse>
            </div>
        );
        ReactDom.render(relation, node);
    }


    // 图表的关联UI
    renderRelationChart() {

    }

    render() {
        return (
            <div>
                <div ref={(instance) => { this.node = instance; }} />
            </div>
        )
    }
}

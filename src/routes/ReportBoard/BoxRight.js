
import { Drawer, message, Tabs, Button, Spin, Modal, Radio, Icon } from 'antd';
import { Relation, RelationChartsAuto, TabName, RelationTable, TabsUI } from '../../componentsPro/RelationUtil';
import ReportBoardUtils from '../../utils/reportBoardUtils';
import styles from './index.less';


/***
 * 
 * 编辑模式-右侧
 * 
 * 负责把ReportBoard中的代码抽离到这里,因为主页面实在是写不下啦
 * 
 * @author:wangliu
 * 
 * 
 * ***/

let _this = {}; // 父组件的this对象
const reportBoardUtils = new ReportBoardUtils();

class BoxRight {

    /***
     * 
     * 初始化_this对象
     * 
     * ***/
    init_this = (props) => {
        _this = props;
    }

    /***
     * 
     * 编辑左侧-主入口
     * 
     * ***/
    renderContent = () => {
        return (
            <div>
                {this.renderMenue()}
                {this.disPlayRight()}
            </div>
        );
    }

    /*****************************************1.悬停按钮**************************************************************/
    /***
     * 
     * 悬停按钮
     * 要求：如果是大屏 显示悬停按钮;其他: 正常显示--根据权限和编辑模式显示
     * 
     * 
     * ***/
    renderMenue = () => {
        const { bigScreen } = _this.state;
        if (bigScreen) {
            return this.menueBigScreen();
        } else {
            return this.menuePc();
        }
    }
    // 大屏模式-悬停按钮
    menueBigScreen = () => {
        return (
            <div className={styles['editMenue-bigScreen']} onMouseEnter={this.onMouseEnterShow.bind(this)} onMouseLeave={this.onMouseLeaveHide.bind(this)} >
                <Icon onClick={_this.changeBigScreen} type="fullscreen" style={{}} />
            </div>
        );
    }
    // pc模式-普通按钮
    menuePc = () => {
        if (_this.state.editModel == "true") { // 编辑模式
            return (
                <div className={styles['editMenue-edit']} >
                    <Icon onClick={_this.changeEditeMode} type="unlock" />
                </div>
            );
        } else { // 展示模式
            return (
                <div>
                    {_this.state.user_auth == "1" ?
                        <div className={styles["editMenue-editModel-false"]} >
                            {<Icon onClick={_this.changeEditeMode} style={{ marginRight: '5px', marginLeft: "5px" }} type="lock" />}
                            {<i className={styles['col-line2']}></i>}
                            {<Icon onClick={_this.changeBigScreen} type="fullscreen" className={styles['bigScreen-change']} />}
                            {<i className={styles['col-line1']}></i>}
                            {<Icon onClick={_this.onPrint} type="printer" className={styles['print']} />}
                        </div>
                        :
                        <div className={styles['editMenue-edit']} >
                            {<Icon onClick={_this.onPrint} type="printer" />}
                        </div>}
                </div>
            );
        }
    }
    onMouseEnterShow = (e) => {
        e.target.style.width = '40px';
    }
    onMouseLeaveHide = (e) => {
        e.target.style.width = 0;
    }

    /*****************************************1.右侧编辑框**************************************************************/

    disPlayRight = () => {
        return (
            <div>
                {
                    _this.state.editModel == "true" ? <div className={styles['boardRight']} ref={(instance) => { _this.right = instance; }} >
                        {/* 切换按钮start */}
                        <div>
                            <div>
                                <Radio.Group defaultValue="drag" buttonStyle="solid" checked={_this.state.dragMoveChecked} onChange={this.changeDragMoveChecked}>
                                    <Radio.Button value="drag" >拖拽</Radio.Button>
                                    <Radio.Button value="relation">关联</Radio.Button>
                                </Radio.Group>
                            </div>
                        </div>
                        {/* 切换按钮end */}
                        <div style={{ border: '1px solid #ccc' }}>
                            {this.disPlayContent()}
                        </div>
                    </div> : <div></div>
                }
            </div>
        );
    }
    disPlayContent = () => {
        const { type, mChart, name } = _this.state.rightProps;
        if (type == "search") {
            return this.disPlaySearch(mChart, name);
        } else if (type == "chart") {
            return this.disPlayRightCharts(mChart, name);
        } else if (type == "tab") {
            return this.displayTabName();
        } else if (type == "antdTable") {
            return this.displayRightTable(mChart, name);
        }
    }

    /***
     * 搜索框关联
     * mChart
     * chartId:m_dashboard的图表id
     * ***/
    disPlaySearch(mChart, name) {
        //  如果不是编辑模式 右侧不相应监听事件
        if (_this.state.editModel == "false" || _this.state.dragMoveChecked == false) {
            return;
        }
        const { mDashboard, mCharts } = _this.state;
        // 取m_dashboard
        let fatherName;//  搜索框的farherName 用来找到  和 搜索框一起的 其他图表
        let board_item;//  搜索框的 relation
        let chart_children = [];//  和搜索框一起的图表的 集合
        let search_item; // 搜索框自身(mdashboard中 chidren 里的search )
        const { id, style_config } = mDashboard;
        const md_children = JSON.parse(style_config).children;
        md_children.map((item, index) => {
            if (item.name == name) {
                board_item = item.relation;
                fatherName = item.fatherName;
                search_item = item;
            }
        });
        // 找到和 搜索框一起的 图表
        md_children.map((item, index) => {
            if (item.type != "tab" && item.type != "search") {
                chart_children.push(item);
            }
        });

        return (
            <div>
                <Relation
                    name={name}
                    mChart={mChart}
                    mDashboard={_this.state.mDashboard}
                    mDashboard_old={_this.state.mDashboard_old}
                    tableConfig={_this.state.tableConfig}
                    relation={board_item}
                    search_item={search_item}
                    idColumns={_this.props.model.idColumns}
                    chart_children={chart_children}
                    mCharts={_this.props.model.mCharts}
                    tableIdColumns={_this.props.model.tableIdColumns}
                    changeSearchItem={this.changeSearchItem}
                    changeSearchRelation={this.changeSearchRelation}
                    changeSearchDataSetName={this.changeSearchDataSetName}
                />
            </div>
        );
    }

    /***
     * 图表关联
     * mChart
     * chartId:m_dashboard中图表的id
     * ***/
    disPlayRightCharts(mChart, name) {
        //  如果不是编辑模式 右侧不相应监听事件
        if (_this.state.editModel == "false") {
            return;
        }
        const { mDashboard, mCharts } = _this.state;
        // 取m_dashboard
        let fatherName;//  图表的farherName 用来找到  和 搜索框一起的 其他图表
        let board_item;//  图表的 relation
        let chart_children = [];//  和图表一起的图表的 集合
        const { id, style_config } = mDashboard;
        const md_children = JSON.parse(style_config).children;
        md_children.map((item, index) => {
            if (item.name == name) {
                board_item = item.relation;
                fatherName = item.fatherName;
            }
        });
        // 找到和 图表一起的 图表
        md_children.map((item, index) => {
            if (item.type != "tab" && item.type != "search" && item.name != name) {
                chart_children.push(item);
            }
        });
        return (
            <div>
                <RelationChartsAuto
                    mChart={mChart}
                    relation={board_item}
                    chart_children={chart_children}
                    mCharts={_this.props.model.mCharts}
                    tableIdColumns={_this.props.model.tableIdColumns}
                    idColumns={_this.props.model.idColumns}
                    changeCheckRelation={this.changeCheckRelation}
                    name={name}
                />
            </div>
        );
    }

    // 展示table的关联
    displayRightTable = (mChart, name) => {
        //  如果不是编辑模式 右侧不相应监听事件
        if (_this.state.editModel == "false") {
            return;
        }
        const { mDashboard, mCharts } = _this.state;
        const { id, style_config } = mDashboard;
        const md_children = JSON.parse(style_config).children;
        // 找到和 图表一起的 图表
        let chart_children = [];//  和图表一起的图表的 集合
        let board_item;//  图表的 relation
        md_children.map((item, index) => {
            if (item.type != "tab" && item.type != "search" && item.name != name) {
                chart_children.push(item);
            }
            if (item.name == name) {
                board_item = item.relation;
            }
        });
        return (
            <div>
                <RelationTable
                    mChart={mChart}
                    relation={board_item}
                    mCharts={_this.props.model.mCharts}
                    tableIdColumns={_this.props.model.tableIdColumns}
                    idColumns={_this.props.model.idColumns}
                    chart_children={chart_children}
                    changeCheckRelation={this.changeCheckRelation}
                    name={name}
                />
            </div>
        );
    }

    // 展示右侧tab的名称
    displayTabName = () => {
        //  如果不是编辑模式 右侧不相应监听事件
        if (_this.state.editModel == "false") {
            return;
        }
        const { tagName } = _this.state;
        return (
            <div>
                <TabName
                    tagName={tagName}
                    changeTabName={_this.changeTabName}
                />
            </div>
        );
    }

    /*********************************************方法*******************************************************/
    //  设置右侧开关 控制dragact是否可移动
    changeDragMoveChecked = () => {
        const check = _this.state.dragMoveChecked;
        if (check == true) {
            _this.setState({
                dragMoveChecked: false,
            });
        } else {
            _this.setState({
                dragMoveChecked: true,
            });
        }
    }
    // 关联关系点击回调
    // 修改 搜索的 item 增加或减少
    // id 是当前图表的uuuid  
    changeSearchItem = (id, value) => {
        // 思路 看 relation里有没有 name,有就删除，没有就新增一个空的
        const { mDashboard } = _this.state;
        const { style_config } = mDashboard;
        const style_config_obj = JSON.parse(style_config);
        const md_children = style_config_obj.children;
        md_children.map((item, index) => {
            if (item.name == id) {
                // relation 关联关系
                const relation = item.relation;
                const relation_keys = Object.keys(relation);
                const value_keys = value;
                // 有就删除
                for (let i = 0; i < relation_keys.length; i++) {
                    let flag = false;
                    for (let j = 0; j < value_keys.length; j++) {
                        if (relation_keys[i] == value_keys[j]) {
                            flag = true;
                        }
                    }
                    if (!flag) {
                        delete relation[relation_keys[i]];
                    }
                }
                // 没有就增加一个   relationFields:{"图表Id":[关联字段Id]}
                for (let i = 0; i < value_keys.length; i++) {
                    let flag = false;
                    for (let j = 0; j < relation_keys.length; j++) {
                        if (value_keys[i] == relation_keys[j]) {
                            flag = true;
                        }
                    }
                    if (!flag) {
                        // 增加一个Item，自动配置Item和已有的图表的关联关系
                        reportBoardUtils.addSearchChartRelationAutoSearch(relation, id, value_keys[i], _this.state.mDashboard, _this.props.model.tableIdColumns, _this.props.model.idColumns, _this.props.model.mCharts);
                    }
                }
            }
        });
        // md_children转回string  然后刷新state
        style_config_obj.children = md_children;
        mDashboard.style_config = JSON.stringify(style_config_obj);
        _this.setState({
            mDashboard: mDashboard,
        });
        // 更新ui(主要是搜索框的子项个数)
        _this.refreshDashboard();
    }
    // 右侧搜索框配置关联关系  参数 searchItem 搜索框item的子项id
    changeSearchRelation = (id, searchItem, checkValue) => {
        const { mDashboard } = _this.state;
        const { style_config } = mDashboard;
        const style_config_obj = JSON.parse(style_config);
        const md_children = style_config_obj.children;
        md_children.map((item, index) => {
            if (item.name == id) {
                // relation 关联关系
                const relation = item.relation;
                const relation_item = relation[searchItem]; // relation子项
                const relationFields = relation_item.relationFields;
                const keys = Object.keys(relationFields); // relationFields里的keys(其他图表的id)
                const value_keys = checkValue;// 点击后传过来的keys(图表Id) 因为怕重复所有后面加了searchItem
                // 本地有就删除
                for (let i = 0; i < keys.length; i++) {
                    let flag = false;
                    for (let j = 0; j < value_keys.length; j++) {
                        if (keys[i] == value_keys[j]) {
                            flag = true;
                        }
                    }
                    if (!flag) {
                        delete relationFields[keys[i]];
                    }
                }
                // 本地没有就增加一个
                for (let i = 0; i < value_keys.length; i++) {
                    let flag = false;
                    for (let j = 0; j < keys.length; j++) {
                        if (value_keys[i] == keys[j]) {
                            flag = true;
                        }
                    }
                    if (!flag) {
                        // params relationFields,value_keys[i]:图表id,searchItem:搜索子项id,tableIdColumns数据集,idColumns
                        reportBoardUtils.addSearchChartRelation(relationFields, value_keys[i], searchItem, _this.state.mDashboard, _this.props.model.tableIdColumns, _this.props.model.idColumns, _this.props.model.mCharts);
                    }
                }
            }
        });
        // md_children转回string  然后刷新state
        style_config_obj.children = md_children;
        mDashboard.style_config = JSON.stringify(style_config_obj);
        _this.setState({
            mDashboard: mDashboard,
        });
        // 更新ui(主要是搜索框的子项个数)
        _this.refreshDashboard();
    }
    // 修改搜索框的数据集
    changeSearchDataSetName = (value) => {
        const { mDashboard } = _this.state;
        const { style_config } = mDashboard;
        const style_config_obj = JSON.parse(style_config);
        const md_children = style_config_obj.children;
        md_children.map((item, index) => {
            if (item.type == "search") {
                item.dataSetName = value;
            }
        });
        // md_children转回string  然后刷新state
        style_config_obj.children = md_children;
        mDashboard.style_config = JSON.stringify(style_config_obj);
        _this.setState({
            mDashboard: mDashboard,
        });
        _this.refreshDashboard(); // 刷新页面，mDashboard修改state后页面没有刷新可能是因为它还是用的原来的对象。
    }

    // 修改图表之间的关联关系
    // 参数  id search里面的itemid(rsc_column_config), dimension维度id , value   relation里拼好的  "name":{ label:,relationFields:{"chart_item_name":[value]},props:, }
    changeCheckRelation = (id, dimension, value) => {
        const { mDashboard } = _this.state;
        const { style_config } = mDashboard;
        const style_config_obj = JSON.parse(style_config);
        const md_children = style_config_obj.children;
        let type;// 图表的类型
        md_children.map((item, index) => {
            if (item.chartId == id) {
                // relation 关联关系
                const relation = item.relation;
                const object = relation[dimension];
                let relationFields = object.relationFields;
                type = item.type;
                // 拼接 relationFields 里的关联关系  relationFields ["uuuid,columnid"]
                //const field = `${chart_item_name},${value}`;
                // 拼接 relationFields 里的关联关系  relationFields {"uuuid":"columnid"}
                //relationFields[chart_item_name] = value;
                // 清空relationFields
                relationFields = {};
                // 将value中的值放入relationFields
                value.map((value_item) => {
                    const arr = value_item.toString().split("\:");
                    const value_array = [];
                    value_array.push(value_item.toString());
                    relationFields[arr[0]] = value_array;
                });
                object.relationFields = relationFields;
            }
        });
        // md_children转回string  然后刷新state
        style_config_obj.children = md_children;
        mDashboard.style_config = JSON.stringify(style_config_obj);
        _this.setState({
            mDashboard: mDashboard,
        });
    }




}
export default BoxRight;
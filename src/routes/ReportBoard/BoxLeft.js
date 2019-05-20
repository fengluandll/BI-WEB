
import ReportBoardUtils from '../../utils/reportBoardUtils';
import { ChartList, TabList } from '../../componentsPro/ChartList';

import styles from './index.less';


/***
 * 
 * 编辑模式-左侧
 * 
 * 负责把ReportBoard中的代码抽离到这里,因为主页面实在是写不下啦
 * 
 * @author:wangliu
 * 
 * 
 * ***/

let _this = {}; // 父组件的this对象
const reportBoardUtils = new ReportBoardUtils();

class BoxLeft {

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
                {this.disPlayLeft()}
            </div>
        );
    }

    // 展示 左侧控件列表
    disPlayLeft() {
        const { mDashboard, mCharts, mDashboard_old } = _this.state;
        const { tDashboard } = _this.props.model;
        return (
            <div>
                {/* 左侧头部标题 */}
                <div style={{ height: '39px', position: 'relative', lineHeight: '39px', textAlign: 'center', borderRight: '1px solid #ccc', background: '#eee', overflow: 'hidden' }}>
                    <h1 style={{ color: '#1890ff', fontSize: '16px' }}>编辑模式</h1>
                </div>
                {/* 控件列表 */}
                <div>
                    <ChartList
                        mCharts={mCharts}
                        mDashboard={mDashboard}
                        addOrRemoveChart={this.addOrRemoveChart}
                    />
                </div>
                {/* 页签-customer有权限 */}
                <div>
                    {_this.state.user_type == 'customer' ?
                        <TabList
                            mCharts={mCharts}
                            mDashboard_old={mDashboard_old}
                            tDashboard={tDashboard}
                            updateState={_this.updateState}
                        /> : <div></div>}
                </div>
            </div>
        );
    }

    /*********************************************方法*******************************************************/
    //  左侧配置图表 点击删除或增加图表
    addOrRemoveChart = (operateType, chartId) => {
        const { mDashboard } = _this.state;
        const { style_config } = mDashboard;
        const style_config_obj = JSON.parse(style_config);
        const children = style_config_obj.children;
        const dragactStyle = style_config_obj.dragactStyle;
        if (operateType == "add") {
            // 找到对应的mChart表，并调用增加方法
            const mCharts = _this.state.mCharts;
            mCharts.map((item, index) => {
                if (item.id.toString() == chartId) {
                    this.addNewChart(item);
                }
            });
            //  刷新ui
            _this.refreshDashboard();
        } else {
            //  复选框值比mDashboard中的少 要删除
            for (let i = 0; i < children.length; i++) {
                if (children[i].chartId == chartId) {
                    children.splice(i, 1);//  删除children数组
                }
                // 删除dragact样式
                for (let k = 0; k < dragactStyle.length; k++) {
                    if (dragactStyle[k].key.toString() == chartId) {
                        dragactStyle.splice(k, 1);
                    }
                }
            }
            // md_children转回string  然后刷新state
            style_config_obj.children = children;
            style_config_obj.dragactStyle = dragactStyle;
            mDashboard.style_config = JSON.stringify(style_config_obj);
            _this.setState({
                mDashboard: mDashboard,
            }, () => {
                // 刷新页面
                _this.refreshDashboard();
            });
        }
    }
    // 添加新的图表chart
    addNewChart = (mChart) => {
        const { mDashboard } = _this.state;
        // 新增
        reportBoardUtils.addNewChart(mChart, mDashboard);
        // 加上为搜索框全部Item自动配置和图表的关联 20181101
        reportBoardUtils.addSearchChartRelationAuto(mDashboard, _this.props.model.tableIdColumns, _this.props.model.idColumns, mChart, _this.props.model.mCharts);
        _this.setState({
            mDashboard: mDashboard,
        });
    }


}
export default BoxLeft;
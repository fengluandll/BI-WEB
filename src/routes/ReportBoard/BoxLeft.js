

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
                {/* logo标题start */}
                <div style={{ height: '39px', position: 'relative', lineHeight: '39px', textAlign: 'center', borderRight: '1px solid #ccc', background: '#eee', overflow: 'hidden' }}><h1 style={{ color: '#1890ff', fontSize: '16px' }}>编辑模式</h1></div>
                {/* logo标题end */}
                <div>{/* 控件列表 */}
                    <ChartList
                        mCharts={mCharts}
                        mDashboard={mDashboard}
                        addOrRemoveChart={_this.addOrRemoveChart}
                    />
                </div>
                <div>{/*只有customer才有权限看到*/}
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



}
export default BoxLeft;
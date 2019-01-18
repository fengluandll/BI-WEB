import { connect } from 'dva';
import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import DashBoardUtils from '../../utils/dashboardUtils';
import { Bar, Pie, Line, Table, Pivottable } from '../../componentsPro/Charts';



const dashboardUtils = new DashBoardUtils();
/***
 * BI报表后台编辑界面
 * wangliu 20190116
 * 
 * ***/
class EditBoard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            mChartsList: {}, // 每个t_dashboard的mcharts列表
        };
    }
    componentWillMount() {

    }
    componentDidUpdate() {

    }
    componentWillUnmount() {

    }
    /********************************t_dashboard列表****************************************/


    /************************************mcharts列表****************************************/



    /****************************************UI显示*****************************************/


    /***************************************编辑模块****************************************/
    /***
     * 展示编辑模块
     * 根据图表不同的类型,展示不同的图表html
     * ***/
    getEditContent = () => {
        const type = "";
        if (type == "bar") {

        } else if (type == "line") {

        } else if (type == "text") {

        }
    }



    /***
     * 展示内容
     * 
     * ***/
    renderContent = () => {
        return (
            <div>
                <div>
                    {/***左侧所有的t_dashboard列表***/}
                </div>
                <div>
                    {/***左侧第二排的mcharts列表***/}
                </div>
                <div>
                    {/***每个mcharts的编辑界面***/}
                    <div>
                        {/***显示图表***/}
                    </div>
                    <div>
                        {/***显示图表的编辑配置***/}
                    </div>
                </div>
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
export default connect(state => ({
    model: state.editBoard,
}))(EditBoard);

import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import styles from './index.less';

import { Drawer, message, Tabs, Button, Spin, Modal, Radio, Icon } from 'antd';

/***
 * 
 * 报表展示主入口UI
 * 
 * 负责把ReportBoard中的UI展示部分抽离到这个类中,纯粹是因为写不下了,才写这里。。
 * 
 * @author:wangliu
 * 
 * 
 * ***/
class ReportBoardUI {


    /***
     * 
     * 悬停按钮
     * 要求：如果是大屏 显示悬停按钮;其他: 正常显示--根据权限和编辑模式显示
     * 
     * props:父this
     * 
     * ***/
    getMenue = (props) => {
        const { bigScreen } = props.state;
        if (bigScreen) {
            return this.menueBigScreen(props);
        } else {
            return this.menuePc(props);
        }
    }
    // 大屏模式-悬停按钮
    menueBigScreen = (props) => {
        return (
            <div className={styles['editMenue-bigScreen']} onMouseEnter={this.onMouseEnterShow.bind(this)} onMouseLeave={this.onMouseLeaveHide.bind(this)} >
                <Icon onClick={props.changeBigScreen} type="fullscreen" style={{}} />
            </div>
        );
    }
    // pc模式-普通按钮
    menuePc = (props) => {
        if (props.state.editModel == "true") { // 编辑模式
            return (
                <div className={styles['editMenue-edit']} >
                    <Icon onClick={props.changeEditeMode} type="unlock" />
                </div>
            );
        } else { // 展示模式
            return (
                <div>
                    {props.state.user_auth == "1" ?
                        <div className={styles["editMenue-editModel-false"]} >
                            {<Icon onClick={props.changeEditeMode} style={{ marginRight: '5px', marginLeft: "5px" }} type="lock" />}
                            {<i className={styles['col-line2']}></i>}
                            {<Icon onClick={props.changeBigScreen} type="fullscreen" className={styles['bigScreen-change']} />}
                            {<i className={styles['col-line1']}></i>}
                            {<Icon onClick={props.onPrint} type="printer" className={styles['print']} />}
                        </div>
                        :
                        <div className={styles['editMenue-edit']} >
                            {<Icon onClick={props.onPrint} type="printer" />}
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



    /***
     * 
     * 右侧编辑
     * 
     * ***/
    getEditBoxRight = (props) => {
        return (
            <div>
                {
                    props.state.editModel == "true" ? <div className={styles['boardRight']} ref={(instance) => { props.right = instance; }} >
                        {/* 切换按钮start */}
                        <div>
                            <div>
                                <Radio.Group defaultValue="drag" buttonStyle="solid" checked={props.state.dragMoveChecked} onChange={props.changeDragMoveChecked}>
                                    <Radio.Button value="drag" >拖拽</Radio.Button>
                                    <Radio.Button value="relation">关联</Radio.Button>
                                </Radio.Group>
                            </div>
                        </div>
                        {/* 切换按钮end */}
                        <div style={{ border: '1px solid #ccc' }}>
                            <div ref={(instance) => { props.rightRelation = instance; }}></div>
                        </div>
                    </div> : <div></div>
                }
            </div>
        );
    }

}
export default ReportBoardUI;
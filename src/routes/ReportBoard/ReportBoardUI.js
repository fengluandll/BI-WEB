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
     * render函数
     * 
     * ***/
    getRender = (props) => {

    }

    /***
     * 
     * 悬停按钮
     * 
     * props:父this
     * 
     * ***/
    getMenue = (props) => {
        return (
            <div>
                {props.state.user_auth == "1" ?
                    <div className={styles[props.state.editModel == "true" ? "editMenue-editModel-true" : "editMenue-editModel-false"]} >
                        {props.state.editModel == "true" ? <Icon onClick={props.changeEditeMode} type="unlock" /> : <Icon onClick={props.changeEditeMode} style={{ marginRight: '5px', marginLeft: (props.state.editModel == "true") ? "0" : "5px" }} type="lock" />}
                        {<i className={styles['col-line2']}></i>}
                        {props.state.editModel == "true" ? <Icon onClick={props.changeBigScreen} type="fullscreen" className={styles['bigScreen-change']} /> : <Icon onClick={props.changeBigScreen} type="fullscreen" className={styles['bigScreen-change']} />}
                        {props.state.editModel == "true" ? '' : <i className={styles['col-line1']}></i>}
                        {props.state.editModel == "true" ? '' : <Icon onClick={props.onPrint} type="printer" className={styles['print']} />}
                    </div>
                    :
                    <div style={{ marginRight: (props.state.editModel == "true") ? "200px" : "0", width: 40, height: 40, opacity: '1', border: '2px solid #ccc', borderLeft: '1px solid #ccc', borderBottom: '1px solid #ccc', borderTop: '1px solid #ccc', background: '#eee', color: '#000', position: 'absolute', top: 0, right: '-5px', zIndex: 1000, fontSize: 22, textAlign: 'center', cursor: 'pointer' }} >
                        {props.state.editModel == "true" ? '' : <Icon onClick={props.onPrint} type="printer" />}
                    </div>}
            </div>
        );
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
import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Form, Input, Button, Modal, Select, Switch, Checkbox, Row, Col } from 'antd';

/***
 * tabs组件
 * 页签组件
 * --
 * ***/
class TabsUI extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    componentWillReceiveProps(nextProps) {
        // 用户类别，当前dashbaord对象,t_dashboard,保存方法
        const { user_type, mDashboard_old, tDashboard, onSave } = nextProps;
    }

    /*************************************************************/


    /*******************************************************************/

    render() {
        return (
            <div>

            </div>
        );
    }
}

export default TabsUI;

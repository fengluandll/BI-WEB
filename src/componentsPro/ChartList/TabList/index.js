import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Collapse, Checkbox, Modal, message } from 'antd';
import styles from './index.less';
import ReportBoardUtils from '../../../utils/reportBoardUtils';

const Panel = Collapse.Panel;
const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;
const reportBoardUtils = new ReportBoardUtils();

//  仪表板 左侧的  图表列表 组件
export default class Index extends PureComponent {

    componentDidMount() {
    }

    // 拉取选中同步
    pullTdashboardTab = (name, item) => {
        const fatherThis = this;
        confirm({
            title: '',
            content: `是否拉取原始 ${name} `,
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                fatherThis.pullSynchronization(item);
                message.success('保存成功');
            },
            onCancel() {
            },
        });
    }

    // 将 t_dashboard中的同步到m_dashboard中
    pullSynchronization = (key) => {
        const { mDashboard_old, tDashboard, mCharts } = this.props;
        const style_config = JSON.parse(tDashboard.style_config);
        const tabValue = style_config.children[key]; // 选中的t_dashboard中的tab值
        const style_config_old = JSON.parse(mDashboard_old.style_config);
        style_config_old.children[key] = tabValue;
        mDashboard_old.style_config = JSON.stringify(style_config_old);
        this.props.updateState({ mDashboard_old });
    }

    // 拉取所有的
    pullTdashboardAll = () => {
        const fatherThis = this;
        confirm({
            title: '',
            content: '是否拉取全部',
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                fatherThis.pullSynchronizationAll();
                message.success('保存成功');
            },
            onCancel() {
            },
        });
    }

    // 拉取同步所有
    pullSynchronizationAll = () => {
        const { mDashboard_old, tDashboard, mCharts } = this.props;
        const style_config = JSON.parse(tDashboard.style_config);
        mDashboard_old.style_config = JSON.stringify(style_config);
        this.props.updateState({ mDashboard_old });
    }

    renderChart() {
        const { tDashboard, mCharts } = this.props;
        const style_config = JSON.parse(tDashboard.style_config);
        const children = style_config.children;
        const keys = Object.keys(children); // 所有的tab的key(uuuid)
        return (
            <div>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={<div><span>标准页签</span></div>} key="1">
                        {keys.map((item, index) => {
                            const name = children[item].name;
                            const order = children[item].order;
                            return (
                                <div key={index} onClick={this.pullTdashboardTab.bind(this, name, item)}>
                                    {`${name}${order}`}
                                </div>
                            );
                        })}
                        <div onClick={this.pullTdashboardAll.bind(this)}>全部拉取</div>
                    </Panel>
                </Collapse>
            </div>
        );
    }
    render() {
        return (
            <div>
                {this.renderChart()}
            </div>
        )
    }
}

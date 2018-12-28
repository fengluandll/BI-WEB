import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Collapse, Checkbox } from 'antd';
import styles from './index.less';
import ReportBoardUtils from '../../../utils/reportBoardUtils';

const Panel = Collapse.Panel;
const CheckboxGroup = Checkbox.Group;
const reportBoardUtils = new ReportBoardUtils();

//  仪表板 左侧的  图表列表 组件
export default class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            chartIdArrayLine: [],// 选中的列表
        };
    }

    componentDidMount() {
    }

    handleFieldContent = (n) => {
        this['fieldContent'] = n;
    };

    toogle = (ev) => {
        const target = ev.target;
        if (ev.target.className === 'anticon anticon-down') {
            target.className = 'anticon anticon-up';
            this['fieldContent'].style.display = 'block';
        } else {
            target.className = 'anticon anticon-down';
            this['fieldContent'].style.display = 'none';
        }
    };

    renderChart() {
        return (
            <div>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={<div><span>标准页签</span></div>} key="1">
                        <div className="search-config-selection">

                        </div>
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

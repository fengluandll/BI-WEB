import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { List, Avatar } from 'antd';
import NewCharts from '../NewCharts';

class MchartsList extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }
    componentDidUpdate() {
    }

    // 点击事件
    onChange = (id) => {
        const { mChartsList, mchart_id, onChange } = this.props;
        onChange(id);
    }

    // 拼接数据
    getData = () => {
        const { mChartsList, mchart_id, onChange } = this.props;
        const data = [];
        for (let key in mChartsList) {
            const mCharts = mChartsList[key];
            const obj = { "name": mCharts.name, "id": mCharts.id, "type": mCharts.mc_type, "description": mCharts.config };
            data.push(obj);
        }
        return data;
    }



    render() {
        const data = this.getData();
        return (
            <div>
                <NewCharts />
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title={<div onClick={this.onChange.bind(this, item.id)}>{item.name}-类型-{item.type}</div>}
                                description={item.name}
                            />
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}

export default MchartsList;

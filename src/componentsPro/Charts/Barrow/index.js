
import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import G2 from '@antv/g2';
import ChartHelper from '../base';

import styles from '../index.less';

const chartHelper = new ChartHelper();

/***
 * 
 * @title:环形图
 * 
 * @author:wangliu
 * 
 * 
 * ***/
class Barrow extends PureComponent {

    componentDidMount() {
        this.renderChart();
    }

    componentDidUpdate() {
        this.renderChart();
    }

    renderChart = () => {
        const { dragactStyle, editModel, mChart, dateSetList, onPlotClick } = this.props;
        // clean
        this.node.innerHTML = '';
        // 读取配置
        const height = chartHelper.getHeight(dragactStyle, mChart, editModel);
        const config = JSON.parse(mChart.config);
        const text = config.dashboard_text;
        // 图表创建
        var chart = new G2.Chart({
            container: this.node,
            forceFit: true,
            height: height,
            padding: [20, 40, 50, 124],
        });
        // 填充数据
        chart.source(dateSetList, {
            y: {
                // max: 300,
                // min: 0,
                nice: false,
                alias: text,
            }
        });
        chart.axis('x', {
            label: {
                textStyle: {
                    fill: '#8d8d8d',
                    fontSize: 12
                }
            },
            tickLine: {
                alignWithLabel: false,
                length: 0
            },
            line: {
                lineWidth: 0
            }
        });
        chart.axis('y', {
            label: null,
            title: {
                offset: 30,
                textStyle: {
                    fontSize: 12,
                    fontWeight: 300
                }
            }
        });
        chart.legend(false);
        chart.coord().transpose();
        chart.interval().position('x*y').size(26).opacity(1).label('y', {
            textStyle: {
                fill: '#8d8d8d'
            },
            offset: 10
        });
        chart.render();

        // plot点击事件
        chart.on('plotclick', (ev) => {
            const dimension = config.dimension;
            this.props.onPlotClick(ev.data, dimension, mChart.id);
        });
    }

    render() {
        const { mChart } = this.props;
        const { name } = JSON.parse(mChart.config);
        let constCss = "chart-content";
        return (
            <div>
                <div className={styles['chart-titleBorder']}>
                    <div className={styles['chart-title']}>{name ? name : ""}</div>
                </div>
                <div className={styles[constCss]} ref={(instance) => { this.node = instance }} />
            </div>
        );
    }

}
export default Barrow;
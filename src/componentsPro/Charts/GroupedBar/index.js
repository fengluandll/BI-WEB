
import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import G2 from '@antv/g2';
import ChartHelper from '../base';

import styles from '../index.less';

const chartHelper = new ChartHelper();

/***
 * 
 * @title:分组条形图
 * 
 * @author:wangliu
 * 
 * 
 * ***/
class GroupedBar extends PureComponent {
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

        var data = [{
            company: 'Apple',
            type: '整体',
            value: 30
        }, {
            company: 'Facebook',
            type: '整体',
            value: 35
        }, {
            company: 'Google',
            type: '整体',
            value: 28
        }, {
            company: 'Apple',
            type: '非技术岗',
            value: 40
        }, {
            company: 'Facebook',
            type: '非技术岗',
            value: 65
        }, {
            company: 'Google',
            type: '非技术岗',
            value: 47
        }, {
            company: 'Apple',
            type: '技术岗',
            value: 23
        }, {
            company: 'Facebook',
            type: '技术岗',
            value: 18
        }, {
            company: 'Google',
            type: '技术岗',
            value: 20
        }, {
            company: 'Apple',
            type: '技术岗',
            value: 35
        }, {
            company: 'Facebook',
            type: '技术岗',
            value: 30
        }, {
            company: 'Google',
            type: '技术岗',
            value: 25
        }];

        var chart = new G2.Chart({
            container: this.node,
            forceFit: true,
            height: height,
            padding: 'auto'
        });
        chart.source(data);
        chart.scale('value', {
            alias: '占比（%）',
            max: 75,
            min: 0,
            tickCount: 4
        });
        chart.axis('type', {
            label: {
                textStyle: {
                    fill: '#aaaaaa'
                }
            },
            tickLine: {
                alignWithLabel: false,
                length: 0
            }
        });

        chart.axis('value', {
            label: {
                textStyle: {
                    fill: '#aaaaaa'
                }
            },
            title: {
                offset: 50
            }
        });
        chart.legend({
            position: 'top-center'
        });
        chart.interval().position('type*value').color('company').opacity(1).adjust([{
            type: 'dodge',
            marginRatio: 1 / 32
        }]);
        chart.render();
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
export default GroupedBar;
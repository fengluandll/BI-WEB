
import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import G2 from '@antv/g2';

import styles from '../index.less';

/***
 * 
 * @title:环形图
 * 
 * @author:wangliu
 * 
 * 
 * ***/
class Circular extends PureComponent {

    componentDidMount() {
        this.renderChart();
    }

    componentDidUpdate() {
        this.renderChart();
    }

    renderChart = () => {
        // clean
        this.node.innerHTML = '';
        var data = [{
            item: '事例一',
            count: 40,
            percent: 0.4
        }, {
            item: '事例二',
            count: 21,
            percent: 0.21
        }, {
            item: '事例三',
            count: 17,
            percent: 0.17
        }, {
            item: '事例四',
            count: 13,
            percent: 0.13
        }, {
            item: '事例五',
            count: 9,
            percent: 0.09
        }];
        var chart = new G2.Chart({
            container: this.node,
            forceFit: true,
            height: 300,
            animate: false
        });
        chart.source(data, {
            percent: {
                formatter: function formatter(val) {
                    val = val * 100 + '%';
                    return val;
                }
            }
        });
        chart.coord('theta', {
            radius: 0.75,
            innerRadius: 0.6
        });
        chart.tooltip({
            showTitle: false,
            itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        });
        // 辅助文本
        chart.guide().html({
            position: ['50%', '50%'],
            html: '<div style="color:#8c8c8c;font-size: 14px;text-align: center;width: 10em;">主机<br><span style="color:#8c8c8c;font-size:20px">200</span>台</div>',
            alignX: 'middle',
            alignY: 'middle'
        });
        var interval = chart.intervalStack().position('percent').color('item').label('percent', {
            formatter: function formatter(val, item) {
                return item.point.item + ': ' + val;
            }
        }).tooltip('item*percent', function (item, percent) {
            percent = percent * 100 + '%';
            return {
                name: item,
                value: percent
            };
        }).style({
            lineWidth: 1,
            stroke: '#fff'
        });
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
export default Circular;
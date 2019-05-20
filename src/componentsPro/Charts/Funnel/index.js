
import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import G2 from '@antv/g2';
import ChartHelper from '../base';

import styles from '../index.less';

const chartHelper = new ChartHelper();

/***
 * 
 * @title:漏斗图
 * 
 * @author:wangliu
 * 
 * 
 * ***/
class Funnel extends PureComponent {

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

        var _DataSet = DataSet,
            DataView = _DataSet.DataView;

        var data = [{
            action: '浏览网站',
            pv: 50000
        }, {
            action: '放入购物车',
            pv: 35000
        }, {
            action: '生成订单',
            pv: 25000
        }, {
            action: '支付订单',
            pv: 15000
        }, {
            action: '完成交易',
            pv: 8000
        }];
        var dv = new DataView().source(data);
        dv.transform({
            type: 'map',
            callback: function callback(row) {
                row.percent = row.pv / 50000;
                return row;
            }
        });
        data = dv.rows;
        var chart = new G2.Chart({
            container: this.node,
            forceFit: true,
            height: height,
            padding: [20, 120, 95],
        });
        chart.source(data, {
            percent: {
                nice: false
            }
        });
        chart.axis(false);
        chart.tooltip({
            showTitle: false,
            itemTpl: '<li data-index={index} style="margin-bottom:4px;">' + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' + '{name}<br/>' + '<span style="padding-left: 16px">浏览人数：{pv}</span><br/>' + '<span style="padding-left: 16px">占比：{percent}</span><br/>' + '</li>'
        });
        chart.coord('rect').transpose().scale(1, -1);
        chart.intervalSymmetric().position('action*percent').shape('funnel').color('action', ['#0050B3', '#1890FF', '#40A9FF', '#69C0FF', '#BAE7FF']).label('action*pv', function (action, pv) {
            return action + ' ' + pv;
        }, {
                offset: 35,
                labelLine: {
                    lineWidth: 1,
                    stroke: 'rgba(0, 0, 0, 0.15)'
                }
            }).tooltip('action*pv*percent', function (action, pv, percent) {
                return {
                    name: action,
                    percent: parseInt(percent * 100) + '%',
                    pv: pv
                };
            });
        data.forEach(function (obj) {
            // 中间标签文本
            chart.guide().text({
                top: true,
                position: {
                    action: obj.action,
                    percent: 'median'
                },
                content: parseInt(obj.percent * 100) + '%', // 显示的文本内容
                style: {
                    fill: '#fff',
                    fontSize: '12',
                    textAlign: 'center',
                    shadowBlur: 2,
                    shadowColor: 'rgba(0, 0, 0, .45)'
                }
            });
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
export default Funnel;
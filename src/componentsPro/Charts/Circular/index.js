
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
class Circular extends PureComponent {

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
        // 计算数值
        let total = 0;
        for (let item of dateSetList) {
            total = total + parseInt(item.y);
        }
        // 图表创建
        var chart = new G2.Chart({
            container: this.node, // 挂载节点
            forceFit: true, // 宽度自适应
            height: height, // 高度
            padding: 'auto', // 边距
            animate: false, // 动画
            background: { // 背景
                fillOpacit: 0, // 图表背景透明度
                opacity: 0, // 图表整体透明度
            },
            pixelRatio: window.devicePixelRatio, // 设备像素比
            //theme: 'dark', // 主题
        });
        // 填充数据
        chart.source(dateSetList, {
            y: {
                formatter: function formatter(val) {
                    //val = val * 100 + '%';
                    return val;
                }
            }
        });
        // 坐标系转换
        chart.coord('theta', {
            radius: 0.75,
            innerRadius: 0.6
        });
        // 弹出提示
        chart.tooltip({
            showTitle: false,
            itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        });
        // 辅助文本
        chart.guide().html({
            position: ['50%', '50%'],
            html: `<div style="color:#8c8c8c;font-size: 14px;text-align: center;width: 10em;">合计<br><span style="color:#8c8c8c;font-size:20px">${total}</span></div>`,
            alignX: 'middle',
            alignY: 'middle'
        });
        // 创建柱图
        chart.intervalStack().position('y').color('x').label('y', {
            formatter: function formatter(val, item) {
                return item.point.x + ': ' + val;
            }
        }).tooltip('x*y', function (x, y) {
            //y = y * 100 + '%';
            return {
                name: x,
                value: y
            };
        }).style({
            lineWidth: 1,
            stroke: '#fff'
        });
        // chart.intervalStack().position('y').color('x', ['#0a7aca', '#0a9afe', '#4cb9ff', '#8ed1ff']).opacity(1).label('y', {
        //     offset: -18,
        //     textStyle: {
        //       fill: 'white',
        //       fontSize: 12,
        //       shadowBlur: 2,
        //       shadowColor: 'rgba(0, 0, 0, .45)'
        //     },
        //     rotate: 0,
        //     autoRotate: false,
        //     formatter: function formatter(text, item) {
        //       return String(parseInt(item.point.y * 100)) + '%';
        //     }
        //   });

        // 渲染图表 - 最后一步
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
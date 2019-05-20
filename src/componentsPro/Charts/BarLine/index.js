
import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import G2 from '@antv/g2';
import ChartHelper from '../base';

import styles from '../index.less';

const chartHelper = new ChartHelper();

/***
 * 
 * @title:柱线图
 * 
 * @author:wangliu
 * 
 * 
 * ***/
class BarLine extends PureComponent {

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
            time: '10:10',
            call: 4,
            waiting: 2,
            people: 2
        }, {
            time: '10:15',
            call: 2,
            waiting: 6,
            people: 3
        }, {
            time: '10:20',
            call: 13,
            waiting: 2,
            people: 5
        }, {
            time: '10:25',
            call: 9,
            waiting: 9,
            people: 1
        }, {
            time: '10:30',
            call: 5,
            waiting: 2,
            people: 3
        }, {
            time: '10:35',
            call: 8,
            waiting: 2,
            people: 1
        }, {
            time: '10:40',
            call: 13,
            waiting: 1,
            people: 2
        }];

        var chart = new G2.Chart({
            container: this.node,
            forceFit: true,
            height: height,
        });
        chart.source(data, {
            call: {
                min: 0
            },
            people: {
                min: 0
            },
            waiting: {
                min: 0
            }
        });
        chart.legend({
            custom: true,
            allowAllCanceled: true,
            items: [{
                value: 'waiting',
                marker: {
                    symbol: 'square',
                    fill: '#3182bd',
                    radius: 5
                }
            }, {
                value: 'people',
                marker: {
                    symbol: 'hyphen',
                    stroke: '#fdae6b',
                    radius: 5,
                    lineWidth: 3
                }
            }],
            onClick: function onClick(ev) {
                var item = ev.item;
                var value = item.value;
                var checked = item.checked;
                var geoms = chart.getAllGeoms();
                for (var i = 0; i < geoms.length; i++) {
                    var geom = geoms[i];
                    if (geom.getYScale().field === value) {
                        if (checked) {
                            geom.show();
                        }
                    } else {
                        geom.hide();
                    }
                }
            }
        });
        chart.axis('people', {
            grid: null,
            label: {
                textStyle: {
                    fill: '#fdae6b'
                }
            }
        });
        chart.interval().position('time*waiting').color('#3182bd');
        chart.line().position('time*people').color('#fdae6b').size(3).shape('smooth');
        chart.point().position('time*people').color('#fdae6b').size(3).shape('circle');
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
export default BarLine;
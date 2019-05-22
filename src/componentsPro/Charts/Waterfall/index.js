
import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import G2 from '@antv/g2';
import ChartHelper from '../base';

import styles from '../index.less';

const chartHelper = new ChartHelper();

/***
 * 
 * @title:瀑布图
 * 
 * @author:wangliu
 * 
 * 
 * ***/
class Waterfall extends PureComponent {

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
        // 计算数据
        let total = 0;
        for (let item of dateSetList) {
            total = total + parseInt(item.y);
        }
        dateSetList.push({ x: '合计', y: total });

        var _G = G2,
            Util = _G.Util,
            Shape = _G.Shape,
            Global = _G.Global;


        function getRectPath(points) {
            var path = [];
            for (var i = 0; i < points.length; i++) {
                var point = points[i];
                if (point) {
                    var action = i === 0 ? 'M' : 'L';
                    path.push([action, point.x, point.y]);
                }
            }
            var first = points[0];
            path.push(['L', first.x, first.y]);
            path.push(['z']);
            return path;
        }

        function getFillAttrs(cfg) {
            var defaultAttrs = Global.shape.interval;
            var attrs = Util.mix({}, defaultAttrs, cfg.style, {
                fill: cfg.color,
                stroke: cfg.color,
                fillOpacity: cfg.opacity
            });
            return attrs;
        }

        Shape.registerShape('interval', 'waterfall', {
            draw: function draw(cfg, container) {
                var attrs = getFillAttrs(cfg);
                var rectPath = getRectPath(cfg.points);
                rectPath = this.parsePath(rectPath);
                var interval = container.addShape('path', {
                    attrs: Util.mix(attrs, {
                        path: rectPath
                    })
                });

                if (cfg.nextPoints) {
                    var linkPath = [['M', cfg.points[2].x, cfg.points[2].y], ['L', cfg.nextPoints[0].x, cfg.nextPoints[0].y]];

                    if (cfg.nextPoints[0].y === 0) {
                        linkPath[1] = ['L', cfg.nextPoints[1].x, cfg.nextPoints[1].y];
                    }
                    linkPath = this.parsePath(linkPath);
                    container.addShape('path', {
                        attrs: {
                            path: linkPath,
                            stroke: '#8c8c8c',
                            lineDash: [4, 2]
                        }
                    });
                }

                return interval;
            }
        });

        for (var i = 0; i < dateSetList.length; i++) {
            var item = dateSetList[i];
            if (i > 0 && i < dateSetList.length - 1) {
                if (Util.isArray(dateSetList[i - 1].y)) {
                    item.y = [dateSetList[i - 1].y[1], item.y + dateSetList[i - 1].y[1]];
                } else {
                    item.y = [dateSetList[i - 1].y, item.y + dateSetList[i - 1].y];
                }
            }
        }

        var chart = new G2.Chart({
            container: this.node,
            forceFit: true,
            height: height,
        });
        chart.source(dateSetList);
        // 自定义图例
        chart.legend({
            custom: true,
            clickable: false,
            items: [{
                value: '各项',
                marker: {
                    symbol: 'square',
                    fill: '#1890FF',
                    radius: 5
                }
            }, {
                value: '合计',
                marker: {
                    symbol: 'square',
                    fill: '#8c8c8c',
                    radius: 5
                }
            }]
        });
        chart.interval().position('x*y').color('x', function (x) {
            if (x === '合计') {
                return '#8c8c8c';
            }
            return '#1890FF';
        }).tooltip('x*y', function (x, y) {
            if (Util.isArray(y)) {
                return {
                    name: '显示',
                    value: y[1] - y[0]
                };
            }

            return {
                name: '显示',
                value: y
            };
        }).shape('waterfall');

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
export default Waterfall;
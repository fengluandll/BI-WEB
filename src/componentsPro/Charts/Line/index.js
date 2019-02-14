import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import G2 from '@antv/g2';
import { compare } from '../../../utils/equal';
import ChartHelper from '../base';

import styles from '../index.less';

const chartHelper = new ChartHelper();
class Line extends PureComponent {
  componentDidMount() {
    this.renderChart();
  }
  componentDidUpdate() {
    this.renderChart();
  }

  handleRef = (n) => {
    this.node = n;
  };
  renderEmpty = () => {
    return (<div className={styles.empty}><span>数据返回为空</span></div>);
  };

  renderChart() {
    const { mChart, dateSetList } = this.props;
    const config = JSON.parse(mChart.config);

    if (null == mChart || dateSetList == null || dateSetList.length == 0) {
      ReactDom.render(this.renderEmpty(), this.node);
      return;
    }
    // clean
    this.node.innerHTML = '';

    // -------------------图表配置--------------------------------
    let width = 600;
    if (config.width) {
      width = config.width;
    }
    let height = 300;
    if (config.height) {
      height = config.height;
    }
    // 控制图形高度
    if (null != this.props.dragactStyle && this.props.dragactStyle.length > 0) {
      const array = this.props.dragactStyle;
      array.map((item, index) => {
        if (item.key == mChart.id.toString()) {
          if (this.props.editModel == "true") {
            height = item.h * 40 - 50;
          } else {
            height = item.h * 40 - 50;
          }
        }
      });
    }
    // 自适应宽度
    let forceFit = false;
    if (config.forceFit == "1") {
      forceFit = true;
    }
    // 边距
    let padding = [32, 32, 100, 50];
    if (config.padding) {
      padding = config.padding;
    }

    // init
    const chart = new G2.Chart({
      container: this.node, // 指定图表容器 ID
      forceFit: forceFit, //  自适应宽度
      width: width, // 指定图表宽度
      height: height, // 指定图表高度
      padding: padding,
    });


    // 转换数据和 填充数据到 view
    const { dv, x, y, color } = chartHelper.initDataSet(dateSetList, mChart);


    const scaleConfig = {};

    chart.source(dv, scaleConfig);

    // 控制线状图样式
    const line = chart.line().position(`${x}*${y}`);
    const point = chart.point().position(`${x}*${y}`).size(3)
      .shape('circle')
      .style({
        stroke: '#fff',
        lineWidth: 1,
      });
    if (dateSetList[0] && dateSetList[0].color) {
      line.color(color);
      point.color(color);
    }

    chart.render();

    // plot点击事件
    chart.on('plotclick', (ev) => {
      const dimension = config.dimension;
      this.props.onPlotClick(ev.data, dimension, mChart.id);
    });

    this.chart = chart;
  }
  render() {
    const mChart = this.props.mChart;
    const config = JSON.parse(mChart.config);
    return (
      <div>
        <div className={styles['chart-titleBorder']}>
          <div className={styles['chart-title']}>{mChart.name ? mChart.name : ""}</div>
        </div>
        <div ref={this.handleRef} />
      </div>
    )
  }
}

export default Line;

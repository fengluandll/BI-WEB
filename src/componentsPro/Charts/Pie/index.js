import React, { Component } from 'react';
import ReactDom from 'react-dom';
import G2 from '@antv/g2';
import { compare } from '../../../utils/equal';
import ChartHelper from '../base';
import MathUtils from '../../../utils/MathUtils';

import styles from '../index.less';

const chartHelper = new ChartHelper();
class Pie extends Component {
  componentDidMount() {
    this.renderChart();
  }
  componentDidUpdate() {
    this.renderChart();
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  handleRef = (n) => {
    this.node = n;
  };
  renderEmpty = () => {
    return (<div className={styles.empty}><span>数据返回为空</span></div>);
  };

  renderChart(props) {
    const mChart = this.props.mChart;
    const config = JSON.parse(mChart.config);
    const dateSetList = this.props.dateSetList;

    if (null == mChart || dateSetList == null) {
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
    if (null != this.props.dragactStyle && this.props.dragactStyle.length > 0) {
      const array = this.props.dragactStyle;
      array.map((item, index) => {
        if (item.key == mChart.id.toString()) {
          if (this.props.editModel == "true") {
            height = item.h * 40 - 40;
          } else {
            height = item.h * 40 - 30;
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
    let padding = [10, '35%', 0, 0];
    if (config.padding) {
      padding = config.padding;
    }

    const chart = new G2.Chart({
      container: this.node, // 指定图表容器 ID
      forceFit: forceFit, //  自适应宽度
      width: width, // 指定图表宽度
      height: height, // 指定图表高度
      padding: padding,
    });

    // 转换数据和 填充数据到 view
    const { dv, x } = chartHelper.initDataSet(dateSetList, mChart, ChartHelper.PIE);


    chart.legend(false);
    chart.tooltip(false);
    chart.axis(false);

    chart.source(dv, {
      percent: {
        formatter: (val) => {
          const v = MathUtils.toDecimal(val * 100);
          return `${v}%`;
        },
      },
    });

    chart.coord('theta', {
      radius: 0.75,
    });

    chart.legend({
      position: 'right', // 设置图例的显示位置
      itemGap: 0 // 图例项之间的间距
    });

    chart.tooltip({
      showTitle: false,
      itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>',
    });
    chart.intervalStack()
      .position('percent')
      .color(x);
    // .label('percent', {
    //   formatter: (val, item) => {
    //     return `${item.point[x]}:${val}`;
    //   },
    // });

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
        <div className={styles['chart-title']}>{mChart.name ? mChart.name : ""}</div>
        <div ref={this.handleRef} />
      </div>
    )
  }
}

export default Pie;

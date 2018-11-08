import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import G2 from '@antv/g2';
import { compare } from '../../../utils/equal';
import ChartHelper from '../base';

import styles from '../index.less';

const chartHelper = new ChartHelper();
class Line extends PureComponent {
  state = {
    autoHideXLabels: false,
  };

  componentDidMount() {
    this.renderChart(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const title = nextProps.styleConfigs.title;
    this.title.innerHTML = title.visible ? title.name : '';
    const a = !compare(this.props.data, nextProps.data);
    const b = !compare(this.props.styleConfigs, nextProps.styleConfigs);
    const width = this.node.clientWidth;
    // 标题项的变化不触发图表重新渲染
    if (compare(this.props.styleConfigs.title, nextProps.styleConfigs.title) && (a || b)) {
      this.renderChart(nextProps);
    } else if (this.chart && (this.chart['_attrs'].width < width && width !== 0)) {
      this.chart.changeWidth(width);
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  handleRef = (n) => {
    this.node = n;
  };
  handleTitle = (n) => {
    this.title = n;
  };
  renderEmpty = () => {
    return (<div className={styles.empty}><span>数据返回为空</span></div>);
  };
  renderChart(props) {
    const {
      fit = true,
      padding = [32, 32, 100, 50],
    } = props;
    const { styleConfigs, data, config } = props;
    if (!data || (data && data.length < 1)) {
      ReactDom.render(this.renderEmpty(), this.node);
      return;
    }
    // clean
    this.node.innerHTML = '';

    const chart = new G2.Chart({
      container: this.node,
      forceFit: fit,
      height: styleConfigs.height - 22,
      padding,
    });
    const { dv, x, y, color } = chartHelper.initDataSet(data, config);
    const { stack, percent } = styleConfigs;
    const scaleConfig = {};
    if (stack && percent) {
      // 百分比堆积转换
      scaleConfig['percent'] = {
        formatter: (value) => {
          value = (value || 0) * 100;
          return `${value.toFixed(1)}%`;
        },
        min: 0,
        max: 1,
      };
    }
    chart.source(dv, scaleConfig);
    const legend = styleConfigs.legend.visible ? chartHelper.legend(chart, color) : false;
    const tooltip = styleConfigs.tooltip.visible ? chartHelper.tooltip() : false;
    chart.legend(legend);
    chart.tooltip({
      ...{
        crosshairs: {
          type: 'line',
        },
      },
      tooltip,
    });
    if (stack && percent) {
      // 堆叠区域点图
      chart.areaStack().position(`${x}*percent`).color(color);
      const line = chart.lineStack().position(`${x}*percent`);
      const point = chart.point().position(`${x}*percent`).size(3).adjust('stack')
        .shape('circle')
        .style({
          stroke: '#fff',
          lineWidth: 1,
        });
      if (data[0].color) {
        line.color(color);
        point.color(color);
      }
    } else if (stack) {
      // 堆叠百分比区域点图
      chart.areaStack().position(`${x}*${y}`).color(color);
      const line = chart.lineStack().position(`${x}*${y}`);
      const point = chart.point().position(`${x}*${y}`).size(3).adjust('stack')
        .shape('circle')
        .style({
          stroke: '#fff',
          lineWidth: 1,
        });
      if (data[0].color) {
        line.color(color);
        point.color(color);
      }
    } else {
      const line = chart.line().position(`${x}*${y}`);
      const point = chart.point().position(`${x}*${y}`).size(3)
        .shape('circle')
        .style({
          stroke: '#fff',
          lineWidth: 1,
        });
      if (data[0].color) {
        line.color(color);
        point.color(color);
      }
    }

    chart.render();

    chart.on('plotclick', (ev) => {
      config.onPlotClick(ev, config);
    });
    this.chart = chart;
  }
  render() {
    const { height, title } = this.props.config.styleConfigs;
    return (
      <div style={{ height }}>
        <div className="full-height">
          <div className={styles['chart-title']} ref={this.handleTitle}>{ title.visible ? title.name : '' }</div>
          <div className={styles['chart-content']} ref={this.handleRef} />
        </div>
      </div>
    );
  }
}

export default Line;

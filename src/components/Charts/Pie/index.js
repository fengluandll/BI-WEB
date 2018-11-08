import React, { Component } from 'react';
import ReactDom from 'react-dom';
import G2 from '@antv/g2';
import { compare } from '../../../utils/equal';
import ChartHelper from '../base';
import MathUtils from '../../../utils/MathUtils';

import styles from '../index.less';

const chartHelper = new ChartHelper();
class Pie extends Component {
  state = {
    legendData: [],
    legendBlock: true,
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
      padding = [ 10, '35%', 0, 0],
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
    const { dv, x } = chartHelper.initDataSet(data, config, ChartHelper.PIE);

    const legend = styleConfigs.legend.visible ? chartHelper.legend(chart, x) : false;
    const tooltip = styleConfigs.tooltip.visible ? chartHelper.tooltip() : false;
    chart.legend(legend);
    chart.tooltip(tooltip);
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

export default Pie;

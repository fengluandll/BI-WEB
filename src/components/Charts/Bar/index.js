import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import G2 from '@antv/g2';
import { compare } from '../../../utils/equal';
import ChartHelper from '../base';

import styles from '../index.less';

const chartHelper = new ChartHelper();
class Bar extends PureComponent {
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
    let {
      fit = true,
      padding = ['10%', 30, '25%', 40],
    } = props;
    const { styleConfigs, data } = props;
    if (!styleConfigs.legend.visible) {
      padding = ['10%', 30, '25%', 150];
    }

    if (!data || (data && data.length < 1)) {
      ReactDom.render(this.renderEmpty(), this.node);
      return;
    }
    // clean
    this.node.innerHTML = '';
    // add by wangliu width
    let chartWidth = 0;
    let dataLength = data.length;
    let chartFit = fit;
    if (dataLength > 30) {
      chartFit = false;
      chartWidth = dataLength * 55.6521;
      if (chartWidth > 32000) {
        chartWidth = 32000;
      }
    }
    // init
    const chart = new G2.Chart({
      container: this.node,
      forceFit: chartFit,
      height: styleConfigs.height - 22,
      padding,
      width: chartWidth,
    });
    const { stack, percent } = styleConfigs;
    const { dv, x, y, color } = chartHelper.initDataSetBar(data, this.props.config);
    const scaleConfig = {};
    scaleConfig[`${x}`] = {
      type: 'cat', // 声明字段为分类类型
    };
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
    // init geom
    if (stack && percent) {
      // 百分比堆积
      chart.intervalStack().position(`${x}*percent`).color(color);
    } else if (stack) {
      // 堆积
      chart.intervalStack().position(`${x}*${y}`).color(color);
    } else {
      console.log();
      if (data[0].color) {
        chart.interval().position(`${x}*${y}`).color(color).adjust([{
          type: 'dodge',
          marginRatio: 0,
        }])
          .select(true, {
            mode: 'single',
            style: { fill: '#0000CD' },
            cancelable: true,
          })
          .label(`${y}`, {
            offset: 10
          });
      } else {
        chart.interval().position(`${x}*${y}`)
          .select(true, {
            mode: 'single',
            style: { fill: '#0000CD' },
            cancelable: true,
          })
          .label(`${y}`, {
            offset: 10
          });
      }
    }
    // init legend
    // const legend = styleConfigs.legend.visible ? chartHelper.legend(chart, color) : false;
    // init tooltip
    // const tooltip = styleConfigs.tooltip.visible ? chartHelper.tooltip() : false;
    //chart.legend(legend);
    //chart.tooltip(tooltip);
    if (!styleConfigs.legend.visible) {
      chart.legend({
        position: 'left', // 设置图例的显示位置
        itemGap: 20 // 图例项之间的间距
      });
    }else{
      chart.legend(false);
    }

    //add by wangliu 0820
    //chart.legend(false); // 隐藏全部图例
    chart.tooltip(false); // 关闭 tooltip
    /*for (let tmp = 0; tmp < data.length; tmp++) {
      let contentNum = data[tmp].y;
      let contentNumCount = contentNum.toString().length;
      let offSetX = 0;
      if (contentNumCount == 1) {
        offSetX = -3;
      } else if (contentNumCount == 2) {
        offSetX = -6;
      } else if (contentNumCount == 3) {
        offSetX = -9;
      } else if (contentNumCount == 4) {
        offSetX = -12;
      }
      // 暂时删掉 辅助
      chart.guide().text({
        top: true,
        style: {
          fill: '#1C86EE', // 文本颜色
          fontSize: '12', // 文本大小
          fontWeight: 'bold' // 文本粗细
        },
        content: data[tmp].y,
        position: [data[tmp].x, data[tmp].y + 2],
        offsetX: offSetX,
      });
    } */
    chart.axis(`${x}`, {
      label: {
        offset: 4, // 设置坐标轴文本 label 距离坐标轴线的距离
        textStyle: {
          textAlign: 'start', // 文本对齐方向，可取值为： start middle end
          fill: '#404040', // 文本的颜色
          fontSize: '12', // 文本大小
          //fontWeight: 'bold', // 文本粗细
          rotate: 20,
          textBaseline: 'top' // 文本基准线，可取 top middle bottom，默认为middle
        },
        autoRotate: true, // 是否需要自动旋转，默认为 true
      }
    });


    chart.render();
    chart.on('plotclick', (ev) => {
      this.props.config.onPlotClick(ev, this.props.config);
    });
    this.chart = chart;
  }
  render() {
    const { height, title } = this.props.styleConfigs;
    return (
      <div style={{ height }}>
        <div className="full-height">
          <div className={styles['chart-title']} ref={this.handleTitle}>{title.visible ? title.name : ''}</div>
          <div className={styles['chart-content']} ref={this.handleRef} />
        </div>
      </div>
    );
  }
}

export default Bar;

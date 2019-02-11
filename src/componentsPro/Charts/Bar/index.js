import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import G2 from '@antv/g2';
import { compare } from '../../../utils/equal';
import ChartHelper from '../base';

import styles from '../index.less';

const chartHelper = new ChartHelper();
class Bar extends PureComponent {

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

  renderChart1() {
    // example
    const data = [
      { genre: 'Sports', sold: 275 },
      { genre: 'Strategy', sold: 115 },
      { genre: 'Action', sold: 120 },
      { genre: 'Shooter', sold: 350 },
      { genre: 'Other', sold: 150 }
    ]; // G2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。

    // Step 1: 创建 Chart 对象
    const chart = new G2.Chart({
      container: this.node, // 指定图表容器 ID
      width: 600, // 指定图表宽度
      height: 300 // 指定图表高度
    });
    // Step 2: 载入数据源
    chart.source(data);
    // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
    chart.interval().position('genre*sold').color('genre')
    // Step 4: 渲染图表
    chart.render();
    this.chart = chart;
  }

  renderChart() {
    const mChart = this.props.mChart;
    const config = JSON.parse(mChart.config);
    const dateSetList = this.props.dateSetList;

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
    let padding = ['10%', 30, '25%', 50];
    if (config.padding) {
      padding = config.padding;
    }
    if (config.legend == "1") {
      padding = ['10%', 30, '25%', 150];
    }

    // 控制数据量特别大的情况
    let chartWidth = 0;
    let dataLength = dateSetList.length;
    if (dataLength > 5) {
      chartFit = false;
      chartWidth = dataLength * 55.6521;
      height = height - 4;
      if (chartWidth > 32000) {
        chartWidth = 32000;
      }
    }
    let chartFit = forceFit; // 自适应最后设置起作用 modify by wangliu 20190125

    // init
    const chart = new G2.Chart({
      container: this.node, // 指定图表容器 ID
      forceFit: chartFit, //  自适应宽度
      width: chartWidth, // 指定图表宽度
      height: height, // 指定图表高度
      padding: padding,
    });

    // 转换数据和 填充数据到 view
    const { dv, x, y, color } = chartHelper.initDataSetBar(dateSetList, mChart);

    //字段分类类型
    const scaleConfig = {};
    scaleConfig[`${x}`] = {
      type: 'cat', // 声明字段为分类类型
    };
    // 填充 view
    chart.source(dv, scaleConfig);

    // x,y轴
    if (dateSetList[0] && dateSetList[0].color) {
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

    /*图例*/
    if (config.legend == "1") {
      chart.legend({
        position: 'left', // 设置图例的显示位置
        itemGap: 20 // 图例项之间的间距
      });
    } else {
      chart.legend(false); // 隐藏全部图例
    }

    chart.tooltip(true, {
      crosshairs: ['true'],
      showTitle: false,
      containerTpl: '<div class="g2-tooltip">'
        + '<p class="g2-tooltip-title"></p>'
        + '<table class="g2-tooltip-list"></table>'
        + '</div>', // tooltip的外层模板
      itemTpl: '<tr class="g2-tooltip-list-item"><td style="color:{color}">{name}</td><td>{value}</td></tr>', // 支持的字段 index,color,name,value
      offset: 50,
      'g2-tooltip': {
        position: 'absolute',
        visibility: 'hidden',
        border: '1px solid #efefef',
        backgroundColor: 'white',
        color: '#000',
        opacity: '0',
        padding: '5px 15px',
        'transition': 'top 200ms,left 200ms'
      }, // 设置 tooltip 的 css 样式
      'g2-tooltip-list': {
        margin: '10px'
      }
    }); // 关闭 tooltip

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

    // 展现 render
    chart.render();
    // plot点击事件
    chart.on('plotclick', (ev) => {
      const dimension = config.dimension;
      // 用于点图的构建
      let point = {
        // 画布坐标，返回一个数组
        x: ev.x,
        y: ev.y
      }
      const origin1 = chart.getSnapRecords(point);
      let _origin = null;
      let size = chart.getTooltipItems(point)[0].size / 2;
      let index;
      for (let i = 0; i < origin1.length; i++) {
        if ((ev.x > 0 && ev.x < origin1[i].x - size) || (ev.x > origin1[i].x - size && ev.x < origin1[i].x + size) || (i == origin1.length - 1 && ev.x > origin1[i].x - size)) {
          index = i;
          break;
        }
      }
      _origin = origin1[index]._origin;
      // getTooltipItems,根据传入的坐标点point，获取当前坐标点上的tooltip信息
      // 获取当前坐标点上tooltip信息,
      const data = origin1[index];
      // 获取图表中标记对象,返回一个数组
      let shapes = chart.getAllGeoms()[0].getShapes();
      for (let i = 0, len = shapes.length; i < len; i++) {
        var shape = shapes[i];
        var origin = shape.get('origin')['_origin'];
        if (_origin.维度 == origin.维度 && _origin.度量 == origin.度量 && _origin.图例 == origin.图例) {
          chart.getAllGeoms()[0].setShapeSelected(shape);
        }
      }

      this.props.onPlotClick(data, dimension, mChart.id);
    });

    // chart 变量赋值
    this.chart = chart;

  }

  render() {
    const mChart = this.props.mChart;
    const config = JSON.parse(mChart.config);
    const scrollX = config.scrollX; // 根据后端配置是否出现滚动条 切换css x有滚动条高度减滚动条高度
    let constCss = "chart-content";
    // if(scrollX == "1"){
    //   constCss = "barScroll-content";
    // }
    return (
      <div>
        <div className={styles['chart-titleBorder']}>
          <div className={styles['chart-title']}>{mChart.name ? mChart.name : ""}</div>
        </div>
        <div className={styles[constCss]} ref={this.handleRef} />
      </div>
    )
  }
}

export default Bar;

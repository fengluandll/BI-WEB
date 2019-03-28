import DataSet from '@antv/data-set';
import G2 from '@antv/g2';
import ObjectUtils from '../../utils/objectUtils';

const { Util } = G2;
class ChartHelper {
  /**
   * 初始化数据集-bar
   * @param data 图表数据柱状图
   * @returns {*}
   */
  initDataSetBar = (data, mCharts, chartType) => {
    const ds = new DataSet();
    const dv = ds.createView();
    dv.rows = ObjectUtils.quickDeepClone(data);
    //this.initTransform(dv, mCharts, chartType);
    //this.fill(dv, data, mCharts);
    const config = JSON.parse(mCharts.config);
    const { order, dimension, measure } = config;
    const x = mCharts.config.dimension ? mCharts.config.dimension : '维度';
    const y = mCharts.config.measure ? mCharts.config.measure : '度量';
    const color = mCharts.config.color ? mCharts.config.color : '图例';
    // 按字段排序 modify by wangliu 20190328 将默认排序改为 后台控制 按 X 或者 Y 排序
    if (null == order || order == "Y") {
      dv.transform({
        type: 'sort-by',
        fields: ['y'], // 根据指定的字段集进行排序，与lodash的sortBy行为一致
        order: 'DESC',        // 默认为 ASC，DESC 则为逆序
      });
    } else { // 按x轴正序排列
      dv.transform({
        type: 'sort-by',
        fields: ['x'],
        order: 'ASC',
      });
    }

    dv.transform({    // addby wangliu 20181116永远按图例排序
      type: 'sort-by',
      fields: ['color'],
      order: 'ASC',
    });
    // 字段重命名
    dv.transform({
      type: 'rename',
      map: {
        x,
        y,
        color,
      },
    });
    return { dv, x, y, color };
  }


  /**
   * 初始化数据集
   * @param data 图表数据
   * @returns {*}
   */
  initDataSet = (data, mCharts, chartType) => {
    const ds = new DataSet();
    const dv = ds.createView();
    dv.rows = ObjectUtils.quickDeepClone(data);
    this.initTransform(dv, mCharts, chartType);
    this.fill(dv, data, mCharts);
    const x = mCharts.config.dimension ? mCharts.config.dimension : '维度';
    const y = mCharts.config.measure ? mCharts.config.measure : '度量';
    const color = mCharts.config.color ? mCharts.config.color : '图例';
    // 按字段排序
    dv.transform({
      type: 'sort-by',
      fields: ['x'], // 根据指定的字段集进行排序，与lodash的sortBy行为一致
      order: 'ASC',        // 默认为 ASC，DESC 则为逆序
    });
    // 字段重命名
    dv.transform({
      type: 'rename',
      map: {
        x,
        y,
        color,
      },
    });
    return { dv, x, y, color };
  };
  fill = (dv, data, config) => {
    if (data[0] == null || data[0].color == null) {
      // 如果图例为空则无需补全
      return;
    }
    /* 补全行 */
    dv.transform({
      type: 'fill-rows',
      groupBy: ['color'],
      orderBy: ['x'],
      fillBy: 'group',
    });
    dv.transform({
      type: 'fill-rows',
      groupBy: ['x'],
      orderBy: ['color'],
      fillBy: 'group',
    });
    /* 补全值 */
    let field = 'y';
    if (config.stack && config.percent) {
      field = 'percent';
    }
    dv.transform({
      type: 'impute',
      field,       // 待补全字段
      groupBy: ['x', 'color'], // 分组字段集（传空则不分组）
      method: 'value',  // 补全常量
      value: 0,         // 补全的常量为10
    });
  };
  /**
   * 初始化数据转换
   * @param dv 图表数据视图
   * @param isPercent 是否需要做百分比转换
   */
  initTransform = (dv, config, chartType) => {
    if (chartType === ChartHelper.PIE) {
      dv.transform({
        type: 'percent',
        field: 'y',
        dimension: 'x',
        as: 'percent',
      });
    } else if (config.stack && config.percent) {
      // 百分比堆积时需要做百分比数据转换
      dv.transform({
        type: 'percent',
        field: 'y',
        dimension: 'color',
        groupBy: ['x'],
        as: 'percent',
      });
    }
    // 数据加工，给null/undefined数值重置为NULL字符串
    dv.transform({
      type: 'map',
      callback(row) {
        if (!row.x) {
          row.x = 'NULL';
        }
        if (!row.color) {
          row.color = 'NULL';
        }
        return row;
      },
    });
  };
  legend = (chart, legend) => {
    const legendFilterVals = [];
    return {
      title: null, // 不展示图例的标题
      position: 'bottom',
      layout: 'horizontal',    // 排列方式vertical、horizontal，分别表示垂直和水平排布
      useHtml: true, // 针对分类类型图例，用于开启是否使用Html渲染图例
      textStyle: {
        textAlign: 'center', // 文本对齐方向，可取值为： start middle end
        fill: '#404040', // 文本的颜色
        fontSize: '13', // 文本大小
        fontWeight: 'normal', // 文本粗细
        rotate: 30, // 文本旋转角度，以角度为单位，仅当 autoRotate 为 false 时生效
        textBaseline: 'top', // 文本基准线，可取 top middle bottom，默认为middle
      },
      offsetY: -20,
      containerTpl: '<div class="g2-legend" style="max-height:60px;">' +
        '<table class="g2-legend-list" style="list-style-type:none;margin:0;padding:0;"></table>' +
        '</div>',
      itemTpl: (value, color, checked, index) => {
        checked = checked ? 'checked' : 'unChecked';
        return `<li class="g2-legend-list-item item-${index} ${checked}" data-value="${value}" data-color="${color}" style="cursor: pointer;font-size: 14px;">
          <i class="g2-legend-marker" style="width:10px;height:10px;display:inline-block;margin-right:10px;background-color:${color};"></i>
          <span class="g2-legend-text" style="font-size:13px;">${value}</span>
      </li>`;
      },
      marker: 'square', // 设置图例 marker 的显示样式
      onClick: (ev) => {
        const clickedValue = ev.item.value;
        if (ev.checked) {
          Util.Array.remove(legendFilterVals, clickedValue);
        } else {
          legendFilterVals.push(clickedValue);
        }
        chart.filter(`${legend}`, (val) => {
          return !Util.inArray(legendFilterVals, val);
        });
        chart.repaint();
      },
    };
  };
  tooltip = () => {
    return {
      enterable: true,
      containerTpl: '<div class="g2-tooltip" style="max-height:250px;">'
        + '<div class="g2-tooltip-title" style="margin-bottom: 4px;"></div>'
        + '<div style="max-height:210px;overflow:auto;">'
        + '<ul class="g2-tooltip-list"></ul>'
        + '</div>'
        + '</div>',
      itemTpl: '<li data-index={index}>'
        + '<span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>'
        + '{name}: {value}'
        + '</li>',
    };
  };
}
ChartHelper.PIE = 'pie';
export default ChartHelper;

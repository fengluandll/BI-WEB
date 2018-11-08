import objectUtils from './objectUtils';

/** 组件配置对象 */
const component = {
  /** 容器/元素 名称,元素标识 */
  name: '',
  /** 组别：例如chart(图表组件)-design(布局) */
  group: 'chart',
  /** 组件类型,例如根容器-root,Tab-tab,柱状图-bar,饼图-pie */
  type: '',
  /** 当前对应的数据集 */
  ds: {},
  /** 子集容器/元素 */
  children: [],
  /** 渲染属性 */
  props: {},
  /** 组件渲染 */
  render: () => { /* return ReactNode; */ },
  /** 排序索引 */
  sortIndex: 0,
  /** 当前激活tab面板的key */
  activeKey: '',
  /** 数据配置 */
  dataConfig: {
    visible: false,
    dimension: [], // 维度
    measure: [], // 度量
    legend: [],  // 图例
  },
  /** 样式配置项，根据不同的组件会有不同的配置项 */
  styleConfigs: {
    height: 300,
    margintop: 0,
    width: 100,
    marginleft: 0,
    visible: false,
    head: true,  // addby wangliu  0831 用来控制是否显示整个头部(目前用于table)
    title: {
      name: '测试',
      visible: true,
    },
    legend: {
      name: '',
      visible: true,
      position: 'top',  // top bottom left right
    },
    tooltip: {
      visible: true,
      enterable: true,
    },
    horizontal: false, // 横向
    stack: false,  // 堆积
    percent: false, // 百分比堆积
    axisTitle: false, // 轴标题
    yAxis: true, // Y轴
    xAxis: true, // x轴
    // table-style-config
    fixed: {
      enable: false,
      fixedColumnsLeft: 0,
    },
    rowHeaders: true, // 默认显示交叉表序号
    orderBy: 1,
  },
  /** 数据关联配置 */
  relation: {
    /* 图表关联使用 */
    // filedId: {
    //   relationFields: {
    // name:关联控件的name,relationField:关联的字段
    //     name: 'relationField',
    //   },
    // },
    /* 查询控件关联使用 */
    // filedId: {
    //   label: '', // 查询项标签名称，默认为数据集的rscDisplay
    // 查询项属性,根本类型的不同属性也不同，详见对应数据筛选控件
    //   props: {
    //     rule: {},  // 规则定义
    //     type: 0, // 控件类型，供字符筛选控件和日期筛选控件使用
    //     val: null, // 控件值,数组
    //   },
    //   relationFields: {
    //     // name:关联控件的name,relationField:关联的字段
    //     name: 'relationField',
    //   },
    // },
  },
  /** 图表plot点击事件 */
  onPlotClick: (ev) => {
    if (ev.data) {
      console.log(ev.data['_origin']);
    }
  },
};
// 示范数据
const demoData = {
  bar: [],
  pie: [],
  getTab: () => {
    return [{
      title: 'Tab1',
      type: 'tab_panel',
      name: objectUtils.generateUUID(),
      children: [],
    }, {
      title: 'Tab2',
      type: 'tab_panel',
      name: objectUtils.generateUUID(),
      children: [],
    }];
  },
  table: [],
};
demoData.table = {
  header: ['Tesla', 'Nissan', 'Toyota', 'Honda', 'Mazda', 'Ford'],
  body: [
    [10, 11, 12, 13, 15, 16],
    [10, 11, 12, 13, 15, 16],
    [10, 11, 12, 13, 15, 16],
    [10, 11, 12, 13, 15, 16],
    [10, 11, 12, 13, 15, 16],
  ],
};
demoData.bar = [{ x: '1951 年', y: 38 },
{ x: '1952 年', y: 52 },
{ x: '1956 年', y: 61 },
{ x: '1957 年', y: 145 },
{ x: '1958 年', y: 48 },
{ x: '1959 年', y: 38 },
{ x: '1960 年', y: 38 },
{ x: '1962 年', y: 38 }];
demoData.pie = [
  { x: '事例一', y: 40 },
  { x: '事例二', y: 21 },
  { x: '事例三', y: 17 },
  { x: '事例四', y: 13 },
  { x: '事例五', y: 9 },
];
demoData.line = [
  { x: '1991', y: 3 },
  { x: '1992', y: 4 },
  { x: '1993', y: 3.5 },
  { x: '1994', y: 5 },
  { x: '1995', y: 4.9 },
  { x: '1996', y: 6 },
  { x: '1997', y: 7 },
  { x: '1998', y: 9 },
  { x: '1999', y: 13 },
];
class DashBoardUtils {
  getComponent = (type, onPlotClick) => {
    const comp = objectUtils.deepClone(component);
    const name = objectUtils.generateUUID();
    switch (type) {
      case 'pie': {
        comp.styleConfigs.percent = true;
        comp.styleConfigs.title.name = '饼图';
        const rest = {
          ...comp,
          ...{
            type,
            name,
            onPlotClick,
          },
        };
        return rest;
      }
      case 'bar':
        comp.styleConfigs.title.name = '柱状图';
        return {
          ...comp,
          ...{
            type,
            name,
            onPlotClick,
          },
        };
      case 'line':
        comp.styleConfigs.title.name = '折线图';
        return {
          ...comp,
          ...{
            type,
            name,
            onPlotClick,
          },
        };
      case 'table':
        comp.styleConfigs.title.name = '交叉表';
        comp.styleConfigs.height = 300;  // tab默认高度300
        return {
          ...comp,
          ...{
            type,
            name,
          },
        };
      case 'tab':
        comp.styleConfigs.title.name = '标签页';
        comp.styleConfigs.height = 1000;  // tab默认高度1000
        comp.group = 'design';
        return {
          ...comp,
          ...{
            type,
            name,
          },
        };
      case 'search':
        comp.group = 'design';
        return {
          ...comp,
          ...{
            type,
            name,
          },
        };
      default:
        return comp;
    }
  };
  delByName = (o, name) => {
    if (!o || o.children.length === 0) {
      return;
    }
    const index = o.children.findIndex(item => item.name === name);
    if (index >= 0) {
      o.children.splice(index, 1);
    } else {
      o.children.map(item => this.delByName(item, name));
    }
  };
  /**
   * 根据Name查找容器
   * 根容器一定存在
   * 判断children是否为null,为null需要创建
   * @param o
   * @param val
   */
  findByName = (o, val) => {
    if (!o) {
      return;
    }
    const hasChildren = !!o.children;
    if (o.name === val) {
      if (!hasChildren) {
        Object.defineProperty(o, 'children', {
          value: [],
        });
      }
      return o;
    }
    if (hasChildren) {
      for (const child of o.children) {
        const rest = this.findByName(child, val);
        if (rest) {
          return rest;
        }
      }
    }
  };
  /**
   * 根据tab-panel面板Name查找对应的父容器tab
   * @param o
   * @param val
   * @returns {*}
   */
  findTabByPanel = (o, val) => {
    if (!o) {
      return;
    }
    const hasChildren = !!o.children;
    // 判断类型是否是tab
    if (o.type === 'tab') {
      const panel = o.children.find((ele) => {
        return ele.name === val;
      });
      if (panel) {
        return o;
      }
    }
    if (hasChildren) {
      for (const child of o.children) {
        const rest = this.findTabByPanel(child, val);
        if (rest) {
          return rest;
        }
      }
    }
  };
  /**
   * 查找图表控件
   * @param o 源
   * @param arr 接收查找结果的数据
   * @param name 在查找结果中需要排除的控件name
   * @param types 指定查找的类型，example: ['line', 'bar', 'pie']
   */
  findChart = (o, arr, name) => {
    if (o.group === 'chart') {
      if (o.name !== name) {
        arr.push(o);
      }
    } else {
      const hasChildren = !!o.children;
      if (hasChildren) {
        for (const child of o.children) {
          this.findChart(child, arr, name);
        }
      }
    }
  };

  /**
   * add by wangliu 0907  
   * 查找同一个父容器下图表控件
   * @param o 源
   * @param arr 接收查找结果的数据
   * @param name 在查找结果中需要排除的控件
   * @param types 指定查找的类型，example: ['line', 'bar', 'pie']
   */
  findTagCharts = (o, arr, pass) => {
    if (o.group === 'chart') {
      if (o.name !== pass.name && o.containerName === pass.containerName) {
        arr.push(o);
      }
    } else {
      const hasChildren = !!o.children;
      if (hasChildren) {
        for (const child of o.children) {
          this.findTagCharts(child, arr, pass);
        }
      }
    }
  }

  // 判断 有没有 containerName wangliu
  findChartsJudge = (o, ret) => {
    if (o.group === 'chart' && null == o.containerName) {
      ret.push(1);
    } else {
      const hasChildren = !!o.children;
      if (hasChildren) {
        for (const child of o.children) {
          this.findChartsJudge(child, ret);
        }
      }
    }
  }

  // 为了 兼容之前的 做判断  wangliu
  findChartsChange = (o, arr, pass) => {
    let ret = [];
    this.findChartsJudge(o, ret);
    if (ret.length != 0) {
      this.findChart(o, arr, pass.name);
    } else {
      this.findTagCharts(o, arr, pass);
    }
  }

  /**
   * 根据类型查找控件
   * @param o 源
   * @param arr 接受查找结果的数据
   * @param types 指定需要查找的类型
   * @param name 需要排除在外的控件name
   */
  findByType = (o, arr, types = [], name) => {
    if (types.indexOf(o.type) >= 0) {
      if (o.name !== name) {
        arr.push(o);
      }
    } else {
      const hasChildren = !!o.children;
      if (hasChildren) {
        for (const child of o.children) {
          this.findByType(child, arr, types, name);
        }
      }
    }
  };
  /**
   * 获取控件中已配置的数据集ID
   * @param o
   * @param arr
   */
  fillAllDsId = (o, arr) => {
    const hasChildren = !!o.children;
    if (o.ds && o.ds.id && arr.indexOf(o.ds.id) < 0) {
      arr.push(o.ds.id);
    }
    if (hasChildren) {
      for (const child of o.children) {
        this.fillAllDsId(child, arr);
      }
    }
  }
}
DashBoardUtils.demoData = demoData;
export default DashBoardUtils;

import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import classNames from 'classnames';
import SearchDate from '../Search-Date';
import SearchNumber from '../Search-Number';
import SearchCharacter from '../Search-Character';
import { Icon, Input } from 'antd';

import styles from './index.less';

/**
 * 仪表板-查询控件
 */
export default class Index extends PureComponent {
  constructor(props) {
    super(props);
    const { relation, mChart, styleConfig, searchEnum, tagName } = this.props;
    let tagName_key; // 获取当前页签的id
    for (let key in tagName) {
      tagName_key = key;
    }
    this.state = {
      relation,
      mChart,
      styleConfig,
      searchEnum,
    };
    this.clickTime = 1; // 点击次数
    this.pages = 0;  // 搜索框页数  1为一页
    this.tagName_key = tagName_key; // 当前tab的id
  }
  componentDidMount = () => {
    this.renderItem();

  };
  componentWillReceiveProps(nextProps) {
    const { relation, mChart, styleConfig, searchEnum } = nextProps;
    this.state = {
      relation,
      mChart,
      styleConfig,
      searchEnum,
    };
  }
  componentDidUpdate() {
    this.renderItem();
  }

  // 输入值 改变变量内容
  onChange = (key, val) => {
    // 找到 mdashboard 中搜索框的 item  给props赋值
    const { relation, changeProps, chart_item } = this.props;
    relation[key].props = val || null;
    // val 的值 是  ["3"]
    chart_item.relation = relation;
    changeProps(chart_item);
  };

  // 搜索框点击事件 点击搜索
  onClick = (value) => {
    const { chart_item } = this.props;
    const fatherName = chart_item.fatherName;
    this.props.clickSearch();
  };
  // 变换搜索框里查询的 子项
  changeSearch = () => {
    this.clickTime++;
    this.renderItem();
  }

  // 组织树
  onSearchProClick = () => {
    this.props.changeSearchPro();
  }

  //  render searchitem
  renderItem = () => {
    // mdashBoard 中的 relation、styleConfig  mChart表
    const { relation, mChart, styleConfig, searchEnum } = this.state;
    const { tagName, onLoad } = this.props;
    const mChart_config = JSON.parse(mChart.config);
    // 取出 mchart 中的 搜索 searchJson
    const searchJson = mChart_config.searchJson;
    const keys = Object.keys(relation);
    // js数组排序
    for (let i = 0; i < keys.length - 1; i++) {
      for (let j = 0; j < keys.length - i - 1; j++) {
        if (relation[keys[j]].order > relation[keys[j + 1]].order) {
          let tmp = keys[j + 1];
          keys[j + 1] = keys[j];
          keys[j] = tmp;
        }
      }
    }
    const len = keys.length;
    const arr = [];
    for (let j = 0; j < len; j += 1) {
      const key = keys[j];
      const rela = relation[key];
      arr.push({
        key,
        rela,
      });
    }

    // add by wangliu 0911  搜索内容翻页 这个是让搜索栏翻页的逻辑  从老系统中copy过来的 add by wangliu 20190111
    let cnt = 5;  // 一行显示个数
    // 通过深入 Document 内部对 body 进行检测，获取窗口大小
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
      let winWidth = document.documentElement.clientWidth - 100; // 照顾编辑界面 去掉左右的 宽度
      cnt = parseInt(winWidth / 160);
    }
    let c = this.clickTime;  //点击次数
    let n = arr.length;   //  数组长度
    let times = Math.ceil(n / cnt); // 翻页的页码数
    let t = c % times;  // 点击次数取余
    let arrTmp = [];
    if (n <= cnt) {    // 只有一页的情况
      for (let i = 0; i < n; i++) {
        arrTmp.push(arr[i]);
      }
      this.pages = 1;  // 搜索框只有一页
    } else {
      if (t != 0) {    // 点击在半中间的页数
        for (let i = cnt * t - cnt; i < cnt * t; i++) {
          arrTmp.push(arr[i]);
        }
      } else if (t == 0) {    //  点击在最后一页
        let last = n - cnt * (times - 1);
        for (let i = n - last; i < n; i++) {
          arrTmp.push(arr[i]);
        }
      }
    }

    //  mdashboard中放的是 搜索的关联关系和值    mchart中放的是搜索的样式  所以调用搜索子项的时候 两个参数都要传 
    //  参数  
    let tagName_key;
    for (let key in tagName) {
      tagName_key = key;
    }
    if (tagName_key != this.tagName_key) { // 判断如果是切换页签,那就把所有的搜索框清空,等到再次刷新的时候再展示
      ReactDom.render(<div></div>, this.queryArea);
      this.tagName_key = tagName_key;
    } else {
      ReactDom.render(
        <div>
          <div className={styles['query-area-item']} key={-1} >
            <div className={styles['query-area-item-label']}>
              组织:
                </div>
            <div>
              <div className={styles['query-field']}>
                <Input onClick={this.onSearchProClick.bind(this)} style={{ width: '110px' }} />
              </div>
            </div>
          </div>
        </div>,
        this.searchPro); // 组织树
      ReactDom.render(<div>
        {
          arrTmp.map((arrItem, index) => {
            const { key } = arrItem;
            const rela = relation[key];
            const relaJson = searchJson[key];
            const { type, name } = relaJson;

            let child = null;
            if (type == "11" || type == "12") {// num
              child = <SearchNumber rela={rela} relaJson={relaJson} onChange={this.onChange.bind(this, key)} />;
            } else if (type == "2" || type == "3" || type == "4" || type == "21") { // str
              // 拼接数据 data
              const data = [];
              if (null != searchEnum[key]) {
                for (let i = 0; i < searchEnum[key].length; i++) {
                  data.push({
                    id: `${i}`,
                    name: searchEnum[key][i],
                  });
                }
              }
              const { chart_item } = this.props;// 取出搜索框控件的chartId
              child = (
                <SearchCharacter
                  rela={rela} relaJson={relaJson}
                  onChange={this.onChange.bind(this, key)}
                  load={() => {
                    onLoad(key, chart_item.chartId);
                  }}
                  data={data}
                />);
            } else if (type == "1") {// 日期
              child = <SearchDate rela={rela} relaJson={relaJson} onChange={this.onChange.bind(this, key)} />;
            }

            return (
              <div className={styles['query-area-item']} key={index} >
                <div className={styles['query-area-item-label']}>
                  {name}:
                </div>
                <div>
                  {child}
                </div>
              </div>
            );
          })
        }
      </div>, this.queryArea);
    }
  }
  /***
   * 展示下一页的按钮
   * ***/
  renderNextPage = () => {
    if (this.pages == "0") {
      return (
        <div style={{ marginRight: 50 }}>
          <Icon type="caret-right"
            onClick={
              () => {
                this.changeSearch();
              }
            }
          />
        </div>
      );
    } else if (this.pages == "1") {
      return (
        <div></div>
      );
    }
  }


  render() {
    let height = 60;
    const mChart = this.props.mChart;
    if (this.props.dragactStyle.length > 0) {
      const array = this.props.dragactStyle;
      array.map((item, index) => {
        if (item.key == mChart.id.toString()) {
          if (this.props.editModel == "true") {
            height = item.h * 40 - 18;
          } else {
            height = item.h * 40 - 18;
          }
        }
      });
    }
    return (
      <div className={styles['query-container']} name="search" style={{ height: height }}>
        <div style={{ width: '120px' }} ref={(instance) => { this.searchPro = instance; }} />
        <div className={styles['query-area-container']} ref={(instance) => { this.queryArea = instance; }} />
        {this.renderNextPage()}
        <div className={styles['query-btn']}>
          <Icon type="search" style={{ fontSize: 16, color: '#08c' }}
            onClick={() => {
              this.onClick();
            }}
          />
        </div>
      </div>
    );
  }
}

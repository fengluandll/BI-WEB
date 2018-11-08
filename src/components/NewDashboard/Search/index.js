import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import classNames from 'classnames';
import { Button } from 'antd';
import SearchDate from '../Search-Date';
import SearchNumber from '../Search-Number';
import SearchCharacter from '../Search-Character';
import { Icon } from 'antd';

import styles from './index.less';

/**
 * 仪表板-查询控件
 */
let clickTime = 1; // 点击次数
let pages = 0;  // 搜索框页数  1为一页
export default class Index extends PureComponent {
  // add by wangliu  0911 用来做搜索框的点击 翻页查询控件
  constructor(props) {
    super(props);
    this.state = {
      clickprops: {},
    };
  }
  componentDidMount = () => {
    this.renderItem(this.props);
    // 初始化的时候将 props 赋值给 state保存
    this.setState({
      clickprops: this.props,
    });
  };
  componentWillReceiveProps(nextProps) {
    this.renderItem(nextProps);
    // 初始化的时候将 props 赋值给 state保存
    this.setState({
      clickprops: nextProps,
    });
  }
  onChange = (key, val) => {
    const { config } = this.props;
    config.relation[key].props.val = val || null;
  };
  onClick = (comp, column) => {
    this.props.onClick(comp, column);
  };
  deleteItem = (key) => {
    const { config, onDeleteItem } = this.props;
    const { relation } = config;
    delete relation[key];
    onDeleteItem();
  };
  // 变换搜索框里查询的 子项
  changeSearch = () => {
    clickTime++;
    this.renderItem(this.state.clickprops);
  }
  renderItem = (props) => {
    const { config, onLoad, searchEnum, dsColumnMap, isReport } = props;
    const { relation } = config;
    const keys = Object.keys(relation);
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
    // arr.sort((a, b) => {
    //   return a.rela.sortIndex >= b.rela.sortIndex;
    // });
    //addby wangliu 0822 冒泡排序
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j].rela.sortIndex > arr[j + 1].rela.sortIndex) {
          let tmpArr = arr[j + 1];
          arr[j + 1] = arr[j];
          arr[j] = tmpArr;
        }
      }
    }
    // add by wangliu 0911  搜索内容翻页
    let cnt = 5;  // 一行显示个数
    // 通过深入 Document 内部对 body 进行检测，获取窗口大小
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
      let winWidth = document.documentElement.clientWidth - 100; // 照顾编辑界面 去掉左右的 宽度
      cnt = parseInt(winWidth / 160);
    }
    let c = clickTime;  //点击次数
    let n = arr.length;   //  数组长度
    let times = Math.ceil(n / cnt); // 翻页的页码数
    let t = c % times;  // 点击次数取余
    let arrTmp = [];
    if (n <= cnt) {    // 只有一页的情况
      for (let i = 0; i < n; i++) {
        arrTmp.push(arr[i]);
      }
      pages = 1;  // 搜索框只有一页
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

    const dsColumns = config.ds.id ? dsColumnMap[config.ds.id] : [];
    ReactDom.render((<div>
      {
        arrTmp.map((arrItem) => {
          const { key } = arrItem;
          const rela = relation[key];
          const { label } = rela;
          const column = dsColumns.find((col) => {
            return col.id == key;
          });
          if (!column) {
            return '';
          }
          let child = null;
          switch (column.rscType) {
            case 1:
              child = <SearchNumber {...rela.props} onChange={this.onChange.bind(this, key)} />;
              break;
            case 2: {
              const enumData = searchEnum[config.name];
              const data = [];
              const field = dsColumns.find((item) => {
                return item.id == key;
              }).rscName;
              if (enumData && enumData[field]) {
                for (let i = 0; i < enumData[field].length; i += 1) {
                  // add by wangliu 修复 数据里有null 然后去除
                  if (null == enumData[field][i]) {
                    continue;
                  }
                  data.push({
                    id: `${i}`,
                    name: enumData[field][i],
                  });
                }
              }
              child = (
                <SearchCharacter
                  {...rela.props}
                  onChange={this.onChange.bind(this, key)}
                  load={() => {
                    onLoad(config.name, key);
                  }}
                  data={data}
                />);
              break;
            }
            default:
              child = <SearchDate {...rela.props} onChange={this.onChange.bind(this, key)} />;
          }
          return (<div className={styles['query-area-item']} key={column.id} onClick={this.onClick.bind(this, config, column)}>
            <div className={styles['query-area-item-label']}>
              {label}:
              {!isReport ? (
                <i className={classNames(styles['query-area-item-label-icon'], 'anticon', 'anticon-delete')} onClick={this.deleteItem.bind(this, key)} />
              ) : ''}
            </div>
            <div>
              {child}
            </div>
          </div>);
        })
      }
    </div>), this.queryArea);
  };
  render() {
    const { height, title } = this.props.config.styleConfigs;
    let nextPage;
    if (pages == 0) {  // 多页的情况
      nextPage = (
        <div style={{ marginRight: 50 }}>
          <Icon type="caret-right"
            onClick={
              () => {
                this.changeSearch();
              }
            }
          />
        </div>
      )
    } else if (pages == 1) {
      nextPage = (
        <div></div>
      )
    }
    return (
      <div className={styles['query-container']} name="search" style={{ height: 60 }}>
        <div className={styles['query-area-container']} ref={(n) => { this.queryArea = n; }} />
        {nextPage}
        <div className={styles['query-btn']}>
          <Icon type="search" style={{ fontSize: 16, color: '#08c' }}
            onClick={() => {
              const { onSearch } = this.props;
              if (onSearch) {
                onSearch();
              }
            }}
          />
        </div>
      </div>
    );
  }
}

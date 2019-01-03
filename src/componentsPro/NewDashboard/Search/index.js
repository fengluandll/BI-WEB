import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import classNames from 'classnames';
import SearchDate from '../Search-Date';
import SearchNumber from '../Search-Number';
import SearchCharacter from '../Search-Character';
import { Icon } from 'antd';

import styles from './index.less';

/**
 * 仪表板-查询控件
 */

export default class Index extends PureComponent {
  constructor(props) {
    super(props);

  }
  componentDidMount = () => {
    this.renderItem(this.props);

  };
  componentWillReceiveProps(nextProps) {
    this.renderItem(nextProps);

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

  //  render searchitem
  renderItem = (props) => {
    // mdashBoard 中的 relation、styleConfig  mChart表
    const { relation, mChart, styleConfig, onLoad, searchEnum } = props;
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

    //  mdashboard中放的是 搜索的关联关系和值    mchart中放的是搜索的样式  所以调用搜索子项的时候 两个参数都要传 
    //  参数  

    ReactDom.render(<div>
      {
        arr.map((arrItem, index) => {
          const { key } = arrItem;
          const rela = relation[key];
          const relaJson = searchJson[key];
          const { type, name } = relaJson;

          let child = null;
          switch (type) {
            case "1":
              // num
              child = <SearchNumber rela={rela} relaJson={relaJson} onChange={this.onChange.bind(this, key)} />;
              break;
            case "2":
              // str
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
              break;
            case "3":
              // date
              child = <SearchDate rela={rela} relaJson={relaJson} onChange={this.onChange.bind(this, key)} />;
              break;
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
        <div className={styles['query-area-container']} ref={(instance) => { this.queryArea = instance; }} />

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

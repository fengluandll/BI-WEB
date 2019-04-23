import React, { Component } from 'react';
import ReactDom from 'react-dom';
import G2 from '@antv/g2';
import { compare } from '../../../utils/equal';
import ChartHelper from '../base';
import MathUtils from '../../../utils/MathUtils';

import styles from '../index.less';

/****
 * 我都忘了干嘛用得了,目前没用
 * 
 * 这个引用的包有点大后期要把这个删了
 * ***/
class Perspective extends Component {
  componentDidMount() {
    this.renderDate();
  }
  componentDidUpdate() {
    this.renderDate();
  }
  renderEmpty = () => {
    return (<div className={styles.empty}><span>数据返回为空</span></div>);
  };

  renderDate1 = () => {
    var url = 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json';
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.onload = function () {
      var table = perspective.worker().table(JSON.parse(xhr.response));
      for (var el of document.getElementsByTagName('perspective-viewer')) {
        el.load(table);
      }
    }

    xhr.send(null);

    // 老版的
    // <perspective-viewer id="container" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: 1200, height: 800, border: '1px solid #ccc' }}
    //   row-pivots='["athlete"]'
    //   column-pivots='["year"]'
    //   columns='["gold","silver","bronze"]'
    //   sort='[["gold","desc"]]'>
    // </perspective-viewer>
  }

  renderDate = () => {
    const { mChart, dateSetList, dragactStyle, editModel } = this.props;
    const config = JSON.parse(mChart.config);
    const { header, body } = dateSetList;
    const data = []; // 根据table的数据拼接处perspective所需要的参数
    // 转换数据格式
    for (let i = 0; i < body.length; i++) {
      const value = body[i];
      const obj = {};
      for (let j = 0; j < header.length; j++) {
        obj[header[j]] = value[j];
      }
      data.push(obj);
    }

    // 加载上数据
    for (var el of document.getElementsByTagName('perspective-viewer')) {
      el.load(data);
    }

  }


  renderChart = () => {
    return (
      <div>
        {/* <perspective-viewer id="container" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: 1200, height: 800, border: '1px solid #ccc' }}
          row-pivots='["athlete"]'
          column-pivots='["year"]'
          columns='["gold","silver","bronze"]'
          sort='[["gold","desc"]]'>
        </perspective-viewer> */}
      </div>
    );

  }
  render() {
    return (
      <div>
        {this.renderChart()}
      </div>
    )
  }

}

export default Perspective;


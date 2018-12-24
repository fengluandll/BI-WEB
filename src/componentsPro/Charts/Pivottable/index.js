import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';

import styles from '../index.less';

class Pivottable extends PureComponent {

  componentDidMount() {
  }
  componentDidUpdate() {
  }

  renderEmpty = () => {
    return (<div className={styles.empty}><span>数据返回为空</span></div>);
  };

  renderChart = () => {
    const { mChart, dateSetList, dragactStyle, editModel } = this.props;
    const config = JSON.parse(mChart.config);
    const { header, body } = dateSetList;
    const data = []; // 根据table的数据拼接处pivottable所需要的参数
    data.push(header);
    for (let i = 0; i < body.length; i++) {
      data.push(body[i]);
    }

    if (null == mChart || dateSetList == null) {
      return;
    }

    // -------------------图表配置--------------------------------
    let width = 300;
    if (config.width) {
      width = config.width;
    }
    let height = 300;
    if (config.height) {
      height = config.height;
    }
    if (null != dragactStyle && dragactStyle.length > 0) {
      const array = dragactStyle;
      array.map((item, index) => {
        if (item.key == mChart.id.toString()) {
          if (editModel == "true") {
            height = item.h * 40 - 20;
          } else {
            height = item.h * 40 - 20;
          }
        }
      });
    }
    // 边距
    let padding = ['10%', 30, '25%', 40];
    if (config.padding) {
      padding = config.padding;
    }

    if (!body || (body && body.length < 1)) {
      ReactDom.render(this.renderEmpty(), this.node);
      return;
    }

    // add by wangliu 修改表格每列的宽度
    const bodyrow = body[0];//取数据第一行
    let widthArray = [];  //handsontable的宽度变量
    for (let i = 0; i < bodyrow.length; i++) {
      let rowLenth = 0;  //字符串长度
      for (let j = 0; j < body.length; j++) {
        if (null === body[j][i]) {
          continue;
        }
        if (typeof (body[j][i]) == "number") {
          if (body[j][i].length > rowLenth) {
            rowLenth = body[j][i].length;
          }
        } else {
          if (body[j][i].length * 2 > rowLenth) {
            rowLenth = body[j][i].length;
            let content = body[j][i].split('');
            let tmpCont = 0;
            for (let m = 0; m < content.length; m++) {
              //  如果是中文长度翻倍
              let tmpStr = /^[\u4e00-\u9fa5],{0,}$/;
              if (tmpStr.test(content[m])) {
                tmpCont++;
              }
            }
            rowLenth = rowLenth + tmpCont;
          }
        }
      }
      if (rowLenth <= 10) {
        widthArray.push(100);
      } else {
        widthArray.push(300);
      }
    }

    if (config.head == "1") {//如果显示头部  高度变小
      height = height - 25;
    }
    return (
      <div>
        <PivotTableUI
          data={data}
          onChange={s => this.setState(s)}
          {...this.state}
        />
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

export default Pivottable;

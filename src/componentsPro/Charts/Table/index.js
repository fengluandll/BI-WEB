import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import { compare } from '../../../utils/equal';
import { Icon } from 'antd';

import styles from '../index.less';

class Table extends PureComponent {

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
  onExport = () => {
    const { mChart, dateSetList, editModel, dragactStyle, onExport } = this.props;
    onExport(mChart.id);
  }

  renderChart() {
    const { mChart, dateSetList, editModel, dragactStyle } = this.props;
    const config = JSON.parse(mChart.config);
    const { header, body } = dateSetList;

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
    // 固定前几列
    let fixedColumnsLeft = 0;
    if (config.fixedColumnsLeft) {
      fixedColumnsLeft = config.fixedColumnsLeft
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
    // clean   add by wangliu   修改table 高度
    this.node.innerHTML = '';
    this.chart = new Handsontable(this.node, {
      data: body,
      rowHeaders: true,
      colHeaders: header,
      fixedColumnsLeft: fixedColumnsLeft,
      stretchH: 'all',
      height: height,
      colWidths: widthArray,
      rowHeights: 25,
    });

    // add by wangliu 0817 设置列属性 只读
    this.chart.updateSettings({
      cells: function (row, col) {
        var cellProperties = {};
        cellProperties.readOnly = true;
        return cellProperties;
      }
    });
  }
  render() {
    const { mChart } = this.props;
    const config = JSON.parse(mChart.config);
    let headDiv;
    if (config.head == "1") {
      headDiv = (<div style={{ height: '25px', lineHeight: '25px' }}>
        <div className={styles['chart-title', 'chart-titleTable']} ref={this.handleTitle}>
          {config.name ? config.name : ''}
        </div>
        <Icon type="download" style={{ fontSize: 16, color: '#08c', position: 'absolute', right: '20px', top: '2.5px' }}
          onClick={() => {
            this.onExport();
          }}
        />
      </div>);
    } else {
      headDiv = (<div></div>);
    }
    return (
      <div>
        {headDiv}
        <div ref={this.handleRef} />
      </div>
    )
  }
}

export default Table;

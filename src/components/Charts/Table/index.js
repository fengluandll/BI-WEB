import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import { compare } from '../../../utils/equal';
import { Icon } from 'antd';

import styles from '../index.less';

class Bar extends PureComponent {
  state = {
    autoHideXLabels: false,
  };

  componentDidMount() {
    this.renderChart(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.styleConfigs.head) {//如果有头部
      const title = nextProps.styleConfigs.title;
      this.title.innerHTML = title.visible ? title.name : '';
      const a = !compare(this.props.data, nextProps.data)
        || !compare(this.props.data.body, nextProps.data.body);
      const b = !compare(this.props.styleConfigs, nextProps.styleConfigs);
      const width = this.node.clientWidth;
      // 标题项的变化不触发图表重新渲染
      if (compare(this.props.styleConfigs.title, nextProps.styleConfigs.title) && (a || b)) {
        this.renderChart(nextProps);
      } else if (this.chart && (this.chart.table.clientWidth < width && width !== 0)) {
        this.chart.render();
      }
    } else {
      this.renderChart(nextProps);
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
    const { data, styleConfigs } = props;
    const { header, body } = data;
    const { fixed, rowHeaders } = styleConfigs;
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
          if(body[j][i].length > rowLenth){
            rowLenth = body[j][i].length;
          }
        } else {

          // 判断是由数字或字母组成
          // let testStr = /^[A-Za-z0-9]+$/;
          // let testStr2 = /[^%&',;=?$\x22]+/;
          // if (testStr.test(body[j][i].replace(/\s+/g, "")) || (testStr2.test(body[j][i].replace(/\s+/g, "")) && testStr.test(body[j][i].replace(/\s+/g, "")))) {
          //   if( body[j][i].length > rowLenth){
          //     rowLenth = body[j][i].length;
          //   }
          // } else {
          //   if( body[j][i].length * 2 > rowLenth){
          //     rowLenth = body[j][i].length * 2;
          //   }
          // }

          if(body[j][i].length * 2 > rowLenth){
            rowLenth = body[j][i].length;
            let content = body[j][i].split('');
            let tmpCont = 0;
            for(let m = 0;m < content.length; m++){
              //  如果是中文长度翻倍
              let tmpStr = /^[\u4e00-\u9fa5],{0,}$/;
              if(tmpStr.test(content[m])){
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

    let { height, title, head } = styleConfigs;
    if(head){//如果显示头部  高度变小
      height = height -25;
    }
    // clean   add by wangliu   修改table 高度
    this.node.innerHTML = '';
    this.chart = new Handsontable(this.node, {
      data: body,
      rowHeaders,
      colHeaders: header,
      fixedColumnsLeft: fixed.enable ? fixed.fixedColumnsLeft : 0,
      stretchH: 'all',
      height: height,
      colWidths: widthArray,
      rowHeights:25,
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
    const { styleConfigs, onExport } = this.props;
    const { height, title, head } = styleConfigs;
    let headDidv;
    if (head) {
      headDidv = (
        <div style={{ height: '25px', lineHeight: '25px' }}>
          <div className={styles['chart-title']} ref={this.handleTitle}>
            {title.visible ? title.name : ''}
          </div>
          <Icon type="download" style={{ fontSize: 16, color: '#08c',position: 'absolute', right: '20px', top: '2.5px' }} 
           onClick={() => {
            if (typeof onExport == 'function') {
              onExport();
            }
          }}
          />
        </div>
      )
    } else {
      headDidv = (
        <div></div>
      )
    }
    return (
      <div style={{ height }}>
        <div className="full-height">
          {headDidv}
          <div className={styles['chart-content']} ref={this.handleRef} />
        </div>
      </div>
    );
  }
}

export default Bar;

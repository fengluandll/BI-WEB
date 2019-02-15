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
    if (null == mChart || dateSetList == null) {
      return;
    }
    if (!body || (body && body.length < 1)) {
      return;
    }
    const data = []; // 根据table的数据拼接处pivottable所需要的参数
    data.push(header);
    for (let i = 0; i < body.length; i++) {
      data.push(body[i]);
    }
    const { rows, cols, aggregatorName, column } = config;
    const head = data[0]; // 数据第一行名称
    const arrRows = rows.split(","); // 配置的行
    const arrCols = cols.split(","); // 配置的列
    const arrColumn = column.split(","); // 配置的字段
    const arrRowsName = [];
    const arrColsName = [];
    // 看id在column的第几行来取名称
    for (let i = 0; i < arrRows.length; i++) {
      if (arrColumn.indexOf(arrRows[i]) >= 0) {
        arrRowsName.push(head[arrColumn.indexOf(arrRows[i])]);
      }
    }
    for (let i = 0; i < arrCols.length; i++) {
      if (arrColumn.indexOf(arrCols[i]) >= 0) {
        arrColsName.push(head[arrColumn.indexOf(arrCols[i])]);
      }
    }
    // 高度
    let height = 300;
    if (config.height) {
      height = config.height;
    }
    if (null != this.props.dragactStyle && this.props.dragactStyle.length > 0) {
      const array = this.props.dragactStyle;
      array.map((item, index) => {
        if (item.key == mChart.id.toString()) {
          if (this.props.editModel == "true") {
            height = item.h * 40 - 12;
          } else {
            height = item.h * 40 - 12;
          }
        }
      });
    }

    return (
      <div style={{ overflow: 'auto', height: height }}>
        <PivotTableUI
          data={data}
          rows={arrRowsName}
          cols={arrColsName}
          aggregatorName={aggregatorName}
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

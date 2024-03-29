import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';

import styles from '../index.less';

/***
 * 自定义table,第一个
 * 
 * 这个太扯了,完全自定义写的html不该做成控件
 * 这个查询数据用的接口 是table查询接口
 * 
 * ***/
class TableDiy extends PureComponent {

  componentWillMount() {

  }

  componentDidMount() {
  }

  componentDidUpdate() {

  }
  renderEmpty = () => {
    return (<div className={styles.empty}><span>数据返回为空</span></div>);
  };

  getData = () => {
    const { editModel, mChart, dateSetList } = this.props;
    if (null == dateSetList) {
      return "";
    }
    const value = dateSetList[0];
    const data = {};
    for (let key in value) {
      data[key] = value[key];
    }
    return data;
  }

  /***显示***/
  renderContent = () => {
    const data = this.getData();
    if (data == "") {
      return;
    }
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th rowSpan={"3"}>人数</th>
              <th colSpan={"2"}>总人数</th>
              <th colSpan={"2"}>前勤</th>
              <th colSpan={"2"}>后勤</th>
              <th rowSpan={"2"}>前后勤比例</th>
              <th rowSpan={"2"}>男女比例</th>
              <th rowSpan={"2"}>本月离职人数</th>
              <th rowSpan={"2"}>员工月度离职率</th>
              <th rowSpan={"2"}>外包人数</th>
              <th rowSpan={"2"}>临时工人数</th>
            </tr>
            <tr>
              <th>月初</th>
              <th>月末</th>
              <th>男</th>
              <th>女</th>
              <th>男</th>
              <th>女</th>
            </tr>
            <tr className={styles['tabTr']}>
              <td>{data["1"]}</td>
              <td>{data["2"]}</td>
              <td>{data["3"]}</td>
              <td>{data["4"]}</td>
              <td>{data["5"]}</td>
              <td>{data["6"]}</td>
              <td>{data["7"]}</td>
              <td>{data["8"]}</td>
              <td>{data["9"]}</td>
              <td>{data["10"]}</td>
              <td>{data["11"]}</td>
              <td>{data["12"]}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>年龄结构</th>
              <td colSpan={"2"} className={styles['tabTd']}>25岁及以下</td>
              <td colSpan={"2"} className={styles['tabTd']}>26-35岁</td>
              <td colSpan={"2"} className={styles['tabTd']}>36-45岁</td>
              <td colSpan={"2"} className={styles['tabTd']}>45岁以上</td>
              <td colSpan={"4"} className={styles['tabTd']}>平均年龄</td>
            </tr>
            <tr className={styles['tabTr']}>
              <th>人数</th>
              <td colSpan={"2"}>{data["13"]}</td>
              <td colSpan={"2"}>{data["14"]}</td>
              <td colSpan={"2"}>{data["15"]}</td>
              <td colSpan={"2"}>{data["16"]}</td>
              <td colSpan={"4"}>{data["17"]}</td>
            </tr>
            <tr className={styles['tabTr']}>
              <th>实际占比值</th>
              <td colSpan={"2"}>{data["18"]}</td>
              <td colSpan={"2"}>{data["19"]}</td>
              <td colSpan={"2"}>{data["20"]}</td>
              <td colSpan={"2"}>{data["21"]}</td>
              <td colSpan={"4"}></td>
            </tr>
            <tr className={styles['tabTr']}>
              <th>规划值</th>
              <td colSpan={"2"}>{data["22"]}</td>
              <td colSpan={"2"}>{data["23"]}</td>
              <td colSpan={"2"}>{data["24"]}</td>
              <td colSpan={"2"}>{data["25"]}</td>
              <td colSpan={"4"}></td>
            </tr>
            <tr className={styles['tabTr']}>
              <th>规划占比</th>
              <td colSpan={"2"}>{data["26"]}</td>
              <td colSpan={"2"}>{data["27"]}</td>
              <td colSpan={"2"}>{data["28"]}</td>
              <td colSpan={"2"}>{data["29"]}</td>
              <td colSpan={"4"}></td>
            </tr>
            <tr>
              <th>工龄结构</th>
              <td colSpan={"2"} className={styles['tabTd']}>1年以下</td>
              <td colSpan={"2"} className={styles['tabTd']}>1（含）-3年</td>
              <td colSpan={"2"} className={styles['tabTd']}>3（含）-5年</td>
              <td colSpan={"2"} className={styles['tabTd']}>5（含）-10年</td>
              <td colSpan={"4"} className={styles['tabTd']}>10年（含）以上</td>
            </tr>
            <tr className={styles['tabTr']}>
              <th>人数</th>
              <td colSpan={"2"}>{data["30"]}</td>
              <td colSpan={"2"}>{data["31"]}</td>
              <td colSpan={"2"}>{data["32"]}</td>
              <td colSpan={"2"}>{data["33"]}</td>
              <td colSpan={"4"}>{data["34"]}</td>
            </tr>
            <tr className={styles['tabTr']}>
              <th>实际占比值</th>
              <td colSpan={"2"}>{data["35"]}</td>
              <td colSpan={"2"}>{data["36"]}</td>
              <td colSpan={"2"}>{data["37"]}</td>
              <td colSpan={"2"}>{data["38"]}</td>
              <td colSpan={"4"}>{data["39"]}</td>
            </tr>
            <tr className={styles['tabTr']}>
              <th>规划值</th>
              <td colSpan={"2"}>{data["40"]}</td>
              <td colSpan={"2"}>{data["41"]}</td>
              <td colSpan={"2"}>{data["42"]}</td>
              <td colSpan={"2"}>{data["43"]}</td>
              <td colSpan={"4"}>{data["44"]}</td>
            </tr>
            <tr className={styles['tabTr']}>
              <th>规划占比</th>
              <td colSpan={"2"}>{data["45"]}</td>
              <td colSpan={"2"}>{data["46"]}</td>
              <td colSpan={"2"}>{data["47"]}</td>
              <td colSpan={"2"}>{data["48"]}</td>
              <td colSpan={"4"}>{data["49"]}</td>
            </tr>
            <tr>
              <th>学历结构</th>
              <td colSpan={"2"} className={styles['tabTd']}>硕士及以上</td>
              <td colSpan={"2"} className={styles['tabTd']}>本科</td>
              <td colSpan={"2"} className={styles['tabTd']}>大专</td>
              <td colSpan={"6"} className={styles['tabTd']}>中专及以下</td>
            </tr>
            <tr className={styles['tabTr']}>
              <th>人数</th>
              <td colSpan={"2"}>{data["50"]}</td>
              <td colSpan={"2"}>{data["51"]}</td>
              <td colSpan={"2"}>{data["52"]}</td>
              <td colSpan={"6"}>{data["53"]}</td>
            </tr>
            <tr className={styles['tabTr']}>
              <th>实际占比值</th>
              <td colSpan={"2"}>{data["54"]}</td>
              <td colSpan={"2"}>{data["55"]}</td>
              <td colSpan={"2"}>{data["56"]}</td>
              <td colSpan={"6"}>{data["57"]}</td>
            </tr>
            <tr className={styles['tabTr']}>
              <th>规划值</th>
              <td colSpan={"2"}>{data["58"]}</td>
              <td colSpan={"2"}>{data["59"]}</td>
              <td colSpan={"2"}>{data["60"]}</td>
              <td colSpan={"6"}>{data["61"]}</td>
            </tr>
            <tr className={styles['tabTr']}>
              <th>规划占比</th>
              <td colSpan={"2"}>{data["62"]}</td>
              <td colSpan={"2"}>{data["63"]}</td>
              <td colSpan={"2"}>{data["64"]}</td>
              <td colSpan={"6"}>{data["65"]}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderContent()}
      </div>
    )
  }
}

export default TableDiy;

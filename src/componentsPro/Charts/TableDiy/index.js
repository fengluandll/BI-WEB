import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';

import styles from '../index.less';

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
            <tr>
              <th>{data["1"]}</th>
              <th>{data["2"]}</th>
              <th>{data["3"]}</th>
              <th>{data["4"]}</th>
              <th>{data["5"]}</th>
              <th>{data["6"]}</th>
              <th>{data["7"]}</th>
              <th>{data["8"]}</th>
              <th>{data["9"]}</th>
              <th>{data["10"]}</th>
              <th>{data["11"]}</th>
              <th>{data["12"]}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>年龄结构</th>
              <td colSpan={"2"}>25岁及以下</td>
              <td colSpan={"2"}>26-35岁</td>
              <td colSpan={"2"}>36-45岁</td>
              <td colSpan={"2"}>45岁以上</td>
              <td colSpan={"4"}>平均年龄</td>
            </tr>
            <tr>
              <th>人数</th>
              <td colSpan={"2"}>{data["13"]}</td>
              <td colSpan={"2"}>{data["14"]}</td>
              <td colSpan={"2"}>{data["15"]}</td>
              <td colSpan={"2"}>{data["16"]}</td>
              <td colSpan={"4"}>{data["17"]}</td>
            </tr>
            <tr>
              <th>实际占比值</th>
              <td colSpan={"2"}>{data["18"]}</td>
              <td colSpan={"2"}>{data["19"]}</td>
              <td colSpan={"2"}>{data["20"]}</td>
              <td colSpan={"2"}>{data["21"]}</td>
              <td colSpan={"4"}></td>
            </tr>
            <tr>
              <th>规划值</th>
              <td colSpan={"2"}>{data["22"]}</td>
              <td colSpan={"2"}>{data["23"]}</td>
              <td colSpan={"2"}>{data["24"]}</td>
              <td colSpan={"2"}>{data["25"]}</td>
              <td colSpan={"4"}></td>
            </tr>
            <tr>
              <th>规划占比</th>
              <td colSpan={"2"}>{data["26"]}</td>
              <td colSpan={"2"}>{data["27"]}</td>
              <td colSpan={"2"}>{data["28"]}</td>
              <td colSpan={"2"}>{data["29"]}</td>
              <td colSpan={"4"}></td>
            </tr>
            <tr>
              <th>工龄结构</th>
              <td colSpan={"2"}>1年以下</td>
              <td colSpan={"2"}>1（含）-3年</td>
              <td colSpan={"2"}>3（含）-5年</td>
              <td colSpan={"2"}>5（含）-10年</td>
              <td colSpan={"4"}>10年（含）以上</td>
            </tr>
            <tr>
              <th>人数</th>
              <td colSpan={"2"}>{data["30"]}</td>
              <td colSpan={"2"}>{data["31"]}</td>
              <td colSpan={"2"}>{data["32"]}</td>
              <td colSpan={"2"}>{data["33"]}</td>
              <td colSpan={"4"}>{data["34"]}</td>
            </tr>
            <tr>
              <th>实际占比值</th>
              <td colSpan={"2"}>{data["35"]}</td>
              <td colSpan={"2"}>{data["36"]}</td>
              <td colSpan={"2"}>{data["37"]}</td>
              <td colSpan={"2"}>{data["38"]}</td>
              <td colSpan={"4"}>{data["39"]}</td>
            </tr>
            <tr>
              <th>规划值</th>
              <td colSpan={"2"}>{data["40"]}</td>
              <td colSpan={"2"}>{data["41"]}</td>
              <td colSpan={"2"}>{data["42"]}</td>
              <td colSpan={"2"}>{data["43"]}</td>
              <td colSpan={"4"}>{data["44"]}</td>
            </tr>
            <tr>
              <th>规划占比</th>
              <td colSpan={"2"}>{data["45"]}</td>
              <td colSpan={"2"}>{data["46"]}</td>
              <td colSpan={"2"}>{data["47"]}</td>
              <td colSpan={"2"}>{data["48"]}</td>
              <td colSpan={"4"}>{data["49"]}</td>
            </tr>
            <tr>
              <th>学历结构</th>
              <td colSpan={"2"}>硕士及以上</td>
              <td colSpan={"2"}>本科</td>
              <td colSpan={"2"}>大专</td>
              <td colSpan={"6"}>中专及以下</td>
            </tr>
            <tr>
              <th>人数</th>
              <td colSpan={"2"}>{data["50"]}</td>
              <td colSpan={"2"}>{data["51"]}</td>
              <td colSpan={"2"}>{data["52"]}</td>
              <td colSpan={"6"}>{data["53"]}</td>
            </tr>
            <tr>
              <th>实际占比值</th>
              <td colSpan={"2"}>{data["54"]}</td>
              <td colSpan={"2"}>{data["55"]}</td>
              <td colSpan={"2"}>{data["56"]}</td>
              <td colSpan={"6"}>{data["57"]}</td>
            </tr>
            <tr>
              <th>规划值</th>
              <td colSpan={"2"}>{data["58"]}</td>
              <td colSpan={"2"}>{data["59"]}</td>
              <td colSpan={"2"}>{data["60"]}</td>
              <td colSpan={"6"}>{data["61"]}</td>
            </tr>
            <tr>
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

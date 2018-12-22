import { connect } from 'dva';
import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Icon } from 'antd';
import DashBoardUtils from '../../utils/dashboardUtils';
import { Bar, Pie, Line, Table } from '../../componentsPro/Charts';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';



const dashboardUtils = new DashBoardUtils();

class EditCharts extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mCharts: {},
      dateSetList: {},
    };
    // get reportId
    this.chartId = this.props.match.params.chartId;

  }
  componentWillMount() {
    const chartId = this.chartId;
    this.props.dispatch({
      type: 'editCharts/fetch',
      payload: {
        chartId,
        callback: () => {
          const { list, mCharts } = this.props.model;
          this.setState({
            mCharts,
            dateSetList: list,
          });
        },
      },
    });

  }
  componentDidUpdate() {

  }

  componentWillUnmount() {

  }

  // 折线图
  disPlayLine = () => {
    const mCharts = this.state.mCharts;
    const dateSetList = this.state.dateSetList;
    return (
      <div>
        <Line
          mChart={mCharts}
          dateSetList={dateSetList}
        />
      </div>
    );
  }

  // 柱状图
  disPlayBar = () => {
    const mCharts = this.state.mCharts;
    const dateSetList = this.state.dateSetList;
    return (
      <div>
        <Bar
          mChart={mCharts}
          dateSetList={dateSetList}
        />
      </div>
    );
  }

  // 饼图
  disPlayPie = () => {
    const mCharts = this.state.mCharts;
    const dateSetList = this.state.dateSetList;
    return (
      <div>
        <Pie
          mChart={mCharts}
          dateSetList={dateSetList}
        />
      </div>
    );
  }
  // 交叉表
  disPlayTable = () => {
    const mCharts = this.state.mCharts;
    const dateSetList = this.state.dateSetList;
    return (
      <div>
        <Table
          mChart={mCharts}
          dateSetList={dateSetList}
        />
      </div>
    );
  }
  // pivottable
  displayPivottable = () => {
    const mCharts = this.state.mCharts;
    const dateSetList = this.state.dateSetList;
    const data = []; // 根据table的数据拼接处pivottable所需要的参数
    const { header, body } = dateSetList;
    data.push(header);
    for (let i = 0; i < body.length; i++) {
      data.push(body[i]);
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
  // 搜索栏
  disPlaySearch = () => {
    const mCharts = this.state.mCharts;
    const dateSetList = this.state.dateSetList;
    return (
      <div>
        请在展示页面配置搜索栏
      </div>
    );
  }

  //  图表展示
  disPlayChart = () => {
    // 判断图表类型  搜索框返回
    const mCharts = this.state.mCharts;
    if (null == mCharts.config) {
      return (
        <div>
        </div>
      )
    }
    const { id, dashboardId, name, config } = mCharts;
    const { type } = JSON.parse(config);
    if (type == "0") {
      // 折线图
      return this.disPlayLine();
    } else if (type == "1") {
      // 柱状图
      return this.disPlayBar();
    } else if (type == "2") {
      // 饼图
      return this.disPlayPie();
    } else if (type == "3") {
      // 交叉表
      return this.disPlayTable();
    } else if (type == "4") {
      // privottable
      return this.displayPivottable();
    } else if (type == "5") {

    } else if (type == "11") {
      // 搜索栏
      return this.disPlaySearch();
    }
  };

  render() {
    // 刷新按钮
    let refresh = (
      <div>
        <Icon type="download" style={{ fontSize: 16, color: '#08c', position: 'absolute', right: '20px', top: '2.5px' }}
          onClick={() => {
            alert("aa");
          }}
        />
      </div>
    )
    //图表
    let chart = (
      <div>
        {
          this.disPlayChart()
        }
      </div>
    )
    return (
      <div>
        {refresh}
        {chart}
      </div>
    );
  }
}
export default connect(state => ({
  model: state.editCharts,
}))(EditCharts);

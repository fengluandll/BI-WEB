import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Table, Divider, Icon, Tooltip } from 'antd';
import CalData from './calData';

import styles from '../index.less';

const calData = new CalData();

let pageLoadeFlag = true; // 防止重复提交flag

/***
 * antdTable目前当做普通表格用
 * 
 * @author:wangliu
 * 
 * ***/
class AntdTable extends PureComponent {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  renderEmpty = () => {
    return (<div className={styles.empty}><span>数据返回为空</span></div>);
  };

  /***
   * 点击关联查询事件
   * 
   * ***/
  onPlotClickAntTable = (id, value) => {
    const { onPlotClickAntTable, mChart } = this.props;
    onPlotClickAntTable(id, value, mChart.id);
  }

  /***导出excel***/
  onExport = () => {
    const { mChart, dateSetList, editModel, dragactStyle, onExport } = this.props;
    onExport(mChart.id);
  }
  /***制造参数和列***/
  getTableData2 = () => {
    const { mChart, dateSetList, editModel, dragactStyle, idColumns, item } = this.props;
    const config = JSON.parse(mChart.config);
    let { header, body } = dateSetList;

    // 处理null
    for (let key in body) {
      let line = body[key];
      for (let k in line) {
        const value = line[k];
        if (null == value) {
          line[k] = " ";
        }
      }
    }

    // f1 url跳转功能
    const columnUrl = config.columnUrl.split(",");
    const columnUrl_name = []; // url跳转的字段中文数组
    const columnUrlStr = config.columnUrlStr; // url地址
    const columnUrlParam = config.columnUrlParam; // 参数字段id
    let columnUrlParam_name = "";
    if (null != columnUrlParam && columnUrlParam != "") {
      columnUrlParam_name = idColumns[columnUrlParam].rsc_display; // 字段的中文名称，也就是头部的名称
    }
    if (null != columnUrl && columnUrl != "") {
      for (let key in columnUrl) {
        const value = columnUrl[key];
        if (null != value && value != "") {
          const name = idColumns[value].rsc_display;
          columnUrl_name.push(name);
        }
      }
    }
    // f2 固定单元格
    const { fixed_left, fixed_right } = config;
    const left_name = []; // 固定左侧的中文数组
    const right_name = []; // 固定右侧的中文数组
    if (null != fixed_left && fixed_left != "") {
      const left = fixed_left.split(",");
      for (let key in left) {
        const value = left[key];
        if (null != value && value != "") {
          const name = idColumns[value].rsc_display;
          left_name.push(name);
        }
      }
    }
    if (null != fixed_right && fixed_right != "") {
      const right = fixed_right.split(",");
      for (let key in right) {
        const value = right[key];
        if (null != value && value != "") {
          const name = idColumns[value].rsc_display;
          right_name.push(name);
        }
      }
    }
    // f3 设置每列的宽度
    const col_value_count_arr = []; // 每列的最大字符数量
    let body_first = body[0]; // 第一行的数据
    if (null == body_first) {
      body_first = [];
    }
    const col_count = body_first.length; // 数据总共有多少列
    for (let i = 0; i < col_count; i++) {  // 按照列循环
      const col_value = []; // 每列的所有数据数组
      for (let key in body) {
        const body_line = body[key]; // 每行数据
        col_value.push(body_line[i]); // 每行数据的当前列数据放入数组
      }
      // 计算出每列数据的最大的字符个数
      let col_value_count = 0;
      for (let key in col_value) {
        let tmp_count = 0;
        let value = col_value[key];
        if (null == value) {
          value = "";
        }
        for (var j = 0; j < value.length; j++) {
          var a = value.charAt(i);
          if (a.match(/[^\x00-\xff]/ig) != null) {
            tmp_count += 2;
          }
          else {
            tmp_count += 1;
          }
        }
        if (tmp_count > col_value_count) {
          col_value_count = tmp_count;
        }
      }
      col_value_count_arr.push(col_value_count);
    }
    // f4关联的字段要显示特殊样式-鼠标滑过背景色改变并且箭头变成手
    const column_arr_index = {}; //被关联字段的下标位对象
    if (null != item && item != "") {
      const { type, name, chartId, styleConfig, relation } = item;
      const { column } = config;
      const column_arr = column.split(","); //mChart中的字段id数组
      const column_id_set = new Set(); // 被关联的字段id
      for (let key in relation) {
        const relationFields = relation[key].relationFields;
        const relationFields_keys = Object.keys(relationFields); // 获取 relationFields的 key数组
        if (null != relationFields_keys && relationFields_keys.length > 0) {
          column_id_set.add(key); // 把被关联的字段放入
        }
      }
      for (let id_set of column_id_set) { // 找到被关联的字段在数据中的下标位 组成数组
        for (let key in column_arr) {
          const id = column_arr[key];
          if (id_set == id) {
            column_arr_index[key] = id_set;
          }
        }
      }
    }
    // f5 行或者列的数据根据公式判断后显示不同的颜色

    const tableDate = {}; // 拼接好的参数对象
    /***制造列***/
    const columns = [];
    const first_col = {
      title: () => '序号',
      width: '50px',
      dataIndex: '序号',
      key: '序号',
      fixed: 'left',
      render: (text, record, index) => {
        return (
          <div style={{ textAlign: 'center', backgroundColor: '#f3f3f3', marginLeft: '-5px', marginRight: '-5px' }}>{`${index + 1}`}</div>
        )
      },
    };
    columns.push(first_col); // 放入第一行的序号列
    for (let key in header) {
      const value = header[key];
      const obj = { "title": value, "dataIndex": value, "key": value, "align": "center" };
      // f1 判断并添加url跳转
      if (columnUrl_name.length > 0) {
        for (let key in columnUrl_name) {
          if (value == columnUrl_name[key]) {
            obj.render = (text, record, index) => {
              let value_param = record[columnUrlParam_name]; // 参数的值
              if (null != value_param.key) { // 看是不是截取了字符拼成的div
                value_param = value_param.key;
              }
              const src = columnUrlStr + value_param;
              return (
                <a target="_blank" href={src}>{text}</a>
              );
            }
          }
        }
      }
      // f2 固定单元格
      if (left_name.length > 0) {
        for (let key in left_name) {
          if (value == left_name[key]) {
            obj.fixed = 'left';
            if (col_value_count_arr[key]) { // 如果是固定列那么这一列是要加上宽度的不然就会出现列的重叠
              obj.width = col_value_count_arr[key] * 10;
            }
          }
        }
      }
      if (right_name.length > 0) {
        for (let key in right_name) {
          if (value == right_name[key]) {
            obj.fixed = 'right';
            if (col_value_count_arr[key]) {
              obj.width = col_value_count_arr[key] * 10;
            }
          }
        }
      }
      // f3 设置最大宽度
      if (col_value_count_arr[key] && config.forceFit != "1" && key != header.length - 1) {  // 如果不是自适应的情况下要显固定头部那么除了最后一列不舍宽度，其他都要设置宽度
        obj.width = 200;
      }
      // f4 被关联字段要加特殊样式 和 点击事件
      for (let k in column_arr_index) {
        if (key == k) {
          obj.render = (text, record, index) => {
            return (
              <div style={{ backgroundColor: '#F4F4F4' }} onClick={this.onPlotClickAntTable.bind(this, column_arr_index[k], text)}>{text}</div>
            );
          }
        }
      }
      columns.push(obj);
    }
    /***制造数据***/
    const data = [];
    for (let key in body) {
      const obj = { "key": key };
      const body_line = body[key];
      for (let body_line_key in body_line) {
        let value = body_line[body_line_key];
        if (null == value) {
          value = "";
        }
        value = value.toString().replace('\n', ' '); // 替换换行符
        if (value.length > 12 && config.forceFit != "1") { // 如果字符大于12个的时候那就隐藏用Tooltip提示
          value =
            <div key={value}>
              <Tooltip title={value} placement="top">
                <span>{value.substring(0, 12) + "..."}</span>
              </Tooltip>
            </div>;
        }
        obj[header[body_line_key]] = value;
      }
      data.push(obj);
    }
    tableDate["columns"] = columns;
    tableDate["data"] = data;
    return tableDate;
  }

  /***
   * antdtable瀑布加载事件
   * 
   * ***/
  onScrollLoad = (index, value) => {
    const { mChart, dateSetList, editModel, dragactStyle, idColumns, searchData } = this.props;
    const { start, end, total } = dateSetList.searchAntdTable; // 分页参数(start:分页开始,end:分页结束,total:总计)
    const height = this.getHeight();
    const minus = height / 26; // 一页展示的行数(滑动到最后一页的时触发加载) 按照一页二十行的标准算的
    if (total > 50 && parseInt(index) > parseInt(end - minus)) { // 如果鼠标移动到 比所有的少 比当前最后数据-一页数据多 那就出发查询加载
      console.log(index);
      // 下面开始拼接参数调用查询回调函数
      if (total > 50 && pageLoadeFlag == true) {
        pageLoadeFlag = false; // 防止重复点击flag设置为false
        const searchAntdTable = {}; // antdTable参数对象
        if (end < total - 1 && end + 50 <= total) { // end比total小
          searchAntdTable.start = end;
          searchAntdTable.end = end + 50;
          searchAntdTable.chartId = mChart.id;
          searchData(null, searchAntdTable); // 调用查询接口
        } else if (end < total - 1 && end + 50 > total) { // 下个end比total大,一次就能查完
          searchAntdTable.start = end;
          searchAntdTable.end = total;
          searchAntdTable.chartId = mChart.id;
          searchData(null, searchAntdTable); // 调用查询接口
        }
        setTimeout(() => {
          pageLoadeFlag = true;
        }, 5000); // 等待五秒
      }
    }
  }

  /***
   * 获取数据
   * 
   * ***/
  getTableData = () => {
    const data = calData.cal(this.props);
    const tableDate = calData.getTableData(data, this.props);
    return tableDate;
  }

  /***获取头部***/
  getHeadDiv = () => {
    const { mChart } = this.props;
    const config = JSON.parse(mChart.config);
    const { head, name, download } = config;
    if (head == "1") {
      return (
        <div style={{ height: '25px', lineHeight: '25px' }}>
          <div className={styles['chart-title', 'chart-titleTable']} ref={this.handleTitle}>
            {name ? name : ''}
          </div>
          {download == "0" ? "" :
            <Icon type="download" style={{ fontSize: 16, color: '#08c', position: 'absolute', right: '20px', top: '2.5px' }}
              onClick={() => {
                this.onExport();
              }}
            />}
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }
  }
  /***获取高度***/
  getHeight = () => {
    const { mChart, dateSetList, editModel, dragactStyle, idColumns } = this.props;
    const config = JSON.parse(mChart.config);
    let height = 600;
    if (null != dragactStyle && dragactStyle.length > 0) {
      const array = dragactStyle;
      array.map((item, index) => {
        if (item.key == mChart.id.toString()) {
          if (editModel == "true") {
            height = item.h * 40 - 36;
          } else {
            height = item.h * 40 - 36;
          }
          if (config.head != "1") { // 没有头部的时候
            height = item.h * 40 - 11;
          }
        }
      });
    }
    return height;
  }
  // 获取scroll
  getScroll = () => {
    const { mChart } = this.props;
    const config = JSON.parse(mChart.config);
    const tableDate = this.getTableData();
    const { columns, data } = tableDate;
    const height = this.getHeight();
    let scroll = {};
    let pagination = false;
    if (config.forceFit == "1") { // 如果是自适应的时候就用100%
      scroll = { x: '100%' };
    } else {
      scroll = { x: columns.length * 200 - 140, y: height - 117 };// x轴滚动是列个数乘200,y轴是根据dragact算出的高度减去图表控件额外的高度。
      if (pagination == false) {
        scroll = { x: columns.length * 200 - 140, y: height - 40 }; // x:长度乘以200(这个column拼上了第一列序号,序号宽是20,所以减去150正好,减140是为了x轴长度比较长而已。)
      }
    }
    return scroll;
  }

  renderContent() {
    const tableDate = this.getTableData();
    const { columns, data } = tableDate;
    const { mChart } = this.props;
    const config = JSON.parse(mChart.config);
    let pagination = false; // 分页显示控制
    if (config.pagination && config.pagination == "1") {
      pagination = true;
    }
    const height = this.getHeight();
    const scroll = this.getScroll();
    /***展示table控件***/
    return (
      <div>
        <div>
          {/***head***/}
          {this.getHeadDiv()}
        </div>
        <div style={{ overflow: 'auto', height: height }} >
          <Table
            columns={columns}
            dataSource={data}
            scroll={scroll}
            pagination={pagination}
            size={"middle"}
            onRow={(record, rowkey) => {
              return {
                onClick: (event) => { },       // 点击行
                onDoubleClick: (event) => { }, // 双点击行
                onContextMenu: (event) => { },
                onMouseEnter: (event) => { this.onScrollLoad(rowkey, record) },  // 鼠标移入行
                onMouseLeave: (event) => { this.onScrollLoad(rowkey, record) } // 鼠标离开
              };
            }}
          />
        </div>
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

export default AntdTable;

import React, { PureComponent } from 'react';
import { Button, Select } from 'antd';
import { DataConfig, CheckList, DataConfigSelection } from '../';
import DashBoardUtils from '../../../utils/dashboardUtils';
import objectUtils from '../../../utils/objectUtils';
import Constant from '../../../common/constant';

import styles from './index.less';

const Option = Select.Option;
const dashboardUtils = new DashBoardUtils();
const constant = new Constant();
/**
 * 数据配置面板
 */
export default class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.dsId = this.props.comp.ds.id;  // 当前选中的数据集ID
    const checkBoxGroup = this.dsId ? this.getCheckBoxGroup(this.dsId) : [];
    const checkBoxGroupDefaultValue = this.getCheckBoxGroupDefaultValue();
    const dataConfigSelectionData = this.getDataConfigSelectionData(checkBoxGroupDefaultValue);
    this.state = {
      checkBoxGroup,
      checkBoxGroupDefaultValue,
      dataConfigSelectionData,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.comp.type === 'search') {
      this.dsId = nextProps.comp.ds.id;  // 当前选中的数据集ID
      const checkBoxGroup = this.dsId ? this.getCheckBoxGroup(this.dsId, nextProps) : [];
      const checkBoxGroupDefaultValue = this.getCheckBoxGroupDefaultValue(nextProps);
      const dataConfigSelectionData = this.getDataConfigSelectionData(
        checkBoxGroupDefaultValue, nextProps);
      this.setState({
        checkBoxGroup,
        checkBoxGroupDefaultValue,
        dataConfigSelectionData,
      });
    }
  }
  getCheckBoxGroup = (dsId, props = this.props) => {
    const { dsColumnMap } = props;
    const checkBoxGroup = [];
    const columnList = dsColumnMap[dsId];
    for (const column of columnList) {
      checkBoxGroup.push({
        label: column.rscDisplay,
        value: `${column.id}`,
      });
    }
    return checkBoxGroup;
  };
  getCheckBoxGroupDefaultValue = (props = this.props) => {
    const { relation } = props.comp;
    const keys = Object.keys(relation);
    const checkBoxGroupDefaultValue = [];
    for (const key of keys) {
      checkBoxGroupDefaultValue.push(key);
    }
    return checkBoxGroupDefaultValue;
  };
  getDataConfigSelectionData = (checkValue, props = this.props) => {
    const { dsColumnMap, boxEles, comp } = props;
    const dsColumns = dsColumnMap[this.dsId];
    const charts = [];
    // modify by wangliu  0907   搜索框的 数据 关联
    dashboardUtils.findChartsChange(boxEles, charts, comp);
    const dataConfigSelectionData = [];
    for (let i = 0; i < checkValue.length; i += 1) {
      const val = checkValue[i];
      const column = dsColumns.find((col) => {
        return col.id == val;
      });
      if (!column) {
        return;
      }
      if (!comp.relation[column.id]) {
        const length = Object.keys(comp.relation).length;
        const relation = comp.relation[column.id] = {
          relationFields: {},
          label: column.rscDisplay,
          props: {},
          sortIndex: length,
        };
        this.initFieldRelationProps(column.rscType, relation);
      }
      const data = {
        name: `源字段-${column.rscDisplay}`,
        children: [],
        compName: comp.name,
        fieldId: column.id,
      };
      charts.forEach((subItem) => {
        const id = subItem.ds ? subItem.ds.id : '';
        const columns = dsColumnMap[id] || [];
        const children = [];
        columns.forEach((col) => {
          // {当前组件name,当前组件字段id,关联组件name，关联组件字段id}
          const key = `${comp.name},${column.id},${subItem.name},${col.id}`;
          children.push({
            label: col.rscDisplay,
            value: key,
          });
        });
        data.children.push({
          name: `图表-${subItem.styleConfigs.title.name}`,
          key: subItem.name,
          children,
        });
      });
      dataConfigSelectionData.push({
        data,
        id: column.id,
      });
    }
    return dataConfigSelectionData;
  };
  // 初始化查询项属性
  initFieldRelationProps = (type, relation) => {
    switch (type) {
    case 1:
      Object.assign(relation.props, {
        rule: constant.getNumRule()[0],
        val: null,
      });
      break;
    case 2:
      Object.assign(relation.props, {
        rule: constant.getCharacterRule()[0],
        val: null,
      });
      break;
    default:
      Object.assign(relation.props, {
        rule: constant.getDateRule(),
        val: [null, null],
      });
    }
  };
  reload = () => {
    const { reload } = this.props;
    reload();
  };
  selectDs = (value) => {
    const { comp } = this.props;
    const { dsMap } = this;
    this.dsId = value;
    Object.assign(comp.ds, dsMap[value]);
    this.setState({
      checkBoxGroup: this.getCheckBoxGroup(value),
    });
  };
  changeCheckList = (checkValue) => {
    // 清空不必要的关联
    const { relation } = this.props.comp;
    const keys = Object.keys(relation);
    for (const key of keys) {
      if (checkValue.findIndex((item) => {
        return item === key;
      }) === -1) {
        objectUtils.clearAttr(relation, key);
      }
    }
    const dataConfigSelectionData = this.getDataConfigSelectionData(checkValue);
    this.props.onChangeCheck();
    this.setState({
      dataConfigSelectionData,
    });
  };
  changeCheckRelation = (selectCompName, selectFieldId, name, checkValue) => {
    const { comp } = this.props;
    if (checkValue.length == 0 && comp.relation[selectFieldId]
      && comp.relation[selectFieldId].relationFields[name]) {
      delete comp.relation[selectFieldId].relationFields[name];
    }
    for (const value of checkValue) {
      const [compName, fieldId, subCompName, subFieldId] = value.split(',');
      const relation = comp.relation;
      const key = `${compName},${fieldId},${subCompName},${subFieldId}`;
      if (relation[fieldId]) {
        relation[fieldId].relationFields[subCompName] = key;
      }
    }
    this.props.onChangeCheck();
  };
  // 解析数据集
  renderDsSel = () => {
    const { boxEles, comp } = this.props;
    const chartEles = [];
    dashboardUtils.findChart(boxEles, chartEles);
    const dsMap = {};
    chartEles.forEach((item) => {
      if (item.ds && item.ds.id) {
        dsMap[item.ds.id] = item.ds;
      }
    });
    this.dsMap = dsMap;
    const dsKeys = Object.keys(dsMap);
    const defaultValue = comp.ds ? comp.ds.id : null;
    return (<Select style={{ width: '100%', borderRadius: '0' }} onChange={this.selectDs} defaultValue={defaultValue}>
      { dsKeys.map((key) => {
        const ds = dsMap[key];
        return (<Option value={ds.id} key={ds.id}>{ds.dsDisplay}</Option>);
      }) }
    </Select>);
  };
  renderBox1 = () => {
    const { comp } = this.props;
    return (
      <div className="search-config-selection" key={comp.name}>
        <div className={styles['search-config-selection-row']}>源数据集</div>
        {/* 选择数据集后重新加载字段复选列表并清空同源关联/非同源关联列表 */}
        { this.renderDsSel() }
        <CheckList
          data={this.state.checkBoxGroup}
          defaultValue={this.state.checkBoxGroupDefaultValue}
          changeCheck={this.changeCheckList}
        />
        {/* 选择字段后显示关联列表 */}
        { this.state.dataConfigSelectionData ? this.state.dataConfigSelectionData.map((item) => {
          const relations = comp.relation[item.id] ? comp.relation[item.id].relationFields : {};
          return (
            <DataConfigSelection
              relations={relations}
              data={item.data}
              key={item.id}
              changeCheck={this.changeCheckRelation}
            />
          );
        }) : '' }
      </div>
    );
  };
  renderBox2 = () => {
    const { dataConfigProps, comp } = this.props;
    const { dataConfig, name } = comp;
    return (
      <div key={name}>
        <DataConfig {...dataConfigProps} type="dimension" dragType="dimension" data={dataConfig.dimension} />
        <DataConfig {...dataConfigProps} type="measure" dragType="measure" data={dataConfig.measure} />
        <div className={styles['data-reload']}>
          <span style={{ marginRight: '5px', fontSize: '13px' }} >点击更新图表</span>
          <Button type="primary" className={styles['ant-btn']} onClick={this.reload}>更新</Button>
        </div>
      </div>);
  };
  renderBox3 = () => {
    const { dataConfigProps, comp } = this.props;
    const { dataConfig, name } = comp;
    return (
      <div key={name}>
        <DataConfig {...dataConfigProps} type="dimension" dragType="dimension" data={dataConfig.dimension} />
        <DataConfig {...dataConfigProps} type="measure" dragType="measure" data={dataConfig.measure} />
        <DataConfig {...dataConfigProps} type="legend" dragType="dimension" data={dataConfig.legend} />
        <div className={styles['data-reload']}>
          <span style={{ marginRight: '5px', fontSize: '13px' }} >点击更新图表</span>
          <Button type="primary" className={styles['ant-btn']} onClick={this.reload}>更新</Button>
        </div>
      </div>);
  };
  render() {
    const { comp } = this.props;
    if (comp.type === 'search') {
      return this.renderBox1();
    } else if (comp.type === 'pie' || comp.type === 'table') {
      return this.renderBox2();
    } else {
      return this.renderBox3();
    }
  }
}

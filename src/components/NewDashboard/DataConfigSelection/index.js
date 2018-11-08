import React, { PureComponent } from 'react';
import { Checkbox } from 'antd';

import styles from './index.less';

const CheckboxGroup = Checkbox.Group;
/**
 * 数据关联配置-三级下拉复选
 */
export default class Index extends PureComponent {
  toogle = (ev) => {
    const target = ev.target;
    if (ev.target.className === 'anticon anticon-down') {
      target.className = 'anticon anticon-up';
      this.fieldContent.style.display = 'block';
    } else {
      target.className = 'anticon anticon-down';
      this.fieldContent.style.display = 'none';
    }
  };
  toogleComponent = (key, ev) => {
    const target = ev.target;
    if (ev.target.className === 'anticon anticon-down') {
      target.className = 'anticon anticon-up';
      this[`componentContent${key}`].style.display = 'block';
    } else {
      target.className = 'anticon anticon-down';
      this[`componentContent${key}`].style.display = 'none';
    }
  };
  handleFieldContent = (n) => {
    this.fieldContent = n;
  };
  handleComponentContent = (key, n) => {
    this[`componentContent${key}`] = n;
  };
  /**
   * 点击选择图表关联
   * @param compName 关联图表配置name
   * @param fieldId 关联字段ID
   * @param subCompName 被关联图表配置name
   * @param checkValue 选中的所有被关联字段
   */
  changeCheck = (compName, fieldId, subCompName, checkValue) => {
    this.props.changeCheck(compName, fieldId, subCompName, checkValue);
  };
  render() {
    const { data, relations } = this.props;
    if (data && data.name) {
      return (
        <div className={styles['field-relation']}>
          <div className={styles['field-name']} title={data.name}>
            <i className="anticon anticon-down" onClick={this.toogle} style={{ cursor: 'pointer' }} />{data.name}
          </div>
          <div className={styles['field-content']} ref={this.handleFieldContent}>
            { data.children.map((item) => {
              const relation = relations ? relations[item.key] : null;
              const value = relation ? [relation] : [];
              return (<div key={item.key}>
                <div className={styles['component-name']} title={item.name}>
                  <i className="anticon anticon-down" onClick={this.toogleComponent.bind(this, item.key)} style={{ cursor: 'pointer' }} />{item.name}
                </div>
                <div className={styles['component-content']} ref={this.handleComponentContent.bind(this, item.key)}>
                  <CheckboxGroup value={value} options={item.children} style={{ display: 'block' }} onChange={this.changeCheck.bind(this, data.compName, data.fieldId, item.key)} />
                </div>
              </div>);
            }) }
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

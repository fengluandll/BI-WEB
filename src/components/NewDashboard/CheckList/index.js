import React, { PureComponent } from 'react';
import { Checkbox } from 'antd';

import styles from './index.less';

const CheckboxGroup = Checkbox.Group;

/**
 * 复选框列表
 * todo 搜索
 */
export default class Index extends PureComponent {
  changeCheck = (checkValue) => {
    this.props.changeCheck(checkValue);
  };
  render() {
    return (
      <div className={styles['check-box-group-container']}>
        <div className={styles['check-box-group']}>
          <CheckboxGroup
            options={this.props.data}
            defaultValue={this.props.defaultValue}
            style={{ display: 'block' }}
            onChange={this.changeCheck}
          />
        </div>
      </div>
    );
  }
}

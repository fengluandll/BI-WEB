import React, { PureComponent } from 'react';
import NumberInput from '../../NumberInput';

import styles from '../Search/index.less';

/**
 * 仪表板-查询控件-数值比较
 */
export default class Index extends PureComponent {
  onChange = (value) => {
    const rest = value && value !== '' ? [value] : null;
    this.props.onChange(rest);
  };
  render() {
    const { rela, relaJson } = this.props;
    const defaultValue = rela.props ? rela.props[0] : '';
    return (
      <div className={styles['query-field']}>
        <NumberInput
          addonBefore={relaJson.name}
          onChange={this.onChange}
          placeholder="值"
          defaultValue={defaultValue}
        />
      </div>
    );
  }
}

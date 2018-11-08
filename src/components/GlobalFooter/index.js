import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './index.less';

export default class GlobalFooter extends PureComponent {
  render() {
    const clsString = classNames(styles.globalFooter, this.props.className);
    const id = this.props.id;
    const copyright = this.props.copyright;
    return (
      <div className={clsString} id={id}>
        {copyright && <div className={styles.copyright}>{copyright}</div>}
      </div>
    );
  }
}

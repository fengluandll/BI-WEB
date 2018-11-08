import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import styles from './index.less';

const { Header } = Layout;

export default class GlobalHeader extends PureComponent {
  render() {
    return (
      <Header className={styles.header} id={this.props.id} />
    );
  }
}

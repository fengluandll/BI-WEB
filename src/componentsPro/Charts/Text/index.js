import React, { PureComponent } from 'react';

import styles from '../index.less';

class Text extends PureComponent {

  componentDidMount() {
  }
  componentDidUpdate() {
  }

  handleRef = (n) => {
    this.node = n;
  };
  renderEmpty = () => {
    return (<div className={styles.empty}><span>数据返回为空</span></div>);
  };

  /***
   * 展示内容
   * 
   * ***/
  renderConten = () => {
    const { text } = this.props;
    return (
      <div>
        {text}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderConten()}
      </div>
    )
  }
}

export default Text;

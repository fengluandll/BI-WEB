import React, { PureComponent } from 'react';
import { Modal } from 'antd';

import styles from './index.less';

export default class DraggableModal extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      top: (props.style && props.style.top) ? props.style.top : 0,
      draggable: false,
    };
  }
  dragStart = () => {
    // document.documentElement.addEventListener('mousemove', this.drag);
  };
  dragEnd = () => {
    // document.documentElement.removeEventListener('mousemove', this.drag);
  };
  drag = (e) => {
    this.setState({ top: e.clientY - 32 });
  };
  render() {
    const { title, style, ...otherProps } = this.props;
    const newTitle = (
      <div
        className={styles.header}
        onMouseDown={this.dragStart}
        onMouseUp={this.dragEnd}
      >
        {title}
      </div>);
    const newStyle = { ...style };

    return (
      <Modal {...otherProps} title={newTitle} style={newStyle} />
    );
  }
}

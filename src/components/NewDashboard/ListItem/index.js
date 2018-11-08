import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import styles from './index.less';

const source = {
  beginDrag(props) {
    const { metadata } = props.item;
    return {
      metadata,
      index: props.index,
      type: props.type,
      dragSource: props.dragSource,
    };
  },
};
/**
 * 仪表板编辑
 * 数据集列表项
 * type : dataconfig - 数据配置项, dataset - 数据集列表项
 */
@DragSource(props => props.dragType, source, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class ListItem extends Component {
  render() {
    const { connectDragSource, item } = this.props;
    return connectDragSource(
      <li
        onMouseDown={this.props.onMouseDown}
        className={styles.list_item}
      >
        {item.name}
      </li>,
    );
  }
}

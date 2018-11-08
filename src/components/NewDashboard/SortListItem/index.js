import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import { Icon } from 'antd';
import ReactDom from 'react-dom';
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
const target = {
  hover(props, monitor, component) {
    const item = monitor.getItem();
    const dragIndex = item.index;
    const hoverIndex = props.index;
    // Don't replace items with themselves
    if (dragIndex === hoverIndex || (isNaN(dragIndex) || isNaN(hoverIndex))) {
      // console.log(`dragIndex:${dragIndex},hoverIndex:${hoverIndex}`);
      return;
    }
    // Determine rectangle on screen
    const hoverBoundingRect = ReactDom.findDOMNode(component).getBoundingClientRect();
    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    // Determine mouse position
    const clientOffset = monitor.getClientOffset();
    // console.log(clientOffset);
    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      // console.log(`downwards:dragIndex:${dragIndex},hoverIndex:${hoverIndex},
      // hoverClientY:${hoverClientY},hoverMiddleY:${hoverMiddleY}`);
      return;
    }
    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      // console.log(`upwards:dragIndex:${dragIndex},
      // hoverIndex:${hoverIndex},hoverClientY:${hoverClientY},hoverMiddleY:${hoverMiddleY}`);
      return;
    }
    // console.log(`success:dragIndex:${dragIndex},hoverIndex:${hoverIndex},
    // hoverClientY:${hoverClientY},hoverMiddleY:${hoverMiddleY}`);
    // perform the actions
    props.sort(dragIndex, hoverIndex, item.dragSource);
    item.index = hoverIndex;
  },
};
/**
 * 仪表板编辑
 * 数据集列表项
 * 支持显示排序/数据排序/删除
 * type : dataconfig - 数据配置项, dataset - 数据集列表项
 */
@DragSource(props => props.dragType, source, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
@DropTarget(props => props.dragType, target, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
export default class ListItem extends Component {
  del = () => {
    const { dragSource, item, onDeleteItem } = this.props;
    onDeleteItem(dragSource, item.metadata);
  };
  render() {
    const { connectDropTarget, connectDragSource, isDragging, item, sort } = this.props;
    const opacity = isDragging && sort ? 0 : 1;
    return connectDragSource(connectDropTarget(
      <li
        onMouseDown={this.props.onMouseDown}
        className={styles.list_item}
        style={{ opacity }}
      >
        {item.name}
        <div className="pull-right">
          <Icon type="close" onClick={this.del} />
        </div>
      </li>,
    ));
  }
}

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { DropTarget } from 'react-dnd';
import SortListItem from '../SortListItem';
import styles from './index.less';

const target = {
  drop(props, monitor) {
    const rest = monitor.getItem();
    props.onDrop(props.type, {
      metadata: rest.metadata,
      dragSourceType: rest.type,
      dragSource: rest.dragSource,
    });
  },
};
/**
 * 数据配置项
 * 可拖动，提供拖动排序功能和回调函数
 * data 列表数据 {id, name, icon, index}
 * sort 排序
 * onDblClick 双击
 */
@DropTarget(props => props.dragType, target, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
export default class Index extends PureComponent {
  render() {
    const { type, data, dragType, connectDropTarget, onDeleteItem, sort } = this.props;
    const getTitle = () => {
      switch (type) {
      case 'dimension':
        return '维度';
      case 'measure':
        return '度量';
      default:
        return '图例';
      }
    };
    const props = {
      onDeleteItem,
      sort,
      dragType,
      className: styles['column-item'],
      dragSource: type,
      type: 'dataconfig',
    };
    // const isActive = canDrop && isOver;
    return connectDropTarget(
      <div className={styles['data-config-container']}>
        <div className={styles['data-config-item']}>
          <div className={styles['data-config-item-name']}>{getTitle()}</div>
          <ul className={classNames(styles['data-config-item-value'], styles['column-list'])}>
            {data.map((item, index) => {
              const itemData = {
                id: item.id,
                name: item.rscDisplay,
                metadata: item,
              };
              return <SortListItem {...props} index={index} item={itemData} key={item.id} />;
            })}
          </ul>
        </div>
      </div>,
    );
  }
}

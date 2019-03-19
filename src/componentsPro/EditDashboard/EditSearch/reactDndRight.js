import React, { PureComponent } from 'react';
import { DropTarget } from 'react-dnd';
import ReactDndItem from './reactDndItem'

const target = {
    drop(props, monitor) {
    },
};
/**
 * 数据配置项
 * 可拖动，提供拖动排序功能和回调函数
 * data 列表数据 {id, name, icon, index}
 * sort 排序
 * onDblClick 双击
 */
@DropTarget(props => props.type, target, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
}))
export default class ReactDndRight extends PureComponent {
    render() {
        const { type, idColumns_searchItem_arr, connectDropTarget, onDeleteItem, sort } = this.props;
        const data = [];
        data.push("a");
        data.push("b");
        return connectDropTarget(
            <div>
                {idColumns_searchItem_arr.map((item, index) => {
                    return (
                        <ReactDndItem
                            key={index}
                            type={"dnd"}
                            item={item}
                        />
                    );
                })}
            </div>
        );
    }
}

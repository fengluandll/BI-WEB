import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

const source = {
    beginDrag(props) {
        return {
        };
    },
};
/**
 * 仪表板编辑
 * 数据集列表项
 * type : dataconfig - 数据配置项, dataset - 数据集列表项
 */
@DragSource(props => props.type, source, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))
export default class ReactDndLeft extends Component {
    render() {
        const { connectDragSource, item } = this.props;
        return connectDragSource(
            <div>
                <li
                    onMouseDown={this.props.onMouseDown}
                >
                    {item.rsc_display}
                </li>
            </div>
        );
    }
}

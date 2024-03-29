
import React from 'react';
import 'antd/dist/antd.css';
import { Tabs } from 'antd';
import { DragDropContextProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


/***
 * tabs控件
 * 
 * 
 * Drag & Drop
 * antd自带的拖拽排序功能
 * 
 * first_author:weilili 20190402(离职日期)
 * modified:wangliu
 * 
 * ***/
class TabNode extends React.Component {
    render() {
        const {
            connectDragSource,
            connectDropTarget,
            children,
        } = this.props

        return connectDragSource(
            connectDropTarget(children),
        );
    }
}

const cardTarget = {
    drop(props, monitor) {
        const dragKey = monitor.getItem().index;
        const hoverKey = props.index;

        if (dragKey === hoverKey) {
            return;
        }

        props.moveTabNode(dragKey, hoverKey);
        monitor.getItem().index = hoverKey;
    },
};

const cardSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
        }
    },
};

const WrapTabNode = DropTarget(
    'DND_NODE',
    cardTarget,
    (connect) => ({
        connectDropTarget: connect.dropTarget(),
    }),
)(
    DragSource(
        'DND_NODE',
        cardSource,
        (connect, monitor) => ({
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        }),
    )(TabNode),
);

class TabsUI extends React.Component {
    state = {
        order: [],
    };


    moveTabNode = (dragKey, hoverKey) => {
        const newOrder = this.state.order.slice();
        const { children } = this.props;

        React.Children.forEach(children, (c) => {
            if (newOrder.indexOf(c.key) === -1) {
                newOrder.push(c.key);
            }
        });

        const dragIndex = newOrder.indexOf(dragKey);
        const hoverIndex = newOrder.indexOf(hoverKey);

        newOrder.splice(dragIndex, 1);
        newOrder.splice(hoverIndex, 0, dragKey);

        this.setState({
            order: newOrder,
        });
    };

    renderTabBar = (props, DefaultTabBar) => (
        <DefaultTabBar {...props}>
            {node => (
                <WrapTabNode key={node.key} index={node.key} moveTabNode={this.moveTabNode}>{node}</WrapTabNode>
            )}
        </DefaultTabBar>
    );

    render() {
        const { order } = this.state;
        const { children } = this.props;
        const tabs = [];
        React.Children.forEach(children, (c) => {
            tabs.push(c);
        });
        const orderTabs = tabs.slice().sort((a, b) => {
            const orderA = order.indexOf(a.key);
            const orderB = order.indexOf(b.key);

            if (orderA !== -1 && orderB !== -1) {
                return orderA - orderB;
            }
            if (orderA !== -1) {
                return -1;
            }
            if (orderB !== -1) {
                return 1;
            }

            const ia = tabs.indexOf(a);
            const ib = tabs.indexOf(b);

            return ia - ib;
        });

        return (
            <DragDropContextProvider backend={HTML5Backend}>
                <Tabs
                    renderTabBar={this.renderTabBar}
                    {...this.props}
                >
                    {orderTabs}
                </Tabs>
            </DragDropContextProvider>
        );
    }
}
export default TabsUI;

import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { DragSource, DropTarget, DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend'
import ReactDndLeft from './reactDndLeft'
import ReactDndRight from './reactDndRight'



/***
 * reactdnd拖拽选择框
 * 
 * ***/
class ReactDnd extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            refreshUI: 0, // 用来刷新页面的
        };
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        const { idColumns_searchItem_arr, idColumns_arr } = this.props;
        return (
            <div>
                <DragDropContextProvider backend={HTML5Backend}>
                    <div>
                        {
                            idColumns_arr.map((item, index) => {
                                return (
                                    <ReactDndLeft
                                        type={"dnd"}
                                        item={item}
                                        key={index}
                                    />
                                )
                            })
                        }
                        <ReactDndRight
                            type={"dnd"}
                            idColumns_searchItem_arr={idColumns_searchItem_arr}
                        />
                    </div>
                </DragDropContextProvider>
            </div>
        );
    }
}

export default ReactDnd;
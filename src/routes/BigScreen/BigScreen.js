import { connect } from 'dva';
import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';



/***
 * 
 * 大屏报表-暂时没有开发
 * 
 * @author:wangliu
 * 
 * ***/
class BigScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.boardId = this.props.match.params.screen_id;
    }

    componentWillMount() {

    }
    componentDidUpdate() {

    }
    componentWillUnmount() {

    }


    /****************************************************************************************************************/
    render() {
        return (
            <div>
            </div>
        );
    }
}
export default connect(state => ({
    model: state.bigScreen,
}))(BigScreen);

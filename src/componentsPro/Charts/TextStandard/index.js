import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Statistic, Card, Row, Col, Icon } from 'antd';

/***
 * 
 * 
 * ***/
class TextStandard extends PureComponent {

    componentWillMount() {

    }
    componentDidMount() {

    }
    componentDidUpdate() {

    }


    /*************************************************************************/
    renderContent = () => {
        const { item, dateSetList, mChart } = this.props;
        return (
            <div>
                <Card>
                    <Statistic
                        title="Active"
                        value={11.28}
                        precision={2}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<Icon type="arrow-up" />}
                        suffix="%"
                    />
                </Card>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderContent()}
            </div>
        )
    }
}

export default TextStandard;

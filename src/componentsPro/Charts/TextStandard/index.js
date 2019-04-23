import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Card, Row, Col, Icon } from 'antd';

/***
 * 标准文本控件,自己手写的0.0
 * 
 * @author:wangliu
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
    /***
     * 显示
     * 
     * ***/
    renderContent = () => {
        const { dragactStyle, editModel, item, dateSetList, mChart, idColumns } = this.props;

        // 非空判断
        if (null == mChart || dateSetList == null || dateSetList.length == 0) {
            return;
        }
        // 高度控制
        const config = JSON.parse(mChart.config);
        let height = 300;
        if (config.height) {
            height = config.height;
        }
        if (null != dragactStyle && dragactStyle.length > 0) {
            dragactStyle.map((item, index) => {
                if (item.key == mChart.id.toString()) {
                    if (this.props.editModel == "true") {
                        height = item.h * 40 - 42;
                    } else {
                        height = item.h * 40 - 42;
                    }
                }
            });
        }
        // 拼接显示的数据
        const { body } = dateSetList;
        const { textName, textType } = config;
        const textName_arr = textName.split(",");
        const data = body[0];
        if (textType == "0") {
            return (
                <div>
                    {this.renderType1(textName_arr, data, height)}
                </div>
            );
        } else if (textType == "1") {
            return (
                <div>
                    {this.renderType2(textName_arr, data, height)}
                </div>
            );
        }
    }

    /***
     * 第一种
     * 上边一个，下边一个横着放显示百分比
     * 
     * ***/
    renderType1 = (textName_arr, data, height) => {
        const value1 = data[0];
        const value2 = parseInt(data[1]) * 100; // 给的是小数,加百分号要乘100
        let value2_str = ""; // 第二个值的显示字符串
        let Icon_type = "up"; // 朝上朝下箭头
        let color = "";
        if (value2 >= 0) {
            value2_str = `${value2}%`;
            Icon_type = "up";
            color = "rgb(46, 186, 7)";
        } else {
            value2_str = `${-value2}%`;
            Icon_type = "down";
            color = "#FE5500";
        }
        return (
            <div style={{ height: height }}>
                <div style={{ height: '70%' }}>
                    <div style={{ textAlign: "center", fontSize: '12px', marginTop: '20px', color: 'rgb(152, 152, 152)' }}>
                        {textName_arr[0]}
                    </div>
                    <div style={{ textAlign: "center", fontSize: '28px', color: 'rgb(102, 102, 102)' }}>
                        {value1}
                    </div>
                </div>
                <div style={{ height: '30%', textAlign: "center", margin: '0 auto' }}>
                    <div >
                        <div style={{ display: 'inline', color: color, fontSize: '12px' }}>
                            <Icon type={Icon_type} style={{ fontSize: '12px', color: color }} />
                            {value2_str}
                        </div>
                        <div style={{ display: 'inline', color: 'rgb(204, 204, 204)', fontSize: '12px', marginLeft: '10px' }}>
                            {textName_arr[1]}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /***
     * 第二种
     * 上边一个，下边一个横着放显示比例
     * 
     * ***/
    renderType2 = (textName_arr, data, height) => {
        return (
            <div style={{ height: height }}>
                <div style={{ height: '70%' }}>
                    <div style={{ textAlign: "center", fontSize: '12px', marginTop: '20px', color: 'rgb(152, 152, 152)' }}>
                        {textName_arr[0]}
                    </div>
                    <div style={{ textAlign: "center", fontSize: '28px', color: 'rgb(102, 102, 102)' }}>
                        {data[0]}
                    </div>
                </div>
                <div style={{ height: '30%', textAlign: "center", margin: '0 auto' }}>
                    <div >
                        <div style={{ display: 'inline', color: 'rgb(204, 204, 204)', fontSize: '12px' }}>
                            {textName_arr[1]}:
                        </div>
                        <div style={{ display: 'inline', color: 'rgb(204, 204, 204)', fontSize: '12px', marginLeft: '10px' }}>
                            {data[1]}
                        </div>
                    </div>
                </div>
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

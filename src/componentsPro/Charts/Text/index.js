import React, { PureComponent } from 'react';
import { Editor } from 'slate-react'
import { Value } from 'slate'
import Plain from 'slate-plain-serializer'
import styles from '../index.less';

const initialValue = Plain.deserialize('A string of plain text.');
/***
 * 文本控件
 * Git: https://docs.slatejs.org/walkthroughs/saving-to-a-database
 * ***/
class Text extends PureComponent {
  state = {
    value: initialValue, // 文本框的值
  }

  /***初始化的时候如果有参数就用参数显示***/
  componentWillMount() {
    const { item } = this.props;
    const { value } = item; // 从参数里取出数据
    if (value != null && value != "") {
      const save_value = Plain.deserialize(value); // 将数据解析为控件能理解的格式
      this.setState({
        value: save_value,
      });
    }
  }
  componentDidMount() {
    this.renderConten();
  }
  componentDidUpdate() {
    this.renderConten();
  }
  handleRef = (n) => {
    this.node = n;
  };
  renderEmpty = () => {
    return (<div className={styles.empty}><span>数据返回为空</span></div>);
  };

  /*************************************************************************/

  /***修改事件***/
  onChange = ({ value }) => {
    const save_value = Plain.serialize(value); // 将数据转为序列化进行存储
    const { editModel, onSave, item } = this.props;
    this.props.onSave(save_value, item);
    this.setState({
      value,
    });
  }

  /***
   * 展示内容
   * 
   * ***/
  renderConten = () => {
    const { editModel,mChart,dateSetList } = this.props;
    const config = JSON.parse(mChart.config);
    let readOnly = true; // 判断如果是编辑模式就不是只读模式
    if (editModel == "true") {
      readOnly = false;
    }else{
      readOnly = true;
    }
    return (
      <div>
        <Editor value={this.state.value} readOnly={readOnly} onChange={this.onChange} />
      </div>
    );
  }

  render() {
    let height = 60;
    const mChart = this.props.mChart;
    const config = JSON.parse(mChart.config);
    let headDiv;
    if (this.props.dragactStyle.length > 0) {
      const array = this.props.dragactStyle;
      array.map((item, index) => {
        if (item.key == mChart.id.toString()) {
          if (this.props.editModel == "true") {
            height = item.h * 40 - 8;
          } else {
            height = item.h * 40 - 8;
          }
        }
      });
    }
    if (config.head !== "1") {
      headDiv = (<div style={{ height: '22px', lineHeight: '22px' }}>
        <div className={styles['chart-title','chart-titleTable']} ref={this.handleTitle}>
          {config.name ? config.name : mChart.name}
        </div>
      </div>);
    } else {
      headDiv = (<div></div>);
    }
    return (
      <div name="text" style={{height:height}}>
        <div>{this.renderConten()}</div>
      </div>
    )
  }
}

export default Text;

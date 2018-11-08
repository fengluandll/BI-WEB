import React, { PureComponent } from 'react';
import { Form, Input, Radio } from 'antd';

const { TextArea } = Input;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
class EditForm extends PureComponent {
  renderDimension = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <FormItem {...formItemLayout} label="名称">
          {getFieldDecorator('rscDisplay', {
            rules: [{ required: true, message: '请输入名称' }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="表达式">
          {getFieldDecorator('rscName', {
            rules: [{ required: true, message: '请输入表达式' }],
          })(<TextArea autosize={{ minRows: 8, maxRows: 12 }} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="数据类型">
          {getFieldDecorator('rscType', {
            rules: [{ required: true, message: '请选择数据类型' }],
          })(
            <RadioGroup>
              <Radio value="2">文本</Radio>
              <Radio value="1">数值</Radio>
              <Radio value="3">日期时间</Radio>
            </RadioGroup>)}
        </FormItem>
        <FormItem {...formItemLayout} label="显示值格式化" extra="显示格式，例如#,##0.00%，只能由大小写字母数字和_#,.%组成，长度不超过50个字符">
          {getFieldDecorator('rscFormatter', {})(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="备注信息">
          {getFieldDecorator('remark', {})(<Input />)}
        </FormItem>
      </Form>
    );
  };
  renderMeasure = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <FormItem {...formItemLayout} label="名称">
          {getFieldDecorator('rscDisplay', {
            rules: [{ required: true, message: '请输入名称' }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="表达式">
          {getFieldDecorator('rscName', {
            rules: [{ required: true, message: '请输入表达式' }],
          })(<TextArea autosize={{ minRows: 8, maxRows: 12 }} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="数据类型">
          {getFieldDecorator('rscType', {
            rules: [{ required: true, message: '请选择数据类型' }],
          })(
            <RadioGroup>
              <Radio value="2" defaultChecked>文本</Radio>
              <Radio value="1">数值</Radio>
            </RadioGroup>)}
        </FormItem>
        <FormItem {...formItemLayout} label="显示值格式化" extra="显示格式，例如#,##0.00%，只能由大小写字母数字和_#,.%组成，长度不超过50个字符">
          {getFieldDecorator('rscFormatter', {})(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="备注信息">
          {getFieldDecorator('remark', {})(<Input />)}
        </FormItem>
      </Form>
    );
  };
  renderEditForm = () => {
    const { fields } = this.props;
    if (fields.rscCategory === 1) {
      return this.renderDimension();
    } else {
      return this.renderMeasure();
    }
  };
  render() {
    this.props.onLoad(this.props.form);
    return (
      this.renderEditForm()
    );
  }
}
export default Form.create({
  mapPropsToFields(props) {
    const fields = props.fields;
    // 转换rscType为字符类型,否则无法默认选中
    fields.rscType = `${fields.rscType}`;
    const keys = Object.keys(fields);
    const rest = {};
    for (const key of keys) {
      rest[key] = Form.createFormField({
        value: fields[key],
      });
    }
    return rest;
  },
})(EditForm);

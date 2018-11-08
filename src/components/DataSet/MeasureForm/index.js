import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';

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
  getEditForm = () => {
    const { getFieldDecorator } = this.props.form;
    const fields = this.props.fields;
    if (fields.rscType === 1) {
      return (
        <Form>
          <FormItem {...formItemLayout} label="度量显示名">
            {getFieldDecorator('rscDisplay', {
              rules: [{ required: true, message: '度量显示名不能为空' }],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="物理字段名">
            {getFieldDecorator('rscName', {})(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="显示值格式化" extra="显示格式，例如#,##0.00%，只能由大小写字母数字和_#,.%组成，长度不超过50个字符">
            {getFieldDecorator('rscFormatter', {})(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="单位换算乘以" extra="指定原始值换算单位需要乘的数值，例如除 100 可以输入 0.01">
            {getFieldDecorator('rscConversion', {})(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="备注信息">
            {getFieldDecorator('remark', {})(<Input />)}
          </FormItem>
        </Form>
      );
    } else {
      return (
        <Form>
          <FormItem {...formItemLayout} label="度量显示名">
            {getFieldDecorator('rscDisplay', {
              rules: [{ required: true, message: '度量显示名不能为空' }],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="物理字段名">
            {getFieldDecorator('rscName', {})(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="备注信息">
            {getFieldDecorator('remark', {})(<Input />)}
          </FormItem>
        </Form>
      );
    }
  };
  render() {
    this.props.onLoad(this.props.form);
    return (
      this.getEditForm()
    );
  }
}
export default Form.create({
  mapPropsToFields(props) {
    const fields = props.fields;
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

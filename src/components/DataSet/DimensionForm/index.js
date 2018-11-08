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
  render() {
    const { getFieldDecorator } = this.props.form;
    this.props.onLoad(this.props.form);
    return (
      <Form>
        <FormItem {...formItemLayout} label="维度显示名">
          {getFieldDecorator('rscDisplay', {
            rules: [{ required: true, message: '维度显示名不能为空' }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="物理字段名">
          {getFieldDecorator('rscName', {})(<Input disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} label="备注信息">
          {getFieldDecorator('remark', {
            rules: [],
          })(<Input />)}
        </FormItem>
      </Form>
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

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
        <FormItem {...formItemLayout} label="数据集名称">
          {getFieldDecorator('dsDisplay', {
            rules: [{ required: true, message: '请输入数据集名称' }],
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

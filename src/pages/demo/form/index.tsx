import React, {Component} from 'react'
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Card, Form, Input, DatePicker, Button} from 'antd';
import {FormComponentProps} from 'antd/es/form';
import {Dispatch} from "redux";
import {connect} from "dva";

const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const {TextArea} = Input;

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 7},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 12},
    md: {span: 10},
  },
};


const submitFormLayout = {
  wrapperCol: {
    xs: {span: 24, offset: 0},
    sm: {span: 10, offset: 7},
  },
};

interface Props extends FormComponentProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
}

class DemoForm extends Component<Props> {

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const {form, dispatch} = this.props;
    form.validateFields((err,values)=>{
      if(!err) {
        dispatch({
          type: 'demoForm/submitRegularForm',
          payload: values,
        });
      }
    });
  };

  render() {
    const {form: {getFieldDecorator}, submitting} = this.props;
    return (
      <PageHeaderWrapper content="测试表单的 page">
        <Card title="Card title">
          <Form onSubmit={this.handleSubmit}>
            <FormItem label="第一个form Item">
              {getFieldDecorator("first", {
                rules: [
                  {
                    required: true,
                    message: "first item message"
                  }
                ]
              })(<Input placeholder="第一个input"/>)}

            </FormItem>
            <FormItem {...formItemLayout} label="第二个form Item">
              {getFieldDecorator("second", {
                rules: [
                  {
                    required: true,
                    message: "second item message"
                  }
                ]
              })(<RangePicker style={{width: '100%'}} placeholder={["second 1", "second 2"]}/>)}
            </FormItem>

            <FormItem {...formItemLayout} label="第三个form item">
              {getFieldDecorator('goal', {
                rules: [
                  {
                    required: true,
                    message: "",
                  },
                ],
              })(
                <TextArea
                  style={{minHeight: 32}}
                  placeholder=""
                  rows={4}
                />,
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{marginTop: 32}}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{marginLeft: 8}}>
                保存
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<Props>()(
  connect(({loading}: { loading: { effects: { [key: string]: boolean } } }) => ({
    submitting: loading.effects['formBasicForm/submitRegularForm'],
  }))(DemoForm)
)

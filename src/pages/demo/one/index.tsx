import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { Button, notification, Card } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageWrapper from '@/components/ImageWrapperDemo'; // @ 表示相对于源文件根目录

interface Props {
  submitting: boolean;
  dispatch: Dispatch<any>;
  demoOne: any;
}

interface State {
  value: string;
}

@connect(
  ({
    demoOne,
    loading,
  }: {
    demoOne: any;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    demoOne,
    submitting: loading.effects['demoOne/submitRegularForm'],
  }),
)
class One extends Component<Props, State> {
  hello = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(123);
    const { dispatch } = this.props;

    dispatch({
      type: 'demoOne/submitRegularForm',
      payload: {},
    });
  };

  state: State = {
    value: 'test',
  };

  handleChange = (value: any): void => {
    this.setState({
      value,
    });
  };

  prompt = () => {
    notification.open({
      message: 'We got value:',
      description: <span dangerouslySetInnerHTML={{ __html: this.state.value }} />,
    });
  };

  render() {
    return (
      <>
        <ImageWrapper
          src="https://os.alipayobjects.com/rmsportal/mgesTPFxodmIwpi.png"
          desc="示意图"
        />
        <Card title="富文本编辑器">
          <ReactQuill value={this.state.value} onChange={this.handleChange} />
          <Button style={{ marginTop: 16 }} onClick={this.prompt}>
            Prompt
          </Button>
        </Card>
      </>
    );
  }

  // render() {
  //   return (
  //     <div>
  //       <button onClick={this.hello}>
  //         测试{this.props.submitting ? 1 : 0}
  //         {this.props.demoOne.hello}
  //       </button>
  //     </div>
  //   );
  // }
}

export default One;

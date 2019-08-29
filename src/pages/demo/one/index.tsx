import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'dva';

interface Props {
  submitting: boolean;
  dispatch: Dispatch<any>;
  demoOne: any;
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
class One extends Component<Props> {
  hello = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(123);
    const { dispatch } = this.props;

    dispatch({
      type: 'demoOne/submitRegularForm',
      payload: {},
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.hello}>
          测试{this.props.submitting ? 1 : 0}
          {this.props.demoOne.hello}
        </button>
      </div>
    );
  }
}

export default One;

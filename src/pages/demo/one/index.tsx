import React, {Component} from 'react';
import {Dispatch} from "redux";

interface BasicFormProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
}

class One extends Component<BasicFormProps> {

  hello = (e: React.FormEvent) => {
    e.preventDefault();
    const {dispatch} = this.props;

    dispatch({
      type: 'formBasicForm/submitRegularForm',
      payload: {},
    });
  };

  render() {
    return <div onClick={this.hello}>New Page</div>;
  }
}

export default One

import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import { requestData } from './service';


export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    submitRegularForm: Effect;
  };
}

const Model: ModelType = {
  namespace: 'demoForm',
  state: { hello: 'world' },

  effects: {
    *submitRegularForm({ payload }, { call }) {
      yield call(requestData, payload);
      message.success('提交成功');
    },
  },
};

export default Model;

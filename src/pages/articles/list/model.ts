import {AnyAction, Reducer} from 'redux';
import {EffectsCommandMap} from 'dva';
import {addRule, queryRule, removeRule, updateRule, batchDelete} from './service';

import {TableListData} from './data.d';
import {message} from "antd";

export interface StateType {
  data: TableListData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    add: Effect;
    remove: Effect;
    update: Effect;
    batchDelete: Effect
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'articleTableList',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({payload}, {call, put}) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * add({payload, callback}, {call, put}) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * remove({payload, callback}, {call, put}) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * update({payload, callback}, {call, put}) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * batchDelete({payload, callback}, {call, put}) {

      const response = yield call(batchDelete, payload);
      response.status === 'ok' ? message.info(response.message) : message.error(response.message);
      //@ts-ignore https://umijs.org/zh/guide/with-dva.html#faq
      window.g_app._store.dispatch({
        type: 'articleTableList/fetch'
      });
      // if (callback) callback();
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

export default Model;

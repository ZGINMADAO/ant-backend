import { message } from 'antd';
import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryCurrent, query as queryUsers, getAccountMenus } from '@/services/user';
import { User as CurrentUser } from './data';

// export interface CurrentUser {
//   avatar?: string;
//   name?: string;
//   title?: string;
//   group?: string;
//   signature?: string;
//   tags?: {
//     key: string;
//     label: string;
//   }[];
//   userid?: string;
//   unreadCount?: number;
// }

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
    getMenuData: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
    // saveMenu:Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response.status === 'ok') {
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
      } else {
        message.error(response.message, 3);
      }
    },
    *getMenuData({ payload, callback }, { put, call }) {
      const response = yield call(getAccountMenus);
      // if (response.status === 'ok') {
      //   const menuData = response.data;
      //   yield put({
      //     type: 'saveMenu',
      //     payload: { menuData: menuData },
      //   });
      // }
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    // saveMenu(state, action) {
    //   console.log('saveMenu');
    //   console.log(state);
    //   return {
    //     ...state,
    //     ...action.payload,
    //   };
    // },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          // notifyCount: action.payload.totalCount,
          // unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;

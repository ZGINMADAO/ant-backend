import {Reducer} from 'redux';
import {Subscription, Effect} from 'dva';

import {NoticeIconData} from '@/components/NoticeIcon';
import {queryNotices} from '@/services/user';
import {ConnectState} from './connect.d';

export interface NoticeItem extends NoticeIconData {
  id: string;
  type: string;
  status: string;
}

export interface GlobalModelState {
  collapsed: boolean;
  notices: NoticeItem[];
}

export interface GlobalModelType {
  namespace: 'testDemo';
  state: GlobalModelState;
  effects: {
    fetchNotices: Effect;
    clearNotices: Effect;
    changeNoticeReadState: Effect;
  };
  reducers: {
    changeLayoutCollapsed: Reducer<GlobalModelState>;
    saveNotices: Reducer<GlobalModelState>;
    saveClearedNotices: Reducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription,onClick: Subscription};
}

const GlobalModel: GlobalModelType = {
  namespace: 'testDemo',

  state: {
    collapsed: false,
    notices: [],
  },

  effects: {
    * fetchNotices(_, {call, put, select}) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount: number = yield select(
        (state: ConnectState) => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    * clearNotices({payload}, {put, select}) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count: number = yield select((state: ConnectState) => state.global.notices.length);
      const unreadCount: number = yield select(
        (state: ConnectState) => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    * changeNoticeReadState({payload}, {put, select}) {
      const notices: NoticeItem[] = yield select((state: ConnectState) =>
        state.global.notices.map(item => {
          const notice = {...item};
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        }),
      );

      yield put({
        type: 'saveNotices',
        payload: notices,
      });

      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state = {notices: [], collapsed: true}, {payload}): GlobalModelState {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, {payload}): GlobalModelState {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state = {notices: [], collapsed: true}, {payload}): GlobalModelState {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter((item): boolean => item.type !== payload),
      };
    },
  },

  subscriptions: {
    setup({history}): void {
      console.log('testDemo123setup');
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({pathname, search}): void => {
        console.log('testDemo456setup');
      });
    },
    onClick({dispatch}): void {
      console.log('testDemoOnClick123');
      document.addEventListener('click', () => {   //这里表示当鼠标点击时就会触发里面的dispatch命令，这里的save就是reducers中的方法名
        console.log('testDemoOnClick456');
      })
    }
  },
};

export default GlobalModel;

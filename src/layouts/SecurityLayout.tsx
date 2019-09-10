import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { ConnectState, ConnectProps } from '@/models/connect';
import { User as CurrentUser } from '@/models/data';
import PageLoading from '@/components/PageLoading';

interface SecurityLayoutProps extends ConnectProps {
  loading: boolean;
  currentUser: CurrentUser;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;
    if ((!currentUser.id && loading) || !isReady) {
      //如果用户信息不存在以及正在请求  或  页面第一次加载 则显示加载框
      return <PageLoading />;
    }
    if (!currentUser.id) {
      //如果用户信息不存在则跳转到登录
      return <Redirect to="/user/login"></Redirect>;
    }
    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);

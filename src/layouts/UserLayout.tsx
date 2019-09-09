import { DefaultFooter, MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import SelectLang from '@/components/SelectLang';
import { ConnectProps, ConnectState } from '@/models/connect';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: { [path: string]: MenuDataItem };
}

const UserLayout: React.SFC<UserLayoutProps> = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);


  const links = [{
    key: 'test',
    title: '链接导航',
    href: '',
    blankTarget: true
  }, {
    key: 'document',
    title: '帮助文档',
    href: '',
    blankTarget: true
  }, {
    key: 'github',
    title: '问题反馈',
    href: '',
    blankTarget: true
  }];

  const copyright = '@2019';

  return (
    <DocumentTitle
      title={getPageTitle({
        pathname: location.pathname,
        breadcrumb,
        formatMessage,
        ...props,
      })}
    >
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>后台管理系统</span>
              </Link>
            </div>
            <div className={styles.desc}>GGC ADMIN</div>
          </div>
          {children}
        </div>
        <DefaultFooter links={links} copyright={copyright}/>
      </div>
    </DocumentTitle>
  );
};

export default connect(({ settings }: ConnectState) => ({
  ...settings,
}))(UserLayout);

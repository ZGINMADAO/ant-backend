export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/welcome',
          },
          {
            path: '/welcome',
            name: 'welcome',
            icon: 'smile',
            component: './Welcome',
          },
          {
            name: 'basic-form',
            path: '/form/basic-form',
            component: './form/basic-form',
          },
          {
            name: 'demo-one',
            path: '/demo/one',
            component: './demo/one',
          },
          {
            name: 'demo-form',
            path: '/demo/form',
            component: './demo/form/index.tsx',
          },
          {
            name: 'demo-chart',
            path: '/demo/chart',
            component: './demo/chart/index.tsx',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
]

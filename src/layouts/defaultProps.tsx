export default {
  route: {
    routes: [
      {
        name: '登录',
        path: '/login',
        hideInMenu: true,
        component: '@/pages/Login/index',
      },
      {
        name: '初始化',
        path: '/initialization',
        hideInMenu: true,
        component: '@/pages/initialization/index',
      },
      {
        name: '错误',
        path: '/error',
        hideInMenu: true,
        component: '@/pages/error/index',
      },
      {
        name: '定时任务',
        path: '/crontab',
        component: '@/pages/Crontab/index',
      },
      {
        path: '/subscription',
        name: '订阅管理',
        component: '@/pages/Subscription/index',
      },
      {
        name: '环境变量',
        path: '/environment',
        component: '@/pages/Environment/index',
      },
      {
        path: '/config',
        name: '配置文件',
        component: '@/pages/Config/index',
      },
      {
        path: '/script',
        name: '脚本管理',
        component: '@/pages/script/index',
      },
      {
        path: '/dependence',
        name: '依赖管理',
        component: '@/pages/Dependence/index',
      },
      {
        path: '/diff',
        name: '对比工具',
        component: '@/pages/diff/index',
      },
      {
        path: '/log',
        name: '任务日志',
        component: '@/pages/Log/index',
      },
      {
        path: '/setting',
        name: '系统设置',
        component: '@/pages/password/index',
      },
      {
        path: '/about',
        name: '关于',
        component: '@/pages/About/index',
      },
    ],
  },
  navTheme: 'light',
  fixSiderbar: true,
  contentWidth: 'Fixed',
  splitMenus: false,
  siderWidth: 180,
} as any;

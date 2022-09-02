import { DifferenceSet, Info, Install, Log, Setting } from '@icon-park/react';
import '@icon-park/react/styles/index.css';
import IconFont from '@/components/iconfont';

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
        path: '/crontab',
        name: '定时任务',
        icon: <IconFont type="ql-icon-crontab" />,
        component: '@/pages/Crontab/index',
      },
      {
        path: '/subscription',
        name: '订阅管理',
        icon: <IconFont type="ql-icon-subs" />,
        component: '@/pages/subscription/index',
      },
      {
        path: '/env',
        name: '环境变量',
        icon: <IconFont type="ql-icon-env" />,
        component: '@/pages/env/index',
      },
      {
        path: '/config',
        name: '配置文件',
        icon: <IconFont type="ql-icon-config" />,
        component: '@/pages/config/index',
      },
      {
        path: '/script',
        name: '脚本管理',
        icon: <IconFont type="ql-icon-script" />,
        component: '@/pages/script/index',
      },
      {
        path: '/dependence',
        name: '依赖管理',
        icon: <Install theme="outline" size="16" fill="#333" />,
        component: '@/pages/Dependence/index',
      },
      {
        path: '/diff',
        name: '对比工具',
        icon: <DifferenceSet theme="outline" size="16" fill="#333" />,
        component: '@/pages/diff/index',
      },
      {
        path: '/log',
        name: '任务日志',
        icon: <Log theme="outline" size="16" fill="#333" />,
        component: '@/pages/Log/index',
      },
      {
        path: '/setting',
        name: '系统设置',
        icon: <Setting theme="outline" size="16" fill="#333" />,
        component: '@/pages/password/index',
      },
      {
        path: '/about',
        name: '关于',
        icon: <Info theme="outline" size="16" fill="#333" />,
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

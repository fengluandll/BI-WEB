import React from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  // eslint-disable-next-line no-underscore-dangle
  models: () => models.filter(m => !app._models.some(({ namespace }) => namespace === m)).map(m => import(`../models/${m}.js`)),
  // add routerData prop
  component: () => {
    const p = component();
    return new Promise((resolve, reject) => {
      p.then((Comp) => {
        resolve(props => <Comp {...props} routerData={getRouterData(app)} />);
      }).catch(err => reject(err));
    });
  },
});

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = item.name;
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = item.name;
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerData = {
    '/': {
      component: dynamicWrapper(app, [], () => import('../layouts/BasicLayout')),
    },
    '/ds': {
      component: dynamicWrapper(app, ['ds'], () => import('../routes/DataSource/DataSource')),
    },
    '/dl': {
      component: dynamicWrapper(app, ['dl'], () => import('../routes/DataSet/DataSet')),
    },
    '/dlColumn/:id': {
      component: dynamicWrapper(app, ['dlColumn'], () => import('../routes/DataSet/DataSetColumn')),
    },
    '/dashboard': {
      component: dynamicWrapper(app, ['dashboard'], () => import('../routes/Dashboard/Dashboard')),
    },
    '/newDashboard/:pageId?': {
      component: dynamicWrapper(app, ['newDashboard'], () => import('../routes/Dashboard/NewDashboard')),
    },
    '/report/:reportId': {
      component: dynamicWrapper(app, ['report'], () => import('../routes/Report/Report')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/editCharts/:chartId': {
      component: dynamicWrapper(app, ['editCharts'], () => import('../routes/EditCharts/EditCharts')),
    },
    '/reportBoard/:boardId': {
      component: dynamicWrapper(app, ['reportBoard'], () => import('../routes/EditCharts/ReportBoard')),
    },
    '/editBoard/:t_dashboard_id': {
      component: dynamicWrapper(app, ['editBoard'], () => import('../routes/EditCharts/EditBoard')),
    },
    '/bigScreen/:screen_id': {
      component: dynamicWrapper(app, ['bigScreen'], () => import('../routes/BigScreen/BigScreen')),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  const routerDataWithName = {};
  Object.keys(routerData).forEach((item) => {
    routerDataWithName[item] = {
      ...routerData[item],
      name: routerData[item].name || menuData[item.replace(/^\//, '')],
    };
  });
  return routerDataWithName;
};

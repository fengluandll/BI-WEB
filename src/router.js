import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { getRouterData } from './common/router';


// dynamic.setDefaultLoadingComponent(() => {
//   return <Spin size="large" className={styles.globalSpin} />;
// });

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  // const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          {/* <Route path="/user" render={props => <UserLayout {...props} />} />*/}
          <Route path="/" render={props => <BasicLayout {...props} />} />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;

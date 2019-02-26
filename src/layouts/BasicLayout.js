import React from 'react';
import { Layout } from 'antd';
import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import { getMenuData } from '../common/menu';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import styles from '../index.less';

const { Content } = Layout;


/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = (item) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `/${item.path}`,
        to: `/${item.children[0].path}`,
      });
      item.children.forEach((children) => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);


class BasicLayout extends React.PureComponent {

  state = {};


  render() {
    const {
      collapsed, routerData, match, location, dispatch,
    } = this.props;
    let layout = (<div />);
    if (location.pathname.indexOf('/report/') >= 0) {
      layout = (
        <Content className={styles.content} id="bi-content">
          <Switch>
            {
              getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))
            }
            <Redirect exact from="/" to="/ds" />
            <Route render={NotFound} />
          </Switch>
        </Content>
      );
    } else if (location.pathname.indexOf('/editCharts/') >= 0 || location.pathname.indexOf('/editBoard/') >= 0) {
      layout = (
        <Content className={styles.content} id="bi-content">
          <Switch>
            {
              getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))
            }
            <Redirect exact from="/" to="/ds" />
            <Route render={NotFound} />
          </Switch>
        </Content>
      );
    } else if (location.pathname.indexOf('/reportBoard/') >= 0) {
      layout = (
        <Content className={styles.content} id="bi-content">
          <Switch>
            {
              getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))
            }
            <Redirect exact from="/" to="/ds" />
            <Route render={NotFound} />
          </Switch>
        </Content>
      );
    }
    else {
      layout = (
        <Layout>
          <SiderMenu
            id="bi-sider"
            collapsed={collapsed}
            location={location}
            dispatch={dispatch}
          />
          <Layout>
            <GlobalHeader id="bi-header" />
            <Content className={styles.content} id="bi-content">
              <Switch>
                {
                  getRoutes(match.path, routerData).map(item => (
                    <Route
                      key={item.key}
                      path={item.path}
                      component={item.component}
                      exact={item.exact}
                    />
                  ))
                }
                <Redirect exact from="/" to="/ds" />
                <Route render={NotFound} />
              </Switch>
            </Content>
            <GlobalFooter
              id="bi-footer"
              copyright={
                <div>
                  BI Design ©2018
                </div>
              }
            />
          </Layout>
        </Layout>
      );
    }
    return layout;
  }
}

export default connect()(BasicLayout);

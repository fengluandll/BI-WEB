import React, { PureComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import styles from './index.less';
import { getMenuData } from '../../common/menu';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.menus = getMenuData();
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
      collapsed: false,
    };
  }
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };
  getNavMenuItems(menusData) {
    if (!menusData) {
      return [];
    }
    return menusData.map((item) => {
      if (!item.name) {
        return null;
      }
      let itemPath;
      if (item.path && item.path.indexOf('http') === 0) {
        itemPath = item.path;
      } else {
        itemPath = `/${item.path || ''}`.replace(/\/+/g, '/');
      }
      if (item.children && item.children.some(child => child.name)) {
        return item.hideInMenu ? null :
          (
            <SubMenu
              title={
                item.icon ? (
                  <span>
                    <Icon type={item.icon} />
                    <span>{item.name}</span>
                  </span>
                ) : item.name
              }
              key={item.key || item.path}
            >
              {this.getNavMenuItems(item.children)}
            </SubMenu>
          );
      }
      const icon = item.icon && <Icon type={item.icon} />;
      return item.hideInMenu ? null :
        (
          <Menu.Item key={item.key || item.path}>
            {
              // /^https?:\/\//.test(itemPath) ? (
              //   <a href={itemPath} target={item.target}>
              //     {icon}<span>{item.name}</span>
              //   </a>
              // ) : (
              //   <Link
              //      to={itemPath}
              //     // target={item.target}
              //     // replace={itemPath === this.props.location.pathname}
              //     // onClick={this.props.isMobile && (() => { this.props.onCollapse(true); })}
              //   >
              //     {icon}<span>{item.name}</span>
              //   </Link>
              // )
              <Link
                to={itemPath}
                // target={item.target}
                // replace={itemPath === this.props.location.pathname}
                // onClick={this.props.isMobile && (() => { this.props.onCollapse(true); })}
              >
                {icon}<span>{item.name}</span>
              </Link>
            }
          </Menu.Item>
        );
    });
  }
  getSelectedMenuKeys = (path) => {
    const flatMenuKeys = this.getFlatMenuKeys(this.menus);

    if (flatMenuKeys.indexOf(path.replace(/^\//, '')) > -1) {
      return [path.replace(/^\//, '')];
    }
    if (flatMenuKeys.indexOf(path.replace(/^\//, '').replace(/\/$/, '')) > -1) {
      return [path.replace(/^\//, '').replace(/\/$/, '')];
    }
    return flatMenuKeys.filter((item) => {
      const itemRegExpStr = `^${item.replace(/:[\w-]+/g, '[\\w-]+')}$`;
      const itemRegExp = new RegExp(itemRegExpStr);
      return itemRegExp.test(path.replace(/^\//, ''));
    });
  };
  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach((item) => {
      if (item.children) {
        keys.push(item.path);
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      } else {
        keys.push(item.path);
      }
    });
    return keys;
  }
  getDefaultCollapsedSubMenus(props) {
    const { location: { pathname } } = props || this.props;
    const snippets = pathname.split('/').slice(1, -1);
    const currentPathSnippets = snippets.map((item, index) => {
      const arr = snippets.filter((_, i) => i <= index);
      return arr.join('/');
    });
    let currentMenuSelectedKeys = [];
    currentPathSnippets.forEach((item) => {
      currentMenuSelectedKeys = currentMenuSelectedKeys.concat(this.getSelectedMenuKeys(item));
    });
    if (currentMenuSelectedKeys.length === 0) {
      return ['dashboard'];
    }
    return currentMenuSelectedKeys;
  }
  handleOpenChange = (openKeys) => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const isMainMenu = this.menus.some(
      item => lastOpenKey && (item.key === lastOpenKey || item.path === lastOpenKey),
    );
    this.setState({
      openKeys: isMainMenu ? [lastOpenKey] : [...openKeys],
    });
  };
  render() {
    const { location: { pathname }, id } = this.props;
    // Don't show popup menu when it is been collapsed
    const menuProps = {
      openKeys: this.state.openKeys,
    };
    return (
      <Sider
        // trigger={null}
        id={id}
        collapsible
        collapsed={this.state.collapsed}
        breakpoint="md"
        onCollapse={this.onCollapse}
        className={styles.sider}
        width={256}
      >
        <div className={styles.logo}>
          <Link to="/">
            {/* <img src={logo} alt="logo" /> */}
            <h1>BI Design</h1>
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          {...menuProps}
          onOpenChange={this.handleOpenChange}
          selectedKeys={this.getSelectedMenuKeys(pathname)}
          style={{ padding: '16px 0', width: '100%' }}
        >
          {/* <button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>*/}
          {/* <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />*/}
          {/* </button>*/}
          {this.getNavMenuItems(this.menus)}
        </Menu>
      </Sider>
    );
  }
}

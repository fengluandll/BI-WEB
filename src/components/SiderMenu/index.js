import React, { PureComponent } from 'react';
import SiderMenu from './SiderMenu';

export default class Index extends PureComponent {
  onCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  render() {
    return (<SiderMenu
      {...this.props}
      onCollapse={this.onCollapse}
    />);
  }
}

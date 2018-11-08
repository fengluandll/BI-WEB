import React, { PureComponent } from 'react';
import { Tabs, Icon } from 'antd';

const TabPane = Tabs.TabPane;
/**
 * Tabs包装类,仪表板编辑页使用
 */
export default class Index extends PureComponent {
  // 渲染容器中元素
  renderContent = (name, data, isReport) => data.map((item) => {
    // add by wangliu  0829 显示的时候讲 控件加上 布局 css
    const{margintop,marginleft,height,width} = item.styleConfigs;
    let searchIndex;   // 头部搜索框下拉框 显示
    if (item.type == "search") {
      searchIndex = (
        { zIndex: '1', }
      )
    }
    // 兼容旧模板
    if(null == width){
      return (
        <div key={item.name} className={'bi-container'}
          onClick={(e) => {
            if (this.props.onClick && typeof this.props.onClick === 'function') {
              e.stopPropagation();
              this.props.onClick(name, item.name, e);
            }
          }}
        >
          { !isReport ? (
            <Icon
              type="close"
              className={'del-icon'}
              onClick={() => {
                this.props.onCompDelte(item.name);
              }}
            />
          ) : ''}
          {item.render()}
        </div>
      );
    }
    return (
      <div key={item.name+"_bi-container-css"} className={'bi-container-css'} style={searchIndex}>
      <div key={item.name} className={'bi-container'}
      style={{position:'absolute',marginTop:margintop,marginLeft:marginleft+'%',width:width+'%',}}
        onClick={(e) => {
          if (this.props.onClick && typeof this.props.onClick === 'function') {
            e.stopPropagation();
            this.props.onClick(name, item.name, e);
          }
        }}
      >
        { !isReport ? (
          <Icon
            type="close"
            className={'del-icon'}
            onClick={() => {
              this.props.onCompDelte(item.name);
            }}
          />
        ) : ''}
        {item.render()}
      </div>
      </div>
    );
  });
  render() {
    const { props } = this;
    const { height } = props.styleConfigs;
    return (
      <Tabs
        {...props}
      >
        {props.data.map((item) => {
          return (
            <TabPane tab={item.title} key={item.name} closable={false}>
              <div
                style={{ height, cursor: 'pointer', overflow: 'auto', padding: '0 3px 3px 3px' }}
                onClick={() => {
                  if (this.props.onClick && typeof this.props.onClick === 'function') {
                    this.props.onClick(item.name, null);
                  }
                }}
              >{this.renderContent(item.name, item.children, props.isReport)}</div>
            </TabPane>
          );
        })}
      </Tabs>
    );
  }
}

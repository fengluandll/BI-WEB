import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Checkbox, Tooltip } from 'antd';

import styles from './index.less';

/**
 * 仪表板-查询控件-字符筛选-枚举
 */
export default class Index extends PureComponent {
  constructor(props) {
    super(props);
    const { type, value, data } = this.props;
    this.state = {
      multiSelectItems: [],
      searchData: data,
      value,
      type,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { type, value, data } = nextProps;
    if (type === 'multi') {
      const flag = !!value;
      const multiSelectItems = [];
      data.forEach((item) => {
        if (flag && value.findIndex((val) => {
          return val === item.name;
        }) >= 0) {
          multiSelectItems.push(item);
        }
      });
      this.setState({
        multiSelectItems,
        searchData: data,
        value,
        type,
      });
    } else {
      this.setState({
        searchData: data,
        value,
        type,
      });
    }
  }
  multiSelectRefs = {};
  singleSelectedItem = null;
  singleChange = (ev) => {
    const target = ev.currentTarget;
    if (this.singleSelectedItem) {
      this.singleSelectedItem.className = this.singleSelectedItem.className.replace(styles['selected'], '');
    }
    target.className = `${target.className} ${styles['selected']}`;
    this.singleSelectedItem = target;

    const { data, onChange } = this.props;
    const id = this.singleSelectedItem.getAttribute('data-id');
    const selectedItem = data.find((item) => {
      return item.id === id;
    });
    //this.multiSelectDropdownValue.innerHTML = selectedItem.name;
    this.setState({
      value: selectedItem.name.split(','),
    });
    onChange(selectedItem);
    this.multiSelect.style.display = 'none';
  };
  multiChange = (selectedItems) => {
    const { onChange } = this.props;
    const content = selectedItems.reduce((accumulator, current) => {
      if (accumulator === '') {
        return current.name;
      } else {
        return `${accumulator},${current.name}`;
      }
    }, '');
    //this.multiSelectDropdownValue.innerHTML = content;
    this.setState({
      value: content.split(','),
    });
    onChange(selectedItems);
  };
  multiAdd = (ev) => {
    const target = ev.currentTarget;
    if (target.className.indexOf('selected') < 0) {
      const { data } = this.props;
      const id = target.getAttribute('data-id');
      const selectedItem = data.find((item) => {
        return item.id === id;
      });
      target.className = `${target.className} ${styles['selected']}`;
      const multiSelectItems = this.state.multiSelectItems.concat(selectedItem);
      this.setState({
        multiSelectItems,
      });
      this.multiChange(multiSelectItems);
    }
  };
  multiRemove = (ev) => {
    const target = ev.currentTarget;
    const id = target.getAttribute('data-id');
    // 清除选中项的样式
    const removeItem = this['multiSelectRefs'][`multiSelectItem-${id}`];
    removeItem.className = removeItem.className.replace(styles['selected'], '');
    const multiSelectItems = this.state.multiSelectItems.filter((item) => {
      return item.id !== id;
    });
    this.setState({
      multiSelectItems,
    });
    this.multiChange(multiSelectItems);
  };
  selectAll = (ev) => {
    if (ev.target.checked) {
      const { data } = this.props;
      const multiSelectRefs = this['multiSelectRefs'];
      const keys = Object.keys(multiSelectRefs);
      for (const key of keys) {
        const multiSelectRef = multiSelectRefs[key];
        if (multiSelectRef.className.indexOf('selected') < 0) {
          multiSelectRef.className = `${multiSelectRef.className} ${styles['selected']}`;
        }
      }
      this.setState({
        multiSelectItems: data,
      });
      this.multiChange(data);
    } else {
      this.clear();
    }
  };
  clear = () => {
    const multiSelectRefs = this['multiSelectRefs'];
    const keys = Object.keys(multiSelectRefs);
    for (const key of keys) {
      const multiSelectRef = multiSelectRefs[key];
      multiSelectRef.className = multiSelectRef.className.replace(styles['selected'], '');
    }
    this.setState({
      multiSelectItems: [],
    });
    this.multiChange([]);
  };
  open = () => {
    this.props.load();
    this.multiSelect.style.display = 'block';
    this.multiSelect.focus();
  };
  closed = (ev) => {
    // add by wangliu  0827 修改下拉框 消失不了的问题
    // const relatedTarget = ev.relatedTarget;
    // if (relatedTarget == null || (relatedTarget.localName === 'div' && relatedTarget.className === styles['multi-select-dropdown'])) {
    //   this.multiSelect.style.display = 'none';
    // }
    const relatedTarget = ev.relatedTarget;
    if (null != relatedTarget) {
      const pass = JSON.stringify(relatedTarget.className);
      if (pass.indexOf("multi-select-input") != -1) {
        return;
      }
    }
    this.multiSelect.style.display = 'none';
  };
  search = (ev) => {
    const { data } = this.props;
    const val = ev.target.value;
    let searchData = [];
    if (!val || val.length === 0) {
      searchData = this.props.data;
    } else {
      data.forEach((item) => {
        if (item.name.indexOf(val) >= 0) {
          searchData.push(item);
        }
      });
    }
    this.setState({
      searchData,
    });
  };
  render() {
    const { type, value } = this.state;
    const data = this.state.searchData;
    if (type === 'single') {
      return (
        <div className={styles['multi-select-panel']}>
          <div className={styles['multi-select-dropdown']} onFocus={this.open} tabIndex="0">
            <span className={styles['multi-select-dropdown-value']} ref={(n) => { this.multiSelectDropdownValue = n; }}>
              {value ? value[0] : ''}
            </span>
            <i className={classNames(styles['multi-select-dropdown-dropdown'], 'anticon', 'anticon-caret-down')} />
          </div>
          <div className={classNames(styles['multi-select'], styles['hide'])} onBlur={this.closed} tabIndex="0" ref={(n) => { this.multiSelect = n; }}>
            <div className={styles['multi-select-menu']} style={{ width: '100%' }}>
              <div className={styles['multi-select-menu-title']}>
                <input className={styles['multi-select-input']} placeholder="输入字段名" type="text" onBlur={this.closed} onChange={this.search} />
              </div>
              <ul className={styles['multi-select-list']}>
                {data.map((item) => {
                  const clsName = value && value[0] === item.name ? classNames(styles['multi-select-list-item'], styles['selected']) : styles['multi-select-list-item'];
                  return (
                    <li
                      className={clsName}
                      key={item.id}
                      data-id={item.id}
                      onClick={this.singleChange}
                    >
                      <span>
                        <Tooltip title={item.name} placement="leftTop">
                          <span>{item.name}</span>
                        </Tooltip>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      );
    } else {
      let content = '';
      if (value) {
        content = value.reduce((accumulator, current) => {
          if (accumulator === '') {
            return current;
          } else {
            return `${accumulator},${current}`;
          }
        }, '');
      }
      return (
        <div className={styles['multi-select-panel']}>
          <div className={styles['multi-select-dropdown']} onFocus={this.open} tabIndex="0">
            <span className={styles['multi-select-dropdown-value']} ref={(n) => { this.multiSelectDropdownValue = n; }}>
              {content}
            </span>
            <i className={classNames(styles['multi-select-dropdown-dropdown'], 'anticon', 'anticon-caret-down')} />
          </div>
          <div className={classNames(styles['multi-select'], styles['hide'])} onBlur={this.closed} tabIndex="0" ref={(n) => { this.multiSelect = n; }}>
            <div className={styles['multi-select-menu']} ref={(n) => { this.leftMenu = n; }} >
              <div className={styles['multi-select-menu-title']}>
                <input className={styles['multi-select-input']} placeholder="输入字段名" type="text" onChange={this.search} />
              </div>
              <ul className={styles['multi-select-list']}>
                {data.map((item) => {
                  const clsName = value && value.indexOf(item.name) >= 0 ? classNames(styles['multi-select-list-item'], styles['selected']) : styles['multi-select-list-item'];
                  return (
                    <li className={clsName} key={item.id} data-id={item.id} onClick={this.multiAdd} ref={(n) => { this['multiSelectRefs'][`multiSelectItem-${item.id}`] = n; }}>
                      <span>
                        <Tooltip title={item.name} placement="leftTop">
                          <span>{item.name}</span>
                        </Tooltip>
                      </span>
                      <i className={classNames(styles['multi-select-list-item-add-btn'], 'anticon', 'anticon-plus-circle-o')} />
                    </li>
                  );
                })}
              </ul>
              <div className={styles['multi-select-all']}>
                <Checkbox onChange={this.selectAll}>全选</Checkbox>
              </div>
            </div>
            <div className={styles['multi-select-split']} />
            <div className={styles['multi-select-menu']}>
              <div className={styles['multi-select-menu-title']}>
                <span className={styles['multi-select-menu-title-content']}>已添加</span>
              </div>
              {this.state.multiSelectItems.length === 0 ? (
                <div className={styles['hint-add']}><span>请从左侧列表添加</span></div>
              ) : (
                  <div>
                    <ul className={styles['multi-select-list']}>
                      {this.state.multiSelectItems.map((item) => {
                        return (
                          <li className={styles['multi-select-list-item']} key={item.id} data-id={item.id} onClick={this.multiRemove}>
                            <span>
                              <Tooltip title={item.name} placement="rightTop">
                                <span>{item.name}</span>
                              </Tooltip>
                            </span>
                            <i className={classNames(styles['multi-select-list-item-add-btn'], 'anticon', 'anticon-delete')} />
                          </li>
                        );
                      })}
                    </ul>
                    <div className={classNames(styles['multi-select-footer'])}>
                      <span className="pull-right" style={{ cursor: 'pointer' }} onClick={this.clear}>
                        <i className="anticon anticon-delete" />清空
                    </span>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      );
    }
  }
}

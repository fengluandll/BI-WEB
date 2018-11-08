import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Tree, Menu, Icon, Card, Dropdown, Button, Spin, Table, message } from 'antd';
import DraggableModal from '../../components/Modal';
import { MeasureForm, DimensionForm, AddCalcForm, SaveForm } from '../../components/DataSet';
import D from '../../utils/objectUtils';

import styles from './index.less';

const TreeNode = Tree.TreeNode;

class DataSetColumn extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rightClickNodeTreeItem: null, // 右键菜单响应项
      editModalVisible: null, // 编辑模态框是否可见
      saveModalVisible: null, // 保存模态框是否可见
      saveLoading: false, // 保存状态
      loading: false,  // 加载状态
    };
  }
  componentDidMount = () => {
    const id = this.props.match.params.id;
    this.props.dispatch({
      type: 'dlColumn/fetchColumn',
      payload: { id },
    });
  };
  componentWillUnmount() {
    this.props.dispatch({
      type: 'dlColumn/cleanUp',
    });
  }
  getColumn = (id) => {
    const { rest: { list } } = this.props;
    let obj = null;
    list.forEach((item) => {
      if (item.id === parseInt(id, 10)) {
        obj = item;
      }
    });
    return obj;
  };
  /**
   * 打开右键菜单
   */
  getNodeTreeRightClickMenu = () => {
    if (this.state.rightClickNodeTreeItem == null) {
      return '';
    }
    const { pageX, pageY } = { ...this.state.rightClickNodeTreeItem };
    const width = pageX - document.getElementById('bi-sider').offsetWidth;
    const headerHeight = document.getElementById('bi-header').offsetHeight; // 头部导航高度
    const menuHeight = 152; // 弹出菜单高度
    const tmpStyle = {
      position: 'absolute',
      left: `${width}px`,
    };
    if (document.documentElement.clientHeight >= menuHeight + headerHeight + pageY) {
      Object.assign(tmpStyle, {
        top: `${pageY - headerHeight}px`,
      });
    } else {
      Object.assign(tmpStyle, {
        bottom: '2px',
      });
    }
    const subComponent = 'contentMenu';
    let copy = '度量';
    let retweet = '维度';
    let name = 'dimension';
    if (this.state.rightClickNodeTreeItem.item.rscCategory === 1) {
      copy = '维度';
      retweet = '度量';
      name = 'measure';
    }
    const menu = (
      <Menu
        ref={subComponent}
        onClick={this.handleMenuClick}
        style={tmpStyle}
        className={styles.tree_right_menu}
      >
        <Menu.Item key="edit" className={styles.tree_right_menu_item}><Icon type="edit" />编辑</Menu.Item>
        <Menu.Item key="copy" className={styles.tree_right_menu_item}><Icon type="copy" />克隆{copy}</Menu.Item>
        <Menu.Item key="delete" className={styles.tree_right_menu_item}><Icon type="close" />删除</Menu.Item>
        <Menu.Item key="addCalc" name={name} className={styles.tree_right_menu_item}><Icon type="plus" />新建计算字段({copy})</Menu.Item>
        <Menu.Item key="convert" className={styles.tree_right_menu_item}><Icon type="retweet" />转换为{retweet}</Menu.Item>
      </Menu>
    );
    return menu;
  };
  /**
   * 提交修改action并关闭模态框
   */
  deleteColumn = () => {
    const id = this.state.deleteModalVisible.id;
    this.props.dispatch({
      type: 'dlColumn/deleteColumn',
      payload: { id },
    });
    // close delete modal
    this.setState({
      deleteModalVisible: null,
    });
  };
  /**
   * 新增计算字段
   */
  addCalcColumn = () => {
    const { editForm } = this;
    const changeFields = editForm.getFieldsValue();
    const column = this.state.addCalcModalVisible;
    //  iterator
    const pass = Object.keys(changeFields).every((item) => {
      return column[item] === changeFields[item];
    });
    const obj = Object.assign({}, column, changeFields);
    const keys = Object.keys(obj);
    // delete undefined/null
    for (const key of keys) {
      if (obj[key] === null || obj[key] === undefined) {
        delete obj[key];
      }
    }
    for (const key of keys) {
      if (obj[key] === null || obj[key] === undefined) {
        delete obj[key];
      }
    }
    if (!pass) {
      editForm.validateFields(
        (err) => {
          if (!err) {
            // submit update
            this.props.dispatch({
              type: 'dlColumn/updateColumn',
              payload: {
                o: obj,
              },
            });
          }
        },
      );
    }
    // close edit modal
    this.setState({
      addCalcModalVisible: null,
    });
  };
  /**
   * 提交修改action并关闭模态框
   */
  updateColumn = () => {
    const { editForm } = this;
    const changeFields = editForm.getFieldsValue();
    const column = this.state.editModalVisible.item;
    //  iterator
    const pass = Object.keys(changeFields).every((item) => {
      return column[item] === changeFields[item];
    });
    const obj = Object.assign({}, column, changeFields);
    const keys = Object.keys(obj);
    // delete undefined/null
    for (const key of keys) {
      if (obj[key] === null || obj[key] === undefined) {
        delete obj[key];
      }
    }
    if (!pass) {
      editForm.validateFields(
        (err) => {
          if (!err) {
            // submit update
            this.props.dispatch({
              type: 'dlColumn/updateColumn',
              payload: {
                o: obj,
              },
            });
          }
        },
      );
    }
    // close edit modal
    this.setState({
      editModalVisible: null,
    });
  };
  /**
   * 右键菜单响应事件
   * @param key
   * @param item
   * @param domEvent
   * @param keyPath
   */
  handleMenuClick = ({ key, item }) => {
    switch (key) {
    case 'edit':
      this.showEditModal();
      break;
    case 'copy':
      this.copyColumn();
      break;
    case 'delete':
      this.showDeleteModal();
      break;
    case 'addCalc':
      this.showAddCalcModal(item.props.name);
      break;
    case 'convert':
      this.convert();
      break;
    default:
    }
  };
  // 编辑
  showEditModal = () => {
    this.setState({
      editModalVisible: this.state.rightClickNodeTreeItem,
    });
  };
  // 删除
  showDeleteModal = () => {
    this.setState({
      deleteModalVisible: this.state.rightClickNodeTreeItem.item,
    });
  };
  // 克隆
  copyColumn = () => {
    const item = D.deepClone(this.state.rightClickNodeTreeItem.item);
    item.rscDisplay = `${item.rscDisplay}备份`;
    item.id = Math.floor(Math.random() * 100000);
    this.props.dispatch({
      type: 'dlColumn/updateColumn',
      payload: {
        o: item,
      },
    });
  };
  // 新建计算字段
  showAddCalcModal = (name) => {
    const item = this.props.rest.list[0];
    const o = D.deepClone(item);
    D.clearAllVal(o);
    if (name === 'dimension') {
      o.rscCategory = 1;
      o.rscType = '2';
    } else {
      o.rscCategory = 2;
      o.rscType = '1';
    }
    o.isCalc = 'Y';
    o.rsTId = this.props.match.params.id;
    o.id = Math.floor(Math.random() * 100000);
    this.setState({
      addCalcModalVisible: o,
    });
  };
  // 转换为度量/维度
  convert = () => {
    const item = this.state.rightClickNodeTreeItem.item;
    item.rscCategory = item.rscCategory === 1 ? 2 : 1;
    this.props.dispatch({
      type: 'dlColumn/updateColumn',
      payload: {
        o: item,
      },
    });
  };
  // clear right menu
  handleClick = () => {
    this.setState({
      rightClickNodeTreeItem: null,
    });
  };
  // 关闭 - 编辑
  hideEditModal = () => {
    this.setState({
      editModalVisible: null,
    });
  };
  // 关闭 - 删除
  hideDeleteModal = () => {
    this.setState({
      deleteModalVisible: null,
    });
  };
  // 关闭 - 新增计算字段
  hideAddCalcModal = () => {
    this.setState({
      addCalcModalVisible: null,
    });
  };
  // 关闭 - 保存
  hideSaveModal = () => {
    this.setState({
      saveModalVisible: null,
    });
  };
  /**
   * 右键响应菜单
   * @param event
   * @param node
   */
  treeOnRightClick = ({ event, node }) => {
    const status = {
      pageX: event.pageX,
      pageY: event.pageY,
      id: node.props.eventKey,
      categoryName: node.props.title,
      item: null,
    };
    if (status.id !== 'dimension' && status.id !== 'measure') {
      status.item = this.getColumn(status.id);
      this.setState({
        rightClickNodeTreeItem: status,
      });
    }
  };
  /**
   * 合并-数据
   */
  mergeData = () => {
    // 区分维度 / 度量
    const { list, refreshList } = this.props.rest;
    const treeList = [[], []];
    const previewData = [];
    const previewList = [];
    list.forEach((item) => {
      if (item.rscCategory === 2) {
        treeList[1].push(item);
      } else {
        treeList[0].push(item);
      }
      previewData.push({
        title: <div className={styles.ellipsis} style={{ width: '120px' }} title={item.rscDisplay}>{item.rscDisplay}</div>,
        dataIndex: item.rscDisplay,
        key: item.dsDisplay,
        width: 150,
        render: text => <div className={styles.ellipsis} style={{ width: '120px' }} title={text}>{text}</div>,
      });
    });
    refreshList.forEach((item) => {
      const data = Object.assign({}, item);
      data.key = item.ID;
      previewList.push(data);
    });
    // 树结构(维度/度量)
    this.data = treeList;
    // 预览表格-columns
    this.previewData = previewData;
    // 预览表格-list
    this.previewList = previewList;
  };
  /**
   * 保存/另存为 当前所有配置
   */
  saveColumn = ({ key }) => {
    switch (key) {
    case 'save':
      this.setState({
        saveModalVisible: 'save',
      });
      break;
    case 'saveAs':
      this.setState({
        saveModalVisible: 'saveAs',
      });
      break;
    default:
    }
  };
  submitSave = () => {
    const dsDisplay = this.editForm.getFieldValue('dsDisplay');
    this.setState({
      saveLoading: true,
    });
    // 判断数据集名称是否存在
    this.props.dispatch({
      type: 'dlColumn/saveColumn',
      payload: {
        id: this.props.rest.table.dsId,
        name: dsDisplay,
        type: this.state.saveModalVisible,
        onSuccess: (n) => {
          this.setState({
            saveModalVisible: null,
            saveLoading: false,
          });
          if (n === 1) {
            message.warning('数据集名称重复');
          } else {
            message.success('保存成功');
          }
        },
      },
    });
  };
  /**
   * 获取表单对象
   */
  changeEditForm = (form) => {
    this.editForm = form;
  };
  sync = ({ key }) => {
    switch (key) {
    case 'sync':
      this.setState({
        loading: true,
      });
      // 同步表结构
      this.props.dispatch({
        type: 'dlColumn/sync',
        payload: {
          onSuccess: () => {
            this.setState({
              loading: false,
            });
          },
        },
      });
      break;
    case 'refreshData':
      // 刷新预览数据
      this.props.dispatch({
        type: 'dlColumn/refreshData',
      });
      break;
    default:
    }
  };
  /** 功能按钮 */
  syncMenu = (
    <Menu onClick={this.sync}>
      <Menu.Item key="sync">同步表结构</Menu.Item>
      <Menu.Item key="refreshData">预览数据</Menu.Item>
    </Menu>
  );
  saveMenu = (
    <Menu onClick={this.saveColumn}>
      <Menu.Item key="save">保存</Menu.Item>
      <Menu.Item key="saveAs">另存为</Menu.Item>
    </Menu>
  );
  /**
   * 渲染保存确认Modal
   * @returns {*}
   */
  renderSaveModal = () => {
    const item = this.state.saveModalVisible;
    if (item == null) {
      return '';
    }
    const modal = (<DraggableModal
      title="保存"
      visible
      onOk={this.submitSave}
      onCancel={this.hideSaveModal}
      destroyOnClose
      maskClosable={false}
      confirmLoading={this.state.saveLoading}
      okText="确认"
      cancelText="取消"
    >
      <SaveForm
        fields={this.props.rest.table}
        onLoad={this.changeEditForm}
      />
    </DraggableModal>);
    return modal;
  };
  /**
   * 渲染-新建计算字段模态框
   */
  renderAddCalcModal = () => {
    const item = this.state.addCalcModalVisible;
    if (item == null) {
      return '';
    }
    const modal = (<DraggableModal
      title="新建计算字段"
      visible
      onOk={this.addCalcColumn}
      onCancel={this.hideAddCalcModal}
      destroyOnClose
      maskClosable={false}
      okText="确认"
      cancelText="取消"
    >
      <AddCalcForm
        fields={item}
        onLoad={this.changeEditForm}
      />
    </DraggableModal>);
    return modal;
  };
  /**
   * 渲染删除模态框
   * @returns {*}
   */
  renderDeleteModal = () => {
    const item = this.state.deleteModalVisible;
    if (item == null) {
      return '';
    }
    const modal = (<DraggableModal
      title="删除"
      visible
      onOk={this.deleteColumn}
      onCancel={this.hideDeleteModal}
      destroyOnClose
      maskClosable={false}
      okText="确认"
      cancelText="取消"
    >
      确定删除{item.rscDisplay}吗？
    </DraggableModal>);
    return modal;
  };
  /**
   * 渲染编辑表单
   * @param dsCl  DataColumn
   * @returns {XML}
   */
  renderEditForm = (dsCl) => {
    if (dsCl.isCalc === 'Y') {
      return (<AddCalcForm
        fields={dsCl}
        onLoad={this.changeEditForm}
      />);
    } else if (dsCl.rscCategory === 1) {
      return (<DimensionForm
        fields={dsCl}
        onLoad={this.changeEditForm}
      />);
    } else {
      return (<MeasureForm
        fields={dsCl}
        onLoad={this.changeEditForm}
      />);
    }
  };
  /**
   * 渲染编辑模态框
   * @returns {*}
   */
  renderEditModal = () => {
    if (this.state.editModalVisible == null) {
      return '';
    }
    const dsCl = this.state.editModalVisible.item;
    const modal = (<DraggableModal
      title={`编辑${dsCl.rscDisplay}`}
      visible
      onOk={this.updateColumn}
      onCancel={this.hideEditModal}
      destroyOnClose
      maskClosable={false}
      okText="确认"
      cancelText="取消"
    >
      {this.renderEditForm(dsCl)}
    </DraggableModal>);
    return modal;
  };
  render() {
    this.mergeData();
    const tableX = 150 * this.previewData.length;
    const loop = data => data.map((item) => {
      if (item.children && item.children.length) {
        return (<TreeNode key={item.id} title={item.rscDisplay} className={styles.antTreeNode}>
          {loop(item.children)}
        </TreeNode>);
      }
      return <TreeNode key={item.id} title={item.rscDisplay} className={styles.antTreeNode} />;
    });
    const saveModalVisible = this.state.saveModalVisible !== null;

    return (
      <Spin spinning={this.state.loading}>
        <div style={{ height: '100%' }} onClick={this.handleClick}>
          <div className={styles.sider_tree} style={{ borderRight: 'none' }}>
            {this.getNodeTreeRightClickMenu()}
            <Card title="维度" extra={<span className={styles.iconCls} onClick={() => { this.showAddCalcModal('dimension'); }}><Icon type="plus" /></span>} style={{ height: '50%', borderBottom: 'none' }}>
              <Tree
                className="draggable-tree"
                defaultExpandAll
                onRightClick={this.treeOnRightClick}
              >
                {loop(this.data[0])}
              </Tree>
            </Card>
            <Card title="度量" extra={<span className={styles.iconCls} onClick={() => { this.showAddCalcModal('measure'); }}><Icon type="plus" /></span>} style={{ height: '50%' }}>
              <Tree
                className="draggable-tree"
                defaultExpandAll
                onRightClick={this.treeOnRightClick}
              >
                {loop(this.data[1])}
              </Tree>
            </Card>
          </div>
          <div className={styles.workTable}>
            {/* 工具栏 */}
            <div className={styles.toolBar} >
              <Dropdown overlay={this.syncMenu}>
                <Button>
                  同步 <Icon type="down" />
                </Button>
              </Dropdown>
              <Dropdown overlay={this.saveMenu}>
                <Button style={{ marginLeft: 8 }}>
                  保存 <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
            <Table
              id="previewTb"
              columns={this.previewData}
              pagination={false}
              bordered dataSource={this.previewList}
              size="smalls"
              scroll={{ x: tableX, y: 400 }}
            />
          </div>
          {this.renderEditModal()}
          {this.renderDeleteModal()}
          {this.renderAddCalcModal()}
          <DraggableModal
            title="保存"
            visible={saveModalVisible}
            onOk={this.submitSave}
            onCancel={this.hideSaveModal}
            destroyOnClose
            maskClosable
            confirmLoading={this.state.saveLoading}
            okText="确认"
            cancelText="取消"
          >
            <SaveForm
              fields={this.props.rest.table}
              onLoad={this.changeEditForm}
            />
          </DraggableModal>
        </div>
      </Spin>
    );
  }
}
export default connect(state => ({
  rest: state.dlColumn,
}))(DataSetColumn);

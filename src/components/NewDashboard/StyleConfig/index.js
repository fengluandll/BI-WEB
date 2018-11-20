import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Checkbox, Row, Col, Radio, Select } from 'antd';
import NumberInput from '../../NumberInput';

import styles from './index.less';

const RadioGroup = Radio.Group;
const Option = Select.Option;
/**
 * 仪表板-样式配置
 */
export default class Index extends PureComponent {
  change = (func) => {
    const { comp } = this.props;
    func(comp.styleConfigs);
    this.props.onChange();
  };
  changeTitle = (e) => {
    this.change((styleConfigs) => {
      styleConfigs.title.name = e.target.value;
    });
  };
  changeTitleVisible = (e) => {
    this.change((styleConfigs) => {
      styleConfigs.title.visible = e.target.checked;
    });
  };
  changeHeadVisible = (e) => {
    this.change((styleConfigs) => {
      styleConfigs.head = e.target.checked;
    });
  };
  changeHeight = (value) => {
    this.change((styleConfigs) => {
      if (!isNaN(value) && value !== '') {
        styleConfigs.height = parseInt(value, 10);
      }
    });
  };
  changeWidth = (value) => {
    this.change((styleConfigs) => {
      if (!isNaN(value) && value !== '') {
        styleConfigs.width = parseInt(value, 10);
      }
    });
  };
  changeMarginTop = (value) => {
    this.change((styleConfigs) => {
      if (!isNaN(value) && value !== '') {
        styleConfigs.margintop = parseInt(value, 10);
      }
    });
  };
  changeMarginLeft = (value) => {
    this.change((styleConfigs) => {
      if (!isNaN(value) && value !== '') {
        styleConfigs.marginleft = parseInt(value, 10);
      }
    });
  };
  changeHorizontal = (e) => {
    this.change((styleConfigs) => {
      styleConfigs.horizontal = e.target.checked;
    });
  };
  changeLegend = (e) => {
    this.change((styleConfigs) => {
      styleConfigs.legend.visible = e.target.checked;
    });
  };
  changeStack = (e) => {
    this.change((styleConfigs) => {
      styleConfigs.stack = e.target.checked;
    });
  };
  changePercent = (e) => {
    this.change((styleConfigs) => {
      styleConfigs.percent = e.target.checked;
    });
  };
  changeRowHeaders = (e) => {
    this.change((styleConfigs) => {
      styleConfigs.rowHeaders = e.target.checked;
    });
  };
  changeFixedEnable = (e) => {
    this.change((styleConfigs) => {
      styleConfigs.fixed.enable = e.target.checked;
    });
  };
  changeFixedColumnsLeft = (value) => {
    this.change((styleConfigs) => {
      styleConfigs.fixed.fixedColumnsLeft = value;
    });
  };
  changeOrderBy = (e) => {
    this.change((styleConfigs) => {
      styleConfigs.orderBy = e.target.value;
    });
  }
  renderPieConfig = () => {
    const { styleConfigs, name } = this.props.comp;
    return (
      <div key={name}>
        <input className={classNames(styles['int'], 'ant-input')} placeholder="请输入标题" value={styleConfigs.title.name || ''} onChange={this.changeTitle} />
        <Row>
          <Col span={12}>
            <Checkbox
              defaultChecked={styleConfigs.title.visible}
              onChange={this.changeTitleVisible}
            >显示标题</Checkbox>
          </Col>
          <Col span={12}><Checkbox onChange={() => { }}>轴标题</Checkbox></Col>
        </Row>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="高度"
              className={styles.int}
              defaultValue={styleConfigs.height}
              onChange={this.changeHeight}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="上边距"
              className={styles.int}
              defaultValue={styleConfigs.margintop}
              onChange={this.changeMarginTop}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="宽度(%)"
              className={styles.int}
              defaultValue={styleConfigs.width}
              onChange={this.changeWidth}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="左边距(%)"
              className={styles.int}
              defaultValue={styleConfigs.marginleft}
              onChange={this.changeMarginLeft}
            />
          </Col>
        </Row>
        <Row>
          <Col span={8}><span className="label-12">显示模式</span></Col>
          <Col span={16}>
            <RadioGroup name="pieType" defaultValue={1} onChange={() => { }}>
              <Radio value={1}>默认</Radio>
              <Radio value={2}>空心</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row>
          <Col span={12}><Checkbox onChange={() => { }}>显示图例</Checkbox></Col>
        </Row>
        <Row>
          <Col span={24}><Checkbox onChange={() => { }}>显示ToolTip</Checkbox></Col>
        </Row>
      </div>
    );
  };
  renderBarConfig = () => {
    const { styleConfigs, name } = this.props.comp;
    return (
      <div key={name}>
        <input className={classNames(styles['int'], 'ant-input')} placeholder="请输入标题" value={styleConfigs.title.name || ''} onChange={this.changeTitle} />
        <Row>
          <Col span={24}>
            <Checkbox
              defaultChecked={styleConfigs.title.visible}
              onChange={this.changeTitleVisible}
            >显示标题</Checkbox>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="高度"
              className={styles.int}
              defaultValue={styleConfigs.height}
              onChange={this.changeHeight}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="上边距"
              className={styles.int}
              defaultValue={styleConfigs.margintop}
              onChange={this.changeMarginTop}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="宽度(%)"
              className={styles.int}
              defaultValue={styleConfigs.width}
              onChange={this.changeWidth}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="左边距(%)"
              className={styles.int}
              defaultValue={styleConfigs.marginleft}
              onChange={this.changeMarginLeft}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Checkbox
              defaultChecked={styleConfigs.horizontal}
              onChange={this.changeHorizontal}
            >横向</Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox
              defaultChecked={styleConfigs.stack}
              onChange={this.changeStack}
            >堆积</Checkbox>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Checkbox
              defaultChecked={styleConfigs.percent}
              onChange={this.changePercent}
            >百分比堆积</Checkbox>
          </Col>
          <Col span={12}><Checkbox onChange={() => { }}>轴标题</Checkbox></Col>
        </Row>
        <Row>
          <Col span={12}><Checkbox onChange={() => { }}>显示X轴</Checkbox></Col>
          <Col span={12}><Checkbox onChange={() => { }}>显示Y轴</Checkbox></Col>
        </Row>
        <Row>
          <Col span={12}><Checkbox defaultChecked={styleConfigs.legend.visible} onChange={this.changeLegend}>显示图例</Checkbox></Col>
        </Row>
        <Row>
          <Col span={24}><Checkbox onChange={() => { }}>显示ToolTip</Checkbox></Col>
        </Row>
        <Row>
          <Col span={8}><span className="label-12">排序方式</span></Col>
          <Col span={16}>
            <RadioGroup name="pieType" defaultValue={styleConfigs.orderBy} onChange={this.changeOrderBy}>
              <Radio value={1}>X轴</Radio>
              <Radio value={2}>Y轴</Radio>
            </RadioGroup>
          </Col>
        </Row>
      </div>
    );
  };
  renderLineConfig = () => {
    const { styleConfigs, name } = this.props.comp;
    return (
      <div key={name}>
        <input className={classNames(styles['int'], 'ant-input')} placeholder="请输入标题" value={styleConfigs.title.name || ''} onChange={this.changeTitle} />
        <Row>
          <Col span={24}>
            <Checkbox
              defaultChecked={styleConfigs.title.visible}
              onChange={this.changeTitleVisible}
            >显示标题</Checkbox>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="高度"
              className={styles.int}
              defaultValue={styleConfigs.height}
              onChange={this.changeHeight}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="上边距"
              className={styles.int}
              defaultValue={styleConfigs.margintop}
              onChange={this.changeMarginTop}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="宽度(%)"
              className={styles.int}
              defaultValue={styleConfigs.width}
              onChange={this.changeWidth}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="左边距(%)"
              className={styles.int}
              defaultValue={styleConfigs.marginleft}
              onChange={this.changeMarginLeft}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Checkbox
              defaultChecked={styleConfigs.stack}
              onChange={this.changeStack}
            >堆积</Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox
              defaultChecked={styleConfigs.percent}
              onChange={this.changePercent}
            >百分比堆积</Checkbox>
          </Col>
        </Row>
      </div>
    );
  };
  renderTableConfig = () => {
    const { styleConfigs, name } = this.props.comp;
    return (
      <div key={name}>
        <input className={classNames(styles['int'], 'ant-input')} placeholder="请输入标题" value={styleConfigs.title.name || ''} onChange={this.changeTitle} />
        <Row>
          <Col span={24}>
            <Checkbox
              defaultChecked={styleConfigs.title.visible}
              onChange={this.changeTitleVisible}
            >显示标题</Checkbox>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Checkbox
              defaultChecked={styleConfigs.head}
              onChange={this.changeHeadVisible}
            >显示头部</Checkbox>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="高度"
              className={styles.int}
              defaultValue={styleConfigs.height}
              onChange={this.changeHeight}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="上边距"
              className={styles.int}
              defaultValue={styleConfigs.margintop}
              onChange={this.changeMarginTop}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="宽度(%)"
              className={styles.int}
              defaultValue={styleConfigs.width}
              onChange={this.changeWidth}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="左边距(%)"
              className={styles.int}
              defaultValue={styleConfigs.marginleft}
              onChange={this.changeMarginLeft}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Checkbox
              defaultChecked={styleConfigs.rowHeaders}
              onChange={this.changeRowHeaders}
            >显示序号</Checkbox>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Checkbox
              defaultChecked={styleConfigs.fixed.enable}
              onChange={this.changeFixedEnable}
            >冻结左侧列到</Checkbox>
            <Select
              defaultValue={styleConfigs.fixed.fixedColumnsLeft}
              style={{ width: 120 }}
              onChange={this.changeFixedColumnsLeft}
            >
              {
                fixedColumns.map((item) => {
                  return <Option value={item.value} key={item.value}>{item.name}</Option>;
                })
              }
            </Select>
          </Col>
        </Row>
      </div>
    );
  };
  renderTabConfig = () => {
    const { styleConfigs, name } = this.props.comp;
    return (
      <div key={name}>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="高度"
              className={styles.int}
              defaultValue={styleConfigs.height}
              onChange={this.changeHeight}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="上边距"
              className={styles.int}
              defaultValue={styleConfigs.margintop}
              onChange={this.changeMarginTop}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="宽度(%)"
              className={styles.int}
              defaultValue={styleConfigs.width}
              onChange={this.changeWidth}
            />
          </Col>
        </Row>
      </div>
    );
  };
  renderSearchConfig = () => {
    const { styleConfigs, name } = this.props.comp;
    return (
      <div key={name}>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="高度"
              className={styles.int}
              defaultValue={styleConfigs.height}
              onChange={this.changeHeight}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="上边距"
              className={styles.int}
              defaultValue={styleConfigs.margintop}
              onChange={this.changeMarginTop}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <NumberInput
              addonBefore="宽度(%)"
              className={styles.int}
              defaultValue={styleConfigs.width}
              onChange={this.changeWidth}
            />
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const { comp } = this.props;
    switch (comp.type) {
      case 'bar':
        return this.renderBarConfig();
      case 'pie':
        return this.renderPieConfig();
      case 'line':
        return this.renderLineConfig();
      case 'table':
        return this.renderTableConfig();
      case 'tab':
        return this.renderTabConfig();
      case 'search':
        return this.renderSearchConfig();
      default:
        return <div />;
    }
  }
}
const fixedColumns = [{
  value: 0,
  name: '请选择',
}];
for (let i = 1; i <= 10; i += 1) {
  fixedColumns.push({
    value: i,
    name: `前${i}列`,
  });
}

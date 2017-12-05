/**
 * 可编辑table
 * @desc 通过动态渲染数据来控制可编辑性
 *       通过state来控制控件数据的变化
 *
 * rowKey 默认为 tableId
 */
import React from 'react';

import {
  Table,
  Input,
  Select,
  DatePicker,
  Icon,
  Popconfirm,
  Button
} from 'antd';

const Option = Select.Option;

import EditableCell from './editable.cell';

import RULES from '../../common/utils/validate.rules';

import {
  MyToast,
  getSlicedObjectArray
} from '../../common/utils';

import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';

const fileDownloadPath = 'http://oyc0y0ksm.bkt.clouddn.com/';


const changeObjectEditable = (data, rowKey, key, editable) => {
  var data = data.map(item => {
    if (item[rowKey] === key) {
      item.editable = editable
    }

    return item;
  });

  return data;
};

/**
 * @props columns
 * @props dataSource
 * @props onSaveAdd
 * @props onSaveUpdate
 * @props onDelete
 * @props itemDataModel
 * @props loading
 * @props pagination
 * @props onThirdEye  查看按钮
 * @props CustomerBtn 自定义按钮
 */
class EditableTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [],  // 重新封装
      dataSource: this.props.dataSource || [],
      validateTypes: {}, // 验证规则 {columns[i].dataIndex: {type: 'number', title: 'columns[i].title'}}
    }

    this.getColumns = this.getColumns.bind(this);

    this.changeRecordEditableStatus = this.changeRecordEditableStatus.bind(this);
    this.onCellChange = this.onCellChange.bind(this);

    this.addItem = this.addItem.bind(this);
    this.saveAdd = this.saveAdd.bind(this);
    this.saveUpdate = this.saveUpdate.bind(this);
    this.deleteItem = this.deleteItem.bind(this);

    // 数据校验规则
    this.getValidateTypes = this.getValidateTypes.bind(this);
    this.validate = this.validate.bind(this);

    // 编辑时，留存当前状态，当取消编辑时，恢复原状
    this.backupData = {};
  }

  componentDidMount() {
    let {
      columns,
      rowKey='tableId',
      onThirdEye,
      CustomerBtn
    } = this.props;

    var validateTypes = this.getValidateTypes(columns);

    var formatedColumns = this.getColumns({columns, rowKey, onThirdEye, CustomerBtn});

    this.setState({
      columns: formatedColumns,
      validateTypes: validateTypes 
    });
  }

  /**
   * 当外部数据变化，比如父组件重新请求了接口，那么重新渲染
   */
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.dataSource) !== JSON.stringify(this.props.dataSource)) {
      this.setState({
        dataSource: nextProps.dataSource
      })
    }
  }

  // 通过动态渲染数据来控制可编辑性
  getColumns({columns, rowKey, onThirdEye, CustomerBtn}) {
    for (let i=0, len=columns.length; i<len; i++) {
      columns[i].render = (text, record) => {
        // 操作栏
        if (columns[i].dataIndex === 'operation') {
          // 新添加行
          if (record.tableId === '') {
            return (
              <div>
                <a title="取消" onClick={() => this.deleteItem('')}><Icon type="close" className="yzy-icon" /></a>
                <a title="保存" onClick={() => this.saveAdd(record, this.state.validateTypes)}><Icon type="check" className="yzy-icon" /></a>
              </div>
            )
          }

          // 不可编辑状态
          if (!record.editable) {
            return (
              <div>
                {
                  (typeof onThirdEye === 'function') &&
                  <a title="查看" onClick={() => onThirdEye(record)}><Icon type="eye-o" /></a>
                }
                <a title="编辑" onClick={() => this.changeRecordEditableStatus(record, true)}><Icon type="edit" /></a>
                <Popconfirm title="确定要删除吗？" onConfirm={() => this.deleteItem(record[rowKey])}>
                  <a title="删除"><Icon type="delete" /></a>
                </Popconfirm>

                {
                  typeof CustomerBtn === 'function' && <CustomerBtn record={record} />
                }
              </div>
            )
          }

          // 可编辑状态
          return (
            <div>
              <a title="取消" onClick={() => this.changeRecordEditableStatus(record, false)}><Icon type="close" /></a>
              <a title="保存" onClick={() => this.saveUpdate(record, this.state.validateTypes)}><Icon type="check" /></a>
              <Popconfirm title="确定要删除吗？" onConfirm={() => this.deleteItem(record[rowKey])}>
                <a title="删除"><Icon type="delete" /></a>
              </Popconfirm>
            </div>
          )
        }

        // 防御性检查，数据中没有 dataIndex 字段
        if (text === undefined) {
          return (
            <EditableCell 
              editable={record.editable}
              tableId={record.tableId}
              dataIndex={columns[i].dataIndex}
              cellType="text"
              disabled={false}
              value={''}
              onCellChange={this.onCellChange} />
          );
        }

        // input datepicker select file
        return (
          <EditableCell 
            editable={record.editable}
            tableId={record.tableId}
            dataIndex={columns[i].dataIndex}
            disabled={text.disabled}
            cellType={text.cellType}
            value={text.value}
            options={text.options}
            onCellChange={this.onCellChange} />
        );
      }
    }

    return columns;
  }

  /**
   * 通过state来控制控件数据的变化
   * @tableId     数据标识
   * @dataIndex   数据字段名称
   * @value       数据赋值
   */
  onCellChange(tableId, dataIndex, value) {
    // console.log('oncellchange value-----------', value)
    this.setState(prev => {
      return {
        dataSource: prev.dataSource.map(item => {
          if (item.tableId === tableId) {
            item[dataIndex].value = value;
          }

          return item;
        })
      }
    })
  }

  // 取消保存
  changeRecordEditableStatus(record, status=true, rowKey='tableId') {
    if (record[rowKey] === '') return;

    // 为取消时做数据备份处理
    if (status === true) {
      // 斩断引用链
      this.backupData[record[rowKey]] = JSON.parse(JSON.stringify(record));

      this.setState(prev => {
        return {
          dataSource: changeObjectEditable(prev.dataSource, rowKey, record[rowKey], true),
        }
      });
    } else {

      this.setState(prev => {
        return {
          dataSource: prev.dataSource.map(_record => {
            if (_record[rowKey] === record[rowKey]) {
              _record = {
                ...this.backupData[record[rowKey]],
                editable: false
              }
            }

            return _record;
          })
        }
      }, () => {
        this.backupData[record[rowKey]] = null;
      });
    }    
  }

  getValidateTypes(columns) {
    var validateTypes = {};

    columns.forEach(col => {
      if (col.validateType) {
        validateTypes[col.dataIndex] = {
          type: col.validateType,  // 校验类型 'number' 'phone' ...
          title: col.title         // 字段名称
        };
      }
    });

    return validateTypes;
  }

  /**
   * 当有图片上传时，新增或编辑后需要对文件地址做处理
   * 当 response.status: "done"
   * 提取response.filePath to url
   * 直接改变 record
   */
  checkRecordFile(record) {
    let keys = Object.keys(record);
    for (let i=0, len=keys.length; i<len; i++) {
      if (record[keys[i]].cellType === 'file' && typeof record[keys[i]].value[0] === 'object') {
        if (record[keys[i]].value[0].response) {
          if (record[keys[i]].value[0].response.status === 'done') {
            // 新上传文件成功
            record[keys[i]].value[0] = {
              uid: -1,
              name: 'file',
              url: fileDownloadPath + record[keys[i]].value[0].response.filePath
            }
          } else {
            // 上传失败
            record[keys[i]].value = [];
          }
        }
      }
    }
  }

  // 数据校验
  validate(record, validateTypes) {
    // 数据校验
    var _validateItems = Object.keys(validateTypes);
    var validatePass = true;
    var validateMsg = '';

    if (_validateItems.length !== 0) {
      for(let i=0, len=_validateItems.length; i<len; i++) {
        let validateKey = _validateItems[i];
        let validateType = validateTypes[validateKey].type;
        let validateTitle = validateTypes[validateKey].title;

        if (RULES[validateType] === undefined) {
          console.error('validate.js 没有配置校验规则')
        }

        if (!RULES[validateType].reg.test(record[validateKey].value)) {
          validatePass = false;
          // 字段名称 + 校验失败信息
          validateMsg = validateTitle + '，' +  RULES[validateType].msg;

          break;
        }
      }
    }

    return {
      valid: validatePass,
      msg: validateMsg
    }
  }

  saveUpdate(record, validateTypes) {
    
    var isValid = this.validate(record, validateTypes);

    if (isValid.valid === false) {
      MyToast(isValid.msg)
      return;
    }

    let {
      onSaveUpdate,
      rowKey='tableId'
    } = this.props;

    this.checkRecordFile(record);

    onSaveUpdate(record).then(res => {
      if (res.code === 0) {
        MyToast(res.msg);

        // saveupate
        this.setState(prev => {
          return {
            dataSource: changeObjectEditable(prev.dataSource, rowKey, record[rowKey], false),
          }
        });
      } else {
        MyToast(res.msg);
      }
    }).catch(err => MyToast(err));    
  }

  /**
   * 新增
   * 当前新增项未保存时，禁止
   */
  addItem() {
    let {
      rowKey='tableId',
      itemDataModel
    } = this.props;

    let _dataSource = this.state.dataSource;

    if (_dataSource[0][rowKey] === '') return MyToast('请先保存新增项');

    this.setState(prev => {
      let _itemDataModel = JSON.parse(JSON.stringify(itemDataModel));

      return {
        dataSource: [_itemDataModel, ...prev.dataSource]
      } 
    })
  }

  saveAdd(record, validateTypes) {
    var isValid = this.validate(record, validateTypes);

    if (isValid.valid === false) {
      MyToast(isValid.msg)
      return;
    }

    let {
      onSaveAdd,
      rowKey='tableId'
    } = this.props;

    this.checkRecordFile(record);

    onSaveAdd(record).then(res => {
      if (res.code === 0 && res[rowKey]) {
        MyToast(res.msg);

        // saveadd
        this.setState(prev => {
          return {
            dataSource: [{
              ...record,
              tableId: res[rowKey],
              editable: false,
            }, ...prev.dataSource.slice(1)]
          }
        });
      } else {
        MyToast(res.msg);
      }
    }).catch(err => MyToast(err));  
  }

  deleteItem(tableId, rowKey='tableId') {
    // 删除新增项
    if (tableId === '') {
      this.setState(prev => {
        return {
          dataSource: prev.dataSource.slice(1)
        }
      });      
      return;
    }

    let onDelete = this.props.onDelete;

    onDelete(tableId).then(res => {
      if (res.code === 0) {
        MyToast(res.msg);

        // saveupate
        this.setState(prev => {
          return {
            dataSource: getSlicedObjectArray(prev.dataSource, rowKey, tableId)
          }
        });
      } else {
        MyToast(res.msg);
      }
    }).catch(err => MyToast(err));
  }

  render() {
    let {
      loading=false,
      pagination=false,
      rowKey='tableId',
      onSaveAdd,
      itemDataModel
    } = this.props;

    // 支持新增功能
    if (typeof onSaveAdd === 'function' && typeof itemDataModel === 'object') {
      return (
        <div>
          <div className="yzy-table-add-btn">
            <Button type="primary" onClick={this.addItem}>新增</Button>
          </div>
          <Table
            loading={loading}
            columns={this.state.columns}
            dataSource={this.state.dataSource}
            rowKey={rowKey}
            pagination={pagination}
            rowClassName={(record, index) => {
              if (index % 2 !== 0) {
                return 'active'
              }
            }} /> 
        </div>
      )
    }

    return (
      <Table
        loading={loading}
        columns={this.state.columns}
        dataSource={this.state.dataSource}
        rowKey={rowKey}
        pagination={pagination}
        rowClassName={(record, index) => {
          if (index % 2 !== 0) {
            return 'active'
          }
        }}  /> 
    )
  }
}

export default EditableTable;
/**
 * 可编辑table-cell
 */
import React, { Component } from 'react';
import {
  Button,
  Icon,
  Row, 
  Col, 
  Input,
  Select,
  DatePicker,
  Form,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import QiniuUpload from '../qiniu.upload';


import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';

import {
  getLabelFromOptions
} from '../../common/utils';

class EditableCell extends Component {
  constructor(props) {
    super(props)

    this.renderInput = this.renderInput.bind(this);
    this.renderSelect = this.renderSelect.bind(this);
    this.renderDatepicker = this.renderDatepicker.bind(this);
  }

  renderInput() {
    let {
      tableId,
      dataIndex,
      disabled,
      value,
      onCellChange,
      editable
    } = this.props;

    if (!editable) {
      return value;
    }

    return (
      <Input
        disabled={disabled}
        value={value}
        onChange={(e) => onCellChange(tableId, dataIndex, e.target.value)} />
    )
  }

  renderSelect() {
    let {
      tableId,
      dataIndex,
      value,
      options,
      disabled=false,
      onCellChange,
      editable
    } = this.props;

    if (!editable) {
      return getLabelFromOptions(value, options);
    }

    return (
      <Select 
        disabled={disabled}
        style={{width: '100%'}} 
        onSelect={(v) => onCellChange(tableId, dataIndex, v)} 
        value={value || ''}>
        {
          options.map((opt, i) => (
            <Option key={i} value={opt.value}>{opt.label}</Option>
          ))
        }
      </Select>
    )
  }

  renderDatepicker() {
    let {
      tableId,
      dataIndex,
      disabled=false,
      value,
      onCellChange,
      editable
    } = this.props;

    if (!editable) {
      return moment(value).format(dateFormat);
    }

    return (
      <DatePicker 
        disabled={disabled}
        value={moment(value, dateFormat)}
        onChange={(date, dateString) => onCellChange(tableId, dataIndex, dateString)} />
    )
  }

  renderFileUpload() {

    let {
      tableId,
      dataIndex,
      value: fileList,
      onCellChange,
      editable
    } = this.props;

    if (!editable) {
      var filePath = (fileList[0] && fileList[0].url) || '';

      if (filePath) {
        return (<a href={filePath} target="_blank" download="file">下载</a>)
      } else {
        return '';
      }
    }

    return (
      <QiniuUpload
        uploadedFileList={fileList}
        handleUploadedFileList={({fileList}) => onCellChange(tableId, dataIndex, fileList)} />
    );
  }

  render() {
    let cellType = this.props.cellType;

    if (cellType === 'text' || cellType === 'number' || cellType === 'input' || cellType === undefined) {
      return this.renderInput();
    }

    if (cellType === 'select') {
      return this.renderSelect();
    }

    if (cellType === 'datepicker') {
      return this.renderDatepicker();
    }

    if (cellType === 'file') {
      return this.renderFileUpload();
    }

    console.error('editable.cell not found type', cellType);
    return null;
  }
}

export default EditableCell;
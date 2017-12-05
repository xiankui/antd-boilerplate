/**
 * antd + qiniu 上传组件
 * 默认一张图片
 */
import React from 'react';
import {
  Button,
  Icon,
  Upload,
  Modal
} from 'antd';

import {
  MyToast,
} from '../common/utils';

// 骑牛验证token
var uptoken = "W5Fv28XaKurdNr5zjN1fwIb_zLwWw8GwJ6Fnk23E:SwubTIEG7OeBqV747UxeiIvnp70=:eyJzYXZlS2V5IjoiJHt4OnNvdXJjZVR5cGV9LyQoeWVhcikvJChtb24pLyQoZGF5KS8ke2hvdXJ9LyR7bWlufS8ke3NlY30vJCh4OmZpbGVOYW1lKSIsInNjb3BlIjoieXRoYiIsInJldHVybkJvZHkiOiJ7XCJrZXlcIjogJChrZXkpLCBcImhhc2hcIjogJChldGFnKSwgXCJmaWxlUGF0aFwiOiAkKGtleSksIFwiaW1hZ2VXaWR0aFwiOiAkKGltYWdlSW5mby53aWR0aCksIFwiaW1hZ2VIZWlnaHRcIjogJChpbWFnZUluZm8uaGVpZ2h0KSwgXCJmc2l6ZVwiOiAkKGZzaXplKSwgXCJleHRcIjogJChleHQpfSIsImRlYWRsaW5lIjoxNTEwMzA5NjMyfQ==";

const qiniuHost = 'http://up.qiniup.com';
const uploadData = {};

/**
 * @props uploadTitle
 * @props acceptType
 * @props maxLength
 * @props uploadedFileList
 * @props handleUploadedFileList
 * @desc  把上传后的结果列表回传到父组件
 */
class QiniuUpload extends React.Component {
  constructor(props) {
    super(props);

    // [{
    //   uid: -1,
    //   status: 'done',
    //   url: 'http://oyc0y0ksm.bkt.clouddn.com/1509173501415'
    // }]

    this.state = {
      uptoken: '',
      previewImage: '',
      previewVisible: false,
    }
  }

  componentDidMount() {
    /**
     * token 可通过属性传入
     */
    // uploadData.token = this.props.uptoken;
    
    // getQiNiuToken({}).then(res => {
    //     if (!res.data || !res.data.uptoken) {
    //         MyToast('getqiniuyun uptoken error');
    //         return;
    //     }

    //     this.setState({
    //       uptoken: res.data.uptoken
    //     });
    // }).catch(err => console.log(err));

    // get qiniu uptoken
    uploadData.token = uptoken;
  }

  /**
   * 通过key 设置文件路径和名称
   * 路径规则：filetype/2017/11/11/timestamp.ext
   */
  getFileKey(fileType, fileName) {
    var type = fileType.split('/')[0];
    var ext = fileName.split('.')[1] || '';
    var date = new Date();
    var y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate(),
        timestamp = date.getTime();

    m = m < 10 ? ('0' + m) : m;
    d = d < 10 ? ('0' + d) : d;

    var path = `${type}/${y}/${m}/${d}/${timestamp}.${ext}`;

    return path;
  }

  beforeUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      MyToast('请选择图片小于2MB!');
    }

    // get file path 
    var filepath = this.getFileKey(file.type, file.name);

    uploadData.key = filepath;

    return isLt2M;
  }

  handleUploadChange({file, fileList}) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) return;

    this.props.handleUploadedFileList({fileList})

    return;

    /**
     * 不知道原因，为什么这么写法就不能触发 done 事件
     * 上传成功 or 删除成功
     */
    // if (file.status === 'done' || file.status === 'removed') {
    //   this.setState({
    //     uploadedFileList: fileList
    //   });
    // }
  }

  handlePreview(file) {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleCancel() {
    this.setState({ previewVisible: false });
  }

  render() {
    let {
      uploadedFileList,
      uploadTitle='上传',
      acceptType,
      maxLength=1
    } = this.props;


    if (acceptType !== 'image/*') {
      return (
        <div>
          <Upload
              action={qiniuHost}
              container="container"
              multiple={false}
              accept={acceptType}
              beforeUpload={this.beforeUpload.bind(this)}
              onChange={this.handleUploadChange.bind(this)}
              fileList={uploadedFileList}
              data={uploadData}>
              {
                uploadedFileList.length === maxLength ? null : 
                (
                  <Button><Icon type="upload" /> Click to Upload </Button>
                )
              }
          </Upload>
        </div>
      )
    }

    return (
      <div>
        <Upload
            action={qiniuHost}
            container="container"
            listType="picture-card"
            multiple={false}
            accept={acceptType}
            beforeUpload={this.beforeUpload.bind(this)}
            onChange={this.handleUploadChange.bind(this)}
            fileList={uploadedFileList}
            onPreview={this.handlePreview.bind(this)}
            data={uploadData}>
            {
              uploadedFileList.length === maxLength ? null : 
              (
                <div>
                    <Icon type="plus" />
                    <div className="ant-upload-text">{uploadTitle}</div>
                </div>
              )
            }
        </Upload>
        <Modal 
          width="90%"
          visible={this.state.previewVisible} 
          footer={null} 
          onCancel={this.handleCancel.bind(this)}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </div>
    )
  }
}

export default QiniuUpload;
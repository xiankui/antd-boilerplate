/**
 * 七牛云上传组件
 */
import React from 'react';
import ReactDOM from 'react-dom';

import QiniuUpload from '../../components/qiniu.upload';

class QiniuUploadDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedFileList: []
    }
  }

  handleUploadedFileList({fileList}) {
    this.setState({
        uploadedFileList: fileList,
    });
  }

  render() {
    return (
      <div className="yzy-page">
        <QiniuUpload
            uploadTitle="证件上传"
            uploadedFileList={this.state.uploadedFileList}
            handleUploadedFileList={this.handleUploadedFileList.bind(this)}
            maxLength={2}
            maxSize={5}
            acceptType='image/*'
            uptoken=""
           />
      </div>
    )
  }
}

ReactDOM.render(<QiniuUploadDemo />, document.getElementById('root'));
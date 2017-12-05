# antd-boilerplate

antd的使用与二次封装，主要使用场景为PC端CRM管理系统。

## editable.table 

可编辑table，组件从外部接受数据（为了支持数据查询重渲染），在内部维护数据，封装数据的增删改。注意，`dataSource` 格式化后传入组件，从组件返回时需要序列化后提交。

配置参数
* columns
* dataSource
* onSaveUpdate
* onSaveAdd
* onDelete
* itemDataModel
* onThirdEye
* CustomerBtn
* rowKey
* loading
* pagination

## modal.draggable

头部可拖拽的模态框

## qiniu.upload

七牛云上传组件，注意token的获取和文件名的生成。

## rcsearchform

搜索模块
/**
 * index.html
 */
import React from 'react';
import ReactDOM from 'react-dom';

const Facade = () => (
  <div>
    <h1>package list</h1>
    <ul>
      <li><a href="./rcsearchform.html">RcSearchForm</a></li>
      <li><a href="./editableTable.html">EditableTable</a></li>
      <li><a href="./qiniuUpload.html">QiniuUpload</a></li>
    </ul>
  </div>
);

ReactDOM.render(<Facade />, document.getElementById('root'));
/**
 * 封装 editable.table，加标题
 */
import React from 'react';

import EditableTable from './editable.table';

/**
 * editable.table
 * @props columns
 * @props dataSource
 * @props onSaveAdd
 * @props onSaveUpdate
 * @props onDelete
 * @props itemDataModel
 * @props loading
 * @props pagination
 * 
 * @props title
 */
class EditableTableSection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="yzy-table-section">
        <h2 className="yzy-table-section-title">{this.props.title}</h2>
        <EditableTable {...this.props} />
      </div>
    )
  }
}

export default EditableTableSection;
export {
  EditableTable
};
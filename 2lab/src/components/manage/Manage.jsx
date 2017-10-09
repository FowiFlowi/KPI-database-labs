import React from 'react'

import Switcher from './switcher/Switcher.jsx'
import Add from './Add/Add.jsx'
import Delete from './Delete/Delete.jsx'
import Edit from './Edit/Edit.jsx'

class Manage extends React.Component {
  constructor(props) {
    super(props)

    fetch('/api/instance')
      .then(res => Promise.all([res.status, res.json()]))
      .then(([status, response]) => {
        if (status !== 200)
          return this.setState({ preview: response.error })
        
        this.setState({ tables: response.data })
        return Promise.all(response.data.map(table => fetch(`/api/instance/${table}`)))
      })
      .then(responses => {
        responses.forEach(res => {
          if (res.status !== 200)
            throw new Error(res.error)
        })

        return Promise.all(responses.map(res => res.json()))
      })
      .then(res => {
        const tablesData = res.map(i => i.data)
          .reduce((acc, data) => 
            (acc[data.tableName] = data.rows, acc),
          {})

        this.setState({ tablesData })
      })
      .catch(e => this.setState({ preview: e.message }))

    this.state = { current: null, preview: '' }
  }

  handleAddSwitcher() {
    this.setState({ current: <Add tablesData={this.state.tablesData}/> })
  }
  handleDeleteSwitcher() {
    this.setState({ current: <Delete tablesData={this.state.tablesData}/> })
  }
  handleEditSwitcher() {
    this.setState({ current: <Edit tablesData={this.state.tablesData}/> })
  }

  render() {
    return (
      <div className='col-sm-6'>
        <h3>Управління таблицею фактів</h3>
        <Switcher
          onFirstClick={::this.handleAddSwitcher}
          onSecondClick={::this.handleDeleteSwitcher}
          onThirdClick={::this.handleEditSwitcher}
          f_colonizations={this.state.f_colonizations}
        />
        {this.state.current}
        <p>{this.state.preview}</p>
      </div>
    )
  }
}

export default Manage
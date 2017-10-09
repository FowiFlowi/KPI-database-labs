import React from 'react'

import AddSelections from './AddSelections.jsx'

class Add extends React.Component {
  constructor(props) {
    super(props)

    this.state = { preview: '' }
  }

  handleDateChange(e) {
    const date = e.target.value.split('.')
    if (date.length === 3) {
      let flag = true
      date.forEach((value, i) => {
        if (i === 0 && value.length !== 4)
          flag = false
        else if (i !== 0 && value.length !== 2)
          flag = false
      })
      const value = e.target.value
      if (flag && !isNaN(Date.parse(value)))
        this.setState({ date: new Date(value).getTime() / 1000 })
    }
  }

  handleChange(e, column) {
    const id = e.target.selectedOptions[0].getAttribute('id')
    this.setState({ [column]: Number(id) })
  }

  handleAdd() {
    const body = JSON.stringify((this.state.preview = undefined, this.state))

    fetch('/api/facts', { method: 'POST', body })
      .then(res => Promise.all([res.status, res.json()]))
      .then(([status, response]) => {
        if (status !== 200)
          return this.setState({ preview: response.error })
        this.setState({ preview: 'Додано' })
      })
      .catch(e => {
        console.log(e)
        this.setState({ preview: e.message })
      })
  }

  render() {
    return (
      <div>
        <AddSelections 
          tablesData={this.props.tablesData}
          onChange={::this.handleChange}
          onDateChange={::this.handleDateChange}
        />
        <p>{this.state.preview}</p>
        <button className='btn btn-success' onClick={::this.handleAdd}>Додати</button>
      </div>
    )
  }
}

export default Add
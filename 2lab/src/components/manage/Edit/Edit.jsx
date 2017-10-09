import React from 'react'

import FactSelect from '../Delete/FactSelect.jsx'
import AddSelections from '../Add/AddSelections.jsx'

import getFacts from '../../../modules/get_facts'

class Edit extends React.Component {
  constructor(props) {
    super(props)

    this.state = { preview: '', facts: [], selected: {} }

    getFacts()
      .then(facts => this.setState({ facts }))
      .catch(preview => this.setState({ preview }))
  }

  handleFactChange(e) {
    const factId = Number(e.target.selectedOptions[0].getAttribute('id'))
    this.setState({ factId })
  }

  handleChange(e, column) {
    const id = e.target.selectedOptions[0].getAttribute('id'),
          selected = Object.assign(this.state.selected, { [column]: Number(id) })
    this.setState({ selected })
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
      if (flag && !isNaN(Date.parse(value))) {
        const selected = Object.assign(this.state.selected, {
          date: new Date(value).getTime() / 1000
        })
        this.setState({ selected })
      }
    }
  }

  handleEdit() {
    this.setState({ preview: 'Секундочку' })
    const body = JSON.stringify(this.state.selected)

    fetch(`/api/facts/${this.state.factId}`, { 
      method: 'PATCH',
      body
    })
    .then(res => Promise.all([res.status, res.json()]))
    .then(([status, response]) => {
      if (status !== 200)
        return this.setState({ preview: response.error })

      this.setState({ preview: 'Оновлено' })
      getFacts()
        .then(facts => this.setState({ facts }))
        .catch(preview => this.setState({ preview }))
    })
    .catch(e => {
      console.log(e)
      this.setState({ preview: e.message })
    })
  }

  render() {
    return (
      <div>
        <FactSelect 
          options={this.state.facts}
          onChange={::this.handleFactChange}
        />
        {this.state.factId > 0 && <AddSelections
          tablesData={this.props.tablesData}
          onChange={::this.handleChange}
          onDateChange={::this.handleDateChange}
        />
        }
        <p>{this.state.preview}</p>
        <button className='btn btn-light' onClick={::this.handleEdit}>Редагувати</button>
      </div>
    )
  }
}

export default Edit
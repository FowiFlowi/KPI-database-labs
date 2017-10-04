import React from 'react'

import Instance from './instance/Instance.jsx'
import Attributes from './attributes/Attributes.jsx'
import Table from './table/Table.jsx'

class Selector extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      preview: '',
      instanceOptions: [],
      attributes: [],
      selected: { columns: {} }
    }

    fetch('/api/instance')
      .then(res => Promise.all([res.status, res.json()]))
      .then(([status, response]) => {
        if (status !== 200)
          return this.setState({ preview: response.error })
        this.setState({ instanceOptions: response.data })
      })
      .catch(e => this.setState({ preview: e.message }))
  }

  handleInstanceChange(e) {
    const instance = e.target.selectedOptions[0].value
    this.setState({
      selected: { instance, columns: {} },
      preview: 'Секундочку'
    })
    
    fetch(`/api/attributes/${instance}`)
      .then(res => Promise.all([res.status, res.json()]))
      .then(([status, response]) => {
        if (status !== 200)
          return this.setState({ preview: response.error })
        console.log('Instance')
        console.log(response.data)
        this.setState({ attributes: response.data, preview: '' })
      })
      .catch(e => this.setState({ preview: e.message }))
  }

  handleNumericChange(e, column) {
    const selects = [].map.call(e.target.selectedOptions, i => Number(i.value)),
          max = Math.max(...selects),
          min = Math.min(...selects),
          { columns, instance } = this.state.selected

    columns[column] = { min, max, type: 'numeric' }

    this.setState({ selected: { columns, instance } })
  }

  handleTextChange(e, column) {
    const words = e.target.value.split(', '),
          { columns, instance } = this.state.selected

    columns[column] = { words, type: 'text' }

    this.setState({ selected: { columns, instance } })
  }

  handleSelect() {
    console.log(this.state.selected)
    if (!this.state.selected.instance || this.state.selected.instance === 'Ніц')
      return this.setState({ preview: 'Сутність не обрана' })

    const { columns, instance } = this.state.selected
    fetch(`/api/instance/${instance}?data=${JSON.stringify(columns)}`)
      .then(res => Promise.all([res.status, res.json()]))
      .then(([status, response]) => {
        if (status !== 200)
          return this.setState({ preview: response.error })
        
        const { data } = response
        console.log(data)
        this.setState({ tableData: data })
      })
      .catch(e => this.setState({ preview: e.message }))
  }

  render() {
    return (
      <div>
        <h1>Selector</h1>
        <Instance 
          options={this.state.instanceOptions}
          onChange={::this.handleInstanceChange}
        />
        <Attributes
          attributes={this.state.attributes}
          onNumericChange={::this.handleNumericChange}
          onTextChange={::this.handleTextChange}
        />
        <div>{this.state.preview}</div>
        <button onClick={::this.handleSelect}>Вибрати</button>

        <Table 
          data={this.state.tableData}
        />
      </div>
    )
  }
}

export default Selector
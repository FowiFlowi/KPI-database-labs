import React from 'react'

import FactSelect from './FactSelect.jsx'

import getFacts from '../../../modules/get_facts'

class Delete extends React.Component {
  constructor(props) {
    super(props)
    this.state = { options: [], deletedId: null, preview: '' }

    getFacts()
      .then(options => this.setState({ options }))
      .catch(e => this.setState({ preview: e }))
  }

  handleChange(e) {
    const id = e.target.selectedOptions[0].getAttribute('id')
    this.setState({ deletedId: Number(id) })
  }

  handleDelete() {
    const id = this.state.deletedId
    if (id) {
      this.setState({ preview: 'Секундочку' })
      fetch(`/api/facts/${id}`, { method: 'DELETE' })
        .then(res => Promise.all([res.status, res.json()]))
        .then(([status, response]) => {
          if (status !== 200)
            return this.setState({ preview: response.error })
          
          const options = this.state.options.filter(item => item.id !== id)
          this.setState({ options, preview: 'Видалено' })
        })
        .catch(e => {
          console.log(e)
          this.setState({ preview: e.message })
        })
    }
  }

  render() {
    return (
      <div>
        <FactSelect 
          options={this.state.options}
          onChange={::this.handleChange}
        />
        <p>{this.state.preview}</p>
        <button onClick={::this.handleDelete}>Видалити</button>
      </div>
    )
  }
}

export default Delete
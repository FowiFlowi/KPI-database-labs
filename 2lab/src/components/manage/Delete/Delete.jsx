import React from 'react'

import FactSelect from './FactSelect.jsx'

const getFacts = require('../../../modules/get_facts')

class Delete extends React.Component {
  constructor(props) {
    super(props)
    this.state = { options: [], deletedId: null, preview: '' }

    getFacts()
      .then(options => this.setState({ options }))
      .catch(e => this.setState({ preview: e }))
    // fetch('/api/instance/f_colonizations')
    //   .then(res => Promise.all([res.status, res.json()]))
    //   .then(([status, response]) => {
    //     if (status !== 200)
    //       return this.setState({ preview: response.error })
        
    //     const options = response.data.rows.map(item => {
    //       item.date = item.date.substring(0, 10)
    //       const res = { id: item.id },
    //             buf = []
    //       for (const key in item) {
    //         if (key !== 'id')
    //           buf.push(`${key}: ${item[key]}`)
    //       }
    //       res.value = buf.join(' | ')
    //       return res
    //     })
    //     this.setState({ options })
    //   })
    //   .catch(e => {
    //     console.log(e)
    //     this.setState({ preview: e.message })
    //   })
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
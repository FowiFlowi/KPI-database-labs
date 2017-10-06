import React from 'react'

import FileInput from './file_input/FileInput.jsx'

class Uploader extends React.Component {
  constructor(props) {
    super(props)
    this.state = { preview: '' }
  }

  selectFile(inputElement) {
    inputElement.click()
  }

  uploadFile(e) {
    const file = e.target.files[0]
    if (!file)
      return

    this.setState({ preview: 'Обробка...' })

    const formData = new FormData()
    formData.append('file', file)

    fetch('/api/upload/', {
      method: 'POST',
      body: formData,
    })
    .then(res => Promise.all([res.status, res.json()]))
    .then(([status, response]) => {
      if (status === 400)
        return this.setState({ preview: `Error: ${response.error}` })
      this.setState({ preview: response.data })
    })
    .catch(e => {
      console.log(e)
      this.setState({ preview: `Error: ${e.message}` })
    })
  }

  render() {
    return (
      <div className='uploader'>
        <FileInput 
          preview={this.state.preview}
          onClick={::this.selectFile}
          onChange={::this.uploadFile}
        />
      </div>
    )
  }
}

export default Uploader
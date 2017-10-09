import React from 'react'

// import './FileInput.css'

function FileInput(props) {
  let inputElement
  return (
    <div>
      <input id='file-input' type='file' accept='.xml' style={{opacity: 0}}
        ref={input => inputElement = input}
        onChange={props.onChange}
      />
      <div>
        <button 
          className='btn btn-primary col-sm-12'
          onClick={() => props.onClick(inputElement)}>Завантажити XML дані
        </button>
        <p>{props.preview}</p>
      </div>
    </div>
  )
}

export default FileInput
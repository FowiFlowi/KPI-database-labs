import React from 'react'

// class FileInput extends React.Component {
function FileInput(props) {
  let inputElement
  return (
    <div>
      <input id='file-input' type='file' accept='.xml' style={{opacity: 0}}
        ref={input => inputElement = input}
        onChange={props.onChange}
      />
      <div>
        <button onClick={() => props.onClick(inputElement)}>Завантажити XML дані</button>
        <p>{props.preview}</p>
      </div>
    </div>
  )
}

export default FileInput
import React from 'react'

function Instance(props) {
    return (
      <div>
        <label htmlFor='instance-select'>Виберiть сутнiсть</label><br/>
        <select id='instance-select' onChange={props.onChange}>
          {props.options.map((option, i) => <option key={i}>{option}</option>)}
          <option key='default'>Ніц</option>
        </select>
      </div>
    )
}

export default Instance
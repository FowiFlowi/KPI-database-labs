import React from 'react'

function FactSelect(props) {
  return (
    <div>
      <label htmlFor='fact-select'>Виберiть факт</label><br/>
      <select id='fact-select' onChange={props.onChange}>
        {props.options.map(option => <option key={option.id} id={option.id}>{option.value}</option>)}
        <option key='default'>Ніц</option>
      </select>
      <br />
    </div>
  )
}

export default FactSelect
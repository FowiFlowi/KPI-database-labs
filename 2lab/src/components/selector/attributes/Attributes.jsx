import React from 'react'

function NumericSelector(props) {
  return (
    <div>
      <label htmlFor='instance-select'>Виберiть проміжок чисел | {props.column}</label><br/>
      <select id='instance-select' multiple onChange={props.onChange}>
        {props.interval.map((n, i) => <option key={i}>{n}</option>)}
      </select>
    </div>
  )
}

function TextSelector(props) {
  return (
    <div>
      <label htmlFor='instance-select'>Введіть потрібні слова через кому | {props.column}</label><br/>
        <input
          type='text'
          onChange={props.onChange}
        />
    </div>
  )
}

function Attributes(props) {
    return (
      <div>
        {props.attributes.map((a, i) => {
            if (a.column_name === 'id') return
            if (['numeric', 'integer'].includes(a.data_type))
              return (<NumericSelector
                key={i} 
                column={a.column_name}
                interval={a.interval}
                onChange={e => props.onNumericChange(e, a.column_name)}
              />)
            if (['character varying', 'text'].includes(a.data_type))
              return (<TextSelector
                key={i}
                column={a.column_name}
                onChange={e => props.onTextChange(e, a.column_name)}
              />)
          })
        }
      </div>
    )
}

export default Attributes
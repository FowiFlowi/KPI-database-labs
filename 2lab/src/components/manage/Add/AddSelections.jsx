import React from 'react'

function AddSelections(props) {
  if (props.tablesData) {
    return (
      <div>
        <div>
          <label htmlFor='captain-select'>Виберiть капітана</label><br/>
          <select id='captain-select' onChange={e => props.onChange(e, 'captain_id')} defaultValue='Хто?'>
            {props.tablesData.d_captains.map((option, i) => 
              <option key={option.id} id={option.id}>
                Name: {option.name} | Rank: {option.rank}
              </option>
            )}
            <option key='default'>Хто?</option>
          </select>
        </div>

        <div>
          <label htmlFor='casualties-select'>Виберiть втрати (жуть)</label><br/>
          <select id='casualties-select' onChange={e => props.onChange(e, 'casualties_id')} defaultValue='Скільки?'>
            {props.tablesData.d_casualties.map((option, i) => 
              <option key={option.id} id={option.id}>
                People: {option.people} | Money: {option.money} | Ships: {option.ships}
              </option>
            )}
            <option key='default'>Скільки?</option>
          </select>
        </div>

        <div>
          <label htmlFor='attacked-system-select'>Виберiть атаковану систему</label><br/>
          <select id='attacked-system-select' onChange={e => props.onChange(e, 'attacked_star_system_id')} defaultValue='На кого?'>
            {props.tablesData.d_star_systems.map((option, i) => 
              <option key={option.id} id={option.id}>
                Name: {option.name} | Ages: {option.ages} | Size: {option.size}
              </option>
            )}
            <option key='default'>На кого?</option>
          </select>
        </div>

        <div>
          <label htmlFor='from-system-select'>Виберiть систему-нападника</label><br/>
          <select id='from-system-select' onChange={e => props.onChange(e, 'from_star_system_id')} defaultValue='Звідки?'>
            {props.tablesData.d_star_systems.map((option, i) => 
              <option key={option.id} id={option.id}>
                Name: {option.name} | Ages: {option.ages} | Size: {option.size}
              </option>
            )}
            <option key='default'>Звідки?</option>
          </select>
        </div>

        <div>
          <label htmlFor='date-select'>Введіть дату</label><br/>
          <input id='date-select' placeholder='рррр.мм.дд' onChange={props.onDateChange}/>
        </div>
      </div>
    )
  }
  return <div></div>
}

export default AddSelections
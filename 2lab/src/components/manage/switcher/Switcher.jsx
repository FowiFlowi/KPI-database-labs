import React from 'react'

import './Switcher.css'

function Switcher(props) {
    return (
      <div className='switcher'>
            <input id='toggle-local' className='toggle' name='toggle' type='radio'
              onClick={props.onFirstClick}
            />
            <label htmlFor='toggle-local' className='btn'>Додати</label>

            <input id='toggle-state' className='toggle' name='toggle' type='radio'
              onClick={props.onSecondClick}
            />
            <label htmlFor='toggle-state' className='btn'>Видалити</label>

            <input id='toggle-divided' className='toggle' name='toggle' type='radio'
              onClick={props.onThirdClick}
            />
            <label htmlFor='toggle-divided' className='btn'>Редагувати</label>
      </div>
    )
}

export default Switcher
import React from 'react'

import Uploader from '../uploader/Uploader.jsx'
import Selector from '../selector/Selector.jsx'
import Manage from '../manage/Manage.jsx'

import './App.css'

function App() {
  return (
    <div className='wrapper'>
      <Uploader />
      <Selector />
      <Manage />
    </div>
  )
}

export default App
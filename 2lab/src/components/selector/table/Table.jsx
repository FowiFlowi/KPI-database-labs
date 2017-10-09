import React from 'react'

function Table(props) {
    return (
      <div>
        {props.data && props.data.rows.length > 0 &&
          <table className='table'>
          <tbody>
              <tr>
                {props.data.fields.map(item => 
                    <th key={item.columnID}>{item.name}</th>
                )}
              </tr>
              {props.data.rows.map((item, i) => (
                  <tr key={item.id}>
                    {Object.values(item).map((value, i) =>
                      <td key={i}>{value}</td>
                    )}
                  </tr>
                ))
              }
            </tbody>
          </table>
        }
      </div>
    )
}

export default Table
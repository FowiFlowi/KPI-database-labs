module.exports = {
  selectAllTables: `SELECT table_name AS table FROM information_schema.tables 
                    WHERE table_schema = 'public'
                      AND table_type = 'BASE TABLE' 
                      AND table_name != 'spatial_ref_sys'
                    `,

  selectInstanceColumns: instance => `
                    SELECT column_name, data_type FROM information_schema.columns
                    WHERE table_name = '${instance}'
                      AND table_schema = 'public'
                    `,

  selectInstance: (instance, condition) => `SELECT * FROM ${instance} WHERE ${condition}`
}
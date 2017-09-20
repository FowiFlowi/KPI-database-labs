const commands = require('./commands')
let generator

process.stdin.on('data', chunk => {
  try {
    let input = chunk.toString().trim()
    if (!generator || generator.next(input).done) {
      input = input.toLowerCase().split(' ')
      const command = input[0],
            collection = input[1]

      if (!(command in commands))
        throw new Error(`Wrong command. Print 'help'`)

      generator = commands[command](collection)
      generator.next()
    }
  } catch(e) {
    console.error('Error: ' + e.message)
  }
  process.stdout.write('lab1#> ')
})
process.stdout.write('lab1#> ')

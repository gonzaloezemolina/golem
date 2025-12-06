const bcrypt = require('bcryptjs')

const password = 'wanakin1'

bcrypt.hash(password, 10).then(hash => {
  console.log('Hash generado:')
  console.log(hash)
})
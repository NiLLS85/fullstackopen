// Uso:
//   node mongo.js <contraseña>                  lista la agenda
//   node mongo.js <contraseña> "Nombre" número  añade una persona
// El servidor de Atlas se toma de MONGODB_HOST (p. ej. cluster0.abcde.mongodb.net)
// y el usuario de MONGODB_USER. Sin MONGODB_HOST usa una base de datos local.
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const [password, name, number] = process.argv.slice(2)
const host = process.env.MONGODB_HOST
const user = process.env.MONGODB_USER || 'fullstack'

const url = host
  ? `mongodb+srv://${user}:${encodeURIComponent(password)}@${host}/phonebookApp?retryWrites=true&w=majority`
  : 'mongodb://127.0.0.1:27017/phonebookApp'

mongoose.set('strictQuery', false)

const Person = mongoose.model(
  'Person',
  new mongoose.Schema({ name: String, number: String })
)

const run = async () => {
  await mongoose.connect(url)

  if (name && number) {
    await new Person({ name, number }).save()
    console.log(`added ${name} number ${number} to phonebook`)
  } else {
    const persons = await Person.find({})
    console.log('phonebook:')
    persons.forEach(person => console.log(`${person.name} ${person.number}`))
  }

  await mongoose.connection.close()
}

run().catch(error => {
  console.log(error.message)
  mongoose.connection.close()
  process.exit(1)
})

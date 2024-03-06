const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2];
const dbName = 'phonebook';

const url = `mongodb+srv://lucadb:${password}@cluster0.6koa5hl.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  // Display all entries in the phonebook
  Person.find({}).then(people => {
    console.log('phonebook:');
    people.forEach(person => {
      console.log(`${person.name} ${person.phone}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  // Add a new entry to the phonebook
  const newName = process.argv[3];
  const newPhone = process.argv[4];

  const person = new Person({
    name: newName,
    phone: newPhone,
  });

  person.save().then(() => {
    console.log(`added ${newName} number ${newPhone} to phonebook`);
    mongoose.connection.close();
  });
}

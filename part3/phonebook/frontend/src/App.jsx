import React, { useState, useEffect } from 'react';
import personService from './services/personService';
import './styles.css'; // Assicurati di importare il file CSS con i tuoi stili

const Filter = ({ filterValue, handleFilterChange }) => {
  return (
    <div>
      Filter shown with <input value={filterValue} onChange={handleFilterChange} />
    </div>
  );
};

// Componente per il modulo di aggiunta di nuove persone
const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

// Componente per il rendering di tutte le persone nella rubrica telefonica
const Persons = ({ persons, handleDelete }) => {
  return (
    <ul>
      {persons.map((person) => (
        <Person key={person.id} person={person} handleDelete={handleDelete} />
      ))}
    </ul>
  );
};

// Componente per il rendering di una singola persona
const Person = ({ person, handleDelete }) => {
  return (
    <li>
      {person.name} - {person.number} <button onClick={() => handleDelete(person.id)}>Delete</button>
    </li>
  );
};
// Componente principale App
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    personService
      .getAll()
      .then(persons => {
        setPersons(persons);
      });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const existingPerson = persons.find((person) => person.name === newName);
    if (existingPerson) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const newPerson = { name: newName, number: newNumber };

    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons([...persons, returnedPerson]);
        setNewName('');
        setNewNumber('');
      })
      .catch(error => {
        console.error('Error adding new person:', error);
      });
  };

  const handleDelete = (id) => {
    const personToDelete = persons.find(person => person.id === id);
    const confirmDelete = window.confirm(`Delete ${personToDelete.name}?`);
    if (confirmDelete) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          console.error('Error deleting person:', error);
        });
    }
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filterValue.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Phonebook</h2>
      <div className="input-field">
        <Filter filterValue={filterValue} handleFilterChange={handleFilterChange} />
      </div>
      <h3>Add a new person</h3>
      <div className="input-field">
        <PersonForm
          newName={newName}
          newNumber={newNumber}
          handleNameChange={handleNameChange}
          handleNumberChange={handleNumberChange}
          handleSubmit={handleSubmit}
        />
      </div>
      <h3>Numbers</h3>
      <div>
        <Persons persons={filteredPersons} handleDelete={handleDelete} />
      </div>
    </div>
  );
};

export default App;

import { useState, useEffect } from 'react';
import personService from './services/persons';
import './index.css';

const Filter = ({ search, handleSearchChange }) => {
  return (
    <div>
      filter shown with: <input value={search} onChange={handleSearchChange} />
    </div>
  );
};

const Name = ({ newName, handleNameChange }) => {
  return (
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
  );
};

const Number = ({ newNumber, handleNumberChange }) => {
  return (
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
  );
};

const Addednotification = ({ newName }) => {
  if (newName === '') {
    return null;
  }

  return <div className="addpop">Added {newName}</div>;
};

const Deletednotification = ({ deletedName }) => {
  if (deletedName === '') {
    return null;
  }

  return <div className="deletepop">Deleted {deletedName}</div>;
};

const PersonDelete = ({ id, handleDelete }) => {
  const [deleted, setDeleted] = useState(false);

  const handleClick = () => {
    const confirmDelete = window.confirm('Delete?');
    if (confirmDelete) {
      personService
        .remove(id)
        .then(() => {
          setDeleted(true);
          handleDelete(id);
        })
        .catch((error) => {
         
        });
    }
  };

  if (deleted) {
    return null;
  }

  return (
    <button type="submit" onClick={handleClick}>
      Delete
    </button>
  );
};

const Hook = ({ search, handleDelete }) => {
  const [testperson, setTest] = useState([]);

  useEffect(() => {
    personService.getAll().then((response) => {
      setTest(response.data);
    });
  }, []);

  const filteredPersons = testperson.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {filteredPersons.map((person) => (
        <div key={person.number}>
          {person.name} {person.number}{' '}
          <PersonDelete id={person.id} handleDelete={handleDelete} />
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');
  const [addedName, setAddedName] = useState('');
  const [deletedName, setDeletedName] = useState('');

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleDelete = (deletedId) => {
    const deletedPerson = persons.find((person) => person.id === deletedId);
    if (deletedPerson) {
      setDeletedName(deletedPerson.name);
      setTimeout(() => {
        setDeletedName('');
        window.location.reload()
      }, 3000);
    }
  };

  const setName = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber };
    const personExist = persons.some((person) => person.name === newPerson.name);

    if (personExist) {
      alert(`${newName} is already added to the book.`);
    } else {
      setPersons([...persons, newPerson]);
      setNewName('');
      setNewNumber('');
      personService.create(newPerson);

      setAddedName(newName);

      setTimeout(() => {
        setAddedName('');
        window.location.reload()
      }, 3000);
    }
  };

  return (
    <div>
      <h2>Book</h2>
      <Addednotification newName={addedName} />
      <Deletednotification deletedName={deletedName} />
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <div>
        <h2>Add a new</h2>
      </div>
      <form onSubmit={setName}>
        <Name newName={newName} handleNameChange={handleNameChange} />
        <Number newNumber={newNumber} handleNumberChange={handleNumberChange} />
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>

      <Hook search={search} handleDelete={handleDelete} />
    </div>
  );
};

export default App;

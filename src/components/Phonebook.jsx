import React, { useEffect, useState } from "react";
import personsServices from "../services/phonebook";
import Notification from "./Notification";

const Filter = ({ searchTerm, onSearchChange }) => {
  return (
    <div>
      Filter Shown With: <input value={searchTerm} onChange={onSearchChange} />
    </div>
  );
};

const PersonForm = ({
  newName,
  newNumber,
  onNameChange,
  onNumberChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        Name: <input value={newName} onChange={onNameChange} />
      </div>
      <div>
        Number: <input value={newNumber} onChange={onNumberChange} />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, onDelete }) => {
  return (
    <ol>
      {persons.map((person) => (
        <li key={person.id} className="persons">
          {person.name} - {person.number}{" "}
          <button onClick={() => onDelete(person.id)} className='delete'>Delete</button>
        </li>
      ))}
    </ol>
  );
};

const Phonebook = () => {
  const [persons, setPersons] = useState(null);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState({
    errorMessage: null,
    successMessage: null,
  });

  useEffect(() => {
    personsServices.getAll().then((initialPerson) => {
      setPersons(initialPerson);
    });
  }, []);

  if (!persons) {
    return null;
  }

  const addPerson = (event) => {
    event.preventDefault();

    if (newName === "" || newNumber === "") {
      setMessages({
        errorMessage: "Both name and number should be written!",
        successMessage: null,
      });
      setTimeout(() => {
        setMessages({ errorMessage: null, successMessage: null });
      }, 5000);
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };

    const personExists = persons.find((person) => person.name === newName);
    if (personExists) {
      if (
        window.confirm(
          `${newName} is already added to Phonebook. Do you want to update the current number?`
        )
      ) {
        updatePerson(personExists.id, { ...personExists, number: newNumber });
        setMessages({
          errorMessage: null,
          successMessage: `The Number of ${personExists.name} has been updated successfully.`,
        });
        setTimeout(() => {
          setMessages({ errorMessage: null, successMessage: null });
        }, 5000);
      }
      return;
    }

    personsServices
      .create(personObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setMessages({
          errorMessage: null,
          successMessage: `${returnedPerson.name} added successfully!`,
        });
        setTimeout(() => {
          setMessages({ errorMessage: null, successMessage: null });
        }, 5000);
      })
      .catch((error) => {
        let errorMsg = "An error occurred!";
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          errorMsg = error.response.data.error;
        }
        setMessages({
          errorMessage: errorMsg,
          successMessage: null,
        });
        setTimeout(() => {
          setMessages({ errorMessage: null, successMessage: null });
        }, 5000);
      });
  };

  const updatePerson = (id, updatedPerson) => {
    personsServices
      .update(id, updatedPerson)
      .then((returnedPerson) => {
        setPersons(persons.map((p) => (p.id !== id ? p : returnedPerson)));
        setNewName("");
        setNewNumber("");
      })
      .catch(() => {
        setMessages({
          errorMessage: `The person "${updatedPerson.name}" was already removed from the server!`,
          successMessage: null,
        });
        setTimeout(() => {
          setMessages({ errorMessage: null, successMessage: null });
        }, 5000);

        setPersons(persons.filter((p) => p.id !== id));
      });
  };

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    if (person && window.confirm(`Sure To Delete ${person.name}?`)) {
      personsServices
        .delete(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          setMessages({
            errorMessage: null,
            successMessage: `'${person.name}' has been deleted successfully.`,
          });
          setTimeout(() => {
            setMessages({ errorMessage: null, successMessage: null });
          }, 5000);
        })
        .catch(() => {
          setMessages({
            errorMessage: `'${person.name}' was already removed from the server!`,
            successMessage: null,
          });
          setTimeout(() => {
            setMessages({ errorMessage: null, successMessage: null });
          }, 5000);

          setPersons(persons.filter((p) => p.id !== id));
        });
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification messages={messages} />
      <Filter
        searchTerm={searchTerm}
        onSearchChange={handleSearchInputChange}
      />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onSubmit={addPerson}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} onDelete={deletePerson} />
    </div>
  );
};

export default Phonebook;

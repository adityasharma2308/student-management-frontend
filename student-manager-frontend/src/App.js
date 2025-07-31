import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [editId, setEditId] = useState(null);
  const [nameError, setNameError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

const api = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchInput]);

  const fetchStudents = async () => {
    const res = await axios.get(api);
    setStudents(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !age.trim()) return;

    const student = { name, age: parseInt(age) };

    if (editId === null) {
      await axios.post(api, student);
    } else {
      await axios.put(`${api}/${editId}`, student);
    }

    setName("");
    setAge("");
    setEditId(null);
    fetchStudents();
  };

  // ✏️ Edit
  const editStudent = (student) => {
    setName(student.name);
    setAge(student.age);
    setEditId(student.id);
  };

  const deleteStudent = async (id) => {
    await axios.delete(`${api}/${id}`);
    fetchStudents();
  };

  return (
    <div className="App">
      <h1>Student Manager</h1>
      <input
        type="text"
        placeholder="Search by name"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="search-input"
      />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            const value = e.target.value;
            setName(value);
            if (value.length < 3 || /\d/.test(value)) {
              setNameError(
                "Name must be at least 3 letters and contain no numbers"
              );
            } else {
              setNameError("");
            }
          }}
        />
        {nameError && <p style={{ color: "red" }}>{nameError}</p>}
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => {
            const value = e.target.value;
            setAge(value);
            const ageNum = parseInt(value);
            if (isNaN(ageNum) || ageNum < 5 || ageNum > 100) {
              setAgeError("Age must be between 5 and 100.");
            } else {
              setAgeError("");
            }
          }}
        />
        {ageError && <p style={{ color: "red" }}>{ageError}</p>}
        <button
          type="submit"
          className={editId === null ? "add-button" : "update-button"}
          disabled={
            !name.trim() || !age.trim() || nameError !== "" || ageError !== ""
          }
        >
          {editId === null ? "Add Student" : "Update Student"}
        </button>
      </form>

      <table className="student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...students]
            .filter((student) =>
              student.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((student) => (
              <tr
                key={student.id}
                className={editId === student.id ? "editing" : ""}
              >
                <td data-label="Name">{student.name}</td>
                <td data-label="Age">{student.age}</td>
                <td data-label="Actions">
                  <button onClick={() => editStudent(student)}>Edit</button>{" "}
                  <button onClick={() => deleteStudent(student.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

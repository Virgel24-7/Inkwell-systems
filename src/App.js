import { useState, useEffect } from "react";
import './App.css';
import { db } from './firebase-config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const userColRef = collection(db, "users");

  useEffect(() =>{
    const getUsers = async() => {
        const userData = await getDocs(userColRef)
        setUsers(userData.docs.map((doc) =>({...doc.data(), id: doc.id})))
    }

    getUsers();
  }, []);

  const addUser = async () => {
    try {
      const docRef = await addDoc(userColRef, { name, age });
      setUsers([...users, { name, age, id: docRef.id }]);
      setName("");
      setAge("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const updateUser = async (id) => {
    try {
      const userRef = doc(db, "users", id);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          name: name || userDoc.data().name,
          age: age || userDoc.data().age
        });
        setUsers(users.map(user => user.id === id ? { ...user, name: name || userDoc.data().name, age: age || userDoc.data().age } : user));
        setName("");
        setAge("");
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };
  

  const deleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return ( 
      <div className="App">
        <h1>Add User</h1>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Name" 
        />
        <input 
          type="number" 
          value={age} 
          onChange={(e) => setAge(e.target.value)} 
          placeholder="Age" 
        />
        <button onClick={addUser}>Add User</button>

        <h1>Users List</h1>
        {users.map((user) =>{
          return (
          <div key={user.id}> 
            <h1>Name: {user.name} </h1>
            <h1>Age: {user.age} </h1>
            <button onClick={() => updateUser(user.id)}>Update</button>
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </div>
        );
       })}
      </div>
    );
}

export default App;

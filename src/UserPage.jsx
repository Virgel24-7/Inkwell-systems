import React from "react";
import { db, auth } from "./firebase-config";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { logOut } from "./Loginbox";

export let currentUser = null;
export const setCurrentUser = (user) => {
  currentUser = user;
};

export const updateUserdoc = async (bookId) => {
  const tempDoc = doc(db, "users", currentUser.id);
  const newField = await addToReserved(bookId);
  await updateDoc(tempDoc, newField);
};

export const Userpage = (props) => {
  const [userRes, setUserRes] = useState([{}]);

  useEffect(() => {
    const temp = async () => {
      await setReserves();
    };

    temp();
  }, []);

  const setReserves = async () => {
    const usersCollectionRef = collection(db, "users");

    const getList = async () => {
      const data = await getDocs(usersCollectionRef);
      const tempUsers = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const user = tempUsers.filter(
        (user) => user.userId === currentUser.userId
      );

      const tempFunc = async () => {
        const promises = user[0].reserves.map(async (bookId, key) => {
          const temp = await getDoc(doc(db, "booksdemo", bookId));
          console.log(temp.id);
          return { ...temp.data(), id: temp.id };
        });

        console.log(await Promise.all(promises));
        setUserRes(await Promise.all(promises));
        console.log(userRes);
      };

      await tempFunc();
    };

    await getList();
  };

  let navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setCurrentUser(null);
        logOut();
        props.handleLogout();
        navigate("/");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.log(error);
        // An error happened.
      });
  };

  const cancelReserved = (bookId) => {
    console.log(bookId);
    //delete to user reserves
    const usersCollectionRef = collection(db, "users");

    const deleteToUser = async () => {
      const data = await getDocs(usersCollectionRef);
      const tempUsers = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log(tempUsers);
      const user = tempUsers.filter(
        (user) => user.userId === currentUser.userId
      );
      console.log(user);

      const cuserReserves = user[0].reserves;
      console.log(cuserReserves);
      const newCb = cuserReserves.filter((xbookid) => xbookid !== bookId);

      console.log(newCb);
      const tempFunc = async () => {
        const promises = newCb.map(async (bookId, key) => {
          const temp = await getDoc(doc(db, "booksdemo", bookId));
          console.log(temp.id);
          return { ...temp.data(), id: temp.id };
        });

        console.log(await Promise.all(promises));
        setUserRes(await Promise.all(promises));
        console.log(userRes);
      };

      await tempFunc();

      const tempDoc = doc(db, "users", currentUser.id);
      const newField = { reserves: newCb };
      console.log(newField);
      await updateDoc(tempDoc, newField);
    };

    //delete to bookreservers
    const booksCollectionRef = collection(db, "booksdemo");

    const deleteToBook = async () => {
      const data = await getDocs(booksCollectionRef);
      const tempBooks = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log(tempBooks);
      const book = tempBooks.filter((book) => book.id === bookId);
      console.log(book);

      const cuservers = book[0].reservers;
      console.log(cuservers);
      const newCu = cuservers.filter((userId) => userId !== currentUser.userId);

      const tempDoc = doc(db, "booksdemo", bookId);
      const newField = { reservers: newCu };
      console.log(newField);
      await updateDoc(tempDoc, newField);
    };

    deleteToUser();
    deleteToBook();
  };

  return (
    <div style={{ color: "white" }}>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius illo
      voluptates fugiat sapiente soluta, ullam eos ea magnam atque architecto
      ipsum maiores non molestias, omnis itaque quia assumenda rem sit
      aspernatur. Non dolorem eaque nobis voluptatem mollitia necessitatibus
      blanditiis, consequuntur eos quos minima minus! Maiores adipisci provident
      corporis voluptatem cum.
      <div style={{ color: "white" }}>
        {userRes.map((book, key) => (
          <div key={key}>
            {book.title}
            {book.id}
            <button onClick={() => cancelReserved(book.id)}> Cancel </button>
          </div>
        ))}
      </div>
      <button onClick={handleLogout}> LOG OUT </button>
    </div>
  );
};

const addToReserved = (bookId) => {
  const usersCollectionRef = collection(db, "users");

  const addToList = async () => {
    const data = await getDocs(usersCollectionRef);
    const tempUsers = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    const user = tempUsers.filter((user) => user.userId === currentUser.userId);

    const currUserreserves = user[0].reserves;
    const newReserves = { reserves: [...currUserreserves, bookId] };

    return newReserves;
  };

  return addToList();
};

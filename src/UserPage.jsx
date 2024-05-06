import React from "react";
import { db } from "./firebase-config";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";

export let currentUser = null;
export const setCurrentUser = (user) => {
  currentUser = user;
};

export const updateUserdoc = async (bookId) => {
  const tempDoc = doc(db, "users", currentUser.id);
  const newField = await addToReserved(bookId);
  await updateDoc(tempDoc, newField);
};

export const Userpage = () => {
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
          return temp.data();
        });

        setUserRes(await Promise.all(promises));
      };

      await tempFunc();
    };

    await getList();
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
          <div key={key}>{book.title}</div>
        ))}
      </div>
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

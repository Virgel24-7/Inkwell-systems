import React from "react";
import { db, auth } from "./firebase-config";
import {
  doc,
  updateDoc,
  collection,
  getDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { logOut } from "./Loginbox";

const due = 3;

export let currentUser = null;
export const setCurrentUser = (user) => {
  currentUser = user;
};

export const updateUserdoc = async (bookId) => {
  const dateReserved = new Date();
  const dueDate = new Date();
  dueDate.setDate(dateReserved.getDate() + due);

  const hisCollectionRef = collection(db, "history");
  const { id: reserveId } = await addDoc(hisCollectionRef, {
    userid: currentUser.id,
    state: "reserved",
    book: bookId,
    dateReserved: dateReserved.toDateString(),
    dueDate: dueDate.toDateString(),
  });

  console.log(reserveId);
  console.log(typeof reserveId);

  const tempDoc = doc(db, "users", currentUser.id);
  const newField = await addToReserved(reserveId);
  await updateDoc(tempDoc, newField);
};

export const Userpage = (props) => {
  const [userRes, setUserRes] = useState([]);
  const [loadRes, setLoadRes] = useState(true);

  useEffect(() => {
    console.log(typeof userRes);
    console.log(userRes.length);
    const temp = async () => {
      await setReserves();
    };

    temp();
  }, []);

  const setReserves = async () => {
    const getList = async () => {
      const user = await getDoc(doc(db, "users", currentUser.id));

      const setReserves = async () => {
        const promises = user.data().reserves.map(async (reserveId, key) => {
          const temp = await getDoc(doc(db, "history", reserveId));
          const title = (
            await getDoc(doc(db, "booksdemo", temp.data().book))
          ).data().title;
          return { ...temp.data(), id: temp.id, title: title };
        });

        setUserRes(await Promise.all(promises));
        setLoadRes(false);
      };

      await setReserves();
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
        alert("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const cancelReserved = (reserveId, bookId) => {
    //delete to userReserves
    const deleteToUser = async () => {
      const user = await getDoc(doc(db, "users", currentUser.id));

      const cuserReserves = user.data().reserves;
      const newCb = cuserReserves.filter((resId) => resId !== reserveId);

      const tempFunc = async () => {
        const promises = newCb.map(async (reserveId, key) => {
          const temp = await getDoc(doc(db, "history", reserveId));
          const title = (
            await getDoc(doc(db, "booksdemo", temp.data().book))
          ).data().title;
          return { ...temp.data(), id: temp.id, title: title };
        });

        setUserRes(await Promise.all(promises));
      };

      await tempFunc();

      const tempDoc = doc(db, "users", currentUser.id);
      const newField = { reserves: newCb };
      await updateDoc(tempDoc, newField);
    };

    //delete to bookreservers
    const deleteToBook = async () => {
      const book = await getDoc(doc(db, "booksdemo", bookId));

      const cuservers = book.data().reservers;
      const newCu = cuservers.filter((userId) => userId !== currentUser.userId);

      const tempDoc = doc(db, "booksdemo", bookId);
      const newField = { reservers: newCu, copies: book.data().copies + 1 };
      await updateDoc(tempDoc, newField);
    };

    //delete to history
    const deleteToHistory = async () => {
      const historyToDelete = doc(db, "history", reserveId);
      await deleteDoc(historyToDelete);
    };

    deleteToUser();
    deleteToBook();
    deleteToHistory();
  };

  return (
    <div className="center-content">
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius illo
      voluptates fugiat sapiente soluta, ullam eos ea magnam atque architecto
      ipsum maiores non molestias, omnis itaque quia assumenda rem sit
      aspernatur. Non dolorem eaque nobis voluptatem mollitia necessitatibus
      blanditiis, consequuntur eos. Lorem ipsum dolor sit amet consectetur
      adipisicing elit. Doloribus suscipit iure, eligendi accusantium velit
      delectus quod laborum quasi minus facere hic repellat reprehenderit
      repudiandae fuga quaerat harum in doloremque non temporibus consequatur
      consectetur praesentium? Magnam consequuntur fugit, maiores iste
      distinctio voluptatem tenetur consectetur eveniet incidunt quo! Eius, qui.
      Assumenda neque itaque, aperiam animi, sed ipsa perspiciatis vel deserunt
      labore suscipit, quae alias facere culpa voluptas? Modi excepturi pariatur
      eaque nostrum tempora placeat. Voluptatibus magnam voluptates veniam
      voluptatem voluptatum blanditiis perspiciatis eos minima soluta, quasi
      ullam ipsa perferendis eius saepe non voluptas distinctio esse dolore sit
      ea enim iure optio laudantium.
      <div style={{ color: "white" }}>
        {loadRes ? (
          <p>Loading reservations...</p>
        ) : userRes.length === 0 ? (
          <p>No reservations made as of this moment.</p>
        ) : (
          userRes.map((reserve, key) => (
            <div key={key}>
              {reserve.title}: Date reserved: {reserve.dateReserved} - Due date:{" "}
              {reserve.dueDate}
              <button onClick={() => cancelReserved(reserve.id, reserve.book)}>
                Cancel
              </button>
            </div>
          ))
        )}
      </div>
      <button onClick={handleLogout}> LOG OUT </button>
    </div>
  );
};

const addToReserved = async (reserveId) => {
  const tempDoc = await getDoc(doc(db, "users", currentUser.id));
  console.log(tempDoc.data());
  const newArray = { reserves: [...tempDoc.data().reserves, reserveId] };

  console.log(newArray);

  return newArray;
};

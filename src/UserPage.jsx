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

const due = 3;

export let currentUser = null;
export const setCurrentUser = (user) => {
  currentUser = user;
};

export const Userpage = (props) => {
  const [page, setPage] = useState("res");
  const [userRes, setUserRes] = useState([]);
  const [loadRes, setLoadRes] = useState(true);
  const [userBor, setUserBor] = useState([]);
  const [loadBor, setLoadBor] = useState(true);
  const [userRet, setUserRet] = useState([]);
  const [loadRet, setLoadRet] = useState(true);

  useEffect(() => {
    console.log(typeof userRes);
    console.log(userRes.length);
    const temp = async () => {
      await setHistory();
    };

    temp();
  }, []);

  const setHistory = async () => {
    setUserRes(await getRealReserves());
    setUserBor(await getRealBorrows());
    setUserRet(await getRealReturns());
    setLoadRes(false);
    setLoadBor(false);
    setLoadRet(false);
  };

  return (
    <div className="center-content">
      BOOK HISTORY
      <div className="button-container">
        <button
          onClick={async () => {
            setHistory();
            setPage("res");
          }}
        >
          Reservations
        </button>
        <button
          onClick={async () => {
            setHistory();
            setPage("bor");
          }}
        >
          Borrowed books
        </button>
        <button
          onClick={async () => {
            setHistory();
            setPage("ret");
          }}
        >
          Returned books
        </button>
      </div>
      <div style={{ color: "white" }}>
        {(() => {
          switch (page) {
            case "res":
              return loadRes ? (
                <p>Loading reservations...</p>
              ) : userRes.length === 0 ? (
                <p>No reservations made as of this moment.</p>
              ) : (
                <Reservations
                  userRes={userRes}
                  cancelReserved={cancelReserved}
                />
              );
              break;
            case "bor":
              return loadBor ? (
                <p>Loading borrow checkouts...</p>
              ) : userBor.length === 0 ? (
                <p>No borrow checkouts made as of this moment.</p>
              ) : (
                <Borrowedlist userBor={userBor} />
              );
              break;
            default:
              return loadRet ? (
                <p>Loading reservations...</p>
              ) : !userRet || userRet.length === 0 ? (
                <p>No returned books as of this moment.</p>
              ) : (
                <Returnlist userRet={userRet} reserve={reserveBook} />
              );

              break;
          }
        })()}
      </div>
    </div>
  );

  function cancelReserved(reserveId, bookId) {
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

      const tempDoc = doc(db, "booksdemo", bookId);
      const newField = { copies: book.data().copies + 1 };
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
  }
};

export const reserveBook = async (bookId) => {
  const btr = doc(db, "booksdemo", bookId);

  if ((await getDoc(btr)).data().copies === 0) {
    alert("CANNOT RESERVE.\nNo copy available");
    return;
  }

  const userRes = await getRealReserves();
  if (userRes.some((res) => res.book === bookId)) {
    alert("CANNOT RESERVE.\nBook currently being reserved");
    return;
  }

  const userBor = await getRealBorrows();
  if (userBor.some((bor) => bor.book === bookId)) {
    alert("CANNOT RESERVE.\nBook currently being borrowed");
    return;
  }

  const btro = (await getDoc(btr)).data();
  const newField1 = {
    copies: btro.copies - 1,
  };
  updateDoc(btr, newField1);

  //add to history
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

  //edit userdoc
  const tempDoc = doc(db, "users", currentUser.id);
  const newField = await addToReserved(reserveId);
  await updateDoc(tempDoc, newField);

  alert("Successfully reserved");
  return reserveId;
};

const getRealReserves = async () => {
  const user = await getDoc(doc(db, "users", currentUser.id));
  const promises = user.data().reserves.map(async (reserveId, key) => {
    const temp = await getDoc(doc(db, "history", reserveId));
    const title = (await getDoc(doc(db, "booksdemo", temp.data().book))).data()
      .title;
    return { ...temp.data(), id: temp.id, title: title, key: key };
  });

  return await Promise.all(promises);
};

const getRealBorrows = async () => {
  const user = await getDoc(doc(db, "users", currentUser.id));
  const promises = user.data().borrowed.map(async (borrowId, key) => {
    const temp = await getDoc(doc(db, "history", borrowId));
    const bookData = await getDoc(doc(db, "booksdemo", temp.data().book));
    return {
      ...temp.data(),
      id: temp.id,
      title: bookData.data().title,
      dateBorrowed: temp.data().dateBorrowed, // Ensure this line is present
      key: key,
    };
  });

  return await Promise.all(promises);
};

const getRealReturns = async () => {
  const user = await getDoc(doc(db, "users", currentUser.id));
  if (!user.data().returned) return;
  const promises = user.data().returned.map(async (returnId, key) => {
    const temp = await getDoc(doc(db, "history", returnId));
    const title = (await getDoc(doc(db, "booksdemo", temp.data().book))).data()
      .title;
    return { ...temp.data(), id: temp.id, title: title, key: key };
  });

  return await Promise.all(promises);
};

const addToReserved = async (reserveId) => {
  const tempDoc = await getDoc(doc(db, "users", currentUser.id));
  console.log(tempDoc.data());
  const newArray = { reserves: [...tempDoc.data().reserves, reserveId] };

  console.log(newArray);

  return newArray;
};

const Reservations = (props) => {
  return (
    <table className="table-container">
      <thead>
        <tr>
          <th>Book Title</th>
          <th>Date Reserved</th>
          <th>Due Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {props.userRes.map((reserve, key) => (
          <tr key={key}>
            <td>{reserve.title}</td>
            <td>{reserve.dateReserved}</td>
            <td>{reserve.dueDate}</td>
            <td>
              <button
                onClick={() => props.cancelReserved(reserve.id, reserve.book)}
              >
                Cancel
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Borrowedlist = (props) => {
  return (
    <table className="table-container">
      <thead>
        <tr>
          <th>Book Title</th>
          <th>Date Borrowed</th>
          <th>Due Date</th>
        </tr>
      </thead>
      <tbody>
        {props.userBor.map((borrow, key) => (
          <tr key={key}>
            <td>{borrow.title}</td>
            <td>{new Date(borrow.dateBorrowed).toLocaleDateString()}</td>
            {/* Format date if necessary */}
            <td>{borrow.dueDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Returnlist = (props) => {
  return (
    <table className="table-container">
      <thead>
        <tr>
          <th>Book Title</th>
          <th>Date Borrowed</th>
          <th>Date Returned</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {props.userRet.map((returned, key) => (
          <tr key={key}>
            <td>{returned.title}</td>
            <td>{returned.dateBorrowed}</td>
            <td>{returned.dateReturned}</td>
            <td>
              <button onClick={() => props.reserve(returned.book)}>
                Reserve again
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

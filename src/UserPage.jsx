import React from "react";
import { db } from "./firebase-config";
import {
  doc,
  updateDoc,
  collection,
  getDoc,
  addDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { currentUser } from "./App";

export const Userpage = (props) => {
  const [page, setPage] = useState("res");
  const [name, setName] = useState(currentUser.name);
  const [userRes, setUserRes] = useState([]);
  const [loadRes, setLoadRes] = useState(true);
  const [userBor, setUserBor] = useState([]);
  const [loadBor, setLoadBor] = useState(true);
  const [userRet, setUserRet] = useState([]);
  const [loadRet, setLoadRet] = useState(true);
  const [totalFee, setTotalFee] = useState(0);

  useEffect(() => {
    const temp = async () => {
      await setHistory();
    };

    temp();
  }, [page]);

  const setHistory = async () => {
    setUserRes(await getRealReserves());
    setUserBor(await getRealBorrows());
    setUserRet(await getRealReturns());
    setTotalFee(await getRealFee());
    setLoadRes(false);
    setLoadBor(false);
    setLoadRet(false);
  };

  return (
    <div className="center-content">
      <div className="name-box">
        Name: {name}
        <button
          className="editname-button"
          onClick={changeName}
          title="Edit name"
        >
          <span></span>
        </button>
      </div>
      <p>BOOK HISTORY</p>
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
      Total overdue fee: {totalFee}
      <div className="user-content" style={{ color: "white" }}>
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

  function changeName() {
    const newName = prompt(
      "Enter new name\nAlphanumeric only\n(this will reflect on the next login): "
    );

    if (!newName || !/^[a-zA-Z0-9]+$/.test(newName)) {
      alert("Invalid. Alphanumeric only.");
      return;
    }

    const uToUp = doc(db, "users", currentUser.id);
    updateDoc(uToUp, { name: newName });
    setName(newName);
  }

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

  const balance = (await getDoc(doc(db, "users", currentUser.id))).data()
    .totalFee;
  if (balance > 0) {
    alert(
      `CANNOT RESERVE.\nYou currently have ${balance} balance. Please settle this first.`
    );
    return;
  }

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
  dueDate.setDate(dateReserved.getDate() + (await masterData()).resDays);

  const hisCollectionRef = collection(db, "history");
  const { id: reserveId } = await addDoc(hisCollectionRef, {
    userid: currentUser.id,
    state: "reserved",
    book: bookId,
    dateReserved: dateReserved.toDateString(),
    dueDate: dueDate.toDateString(),
  });

  //edit userdoc
  const tempDoc = doc(db, "users", currentUser.id);
  const newField = await addToReserved(reserveId);
  await updateDoc(tempDoc, newField);

  alert("Successfully reserved");
  return reserveId;
};

const cancelRes = (reserveId, bookId) => {
  //delete to userReserves
  const deleteToUser = async () => {
    const user = await getDoc(doc(db, "users", currentUser.id));

    const cuserReserves = user.data().reserves;
    const newCb = cuserReserves.filter((resId) => resId !== reserveId);

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
};

const getRealReserves = async () => {
  const date = new Date();

  const userdoc = doc(db, "users", currentUser.id);
  const user = await getDoc(userdoc);
  const filtRes = user.data().reserves.filter(async (res) => {
    const temp = await getDoc(doc(db, "history", res));
    const overdueDays =
      (Number(Date.parse(date.toDateString())) -
        Number(Date.parse(temp.data().dueDate))) /
      86400000;

    if (overdueDays > 0) {
      cancelRes(res, temp.data().book);
    }

    return overdueDays <= 0;
  });

  const promises = await filtRes.map(async (reserveId, key) => {
    const temp = await getDoc(doc(db, "history", reserveId));
    const title = (await getDoc(doc(db, "booksdemo", temp.data().book))).data()
      .title;

    return { ...temp.data(), id: temp.id, title: title, key: key };
  });

  return await Promise.all(promises);
};

const getRealBorrows = async () => {
  let total = 0;
  const date = new Date();

  const userdoc = doc(db, "users", currentUser.id);
  const user = await getDoc(userdoc);
  const promises = user.data().borrowed.map(async (borrowId, key) => {
    const temp = await getDoc(doc(db, "history", borrowId));
    const title = (await getDoc(doc(db, "booksdemo", temp.data().book))).data()
      .title;
    const overdueDays =
      (Number(Date.parse(date.toDateString())) -
        Number(Date.parse(temp.data().dueDate))) /
      86400000;
    const overdueFee =
      overdueDays <= 0 ? 0 : overdueDays * temp.data().overdueRate;
    total += overdueFee;

    return {
      ...temp.data(),
      id: temp.id,
      title: title,
      dateBorrowed: temp.data().dateBorrowed,
      days: overdueDays <= 0 ? 0 : overdueDays,
      key: key,
      overdueRate: temp.data().overdueRate,
      overdueFee: overdueFee,
    };
  });

  const obj = await Promise.all(promises);
  updateDoc(userdoc, { totalFee: total });

  return obj;
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

const getRealFee = async () => {
  return (await getDoc(doc(db, "users", currentUser.id))).data().totalFee;
};

const addToReserved = async (reserveId) => {
  const tempDoc = await getDoc(doc(db, "users", currentUser.id));
  const newArray = { reserves: [...tempDoc.data().reserves, reserveId] };

  return newArray;
};

export const setUserData = () => {
  getRealReserves();
  getRealBorrows();
  getRealReturns();
  getRealFee();
};

const masterData = async () => {
  try {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    const allUsers = usersSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const master = allUsers.find((user) => user.role === "masteradmin");
    return master;
  } catch (error) {
    console.error("Error fetching users: ", error);
  }
};

const Reservations = (props) => {
  return (
    <div>
      <br />
      <br />
      RESERVATIONS LIST
      <p>Be sure to borrow before the due date or it will auto-cancel.</p>
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
                  className="remove-button"
                  onClick={() => props.cancelReserved(reserve.id, reserve.book)}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

const Borrowedlist = (props) => {
  return (
    <div>
      <br />
      <br />
      BORROW CHECKOUTS LIST
      <p>
        Be sure to return before the due date or there will be overdue fees.
      </p>
      <table className="table-container">
        <thead>
          <tr>
            <th>Book Title</th>
            <th>Date Borrowed</th>
            <th>Due Date</th>
            <th># of days from due</th>
            <th>Daily rate(overdue)</th>
            <th>Overdue fee</th>
          </tr>
        </thead>
        <tbody>
          {props.userBor.map((borrow, key) => (
            <tr key={key}>
              <td>{borrow.title}</td>
              <td>{borrow.dateBorrowed}</td>
              <td>{borrow.dueDate}</td>
              <td>{borrow.days}</td>
              <td>{borrow.overdueRate}</td>
              <td>{borrow.overdueFee}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

const Returnlist = (props) => {
  return (
    <div>
      <br />
      <br />
      RETURN LIST
      <p>Feel free to reserve and borrow the same book/s again.</p>
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
                <button
                  className="remove-button"
                  onClick={() => props.reserve(returned.book)}
                >
                  Reserve again
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

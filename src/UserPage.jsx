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
import { currUserName, logOut } from "./Loginbox";

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
    const getList = async () => {
      const user = await getDoc(doc(db, "users", currentUser.id));

      const setReserves = async () => {
        const promises = user.data().reserves.map(async (reserveId, key) => {
          const temp = await getDoc(doc(db, "history", reserveId));
          const title = (
            await getDoc(doc(db, "booksdemo", temp.data().book))
          ).data().title;
          return { ...temp.data(), id: temp.id, title: title, key: key };
        });

        setUserRes(await Promise.all(promises));
        setLoadRes(false);
      };

      const setBorrowed = async () => {
        const promises = user.data().borrowed.map(async (borrowId, key) => {
          const temp = await getDoc(doc(db, "history", borrowId));
          const bookData = await getDoc(doc(db, "booksdemo", temp.data().book));
          return { 
            ...temp.data(), 
            id: temp.id, 
            title: bookData.data().title, 
            dateBorrowed: temp.data().dateBorrowed, // Ensure this line is present
            key: key 
          };
        });
      
        setUserBor(await Promise.all(promises));
        setLoadBor(false);
      };

      const setReturned = async () => {
        const promises = user.data().returned.map(async (returnId, key) => {
          const temp = await getDoc(doc(db, "history", returnId));
          const title = (
            await getDoc(doc(db, "booksdemo", temp.data().book))
          ).data().title;
          return { ...temp.data(), id: temp.id, title: title, key: key };
        });

        setUserRet(await Promise.all(promises));
        setLoadRet(false);
      };

      await setReserves();
      await setBorrowed();
      await setReturned();
      console.log("refreshed");
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
      <div>
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
              ) : userRet.length === 0 ? (
                <p>No returned books as of this moment.</p>
              ) : (
                <Returnlist userRet={userRet} reserve={reserve} />
              );

              break;
          }
        })()}
      </div>
      <button onClick={handleLogout}> LOG OUT </button>
    </div>
  );

  async function reserve(bookId) {
    if (userRes.some((res) => res.book === bookId)) {
      alert("Book currently being reserved");
      return;
    }

    if (userBor.some((bor) => bor.book === bookId)) {
      alert("Book currently being borrowed");
      return;
    }

    if ((await getDoc(doc(db, "booksdemo", bookId))).data().copies === 0) {
      alert("No copy available");
      return;
    }

    const btr = doc(db, "booksdemo", bookId);
    const btrdoc = await getDoc(btr);
    const newField = {
      reservers: [...btrdoc.data().reservers, currentUser.userId],
      copies: btrdoc.data().copies - 1,
    };
    updateDoc(btr, newField);
    await updateUserdoc(bookId);
    alert("Succesfully reserved");
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
  }
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

  return reserveId;
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
            <td>{new Date(borrow.dateBorrowed).toLocaleDateString()}</td> {/* Format date if necessary */}
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

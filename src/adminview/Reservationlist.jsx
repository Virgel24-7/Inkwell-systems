import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { currentUser } from "../App";

const duePeriod = 7;

export const Reservationlist = () => {
  const [loadRes, setLoadRes] = useState(true);
  const [reservations, setReservations] = useState([]);
  const historyCollectionRef = collection(db, "history");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("username");

  let navigate = useNavigate();

  useEffect(() => {
    if (currentUser === null || currentUser.role !== "admin") {
      navigate("/");
    }
    openReservations(historyCollectionRef, setReservations);
    setLoadRes(false);
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredReserves = reservations.filter((reserved) => {
    const searchTermLower = searchTerm.toLowerCase();
    switch (filterOption) {
      case "username":
        return reserved.name.toLowerCase().includes(searchTermLower);
      case "title":
        return reserved.title.toLowerCase().includes(searchTermLower);
      default:
        return reserved.name.toLowerCase().includes(searchTermLower);
    }
  });

  return (
    <div style={{ color: "white" }}>
      <div className="search-container-admin">
        <form onSubmit={(e) => e.preventDefault()} className="search-bar-admin">
          <input
            style={{ color: "white" }}
            type="text"
            placeholder="Search for reservations here..."
            onChange={handleSearch}
          />
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="title">Search by Title</option>
            <option value="username">Search by Username</option>
          </select>
        </form>
      </div>
      <div className="center-content" style={{ color: "white" }}>
        BOOKS STATUS
      </div>
      <div style={{ textAlign: "center" }}>
        <p>RESERVATIONS LIST</p>
      </div>
      <div className="table-container">
        {loadRes ? (
          <div style={{ textAlign: "center" }}>
            <p>Loading reservations ...</p>
          </div>
        ) : filteredReserves.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <p>No reservations found.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Book Title</th>
                <th>Date Reserved</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReserves.map((reserve, key) => (
                <tr key={key}>
                  <td>{reserve.name}</td>
                  <td>{reserve.title}</td>
                  <td>{reserve.dateReserved}</td>
                  <td>{reserve.dueDate}</td>
                  <td>
                    <button
                      className="remove-button"
                      onClick={() => {
                        changeToBorrow(
                          reserve.id,
                          reserve.userid,
                          reserve.book
                        );
                        openReservations(historyCollectionRef, setReservations);
                        setLoadRes(false);
                      }}
                    >
                      Change to borrow
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

async function openReservations(historyCollectionRef, setReservations) {
  const date = new Date();
  const getReserves = async () => {
    const data = await getDocs(historyCollectionRef);
    const tempHis = data.docs.filter((historyDoc) => {
      return historyDoc.data().state === "reserved";
    });

    const tempHis2 = tempHis.filter((resDoc) => {
      const temp = resDoc.data();
      const overdueDays =
        (Number(Date.parse(date.toDateString())) -
          Number(Date.parse(temp.dueDate))) /
        86400000;

      if (overdueDays > 0) {
        cancelRes(resDoc.id);
      }

      return overdueDays <= 0;
    });

    const promises = tempHis2.map(async (hisDoc) => ({
      ...hisDoc.data(),
      id: hisDoc.id,
      title: (await getDoc(doc(db, "booksdemo", hisDoc.data().book))).data()
        .title,
      name: (await getDoc(doc(db, "users", hisDoc.data().userid))).data().name,
    }));

    const tempHisObject = await Promise.all(promises);

    setReservations(tempHisObject);
  };

  await getReserves();
}

const cancelRes = async (resid) => {
  const rtdoc = doc(db, "history", resid);
  const rtd = (await getDoc(rtdoc)).data();

  //update user
  const utdoc = doc(db, "users", rtd.userid);
  const newResArr = (await getDoc(utdoc))
    .data()
    .reserves.filter((res) => res !== resid);
  updateDoc(utdoc, { reserves: newResArr });

  //update book
  const btdoc = doc(db, "booksdemo", rtd.book);
  const btu = (await getDoc(btdoc)).data();
  updateDoc(btdoc, { copies: btu.copies + 1 });

  //delete res
  deleteDoc(rtdoc);
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

async function changeToBorrow(historyId, userId) {
  //change historydoc
  const resToChange = doc(db, "history", historyId);

  const dateBorrowed = new Date();
  const dueDate = new Date();
  dueDate.setDate(dateBorrowed.getDate() + duePeriod);

  const newField = {
    state: "borrowed",
    dateBorrowed: dateBorrowed.toDateString(),
    dueDate: dueDate.toDateString(),
    overdueRate: (await masterData()).overdueRate,
  };
  updateDoc(resToChange, newField);

  //change userdoc
  const userToChange = doc(db, "users", userId);
  const borrowed = (await getDoc(userToChange)).data().borrowed;
  borrowed.push(historyId);
  const newField2 = {
    reserves: (await getDoc(userToChange))
      .data()
      .reserves.filter((reserved) => {
        return reserved !== historyId;
      }),
    borrowed: borrowed,
  };

  alert("Book successfully being borrowed.");
  updateDoc(userToChange, newField2);
}

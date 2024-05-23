import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";

const duePeriod = 7;

export const Reservationlist = () => {
  const [loadRes, setLoadRes] = useState(true);
  const [reservations, setReservations] = useState([]);
  const historyCollectionRef = collection(db, "history");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("username");

  useEffect(() => {
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
      <div className = "center-content"style={{ color: "white" }}>
       BOOKS STATUS
      </div>
      <div className="table-container">
        {loadRes ? (
          <p>Loading reservations...</p>
        ) : filteredReserves.length === 0 ? (
          <p>No reservations found.</p>
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
  const getReserves = async () => {
    const data = await getDocs(historyCollectionRef);
    const tempHis = data.docs.filter((historyDoc) => {
      return historyDoc.data().state === "reserved";
    });

    const promises = tempHis.map(async (hisDoc) => ({
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

async function changeToBorrow(historyId, userId, bookId) {
  //change historydoc
  const resToChange = doc(db, "history", historyId);

  const dateBorrowed = new Date();
  const dueDate = new Date();
  dueDate.setDate(dateBorrowed.getDate() + duePeriod);

  const newField = {
    state: "borrowed",
    dateBorrowed: dateBorrowed.toDateString(),
    dueDate: dueDate.toDateString(),
  };
  await updateDoc(resToChange, newField);

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

  await updateDoc(userToChange, newField2);
}

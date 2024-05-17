import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { update } from "firebase/database";

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
      <div className="search-container">
        <form onSubmit={(e) => e.preventDefault()} className="search-bar">
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
      <div style={{ color: "white" }}>
        habrcsvfvbdcvsdcbhdtbvxfgcHAHAHA Lorem ipsum dolor sit amet consectetur,
        adipisicing elit. Excepturi cumque, laborum ullam vero eos illo
        repellendus voluptates ipsa consequatur dolorem mollitia tenetur quidem
        earum voluptatum! Ut vero labore pariatur cumque iure. Saepe magnam quia
        veritatis sit eveniet dolor placeat alias, officiis provident. Libero
        explicabo natus facilis vero. Delectus, et velit?
      </div>
      <div style={{ color: "white" }}>
        {loadRes ? (
          <p>Loading reservations...</p>
        ) : filteredReserves.length === 0 ? (
          <p>No reservations found.</p>
        ) : (
          filteredReserves.map((reserve, key) => (
            <div key={key}>
              {reserve.name}
              {"  "}
              {reserve.title}: Date reserved: {reserve.dateReserved} - Due date:{" "}
              {reserve.dueDate} {"  "}
              <button
                onClick={() => {
                  changeToBorrow(reserve.id, reserve.userid, reserve.book);
                  openReservations(historyCollectionRef, setReservations);
                  setLoadRes(false);
                }}
              >
                Change to borrow
              </button>
            </div>
          ))
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
    console.log(tempHisObject);

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

  //change bookdoc
  const bookToChange = doc(db, "booksdemo", bookId);
  const uidtodelete = (await getDoc(doc(db, "users", userId))).data().userId;
  const newField3 = {
    reservers: (await getDoc(bookToChange))
      .data()
      .reservers.filter(async (reserver) => {
        return reserver !== uidtodelete;
      }),
  };

  console.log(uidtodelete);
  console.log(userId);
  await updateDoc(bookToChange, newField3);
}
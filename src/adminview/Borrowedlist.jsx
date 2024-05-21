import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";

export const Borrowedlist = () => {
  const [loadRes, setLoadRes] = useState(true);
  const [borroweds, setborroweds] = useState([]);
  const historyCollectionRef = collection(db, "history");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("username");

  useEffect(() => {
    openBorrowed(historyCollectionRef, setborroweds);
    setLoadRes(false);
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredBorroweds = borroweds.filter((borrowed) => {
    const searchTermLower = searchTerm.toLowerCase();
    switch (filterOption) {
      case "username":
        return borrowed.name.toLowerCase().includes(searchTermLower);
      case "title":
        return borrowed.title.toLowerCase().includes(searchTermLower);
      default:
        return borrowed.name.toLowerCase().includes(searchTermLower);
    }
  });

  return (
    <div style={{ color: "white" }}>
      <div className="search-container">
        <form onSubmit={(e) => e.preventDefault()} className="search-bar">
          <input
            style={{ color: "white" }}
            type="text"
            placeholder="Search for borrow exchange here..."
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
        explicabo natus facilis vero. Delectus, et velit? BORROWED
      </div>
      <div style={{ color: "white" }}>
        {loadRes ? (
          <p>Loading borrow checkouts ...</p>
        ) : filteredBorroweds.length === 0 ? (
          <p>No borrow checkouts found.</p>
        ) : (
          filteredBorroweds.map((borrowed, key) => (
            <div key={key}>
              {borrowed.name}
              {"  "}
              {borrowed.title}: Date borrowed: {borrowed.dateBorrowed} - Due
              date: {borrowed.dueDate} {"  "}
              <button
                onClick={() => {
                  changeToReturned(borrowed.id, borrowed.userid, borrowed.book);
                  openBorrowed(historyCollectionRef, setborroweds);
                  setLoadRes(false);
                }}
              >
                Change to returned
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

async function openBorrowed(historyCollectionRef, setborroweds) {
  const getReserves = async () => {
    const data = await getDocs(historyCollectionRef);
    const tempHis = data.docs.filter((historyDoc) => {
      return historyDoc.data().state === "borrowed";
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

    setborroweds(tempHisObject);
  };

  await getReserves();
}

async function changeToReturned(historyId, userId, bookId) {
  //change historydoc
  const borToChange = doc(db, "history", historyId);

  const dateReturned = new Date();

  const newField = {
    state: "returned",
    dateReturned: dateReturned.toDateString(),
  };
  await updateDoc(borToChange, newField);

  //change userdoc
  const userToChange = doc(db, "users", userId);
  const returned = (await getDoc(userToChange)).data().returned || [];
  returned.push(historyId);
  const newField2 = {
    borrowed: (await getDoc(userToChange))
      .data()
      .reserves.filter((borrowed) => {
        return borrowed !== historyId;
      }),
    returned: returned,
  };
  await updateDoc(userToChange, newField2);

  //change bookdoc
  const bookToChange = doc(db, "booksdemo", bookId);
  const uidtodelete = (await getDoc(doc(db, "users", userId))).data().userId;
  const newField3 = {
    borrowers: (await getDoc(bookToChange))
      .data()
      .borrowers.filter((borrower) => {
        return borrower !== uidtodelete;
      }),
    copies: (await getDoc(bookToChange)).data().copies + 1,
  };
  await updateDoc(bookToChange, newField3);
}
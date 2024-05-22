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
  const [borroweds, setBorroweds] = useState([]);
  const historyCollectionRef = collection(db, "history");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("username");

  useEffect(() => {
    openBorrowed(historyCollectionRef, setBorroweds);
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
      <div className="table-container">
        {loadRes ? (
          <p>Loading borrow checkouts ...</p>
        ) : filteredBorroweds.length === 0 ? (
          <p>No borrow checkouts found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Book Title</th>
                <th>Date Borrowed</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBorroweds.map((borrowed, key) => (
                <tr key={key}>
                  <td>{borrowed.name}</td>
                  <td>{borrowed.title}</td>
                  <td>{borrowed.dateBorrowed}</td>
                  <td>{borrowed.dueDate}</td>
                  <td>
                    <button
                      onClick={() => {
                        changeToReturned(
                          borrowed.id,
                          borrowed.userid,
                          borrowed.book
                        );
                        openBorrowed(historyCollectionRef, setBorroweds);
                        setLoadRes(false);
                      }}
                    >
                      Change to returned
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

async function openBorrowed(historyCollectionRef, setBorroweds) {
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

    setBorroweds(tempHisObject);
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
  const newField3 = {
    copies: (await getDoc(bookToChange)).data().copies + 1,
  };
  await updateDoc(bookToChange, newField3);
}

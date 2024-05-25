import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { currentUser } from "../App";
import { useNavigate } from "react-router-dom";

export const Borrowedlist = () => {
  const [loadRes, setLoadRes] = useState(true);
  const [borroweds, setBorroweds] = useState([]);
  const historyCollectionRef = collection(db, "history");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("username");
  let navigate = useNavigate();

  useEffect(() => {
    if (currentUser === null || currentUser.role !== "admin") {
      navigate("/");
    }
    openBorrowed(historyCollectionRef, setBorroweds);
    setLoadRes(false);
  }, [borroweds]);

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
      <div className="search-container-admin">
        <form onSubmit={(e) => e.preventDefault()} className="search-bar-admin">
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
      <div className="center-content" style={{ color: "white" }}>
        BOOKS STATUS
      </div>
      <div style={{ textAlign: "center" }}>
        <p>BORROW CHECKOUTS LIST</p>
      </div>
      <div className="table-container">
        {loadRes ? (
          <div style={{ textAlign: "center" }}>
            <p>Loading borrow checkouts ...</p>
          </div>
        ) : filteredBorroweds.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <p>No borrow checkouts found.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Book Title</th>
                <th>Date Borrowed</th>
                <th>Due Date</th>
                <th># of days from due</th>
                <th>Daily rate(overdue)</th>
                <th>Overdue fee</th>
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
                  <td>{borrowed.days}</td>
                  <td>{borrowed.overdueRate}</td>
                  <td>{borrowed.overdueFee}</td>
                  <td>
                    <button
                      className="remove-button"
                      onClick={() => {
                        changeToReturned(
                          borrowed.id,
                          borrowed.userid,
                          borrowed.book,
                          borrowed.days,
                          borrowed.overdueFee
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

    const date = new Date();

    const promises = tempHis.map(async (hisDoc, key) => {
      const overdueDays =
        (Number(Date.parse(date.toDateString())) -
          Number(Date.parse(hisDoc.data().dueDate))) /
        86400000;

      const overdueFee =
        overdueDays <= 0 ? 0 : overdueDays * hisDoc.data().overdueRate;

      return {
        ...hisDoc.data(),
        id: hisDoc.id,
        title: (await getDoc(doc(db, "booksdemo", hisDoc.data().book))).data()
          .title,
        name: (await getDoc(doc(db, "users", hisDoc.data().userid))).data()
          .name,
        days: overdueDays <= 0 ? 0 : overdueDays,
        key: key,
        overdueRate: hisDoc.data().overdueRate,
        overdueFee: overdueFee,
      };
    });

    const tempHisObject = await Promise.all(promises);

    setBorroweds(tempHisObject);
  };

  await getReserves();
}

async function changeToReturned(
  historyId,
  userId,
  bookId,
  overdueDays,
  overdueFee
) {
  //change historydoc
  const borToChange = doc(db, "history", historyId);
  let go = false;

  const dateReturned = new Date();
  if (overdueFee > 0) {
    go = confirm(
      "Overdue by: " +
        overdueDays +
        " days\nPayment needed: " +
        overdueFee +
        "\nHave you received payment?"
    );
  } else {
    alert("Book received. No overdue payment necessary.");
    go = true;
  }

  if (!go) {
    alert("Book not returned.");
    return;
  }

  const newField = {
    state: "returned",
    dateReturned: dateReturned.toDateString(),
  };
  updateDoc(borToChange, newField);

  //change userdoc
  const userToChange = doc(db, "users", userId);
  const utcObj = (await getDoc(userToChange)).data();
  const returned = (await getDoc(userToChange)).data().returned || [];
  returned.push(historyId);
  const newField2 = {
    borrowed: utcObj.reserves.filter((borrowed) => {
      return borrowed !== historyId;
    }),
    returned: returned,
    totalFee: utcObj.totalFee - overdueFee,
  };
  updateDoc(userToChange, newField2);

  //change bookdoc
  const bookToChange = doc(db, "booksdemo", bookId);
  const newField3 = {
    copies: (await getDoc(bookToChange)).data().copies + 1,
  };
  updateDoc(bookToChange, newField3);
}

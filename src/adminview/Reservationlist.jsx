import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";

export const Reservationlist = () => {
  const [reservations, setReservations] = useState([{}]);
  const usersCollectionRef = collection(db, "users");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("title");

  useEffect(() => {
    openReservations();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

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
            <option value="username">Search by Author</option>
          </select>
        </form>
      </div>
    </div>
  );

  function openReservations() {
    const getReserves = async () => {
      const data = await getDocs(usersCollectionRef);
      const tempRes = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      const trueRes = tempRes.filter((user) => {
        return user.role === "user" && user.reserves.length !== 0;
      });

      const getReserveObjects = () => {
        let resObjects = [{}];

        trueRes.forEach((user) => {
          user.reserves.forEach(async (userBookId) => {
            const temp = await getDoc(doc(db, "booksdemo", userBookId));
            const title = temp.data().title;

            resObjects.push({ name: user.name, title: title });
          });
        });

        return resObjects;
      };

      setReservations(getReserveObjects());

      console.log(reservations);
    };

    getReserves();
  }
};

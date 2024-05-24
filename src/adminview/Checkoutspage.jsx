import React, { useState, useEffect } from "react";
import { Reservationlist } from "./Reservationlist";
import { Borrowedlist } from "./Borrowedlist";
import { useNavigate } from "react-router-dom";
import { currentUser } from "../App";

export const Checkoutspage = () => {
  const [page, setPage] = useState("res");

  let navigate = useNavigate();

  useEffect(() => {
    if (currentUser === null || currentUser.role !== "admin") {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="button-container">
        <button onClick={() => setPage("res")}>Reservations</button>
        <button onClick={() => setPage("bor")}>Borrowed books</button>
      </div>

      {page === "res" ? <Reservationlist /> : <Borrowedlist />}
    </div>
  );
};

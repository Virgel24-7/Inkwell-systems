import React, { useState } from "react";
import { Reservationlist } from "./Reservationlist";
import { Borrowedlist } from "./Borrowedlist";

export const Checkoutspage = () => {
  const [page, setPage] = useState("res");

  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div>
        <button onClick={() => setPage("res")}>Reservations</button>
        <button onClick={() => setPage("bor")}>Borrowed books</button>
      </div>

      {page === "res" ? <Reservationlist /> : <Borrowedlist />}
    </div>
  );
};

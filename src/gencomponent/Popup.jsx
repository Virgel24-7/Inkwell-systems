import React from "react";
import "./Popup.css";
import { useState } from "react";

export let addNumCopies = Number(0);
export function resetAddNumCopies() {
  addNumCopies = 0;
}

function Popup(props) {
  const [nOfCopies, setNOfCopies] = useState(Number());
  if (props.trigger) document.body.style.overflow = "hidden";

  function closePopup() {
    props.setTrigger(false);
    document.body.style.overflow = "unset";
  }

  return props.trigger ? (
    <div className="popup">
      <div className="popContent">
        <button className="popCloser" onClick={closePopup}>
          Close
        </button>
        {props.code === 1 && (
          <div>
            <div>Current number of copies: {props.copies}</div>
            <input
              type="number"
              placeholder="Number of copies to add"
              onChange={(event) => {
                setNOfCopies(event.target.value);
              }}
            />
            <button
              onClick={() => {
                props.addCopies(props.bookId, props.copies, Number(nOfCopies));
                addNumCopies = Number(nOfCopies);
                closePopup();
              }}
            >
              Add to library
            </button>
            <hr />
          </div>
        )}
        <p>Author: {props.author}</p>
        <br></br>
        <p>Dewey-Decimal System: {props.dewey}</p>
        <br></br>
        <p>Description: {props.description}</p>
        <div>{props.children}</div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default Popup;

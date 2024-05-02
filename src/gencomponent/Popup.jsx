import React from "react";
import "./Popup.css";

function Popup(props) {
  if (props.trigger) document.body.style.overflow = "hidden";

  function closePopup() {
    props.setTrigger(false);
    document.body.style.overflow = "unset";
  }

  return props.trigger ? (
    <div className="popup" onClick={closePopup}>
      <div className="popContent">
        <button className="popCloser" onClick={closePopup}>
          Close
        </button>
        <p>Author: {props.author}</p>
        <br></br>
        <p>Dewey-Decimal System: {props.dewey}</p>
        <br></br>
        <p>Description:  {props.description}</p>
      </div>
    </div>
  ) : (
    ""
  );
}

export default Popup;

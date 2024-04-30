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
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
}

export default Popup;

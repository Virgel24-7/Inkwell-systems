import { useEffect, useState } from "react";
import { storage } from "./firebase-config";
import { getDownloadURL, ref } from "firebase/storage";
import { currUserID } from "./Loginbox";
import { useNavigate } from "react-router-dom";
import { reserveBook } from "./UserPage";
import { isAdmin } from "./Loginbox";

export const Bookcard = (props) => {
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    const getImage = async () => {
      const reference = ref(storage, `/bookcovers/${props.image}`);
      const url = await getDownloadURL(reference);
      setImgUrl(url);
    };

    getImage();
  });

  let navigate = useNavigate();

  const toggleCopy = async () => {
    //minus 1 for users, plus input for admin
    const nOfCopies = await props.getActualCopies(props.id);

    if (currUserID === "") {
      if (nOfCopies === 0) {
        alert("Sorry, no copy available as of this moment.");
      } else {
        navigate("/login");
      }
    } else {
      if (isAdmin) {
        props.showPopContent(
          props.author,
          props.dewey,
          props.description,
          1, //with add functionality
          props.id
        );
      } else {
        reserveBook(props.id);
      }
    }
  };

  return (
    <div>
      <div className="card">
        <div className="imgBx">
          <button
            onClick={() =>
              props.showPopContent(
                props.author,
                props.dewey,
                props.description,
                0, //plain description
                props.id
              )
            }
          >
            <img src={imgUrl} />
          </button>
        </div>
        <div className="truncate-wrapper">
          <h2 className="truncate-text">{props.title}</h2>
          <span className="truncate-popup">{props.title}</span>
        </div>
        <div>
          <br />
          {!isAdmin && (
            <div>
              <button
                onClick={() => {
                  props.showPopContent(
                    props.author,
                    props.dewey,
                    props.description,
                    0, //plain description
                    props.id
                  );
                }}
              >
                Show Description
              </button>
              <br />
            </div>
          )}
          <button className="learn-more" onClick={toggleCopy}>
            <span className="circle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="button-text">
              {isAdmin ? "Add copies" : "Reserve"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

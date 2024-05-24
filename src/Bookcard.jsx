import { useEffect, useState } from "react";
import { storage } from "./firebase-config";
import { getDownloadURL, ref } from "firebase/storage";
import { currentUser } from "./App";
import { useNavigate } from "react-router-dom";
import { reserveBook } from "./UserPage";

export const Bookcard = (props) => {
  const [imgUrl, setImgUrl] = useState("");
  const isAdmin = currentUser ? currentUser.role === "admin" : false;

  useEffect(() => {
    const getImage = async () => {
      try {
        const reference = ref(storage, `/bookcovers/${props.image}`);
        const url = await getDownloadURL(reference);
        setImgUrl(url);
      } catch (error) {}
    };

    getImage();
  });

  let navigate = useNavigate();

  const toggleCopy = async () => {
    //minus 1 for users, plus input for admin
    const nOfCopies = await props.getActualCopies(props.id);

    if (!currentUser) {
      if (nOfCopies === 0) {
        alert("CANNOT RESERVE.\nNo copy available.");
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
          props.id,
          props.title
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
                isAdmin ? 1 : 0, //plain description
                props.id,
                props.title
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
          {!isAdmin && (
            <div className="showDesc">
              <button
                onClick={() => {
                  props.showPopContent(
                    props.author,
                    props.dewey,
                    props.description,
                    0, //plain description
                    props.id,
                    props.title
                  );
                }}
              >
                Show Description
              </button>
            </div>
          )}
          <button className="learn-more" onClick={toggleCopy}>
            <span className="circle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="button-text">
              {isAdmin ? "Edit book" : "Reserve"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

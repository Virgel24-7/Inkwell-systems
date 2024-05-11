import { useEffect, useState } from "react";
import { storage } from "./firebase-config";
import { getDownloadURL, ref } from "firebase/storage";
import { currUserID } from "./Loginbox";
import { useNavigate } from "react-router-dom";
import { updateUserdoc } from "./UserPage";
import { isAdmin } from "./Loginbox";
import { addNumCopies, resetAddNumCopies } from "./gencomponent/Popup";

export const Bookcard = (props) => {
  const [imgUrl, setImgUrl] = useState("");
  const [nOfCopies, setNOfCopies] = useState(Number(props.copies));

  useEffect(() => {
    const getImage = async () => {
      const reference = ref(storage, `/bookcovers/${props.image}`);
      const url = await getDownloadURL(reference);
      setImgUrl(url);
    };

    getImage();
  });

  let navigate = useNavigate();

  const toggleCopy = () => {
    //minus 1 for users, plus input for admin
    console.log(isAdmin);
    if (currUserID === "") {
      navigate("/login");
    } else {
      if (isAdmin) {
        props.showPopContent(
          props.author,
          props.dewey,
          props.description,
          1, //with add functionality
          props.id,
          props.copies
        );
        setNOfCopies(nOfCopies + addNumCopies);
        resetAddNumCopies();
      } else {
        const tempX = props.reservers.filter((user) => {
          return user === currUserID;
        });

        if (nOfCopies > 0) {
          if (props.reservers.length === 0 || tempX.length === 0) {
            props.updateReservers(props.id, props.reservers, currUserID);
            setNOfCopies(nOfCopies - 1);
            props.updateNOfCopies(props.id, props.copies);
            updateUserdoc(props.id);

            alert("Successfully reserved");
          } else if (tempX.length > 0) {
            alert("Already reserved");
          }
        } else {
          alert("No copy available");
        }
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
                props.id,
                props.copies
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
                    props.description
                  );
                  console.log(props);
                }}
              >
                Show Description
              </button>
              <br />
              <p>Copies available: {nOfCopies}</p>
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
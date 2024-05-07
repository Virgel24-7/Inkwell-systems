import { useEffect, useState } from "react";
import { storage } from "./firebase-config";
import { getDownloadURL, ref } from "firebase/storage";
<<<<<<< Updated upstream
import { currUserID } from "./Loginbox";
=======
import { currUser } from "./Loginbox";
>>>>>>> Stashed changes
import { useNavigate } from "react-router-dom";
import { updateUserdoc } from "./UserPage";

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

  const reserve = () => {
    if (currUserID === "") {
      navigate("/login");
    } else {
      const tempX = props.reservers.filter((user) => {
        return (user = currUserID);
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
  };

  return (
    <div>
      <div className="card">
        <div className="imgBx">
          <button
            onClick={() =>
              props.showPopContent(props.author, props.dewey, props.description)
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
          <button
            onClick={() =>
              props.showPopContent(props.author, props.dewey, props.description)
            }
          >
            Show Description
          </button>
          <br />
          <p>Copies available: {nOfCopies}</p>
          <button className="learn-more" onClick={reserve}>
            <span className="circle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="button-text">Reserve</span>
          </button>
        </div>
      </div>
    </div>
  );
};

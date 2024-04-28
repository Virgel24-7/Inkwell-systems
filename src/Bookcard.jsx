import { useEffect, useState } from "react";
import { storage } from "./firebase-config";
import { getDownloadURL, ref } from "firebase/storage";
import { currUser } from "./Loginpage";
import { useNavigate } from "react-router-dom";

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
  }, [props.image]);

  const updatePop = () => {
    props.showPop();
    props.updatePopContent(props.description);
  };

  let navigate = useNavigate();
  const reserve = () => {
    console.log(currUser);
    if (currUser === "") {
      console.log("x");
      navigate("/login");
    } else {
      console.log("a");
      console.log(typeof props.reservers);
      console.log(props.reservers.length);

      const tempX = props.reservers.filter((user) => {
        return (user = currUser);
      });

      if (nOfCopies > 0) {
        if (props.reservers.length === 0 || tempX.length === 0) {
          props.updateReservers(props.id, props.reservers, currUser);
          setNOfCopies(nOfCopies - 1);
          props.updateNOfCopies(props.id, props.copies);
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
          <a href="#">
            <img src={imgUrl} />
          </a>
        </div>
        <h2>{props.title}</h2>
        <div>
          <br />
          <button onClick={updatePop}>Show Description</button>
          <p>Copies available: {nOfCopies}</p>
          <button onClick={reserve}>Reserve</button>
        </div>
      </div>
    </div>
  );
};

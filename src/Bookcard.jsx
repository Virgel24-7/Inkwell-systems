import { useEffect, useState } from "react";
import { storage } from "./firebase-config";
import { getDownloadURL, ref } from "firebase/storage";

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

  const updateCopies = () => {
    if (nOfCopies > 0) {
      setNOfCopies(nOfCopies - 1);
      props.updateNOfCopies(props.id, props.copies);
    } else {
      alert("No copy available");
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
          <button onClick={updateCopies}>Reserve</button>
        </div>
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { storage } from "./firebase-config";
import { getDownloadURL, ref } from "firebase/storage";

export const Bookcard = (props) => {
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    const getImage = async () => {
      const reference = ref(storage, `/bookcovers/${props.image}`);

      await getDownloadURL(reference).then((x) => {
        setImgUrl(x);
      });
    };

    getImage();
  }, []);

  return (
    <div className="card">
      <div className="imgBx">
        <a href="#">
          <img src={imgUrl} />
        </a>
      </div>
      <h2>{props.title}</h2>
      <p>
        <br />
        {props.description}
      </p>
    </div>
  );
};

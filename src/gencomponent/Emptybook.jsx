import React, { useEffect, useState } from "react";
import "./Popup.css";
import { v4 } from "uuid";
import { collection, addDoc } from "firebase/firestore";
import { storage } from "../firebase-config";
import { uploadBytes, ref } from "firebase/storage";
import { db } from "../firebase-config";

function Emptybook(props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [dewey, setDewey] = useState("");
  const [copies, setCopies] = useState(Number(-1));
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState("src/assets/sampleCover.png");

  if (props.trigger) document.body.style.overflow = "hidden";

  if (props.trigger) {
    console.log(props.bookid);
  }

  return props.trigger ? (
    <div className="popup">
      <div className="popContent">
        <button
          className="popCloser"
          onClick={() => {
            props.setTrigger(false);
            document.body.style.overflow = "unset";
          }}
        >
          CLOSE
        </button>

        <form>
          <div>
            Book title :
            <input
              type="text"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            Author/s :
            <input
              type="text"
              placeholder="Author"
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div>
            Description:
            <input
              type="text"
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            Dewey decimal:
            <input
              type="text"
              placeholder="Dewey decimal"
              onChange={(e) => setDewey(e.target.value)}
            />
          </div>
          <div>
            Number of Copies:
            <input
              type="number"
              placeholder="Number of copies"
              onChange={(e) => setCopies(e.target.value)}
            />
          </div>
          <div>
            Upload book cover{"(recommended aspect ratio(15:22))"}
            <input
              type="file"
              onChange={(e) => {
                setCover(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>
        </form>
        <button onClick={submit}>SUBMIT</button>

        <div className="prevBx">
          <img src={preview} />
        </div>
      </div>
    </div>
  ) : (
    ""
  );

  function submit() {
    if (
      title === "" ||
      author === "" ||
      description === "" ||
      dewey === "" ||
      copies === -1 ||
      cover === null
    ) {
      console.log("All fields required");
      return;
    }
    console.log(title);
    console.log(author);
    console.log(description);
    console.log(dewey);
    console.log(copies);
    console.log(cover);

    const booksCollectionRef = collection(db, "booksdemo");

    const image = `${cover.name + v4()}`;
    const imageLoc = `bookcovers/${image}`;
    const imageRef = ref(storage, imageLoc);
    uploadBytes(imageRef, cover).then(() => {
      alert("Image uploaded");
      console.log(imageRef);
    });

    addDoc(booksCollectionRef, {
      title: title,
      description: description,
      dewey: dewey,
      author: author,
      copies: copies,
      image: image,
    });

    props.refresh();
    props.setTrigger(false);
    document.body.style.overflow = "unset";
  }
}

export default Emptybook;

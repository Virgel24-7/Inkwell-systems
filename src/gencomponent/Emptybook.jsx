import React, { useEffect, useRef, useState } from "react";
import "./Popup.css";
import { v4 } from "uuid";
import { collection, addDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import { storage } from "../firebase-config";
import {
  uploadBytes,
  ref,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db } from "../firebase-config";

function Emptybook(props) {
  const [book, setBook] = useState({});
  const [reimg, setReimg] = useState(false);
  let bookObj = null;

  const titleRef = useRef();
  const authorRef = useRef();
  const descRef = useRef();
  const dewRef = useRef();
  const copRef = useRef();
  const imageRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    initialize();
    if (props.bookid !== "" && props.trigger) {
      const getBookObj = async () => {
        bookObj = (await getDoc(doc(db, "booksdemo", props.bookid))).data();

        const getImage = async () => {
          const reference = ref(storage, `/bookcovers/${bookObj.image}`);
          const url = await getDownloadURL(reference);

          setBook({
            ...book,
            ...bookObj,
            covername: bookObj.image,
            copies: bookObj.copies,
            preview: url,
          });
        };

        getImage();
      };

      getBookObj();
    }
  }, [props.trigger, reimg]);

  const initialize = () => {
    setBook({
      title: "",
      author: "",
      description: "",
      dewey: "",
      copies: -1,
      covername: "",
      preview: "src/assets/sampleCover.png",
    });
  };

  if (props.trigger) document.body.style.overflow = "hidden";

  return props.trigger ? (
    <div className="popup">
      <div className="popContent">
        <button
          className="popCloser"
          onClick={() => {
            closePopup();
          }}
        >
          CLOSE
        </button>

        <form ref={formRef}>
          <div>
            Book title :
            <input
              className="titleref"
              type="text"
              ref={titleRef}
              defaultValue={book.title}
            />
          </div>
          <div>
            Author/s :
            <input
              className="authorref"
              type="text"
              ref={authorRef}
              defaultValue={book.author}
            />
          </div>
          <div>
            Description:
            <input
              className="descref"
              type="text"
              ref={descRef}
              defaultValue={book.description}
            />
          </div>
          <div>
            Dewey decimal:
            <input
              className="dewref"
              type="text"
              ref={dewRef}
              defaultValue={book.dewey}
            />
          </div>
          {props.bookid === "" && (
            <div>
              Number of Copies:
              <input
                className="copref"
                type="number"
                ref={copRef}
                defaultValue={book.copies}
              />
            </div>
          )}
          <div>
            Upload book cover{"(recommended aspect ratio(15:22))"}
            <input
              className="imageref"
              type="file"
              ref={imageRef}
              style={{ display: "none" }}
              onChange={() => setReimg(!reimg)}
            />
          </div>
        </form>

        <div className="prevBx">
          <img
            onClick={() => imageRef.current.click()}
            src={
              imageRef.current === null || !imageRef.current.value
                ? book.preview
                : URL.createObjectURL(imageRef.current.files[0])
            }
          />
        </div>
        <button onClick={submit}>SUBMIT</button>
      </div>
    </div>
  ) : (
    ""
  );

  async function submit() {
    const newBookNoimg = {
      title: titleRef.current.value,
      description: descRef.current.value,
      dewey: dewRef.current.value,
      author: authorRef.current.value,
      copies: props.bookid === "" ? copRef.current.value : book.copies,
    };

    let isImgChanged = !!imageRef.current.value;
    let image = null;

    if (
      titleRef.current.value === "" ||
      authorRef.current.value === "" ||
      descRef.current.value === "" ||
      dewRef.current.value === "" ||
      (props.bookid === "" && copRef.current.value === -1) ||
      (!imageRef.current.value && props.bookid === "")
    ) {
      alert("All fields required");
      return;
    }

    const booksCollectionRef = collection(db, "booksdemo");

    if (props.bookid === "" || isImgChanged) {
      image = `${imageRef.current.files[0].name + v4()}`;
      const imageLoc = `bookcovers/${image}`;
      const imageReference = ref(storage, imageLoc);
      uploadBytes(imageReference, imageRef.current.files[0]).then(() => {});
    }

    //delete past image to storage
    if (isImgChanged && props.bookid !== "") {
      const deleteRef = ref(storage, `bookcovers/${book.covername}`);
      await deleteObject(deleteRef);
    }

    if (props.bookid === "") {
      await addDoc(booksCollectionRef, {
        ...newBookNoimg,
        image: image,
      });
      alert("Added successfully");
    } else {
      const btu = doc(db, "booksdemo", props.bookid);
      const newField = {
        ...newBookNoimg,
        image: isImgChanged ? image : book.covername,
      };
      alert("Updated successfully");
      await updateDoc(btu, newField);
    }

    await props.refresh();
    closePopup();
  }

  function closePopup() {
    props.setTrigger(false);
    document.body.style.overflow = "unset";
    formRef.current.reset();
  }
}

export default Emptybook;

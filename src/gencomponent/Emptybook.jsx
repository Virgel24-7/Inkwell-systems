import React, { useEffect, useRef, useState } from "react";
import "./Popup.css";
import { v4 } from "uuid";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { storage } from "../firebase-config";
import {
  uploadBytes,
  ref,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db } from "../firebase-config";
import sampleCover from "../assets/sampleCover.png";
import uploadView from "../assets/Upload_Logo.png";

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
  }, [props.trigger]);

  const initialize = () => {
    setBook({
      title: "",
      author: "",
      description: "",
      dewey: "",
      copies: -1,
      covername: "",
      preview: null,
    });
  };

  if (props.trigger) document.body.style.overflow = "hidden";

  return props.trigger ? (
    <div className="popup">
      <div className="emptypopContent">
        <span className="border"></span>
        <button
          className="popCloser"
          onClick={() => {
            closePopup();
          }}
        >
          CLOSE
        </button>
        <div className="top-line">
          <p className="sys-name">
            <i>
              <b>Inkwell Systems</b>
            </i>
          </p>
        </div>
        <span className="img-instruction">
          <p className="label">Upload book cover</p>
          <p className="label">recommended aspect ratio(15:22)</p>
        </span>
        <span className="blank-box"></span>
        <div className="prevBx">
          <img
            src={
              imageRef.current === null || !imageRef.current.value
                ? book.preview === null
                  ? sampleCover
                  : book.preview
                : URL.createObjectURL(imageRef.current.files[0])
            }
          />
          <div className="upload-View" onClick={() => imageRef.current.click()}>
            <img
              src={uploadView}
              className="view-logo"
              alt="Image of view icon"
            />
          </div>
        </div>

        <div className="form-box">
          <div className="top-half">
            <div>
              <input
                className="imageref"
                type="file"
                ref={imageRef}
                style={{ display: "none" }}
                onChange={() => setReimg(!reimg)}
              />
            </div>
            <div className="key-value">
              <p className="key-name">Book Title</p>
              <input
                className="field"
                type="text"
                ref={titleRef}
                defaultValue={book.title}
              />
            </div>
            <div className="key-value">
              <p className="key-name">Author/s</p>
              <input
                className="field"
                type="text"
                ref={authorRef}
                defaultValue={book.author}
              />
            </div>
            <div className="key-value">
              <p className="key-name">Dewey decimal</p>
              <input
                className="field"
                type="text"
                ref={dewRef}
                defaultValue={book.dewey}
              />
            </div>
            {props.bookid === "" && (
              <div className="key-value">
                <p className="key-name">Number of copies</p>
                <input
                  className="field"
                  type="number"
                  ref={copRef}
                  defaultValue={book.copies !== -1 ? book.copies : ""}
                />
              </div>
            )}
          </div>
          <div className="bottom-half">
            <div className="key-value">
              <p className="key-name">Description</p>
              <textarea
                className="descref"
                type="text"
                style={{ height: "160px" }}
                ref={descRef}
                defaultValue={book.description}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="button-box">
          <button className="empSubmit" onClick={submit}>
            SUBMIT
          </button>
          {props.bookid === "" || (
            <button className="empSubmit" onClick={deleteBook}>
              DELETE BOOK
            </button>
          )}
        </div>
      </div>
    </div>
  ) : (
    ""
  );

  async function submit() {
    const nBook = {
      title: titleRef.current.value,
      description: descRef.current.value,
      dewey: dewRef.current.value,
      author: authorRef.current.value,
      copies: props.bookid === "" ? Number(copRef.current.value) : book.copies,
    };

    let isImgChanged = !!imageRef.current.value;
    let image = null;

    if (
      nBook.title === "" ||
      nBook.author === "" ||
      nBook.description === "" ||
      nBook.dewey === "" ||
      (props.bookid === "" && nBook.copies === -1) ||
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
        ...nBook,
        image: image,
      });
      alert("Added successfully");
    } else {
      const btu = doc(db, "booksdemo", props.bookid);
      const newField = {
        ...nBook,
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
  }

  async function deleteBook() {
    //check if currently reserved or borrowed, return if so
    const historyCollectionRef = collection(db, "history");
    const data = await getDocs(historyCollectionRef);
    const hisArr = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    if (
      hisArr.some(
        (hst) =>
          (hst.state === "reserved" || hst.state === "borrowed") &&
          hst.book === props.bookid
      )
    ) {
      alert("CANNOT DELETE. Book currently being checked out.");
      return;
    }

    const btd = doc(db, "booksdemo", props.bookid);
    if ((await getDoc(btd)).data().copies !== 0) {
      alert("CANNOT DELETE. There are still copies available.");
      return;
    }

    const code = prompt(
      "WARNING. THIS CANNOT BE UNDONE. Copy and paste this to confirm: " +
        props.bookid
    );
    if (code !== props.bookid) {
      alert("FAILED TO DELETE");
      return;
    }

    //deleteTohistory and userRets
    hisArr.forEach(async (hst) => {
      if (hst.book === props.bookid) {
        //update user
        const utoUp = doc(db, "users", hst.userid);
        const utoUpobj = (await getDoc(utoUp)).data();
        const newRets = utoUpobj.returned.filter((ret) => ret !== hst.id);
        const newField = { ...utoUpobj, returned: newRets };
        updateDoc(utoUp, newField);

        const htd = doc(db, "history", hst.id);
        deleteDoc(htd);
      }
    });

    //delete image to storage
    const imageName = (await getDoc(btd)).data().image;
    const deleteRef = ref(storage, `bookcovers/${imageName}`);
    await deleteObject(deleteRef);

    //delete to booksdemo
    deleteDoc(btd);

    await props.refresh();
    closePopup();
    alert("Deleted Successfully");
  }
}

export default Emptybook;

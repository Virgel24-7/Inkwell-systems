import { useEffect, useState } from "react";
import { auth, storage } from "./firebase-config";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { Link } from "react-router-dom";
import { currentUser } from "./App";
import { Bookcard } from "./Bookcard";

export const Homepage = (props) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const getImagesFromFirebase = async () => {
      const imageFolderRef = ref(storage, `/bookcovers`);

      try {
        const results = await listAll(imageFolderRef);
        const imageUrls = results.items.map(async (imageRef) =>
          getDownloadURL(imageRef)
        );

        const shuffledUrls = imageUrls
          .sort(() => Math.random() - 0.5)
          .slice(0, 8);
        const resolvedUrls = await Promise.all(shuffledUrls);

        setImages(resolvedUrls);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    getImagesFromFirebase();

    const intervalId = setInterval(getImagesFromFirebase, 15000);

    return () => clearInterval(intervalId);
  }, [props.user]);

  return (
    <div className="outer-container">
      <div className="container">
        <div className="homeHeading">
          <h1>
            DISCOVER OR <br />
            FIND YOUR BOOK OF <br />
            INTEREST
          </h1>
          <p>
            <br /> Welcome to Inkwell Systems, your portal to a vast universe of
            storytelling! Explore our extensive library featuring manga, manwha,
            comics, and more, where every page holds the promise of adventure,
            mystery, and excitement.
            <br /> <br /> Dive into our collection and immerse yourself in a
            diverse array of genres, from action-packed superhero sagas to
            heartwarming slice-of-life tales. Whether you're a seasoned reader
            or just starting your literary journey, there's something here for
            everyone.
            <br /> <br /> Join our vibrant community of readers and creators as
            we celebrate the art of storytelling in all its forms. Connect with
            fellow enthusiasts, discover new favorites, and let your imagination
            run wild.
            <br /> <br /> Welcome to Inkwell Systems, where every story is
            waiting to be explored. Start your adventure today!
          </p>
        </div>
        <div className="slider">
          {images.map((imageUrl, index) => (
            <span key={index} style={{ "--i": index }}>
              <img src={imageUrl} alt={`Image ${index + 1}`} />
            </span>
          ))}
        </div>
      </div>
      <div className="next-container">
        <div className="next">
          <Link to="books">Next Page</Link>
        </div>
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { db } from "./firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { Bookcard } from "./Bookcard";

export const Library = () => {
  const [library, setLibrary] = useState([]);
  const booksCollectionRef = collection(db, "booksdemo");

  useEffect(() => {
    openCollection();
  }, []);

  function openCollection() {
    const getLibrary = async () => {
      const data = await getDocs(booksCollectionRef);
      const tempLib = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      setLibrary(
        tempLib.sort((a, b) => {
          if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
          if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
          return 0;
        })
      );
    };

    getLibrary();
  }

  return (
    <div className="books">
      {library.map((book, key) => {
        return (
          <Bookcard
            key={key}
            title={book.title}
            description={book.description}
            image={book.image}
          />
        );
      })}
    </div>
  );
};

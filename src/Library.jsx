import { useEffect, useState } from "react";
import { db } from "./firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { Bookcard } from "./Bookcard";

export const Library = () => {
  const [library, setLibrary] = useState([]);
  const booksCollectionRef = collection(db, "booksdemo");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
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
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredLibrary = library.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {library.length === 0 ? (
        <p>Loading library...</p>
      ) : (
        <>
          <div className="search-container">
            <form action="" className="search-bar">
              <input
                type="text"
                placeholder="Search for title, author, classification, and keywords..."
                onChange={handleSearch}
              />
              <button type="submit">
                <img src="src/assets/Search.png" />
              </button>
            </form>
          </div>

          <br />
          <br />
          <br />
          <br />

          <div className="books">
            {filteredLibrary.length === 0 ? (
              <p>No results found.</p>
            ) : (
              filteredLibrary.map((book, key) => (
                <Bookcard
                  key={key}
                  title={book.title}
                  description={book.description}
                  image={book.image}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
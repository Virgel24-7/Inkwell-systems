import { useEffect, useState } from "react";
import { db } from "./firebase-config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Bookcard } from "./Bookcard";
import Popup from "./gencomponent/Popup";

export const Librarypage = () => {
  const [library, setLibrary] = useState([]);
  const booksCollectionRef = collection(db, "booksdemo");
  const [searchTerm, setSearchTerm] = useState("");
  const [pop, setPop] = useState(false);
  const [popContent, setPopContent] = useState("");

  useEffect(() => {
    openLibrary(booksCollectionRef, setLibrary);
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredLibrary = library.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //for updatepopup
  const showPop = () => {
    setPop(true);
  };

  const updatePopContent = (content) => {
    setPopContent(content);
  };
  //endfor updatepopup

  const updateNumOfCopies = async (id, copies) => {
    const tempDoc = doc(db, "booksdemo", id);
    const newField = { copies: copies - 1 };
    await updateDoc(tempDoc, newField);

    openLibrary(booksCollectionRef, setLibrary);
  };

  return (
    <div>
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
                    id={book.id}
                    title={book.title}
                    description={book.description}
                    image={book.image}
                    copies={book.copies}
                    showPop={showPop}
                    updatePopContent={updatePopContent}
                    updateNOfCopies={updateNumOfCopies}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
      {popupContent()}
    </div>
  );

  function popupContent() {
    return (
      <Popup trigger={pop} setTrigger={setPop}>
        {popContent}
      </Popup>
    );
  }
};

function openLibrary(booksCollectionRef, setLibrary) {
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

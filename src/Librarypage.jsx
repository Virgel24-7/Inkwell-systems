import { useEffect, useState } from "react";
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { Bookcard } from "./Bookcard";
import Popup from "./gencomponent/Popup";

export const Librarypage = () => {
  const [library, setLibrary] = useState([]);
  const booksCollectionRef = collection(db, "booksdemo");
  const [searchTerm, setSearchTerm] = useState("");
  const [pop, setPop] = useState(false);
  const [popContent, setPopContent] = useState("");
  const [filterOption, setFilterOption] = useState("title");

  useEffect(() => {
    openLibrary(booksCollectionRef, setLibrary);
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredLibrary = library.filter((book) => {
    const searchTermLower = searchTerm.toLowerCase();
    switch (filterOption) {
      case "title":
        return book.title.toLowerCase().includes(searchTermLower);
      case "author":
        return book.author.toLowerCase().includes(searchTermLower);
      case "dewey":
        return book.dewey.toLowerCase().includes(searchTermLower);
      default:
        return book.title.toLowerCase().includes(searchTermLower);
    }
  });

  const showPopContent = async (author, dewey, description, code, id) => {
    if (author && dewey && description) {
      const copy = await getActualCopies(id);
      setPopContent({ author, dewey, description, code, id, copy });
    } else {
      setPopContent(content);
    }
    setPop(true);
  };

  const getActualCopies = async (id) => {
    const temp = await getDoc(doc(db, "booksdemo", id));

    return temp.data().copies;
  };

  const updateNumOfCopies = async (id) => {
    const tempDoc = doc(db, "booksdemo", id);
    const newField = { copies: (await getActualCopies(id)) - 1 };
    await updateDoc(tempDoc, newField);

    openLibrary(booksCollectionRef, setLibrary);
  };

  const addCopies = async (id, toAdd) => {
    const tempDoc = doc(db, "booksdemo", id);
    const newField = { copies: (await getActualCopies(id)) + toAdd };
    await updateDoc(tempDoc, newField);

    openLibrary(booksCollectionRef, setLibrary);
  };

  const updateReservers = async (id, reservers, user) => {
    const tempDoc = doc(db, "booksdemo", id);
    const newField = { reservers: [...reservers, user] };
    await updateDoc(tempDoc, newField);
  };

  return (
    <div>
      <div>
        {library.length === 0 ? (
          <p>Loading library...</p>
        ) : (
          <>
            <div className="search-container">
              <form onSubmit={(e) => e.preventDefault()} className="search-bar">
                <input
                  type="text"
                  placeholder="Search for books here..."
                  onChange={handleSearch}
                />
                <select
                  value={filterOption}
                  onChange={(e) => setFilterOption(e.target.value)}
                >
                  <option value="title">Search by Title</option>
                  <option value="author">Search by Author</option>
                  <option value="dewey">Search by Dewey Code</option>
                </select>
                
              </form>
            </div>
            <br />
            <br />
            <br />
            <br />
            <div className="books">
              {filteredLibrary.length === 0 ? (
                <p className="no-results-found">No results found.</p>
              ) : (
                filteredLibrary.map((book, key) => (
                  <Bookcard
                    key={key}
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    dewey={book.dewey}
                    description={book.description}
                    image={book.image}
                    reservers={book.reservers}
                    showPopContent={showPopContent}
                    updateNOfCopies={updateNumOfCopies}
                    updateReservers={updateReservers}
                    getActualCopies={getActualCopies}
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
      <Popup
        trigger={pop}
        setTrigger={setPop}
        content={popContent}
        author={popContent?.author}
        dewey={popContent?.dewey}
        description={popContent?.description}
        code={popContent?.code}
        bookId={popContent?.id}
        copies={popContent?.copy}
        addCopies={addCopies}
      ></Popup>
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

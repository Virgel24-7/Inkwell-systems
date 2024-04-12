import { Bookcard } from "./Bookcard";
import library from "./Library";

export const Bookpage = () => {
  return (
    <div>
      <div className="search-container">
        <form action="" className="search-bar">
          <input
            type="text"
            placeholder="Search for title, author,classification, and keywords "
          />
          <button type="submit">
            <img src="src/assets/Search.png" />
          </button>
        </form>
      </div>

      <br />
      <br />
      <br />

      <Bookpagemain />
    </div>
  );
};

const Bookpagemain = () => {
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

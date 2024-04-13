import { Library } from "./Library";

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

      <Library />
    </div>
  );
};

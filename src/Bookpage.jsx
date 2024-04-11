import { Bookcard } from "./Bookcard";

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

      <div className="books">
        <Bookcard
          title="Harry Potter"
          description="Harry Potter is a series of seven fantasy novels written by British author J. K. Rowling. 
                            The first novel in the series is Harry Potter and the Philosophers Stone."
          image="harryPotter.jpg"
        />
        <Bookcard
          title="Blue Lock"
          description="Blue Lock is a Japanese football manga series written by Muneyuki Kaneshiro and illustrated by Yusuke Nomura."
          image="blueLock.jpg"
        />
        <Bookcard
          title="Solo Leveling"
          description="The story is set in a world where humans, 
                            known as hunters, who possess supernatural abilities, must battle deadly monsters to protect mankind."
          image="soloLeveling.jpg"
        />
        <Bookcard
          title="Initial D"
          description="A Japanese street racing manga series written and illustrated by Shuichi Shigeno."
          image="initiald.jpg"
        />
        <Bookcard
          title="One Piece"
          description="One Piece is a manga and anime series that follows Monkey D. Luffy,
                            a young boy with a dream to become the greatest pirate in the world."
          image="onepiece.jpg"
        />
        <Bookcard
          title="Hajime no ippo"
          description="A Japanese boxing -themed manga series written and illustrated by George Morikawa."
          image="hajime.jpg"
        />
      </div>
    </div>
  );
};

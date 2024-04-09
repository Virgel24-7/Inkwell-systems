import { Link } from "react-router-dom";

export const Homepage = () => {
  return (
    <div>
      <div className="homeHeading">
        <h1>
          DISCOVER OR <br />
          FIND YOU BOOK OF <br />
          INTEREST
        </h1>
        <p>
          <br />
          <br />
          <br /> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta
          id suscipit natus! Fugiat at totam esse illo? Culpa, quibusdam id
          laboriosam odit sequi aperiam labore possimus exercitationem esse.
          Quasi, nemo?
        </p>
      </div>
      <br></br>

      <div className="next">
        <Link to="books">Next Page</Link>
      </div>
    </div>
  );
};

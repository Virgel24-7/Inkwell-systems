export const Bookcard = (props) => {
  return (
    <div className="card">
      <div className="imgBx">
        <a href="#">
          <img src={"src/assets/" + props.image} />
        </a>
      </div>
      <h2>{props.title}</h2>
      <p>
        <br />
        {props.description}
      </p>
    </div>
  );
};

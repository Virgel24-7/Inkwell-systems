export const Loginpage = () => {
  return (
    <div className="wrapper">
      <form action="">
        <h1>Log in</h1>
        <div className="input-box">
          <input type="text" placeholder="Username" />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" />
        </div>
        <div className="remember-forgot">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#"> Forgot Password?</a>
        </div>
        <button type="submit" className="btn">
          Login
        </button>
      </form>
    </div>
  );
};

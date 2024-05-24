import alotayaA from "./assets/Alotaya_ID.png";
import alotayaB from "./assets/Alotaya_Silhouette.jpg";
import galanidaA from "./assets/Galanida_ID.png";
import galanidaB from "./assets/Galanida_Silhouette.jpg";
import soralloA from "./assets/Sorallo_ID.png";
import soralloB from "./assets/Sorallo_Silhouette.jpg";
import torresA from "./assets/Torres_ID.png";
import torresB from "./assets/Torres_Silhouette.jpg";

export const Aboutpage = () => {
  return (
    <div className="about-container">
      <div className="who-container">
        <div className="aboutHeading">
          <h1>
            WHO ARE WE? <br />
          </h1>
          <p>
            <br />
            <br />
            <br /> We are the Builders of Tomorrow.
            <br /> <br /> We are a passionate group of second-year Computer
            Engineering students from the University of San Carlos, fueled by a
            shared love for technology and a desire to create innovative
            solutions.
            <br /> <br /> We believe that the future is built by those who dare
            to dream and the programmers who code those dreams into reality.
            This platform is a testament to our dedication, late nights fueled
            by funny jokes and code, and the unwavering support we share as a
            team.
            <br /> <br /> We are constantly learning, pushing boundaries, and
            exploring the endless possibilities of the digital world. As you
            navigate this space, we hope you'll find something that inspires
            you, challenges you, or simply sparks a new idea.
            <br /> <br /> This is just the beginning of our journey, and we
            invite you to join us as we build something remarkable together.
          </p>
        </div>
        <div className="meet-team">
          <div className="meet-team-title">
            <h1>MEET THE TEAM!</h1>
          </div>
          <div className="meet-team-cards">
            <div className="team-card-container">
              <div className="team-view-container">
                <img
                  src={alotayaB}
                  className="view-img"
                  alt="Silhouette of Alotaya, Isaac Jadon #22101054"
                />
              </div>
              <div className="team-img-container">
                <img
                  src={alotayaA}
                  className="nft-img"
                  alt="Image of Alotaya, Isaac Jadon #22101054"
                />
              <hr></hr>
              <h2>Isaac Jadon R.</h2>
              <h1>ALOTAYA</h1>
              <hr></hr>
              <h2 className="self-title">Firebase Backend Programmer</h2>
              <p>22101054@usc.edu.ph +63 711 420 3423</p>
              </div>
            </div>

            <div className="team-card-container">
              <div className="team-view-container">
                <img
                  src={galanidaB}
                  className="view-img"
                  alt="Silhouette of Galanida, John Von Lawdwig #20800221"
                />
              </div>
              <div className="team-img-container">
                <img
                  src={galanidaA}
                  className="nft-img"
                  alt="Image of Galanida, John Von Lawdwig #20800221"
                />
              <hr></hr>
              <h2>John Von Lawdwig S.</h2>
              <h1>GALANIDA</h1>
              <hr></hr>
              <h2 className="self-title">CSS / React Frontend Programmer</h2>
              <p>
              20800221@usc.edu.ph
              +63 991 372 1299
              </p>
              </div>
            </div>

            <div className="team-card-container">
              <div className="team-view-container">
                <img
                  src={soralloB}
                  class="view-img"
                  alt="Silhouette of Sorallo, Kinshin #22101520"
                />
              </div>
              <div className="team-img-container">
                <img
                  src={soralloA}
                  class="nft-img"
                  alt="Image of Sorallo, Kinshin #22101520"
                />
              <hr></hr>
              <h2>Kinshin A.</h2>
              <h1>SORALLO</h1>
              <hr></hr>
              <h2 className="self-title">CSS / React Frontend Programmer</h2>
              <p>22101520@usc.edu.ph +63 813 029 6394</p>
              </div>
            </div>

            <div className="team-card-container">
              <div className="team-view-container">
                <img
                  src={torresB}
                  className="view-img"
                  alt="Silhouette of Torres, Virgel Rai #22103868"
                />
              </div>
              <div className="team-img-container">
                <img
                  src={torresA}
                  className="nft-img"
                  alt="Image of Torres, Virgel Rai #22103868"
                />
              <hr></hr>
              <h2>Virgel Rai S.</h2>
              <h1>TORRES</h1>
              <hr></hr>
              <h2 className="self-title">Firebase Backend Programmer</h2>
              <p>22103868@usc.edu.ph +63 931 415 9265</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

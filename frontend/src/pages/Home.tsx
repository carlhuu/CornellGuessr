import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import p1 from "/src/assets/homepage/pic1.jpg";
import p2 from "/src/assets/homepage/pic2.jpg";
import p3 from "/src/assets/homepage/pic3.jpg";
import p4 from "/src/assets/homepage/pic4.jpg";

const images = [
    {
      original: p1,
    },
    {
      original: p2,
    },
    {
      original: p3,
    },
    {
      original: p4,
    },
  ];

const HomePage = () => (
    <center>
        <h1>Welcome to CornellGuessr!</h1>
        <ImageGallery 
            items = {images} 
            showFullscreenButton = {false}
            showPlayButton = {false}
            autoPlay = {true}
            showNav = {false}
            showThumbnails = {false}
        />
        <h2>
            How to play:
        </h2>
        <p>During each round of play, you will be shown a picture of a spot on Cornell's campus. 
            Use the maps feature to select where you think it is.
             The closer you are to the actual location, the more points you get!
            Each game has 5 rounds, and your goal is get the most points possible by the end. Good luck!
              </p>
    </center>
);

export default HomePage;

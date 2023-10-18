import React from "react";
import ReactDOM from "react-dom/client";
// import './index.css'
import App from "./App";

import StarRating from "./StarRating";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      maxStars={5}
      defaultRating={2}
      ratingArray={["Terrible", "Bad", "Ok", "Good", "Super"]}
    />
    <StarRating maxStars={10} color="red" size={24} /> */}
  </React.StrictMode>
);

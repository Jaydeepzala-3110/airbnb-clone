import axios from "axios";
import { useState, useEffect } from "react";

export default function PlaceImg({ place, index = 0, className = null }) {
  const [img, setImg] = useState("");

  useEffect(() => {
    axios
      .get(`/places/${place}`)
      .then((response) => {
        const { data } = response;
        if (data.photos?.length > 0) {
          setImg(data.photos[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching place details:", error);
      });
  }, [place]);

  if (!img) {
    return "";
  }

  if (!className) {
    className = "object-cover";
  }

  return (
    <div>
      <title>Place Image</title>
      <img
        className={className}
        src={`http://localhost:8080/uploads/${img}`}
        alt="Place Image"
      />
    </div>
  );
}

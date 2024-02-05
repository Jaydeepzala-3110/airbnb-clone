import React from "react";

const BookingPhoto = ({ photoURL }) => {
  return (
    <div className="w-48">
      <img src={photoURL} alt="Place" />
    </div>
  );
};

export default BookingPhoto;

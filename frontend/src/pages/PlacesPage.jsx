import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import AccountNav from "../AccountNav";
import axios from "axios";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("/places/").then((response) => {
      const { data } = response;
      setPlaces(data);
    });
  }, []);

  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
              clipRule="evenodd"
            />
          </svg>
          Add new place
        </Link>
      </div>
      <div className="mt-4">
        {places.length > 0 &&
          places.map((place) => (
            <Link
              to={"/account/places/" + place._id}
              className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl mb-4"
              key={place._id}
            >
              <div className="w-32 h-32 bg-gray-300 rounded-lg overflow-hidden">
                {place.photos?.length > 0 && (
                  <img
                    src={`http://localhost:8080/uploads/${place.photos[0]}`}
                    alt="Place Image"
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <div className="flex-grow">
                <h2 className="text-black text-lg font-bold">{place.title}</h2>
                <p className="text-sm mt-2 text-gray-600">
                  {place.description}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

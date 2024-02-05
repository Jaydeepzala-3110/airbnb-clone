import React, { useReducer, useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Perks from "../Perks";
import "../index.css";
import PhotosUploader from "../PhotosUploader";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "UPDATE_MAX_GUESTS":
      const newMaxGuests = parseInt(action.value);
      if (!isNaN(newMaxGuests) && newMaxGuests >= 1) {
        return {
          ...state,
          maxGuests: newMaxGuests,
        };
      }
      return state;
    default:
      return state;
  }
};

const PlacesFormPage = () => {
  const { id } = useParams();

  const [perks, setPerks] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [price, setPrice] = useState(100);
  const [state, dispatch] = useReducer(reducer, {
    title: "",
    address: "",
    photoLink: "",
    description: "",
    extraInfo: "",
    checkIn: "",
    checkOut: "",
    maxGuests: 1,
  });

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      state.title = data.title;
      state.address = data.address;
      state.photoLink = data.photoLink;
      state.description = data.description;
      state.extraInfo = data.extraInfo;
      state.checkIn = data.checkIn;
      state.checkOut = data.checkOut;
      state.maxGuests = data.maxGuests;
      setPerks(data.perks);
    });
  }, [id]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === "maxGuests") {
      dispatch({ type: "UPDATE_MAX_GUESTS", value });
    } else {
      dispatch({ type: "UPDATE_FIELD", field: name, value });
    }
  };

  const handlePriceChange = (e) => {
    const enteredPrice = e.target.value;
    const regex = /^[0-9\b]+$/;

    if (
      !isNaN(enteredPrice) &&
      parseInt(enteredPrice) >= 100 &&
      regex.test(enteredPrice)
    ) {
      setPrice(parseInt(enteredPrice));
    } else {
      alert("Please enter a valid number greater than or equal to 100");
    }
  };

  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
      title: state.title,
      address: state.address,
      photoLink: state.photoLink,
      description: state.description,
      extraInfo: state.extraInfo,
      checkIn: state.checkIn,
      checkOut: state.checkOut,
      maxGuests: state.maxGuests,
      perks: perks,
      addedPhotos: addedPhotos,
      price: price,
    };

    if (id) {
      await axios.put("/places", {
        id,
        ...placeData,
      });
      setRedirect(true);
    } else {
      await axios.post("/places", placeData);
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  return (
    <div className="mt-8">
      <div className="text-center"></div>

      <div>
        <form onSubmit={savePlace}>
          <h2 className="text-2xl mt-4">Title</h2>
          <p className="text-gray-500 text-sm">
            title for your place, should be short and catchy as in advertisement{" "}
          </p>
          <input
            type="text"
            name="title"
            placeholder="title , for example: My lovely apartment"
            value={state.title}
            onChange={handleOnChange}
          />
          <h2 className="text-2xl mt-4">Address</h2>
          <p className="text-gray-500 text-sm">Address to this place</p>
          <input
            type="text"
            placeholder="address"
            name="address"
            value={state.address}
            onChange={handleOnChange}
          />
          <h2 className="text-2xl mt-4">Photos</h2>
          <p className="text-gray-500 text-sm">more = better</p>

          <PhotosUploader
            photoLink={state.photoLink}
            handleOnChange={handleOnChange}
            addedPhotos={addedPhotos}
            setAddedPhotos={setAddedPhotos}
          />

          <h2 className="text-2xl mt-4">Description</h2>
          <p className="text-gray-500 text-sm">description of the place.</p>
          <textarea
            name="description"
            value={state.description}
            onChange={handleOnChange}
            className=" w-full border my-2 py-2 px-3 rounded-lg"
          />
          <p className="text-gray-500 text-sm">
            select all the perks of your place.
          </p>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            <Perks selectedPerks={perks} setSelectedPerks={setPerks} />
          </div>
          <div>
            <h2 className="text-2xl mt-4">Extra Info</h2>
            <p className="text-gray-500 text-sm">House rules, etc... </p>
            <textarea
              name="extraInfo"
              value={state.extraInfo}
              onChange={handleOnChange}
              className=" w-full border my-2 py-2 px-3 rounded-lg"
            />
            <h2 className="text-2xl mt-4">Check In & Out times,max guest</h2>
            <p className="text-gray-500 text-sm">
              add check in and out times, remember to have a some time window
              for cleaning the room between guests.
            </p>
          </div>
          <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-1">
              <h3 className="mt-2 -mb-1">Check in time</h3>
              <input
                type="text"
                placeholder="14.00"
                name="checkIn"
                value={state.checkIn}
                onChange={handleOnChange}
              />
            </div>
            <div className="col-span-1">
              <h3 className="mt-2 -mb-1">Check out time</h3>
              <input
                type="text"
                name="checkOut"
                value={state.checkOut}
                onChange={handleOnChange}
              />
            </div>
            <div className="col-span-1">
              <h3 className="mt-2 -mb-1">Max number of guests</h3>
              <input
                type="number"
                name="maxGuests"
                value={state.maxGuests}
                onChange={handleOnChange}
              />
            </div>
            <div className="col-span-1">
              <h3 className="mt-2 -mb-1">Price per night</h3>
              <input type="number" value={price} onChange={handlePriceChange} />
            </div>
          </div>

          <button className="primary my-4">Save</button>
        </form>
      </div>
    </div>
  );
};

export default PlacesFormPage;

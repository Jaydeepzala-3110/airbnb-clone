import React from "react";
import { UserContext } from "./UserContextProvider";
import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { Navigate } from "react-router-dom";
import axios from "axios";

const BookingWidget = ({ place }) => {
  const { user } = useContext(UserContext);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");

  const handlePhoneChange = (ev) => {
    const inputValue = ev.target.value;
    if (/^\d*$/.test(inputValue) && inputValue.length <= 10) {
      setPhone(inputValue);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;

  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookThisPlace() {
    const response = await axios.post("/bookings", {
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      place: place._id,
      price: numberOfNights * place.price,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <>
      <div className="bg-white shadow p-4 rounded-2xl">
        <div className="text-2xl text-center">
          Price: ${place.price} / per night
        </div>
        <div className="border rounded-2xl mt-4">
          <div className="flex">
            <div className="py-3 px-4 w-1/2">
              <label htmlFor="checkIn" className="block">
                Check in:
              </label>
              <input
                id="checkIn"
                type="date"
                value={checkIn}
                onChange={(ev) => setCheckIn(ev.target.value)}
                className="w-full"
              />
            </div>
            <div className="py-3 px-4 border-l w-1/2">
              <label htmlFor="checkOut" className="block">
                Check out:
              </label>
              <input
                id="checkOut"
                type="date"
                value={checkOut}
                onChange={(ev) => setCheckOut(ev.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="py-3 px-4 border-t">
            <label htmlFor="numberOfGuests" className="block">
              Number of guests:
            </label>
            <input
              id="numberOfGuests"
              type="number"
              value={numberOfGuests}
              onChange={(ev) => setNumberOfGuests(ev.target.value)}
              className="w-full"
            />
          </div>
          <div className="py-3 px-4 border-t">
            <label htmlFor="fullName" className="block">
              Your full name:
            </label>
            <input
              id="fullName"
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              className="w-full"
            />
            <label htmlFor="phoneNumber" className="block mt-2">
              Phone number:
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full border border-gray-300 rounded py-2 px-3"
            />
          </div>
        </div>
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        Book this place
        {numberOfNights > 0 && <span> ${numberOfNights * place.price}</span>}
      </button>
    </>
  );
};

export default BookingWidget;

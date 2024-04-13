import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import DateTimePicker from "react-datetime-picker";
import Map from "./Map";
import "react-datetime-picker/dist/DateTimePicker.css";
import "../body/body.css";
import marker from "./Map";

const EventForm = () => {
  const [Rsos, setRsos] = useState([]);
  const [marker, setMarker] = useState(null);
  const [userId, setUserId] = useState(
    JSON.parse(localStorage.getItem("currentUser")).userid
  );

  const [event, setEvent] = useState({
    name: "",
    cat: "",
    description: "",
    datetime: new Date(),
    loc: "",
    rso_phone: "",
    rso_email: "",
    rso: "",
    approved: 0,
    cover: "",
  });

  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUserId(JSON.parse(localStorage.getItem("currentUser")).userid);
    console.log("found user id: ", userId);

    const fetchRsos = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/yourrsos/${userId}`);
        setRsos(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRsos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the changed input is the club select
    if (name === "rso") {
      // Update the approved property based on the selected club
      const approvedValue = value === "No RSO" ? 0 : 1;
      setEvent((prevEvent) => ({
        ...prevEvent,
        [name]: value,
        approved: approvedValue,
      }));
    } else {
      // For other inputs, update as usual
      setEvent((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    //setEvent((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/events", event);
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  const handleMapClick = (event) => {
    const newMarker = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarker(newMarker);
    console.log(newMarker); // Log the new marker
  };

  return (
    <div className="form">
      <h1>Add New Event</h1>
      <div className="clubDropdown">
        <label htmlFor="clubSelect">Select RSO:</label>
        <select
          type="select"
          placeholder="Select RSO"
          name="rso"
          onChange={handleChange}
        >
          <option value="">Select a club</option>
          {Rsos.map((club) => (
            <option key={club.id} value={club.rso_name}>
              {club.rso_name}
            </option>
          ))}
          <option value="No RSO">No RSO</option>
        </select>
      </div>
      <input
        type="text"
        placeholder="Event name"
        name="name"
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Event category"
        name="cat"
        onChange={handleChange}
      />
      <textarea
        rows={5}
        type="text"
        placeholder="Event description"
        name="description"
        onChange={handleChange}
      />
      <DateTimePicker
        onChange={(value) => {
          const formattedDateTime = new Date(value)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
          const syntheticEvent = {
            target: { name: "datetime", value: formattedDateTime },
          };
          handleChange(syntheticEvent);
        }}
        value={event.datetime}
      />
      <input
        type="text"
        placeholder="Contact phone number"
        name="rso_phone"
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Contact email address"
        name="rso_email"
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Cover image"
        name="cover"
        onChange={handleChange}
      />
      <h1>Pick a location</h1>
      <Map handleMapClick={handleMapClick}></Map>
      {marker && (
        <div>
          Latitude: {marker.lat}, Longitude: {marker.lng}
        </div>
      )}
      <button onClick={handleClick}>Add</button>
      {error && "Something went wrong!"}
      <Link to="/dashboard">See all events</Link>
    </div>
  );
};

export default EventForm;

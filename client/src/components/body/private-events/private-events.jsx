import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./private-events.css";
import ImageDisplay from "../image-display";
import Slider from "react-slick";
import Modal from "../Modal";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
};
const PrivateEvents = () => {
  const [events, setEvents] = useState([]);
  // determines whether the details pop-up is active
  const [openModal, setOpenModal] = useState(false);
  // stores the id of the event the user selected "details" for
  const [selectedEvent, setSelectedEvent] = useState(null);

  const openTheModal = (event) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };
  const closeTheModal = () => {
    setOpenModal(false);
    setSelectedEvent(null);
  };

  useEffect(() => {
    const fetchPrivateEvents = async () => {
      try {
        const res = await axios.get("http://localhost:8800/privateevents");
        setEvents(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPrivateEvents();
  }, []);

  return (
    <div className="w-3/4 m-auto">
      <h3 className="private-header">Private Events</h3>
      <div className="mt-5">
        <Slider {...settings}>
          {events.map((d) => (
            <div className="bg-white h-[450px] text-black rounded-xl shadow-[10px_5px_var(--blueColor)]">
              <div className="h-56 rounded-t-xl bg-#CD374F flex justify-center items-center">
                <ImageDisplay eventId={d.id} />
              </div>

              <div className="flex flex-col justify-center items-center gap-4 p-4">
                <p className="text-xl font-semibold">{d.name}</p>
                <p>{d.datetime}</p>
                <button
                  className="bg-[#1D6AB5] text-white text-lg px-6 py-1 rounded xl"
                  onClick={() => openTheModal(d)}
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <div className="modal-content">
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          event={selectedEvent}
        />
      </div>
    </div>
  );
};

export default PrivateEvents;

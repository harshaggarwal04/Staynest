import React, { useState } from 'react';
import "../styles/ListingCard.scss";
import { ArrowBackIosNew, ArrowForwardIos, Favorite } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setWishList } from '../redux/state';

const ListingCard = ({
  listingId,
  creator,
  listingPhotoPaths,
  city,
  state,
  country,
  category,
  type,
  price,
  startDate,
  endDate,
  totalPrice,
  booking
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);   // ✅ added this
  const wishList = user?.wishList || [];
  const isLiked = wishList.includes(listingId);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Slider controls
  const goToPrevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length);
  };

  const goToNextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
  };

  // Toggle wishlist
  const patchWishList = async () => {
    if (!user) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${user._id}/${listingId}`, // ✅ full URL
        {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data?.wishList) {
        dispatch(setWishList(data.wishList));
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
    }
  };

  return (
    <div className='listing-card' onClick={() => navigate(`/properties/${listingId}`)}>
      <div className='slider-container'>
        <div className='slider' style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {listingPhotoPaths?.map((photo, index) => (
            <div key={index} className='slide'>
              <img src={photo} alt={`photo${index + 1}`} loading="lazy" />
              <div className='prev-button' onClick={goToPrevSlide}>
                <ArrowBackIosNew sx={{ fontSize: "15px" }} />
              </div>
              <div className='next-button' onClick={goToNextSlide}>
                <ArrowForwardIos sx={{ fontSize: "15px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3>{city}, {state}, {country}</h3>
      <p>{category}</p>

      {!booking ? (
        <>
          <p>{type}</p>
          <p><span>₹{price?.toLocaleString("en-IN")}</span> per night</p>
        </>
      ) : (
        <>
          <p>
            {new Date(startDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })} –
            {new Date(endDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
          </p>
          <p><span>₹{totalPrice?.toLocaleString("en-IN")}</span> total</p>
        </>
      )}

      <button
        className="favorite"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          patchWishList();
        }}
        disabled={!user}
      >
        {isLiked ? (
          <Favorite sx={{ color: "#4facfe" }} />
        ) : (
          <Favorite sx={{ color: "white" }} />
        )}
      </button>
    </div>
  );
};

export default ListingCard;

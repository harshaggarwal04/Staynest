import React, { useEffect, useState } from "react";
import "../styles/List.scss";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";

const WishList = () => {
  const wishListIds = useSelector((state) => state.user?.wishList || []);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wishListIds || wishListIds.length === 0) {
      setListings([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    // fetch all listing details in parallel
    Promise.all(
      wishListIds.map((id) =>
        fetch(`${import.meta.env.VITE_BACKEND_URL}/properties/${id}`)
          .then((res) => (res.ok ? res.json() : null))
          .catch((err) => {
            console.error("Failed to fetch listing", id, err);
            return null;
          })
      )
    )
      .then((results) => {
        if (cancelled) return;
        // filter out any nulls (failed fetches)
        setListings(results.filter(Boolean));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [wishListIds]);

  return (
    <>
      <Navbar />
      <h1 className="title-list">Your Wish List</h1>

      {loading ? (
        <p>Loading...</p>
      ) : listings.length === 0 ? (
        <p style={{ padding: 20 }}>Your wishlist is empty.</p>
      ) : (
        <div className="list">
          {listings.map((item) => (
            <ListingCard
              key={item._id}
              listingId={item._id}
              creator={item.creator}
              listingPhotoPaths={item.listingPhotoPaths}
              city={item.city}
              state={item.state}
              country={item.country}
              category={item.category}
              type={item.type}
              price={item.price}
              startDate={item.startDate}
              endDate={item.endDate}
              totalPrice={item.totalPrice}
              booking={false}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default WishList;

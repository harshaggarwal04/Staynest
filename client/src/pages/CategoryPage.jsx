import { useState, useEffect } from "react";
import "../styles/List.scss";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setListings } from "../redux/state";
import Loader from "../components/Loader";
import ListingCard from "../components/ListingCard";

const CategoryPage = () => {
  const [loading, setLoading] = useState(true);
  const { category } = useParams();

  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings);

  const getFeedListings = async () => {
    try {
      const url =
        category && category !== "All"
          ? `${import.meta.env.VITE_BACKEND_URL}/properties?category=${category}`
          : `${import.meta.env.VITE_BACKEND_URL}/properties`;

      const response = await fetch(url);
      const data = await response.json();

      dispatch(setListings({ listings: data }));
    } catch (err) {
      console.error("Fetch Listings Failed:", err.message);
      dispatch(setListings({ listings: [] })); // clear on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    dispatch(setListings({ listings: [] })); // clear old listings
    getFeedListings();
  }, [category]);

  return (
    <>
      <Navbar />
      <h1 className="title-list">{category} listings</h1>

      {loading ? (
        <Loader />
      ) : listings?.length === 0 ? (
        <p className="no-listings">No listings found for "{category}"</p>
      ) : (
        <div className="list">
          {listings.map(
            ({
              _id,
              creator,
              listingPhotoPaths,
              city,
              state,
              country,
              category,
              type,
              price,
              booking = false,
            }) => (
              <ListingCard
                key={_id}
                listingId={_id}
                creator={creator}
                listingPhotoPaths={listingPhotoPaths} // direct Cloudinary URLs
                city={city}
                state={state}
                country={country}
                category={category}
                type={type}
                price={price}
                booking={booking}
              />
            )
          )}
        </div>
      )}
    </>
  );
};

export default CategoryPage;

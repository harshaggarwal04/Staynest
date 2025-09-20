import React, { useState, useEffect } from 'react';
import { categories } from '../data';
import "../styles/Listings.scss";
import ListingCard from './ListingCard';
import Loader from './Loader';
import { useDispatch, useSelector } from 'react-redux';
import { setListings } from "../redux/state";

const Listings = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("");
    const listings = useSelector(state => state.listings);

    const getFeedListings = async () => {
        try {
            const url = selectedCategory && selectedCategory !== "All" 
                ? `${import.meta.env.VITE_BACKEND_URL}/properties?category=${selectedCategory}` 
                : `${import.meta.env.VITE_BACKEND_URL}/properties`;

            const response = await fetch(url, { method: "GET" });
            const data = await response.json();

            // Ensure data contains Cloudinary paths
            // Example: data[i].listingPhotoPaths = ['folder/image1.jpg', 'folder/image2.jpg']
            
            dispatch(setListings({ listings: data }));
            setLoading(false);
        } catch (err) {
            console.log("Fetching listings failed:", err.message);
        }
    };

    useEffect(() => {
        setLoading(true);
        getFeedListings();
    }, [selectedCategory]);

    return (
        <>
            <div className='category-list'>
                {categories?.map((category, index) => (
                    <div
                        className={`category ${category.label === selectedCategory ? "selected" : ""}`}
                        key={index}
                        onClick={() => setSelectedCategory(category.label)}
                    >
                        <div className='category_icon'>{category.icon}</div>
                        <p>{category.label}</p>
                    </div>
                ))}
            </div>

            {loading ? <Loader /> : (
                <div className='listings'>
                    {listings.map((listing) => (
                        <ListingCard
                            key={listing._id}
                            listingId={listing._id}
                            creator={listing.creator}
                            listingPhotoPaths={listing.listingPhotoPaths}
                            city={listing.city}
                            state={listing.state}
                            country={listing.country}
                            category={listing.category}
                            type={listing.type}
                            price={listing.price}
                            booking={listing.booking || false}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default Listings;

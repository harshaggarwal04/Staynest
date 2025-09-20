import React, { useEffect, useState } from 'react'
import "../styles/ListingDetails.scss";
import { useNavigate, useParams } from 'react-router-dom';
import { facilities } from "../data";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Loader from '../components/Loader';
import { useSelector } from "react-redux";

const ListingDetails = () => {
    const [loading, setLoading] = useState(true);
    const { listingId } = useParams();
    const [listing, setListing] = useState(null);

    const getListingDetails = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/properties/${listingId}`, {
                method: "GET",
            });
            const data = await response.json();
            setListing(data);
            setLoading(false)
        } catch (err) {
            console.log("fetching listing details failed", err.message);
        }
    }

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/properties/${listingId}/${customerId}`,
                    {
                        method: "DELETE",
                    }
                );

                const data = await res.json();
                console.log(data);

                if (res.ok) {
                    alert("Listing deleted");
                    navigate("/");
                } else {
                    alert(data.message);
                }
            } catch (err) {
                console.error("Failed to delete listing", err);
            }
        }
    };



    useEffect(() => {
        getListingDetails()
    }, []);

    // Booking calendar
    const [dateRange, setDateRange] = useState([{
        startDate: new Date(),
        endDate: new Date(),
        key: "selection"
    }]);

    const handleSelect = (ranges) => {
        // updating the selected range when user makes a selection
        setDateRange([ranges.selection])

    }

    const start = new Date(dateRange[0].startDate);
    const end = new Date(dateRange[0].endDate);
    const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24); //calculate the difference in day unit

    // submit booking

    const customerId = useSelector((state) => state?.user?._id);

    const navigate = useNavigate();
    const handleSubmit = async () => {
        try {
            const bookingForm = {
                customerId,
                listingId,
                hostId: listing.creator._id,
                startDate: dateRange[0].startDate.toDateString(),
                endDate: dateRange[0].endDate.toDateString(),
                totalPrice: listing.price * dayCount,
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/bookings/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookingForm)
            });

            if (response.ok) {
                navigate(`/${customerId}/trips`);
            }

        } catch (err) {
            console.log("Submit booking failed", err.message);
        }

    }

    return loading ? <Loader /> : (
        <>
            <div className='listing-details'>
                <div className='title'>
                    <h1>{listing.title}</h1>
                    <div></div>
                </div>

                <div className='photos'>
                    {listing.listingPhotoPaths?.map((url, index) => (
                        <img key={index} src={url} alt={`listing ${index}`} loading="lazy" />
                    ))}

                </div>

                <h2>{listing.type} in {listing.city},{listing.state}, {listing.country}</h2>
                <p>{listing.guestCount} guests - {listing.bedroomCount} bedroom(s) - {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)</p>
                <hr />

                <div className='profile'>
                    <img src={listing.creator.profileImagePath} alt={listing.creator.firstName} />
                    <h3>Listed by {listing.creator.firstName}{listing.creator.lastName}</h3>
                </div>
                <hr />
                <h3>Description</h3>
                <p>{listing.description}</p>
                <hr />

                <h3>{listing.highlight}</h3>
                <p>{listing.highlightDesc}</p>
                <hr />

                <div className='booking'>
                    <div>
                        <h2>What this place offers?</h2>
                        <div className='amenities'>
                            {listing.amenities.map((item, index) => (
                                <div className='facility' key={index}>
                                    <div className='facility_icon'>
                                        {facilities.find((facility) => facility.name === item)?.icon}
                                    </div>
                                    <p>{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2>How long do you want to stay?</h2>
                        <div className='date-range-calendar'>
                            <DateRange ranges={dateRange} onChange={handleSelect} />
                            {dayCount > 1 ? (
                                <h2>₹ {listing.price.toLocaleString("en-in")} x {dayCount} nights</h2>
                            ) : (
                                <h2>₹ {listing.price.toLocaleString("en-in")} x {dayCount} night</h2>
                            )}
                            <h2>Total price: ₹{listing.price * dayCount}</h2>
                            <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
                            <p>End Date: {dateRange[0].endDate.toDateString()}</p>

                            <button className='button' type="submit" onClick={handleSubmit}>
                                BOOKING
                            </button>
                        </div>
                    </div>
                </div>

                {/* DELETE BUTTON - only visible to owner */}
                {customerId === listing.creator._id && (
                    <button className="button" onClick={handleDelete}>
                        Delete Listing
                    </button>
                )}


            </div>
        </>
    )
}

export default ListingDetails
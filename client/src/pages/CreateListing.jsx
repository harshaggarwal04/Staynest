import React, { useState } from 'react';
import Navbar from "../components/Navbar.jsx";
import "../styles/CreateListing.scss";
import { categories, types, facilities } from '../data.jsx';
import { IoIosImages } from "react-icons/io";
import { RemoveCircleOutline, AddCircleOutline } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { BiTrash } from "react-icons/bi";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateListing = () => {
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [formLocation, setFormLocation] = useState({
        address:"", aptSuite:"", city:"", state:"", country:""
    });
    const [guestCount, setGuestCount] = useState(1);
    const [bedroomCount, setBedroomCount] = useState(1);
    const [bedCount, setBedCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);
    const [amenities, setAmenities] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [formDescription, setFormDescription] = useState({
        title: "", description:"", highlight:"", highlightDesc:"", price: 0
    });

    const creatorId = useSelector((state)=> state.user._id);
    const navigate = useNavigate();

    const handleChangeLocation = (e) => {
        const {name, value} = e.target;
        setFormLocation({...formLocation, [name]: value});
    };

    const handleChangeDescription = (e) => {
        const {name, value} = e.target;
        setFormDescription({...formDescription, [name]: value});
    };

    const handleSelectAmenities = (facility) => {
        if(amenities.includes(facility)){
            setAmenities(prev => prev.filter(a => a !== facility));
        } else {
            setAmenities(prev => [...prev, facility]);
        }
    };

    const handleUploadPhotos = (e) => {
        const newPhotos = e.target.files;
        setPhotos(prev => [...prev, ...newPhotos]);
    };

    const handleDragPhoto = (result) => {
        if (!result.destination) return;
        const items = Array.from(photos);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setPhotos(items);
    };

    const handleRemovePhoto = (indexToRemove) => {
        setPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handlePost = async (e) => {
        e.preventDefault();
        try {
            const listingForm = new FormData();
            listingForm.append("creator", creatorId);
            listingForm.append("category", category);
            listingForm.append("type", type);
            listingForm.append("address", formLocation.address);
            listingForm.append("aptSuite", formLocation.aptSuite);
            listingForm.append("city", formLocation.city);
            listingForm.append("state", formLocation.state);
            listingForm.append("country", formLocation.country);
            listingForm.append("guestCount", guestCount);
            listingForm.append("bedroomCount", bedroomCount);
            listingForm.append("bedCount", bedCount);
            listingForm.append("bathroomCount", bathroomCount);
            amenities.forEach(a => listingForm.append("amenities", a));
            listingForm.append("title", formDescription.title);
            listingForm.append("description", formDescription.description);
            listingForm.append("highlight", formDescription.highlight);
            listingForm.append("highlightDesc", formDescription.highlightDesc);
            listingForm.append("price", formDescription.price);

            photos.forEach(photo => {
                listingForm.append("listingPhotos", photo);
            });

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/properties/create`, {
                method: "POST",
                body: listingForm
            });

            if(response.ok){
                navigate("/");
            }
        } catch (err) {
            console.log("publish failed", err.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className='create-listing'>
                <h1>Publish Your Place</h1>
                <form onSubmit={handlePost}>

                    {/* Step 1 */}
                    <div className='create-listing_step1'>
                        <h2>Step 1: Tell us about your place</h2>
                        <hr />
                        <h3>Which of the categories best describes your place?</h3>
                        <div className='category-list'>
                            {categories?.map((item, index) => (
                                <div className={`category ${category === item.label ? "selected" : ""}`} key={index} onClick={()=>setCategory(item.label)}>
                                    <div className='category_icon'>{item.icon}</div>
                                    <p>{item.label}</p>
                                </div>
                            ))}
                        </div>

                        <h3>What type of place will guests have</h3>
                        <div className='type-list'>
                            {types?.map((item, index) => (
                                <div className={`type ${type===item.name?"selected":""}`} key={index} onClick={()=>setType(item.name)}>
                                    <div className='type_text'>
                                        <h4>{item.name}</h4>
                                        <p>{item.description}</p>
                                    </div>
                                    <div className='type_icon'>{item.icon}</div>
                                </div>
                            ))}
                        </div>

                        <h3>Where's your place located</h3>
                        <div className='full'>
                            <div className='location'>
                                <p>Address</p>
                                <input type="text" placeholder='Address' name="address" value={formLocation.address} onChange={handleChangeLocation} required />
                            </div>
                        </div>
                        <div className='half'>
                            <div className='location'>
                                <p>Apt, Suite, House etc (if applicable)</p>
                                <input type="text" placeholder='Apt, Suite, House etc' name='aptSuite' value={formLocation.aptSuite} onChange={handleChangeLocation} required />
                            </div>
                            <div className='location'>
                                <p>City (if applicable)</p>
                                <input type="text" placeholder='City' name='city' value={formLocation.city} onChange={handleChangeLocation} required />
                            </div>
                        </div>
                        <div className='half'>
                            <div className='location'>
                                <p>State</p>
                                <input type="text" placeholder='State' name='state' value={formLocation.state} onChange={handleChangeLocation} required />
                            </div>
                            <div className='location'>
                                <p>Country</p>
                                <input type="text" placeholder='Country' name='country' value={formLocation.country} onChange={handleChangeLocation} required />
                            </div>
                        </div>

                        <h3>Share some basics about your place</h3>
                        <div className='basics'>
                            {[
                                {label: 'Guests', value: guestCount, set: setGuestCount},
                                {label: 'Bedrooms', value: bedroomCount, set: setBedroomCount},
                                {label: 'Beds', value: bedCount, set: setBedCount},
                                {label: 'Bathrooms', value: bathroomCount, set: setBathroomCount},
                            ].map((item, i) => (
                                <div className='basic' key={i}>
                                    <p>{item.label}</p>
                                    <div className='basic_count'>
                                        <RemoveCircleOutline
                                            onClick={()=>item.value>1 && item.set(item.value-1)}
                                            sx={{ fontSize: "25px", cursor: "pointer", "&:hover": { color: "#4facfe" } }}
                                        />
                                        <p>{item.value}</p>
                                        <AddCircleOutline
                                            onClick={()=>item.set(item.value+1)}
                                            sx={{ fontSize: "25px", cursor: "pointer", "&:hover": { color: "#4facfe" } }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className='create-listing_step2'>
                        <h2>Step 2: Make your place stand out</h2>
                        <hr />

                        <h3>Tell guests what your place has to offer</h3>
                        <div className='amenities'>
                            {facilities?.map((item, index)=>(
                                <div className={`facility ${amenities.includes(item.name)?"selected":""}`} key={index} onClick={()=>handleSelectAmenities(item.name)}>
                                    <div className='facility_icon'>{item.icon}</div>
                                    <p>{item.name}</p>
                                </div>
                            ))}
                        </div>

                        <h3>Add Some photos of your place</h3>
                        <DragDropContext onDragEnd={handleDragPhoto}>
                            <Droppable droppableId='photos' direction='horizontal'>
                                {(provided) => (
                                    <div className='photos' {...provided.droppableProps} ref={provided.innerRef}>
                                        {photos.length < 1 && (
                                            <>
                                                <input id="image" type="file" style={{ display: "none" }} accept='image/*' onChange={handleUploadPhotos} multiple />
                                                <label htmlFor='image' className='alone'>
                                                    <div className='icon'><IoIosImages /></div>
                                                    <p>Upload from your device</p>
                                                </label>
                                            </>
                                        )}
                                        {photos.length >= 1 && (
                                            <>
                                                {photos.map((photo, index)=>(
                                                    <Draggable key={index} draggableId={index.toString()} index={index}>
                                                        {(provided)=>(
                                                            <div className='photo' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                <img src={URL.createObjectURL(photo)} alt="place"/>
                                                                <button type="button" onClick={()=>handleRemovePhoto(index)}><BiTrash /></button>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                <input id="image" type="file" style={{ display: "none" }} accept='image/*' onChange={handleUploadPhotos} multiple />
                                                <label htmlFor='image' className='together'>
                                                    <div className='icon'><IoIosImages /></div>
                                                    <p>Upload from your device</p>
                                                </label>
                                            </>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

                        <h3>What Makes your place attractive and exciting?</h3>
                        <div className='description'>
                            <p>Title</p>
                            <input type="text" placeholder='Title' name="title" value={formDescription.title} onChange={handleChangeDescription} required />
                            <p>Description</p>
                            <textarea placeholder='Description' name="description" value={formDescription.description} onChange={handleChangeDescription} required />
                            <p>Highlight</p>
                            <input type="text" placeholder='Highlight' name="highlight" value={formDescription.highlight} onChange={handleChangeDescription} required />
                            <p>Highlight details</p>
                            <textarea placeholder='Highlight details' name="highlightDesc" value={formDescription.highlightDesc} onChange={handleChangeDescription} required />
                            <p>Now, set your Price</p>
                            <span>₹</span>
                            <input type="number" placeholder='5000' className='price' name="price" value={formDescription.price} onChange={handleChangeDescription} required />
                        </div>
                    </div>

                    <button type="submit" className='submit_btn'>CREATE YOUR LISTING</button>
                </form>
            </div>
        </>
    )
}

export default CreateListing;

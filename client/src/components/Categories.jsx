import React from 'react';
import {categories} from '../data.jsx';
import { Category } from '@mui/icons-material';
import '../styles/Categories.scss';
import {Link} from 'react-router-dom';

const Categories = () => {
    return (
        <div className="categories">
            <h1>Explore Top categories</h1>
            <p>Discover vacation rentals for every kind of traveler — where comfort meets culture, and every stay is a chance to create unforgettable memories..
            </p>

            <div className='categories_list'>
                {categories?.slice(1,7).map((category, index)=>{
                    return(<Link to={`/properties/category/${category.label}`}>
                        <div className='category' key={index}>
                            <img src={category.img} alt={category.label} loading='lazy'/>
                            <div className='overlay'></div>
                            <div className='category_text'>
                                <div className='category_text_icon'>{category.icon}</div>
                                <p>{category.label}</p>
                            </div>
                        </div>
                    </Link>)
                })}
            </div>
        </div>
    );
}

export default Categories
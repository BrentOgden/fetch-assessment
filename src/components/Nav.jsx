import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Nav() {
  

  return (
    <section className='absolute top-0 left-0'>
    <div className='mb-9'>
      
       

          <button className='rounded-none bg-[url(./assets/bg-texture.jpeg)] hover:bg-orange-600 text-white px-4 ml-1 py-2 rounded-b-lg'>
            <Link to="/FavoritesList">My Favorites</Link>
          </button>
          <button className='rounded-none bg-[url(./assets/bg-texture.jpeg)] hover:bg-orange-600 text-white px-4 ml-1 py-2 rounded-b-lg'>
            <Link to="/DogList">Search for Dogs</Link>
          </button>
       
      
    </div>
    </section>
  );
}
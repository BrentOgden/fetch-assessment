import React from 'react';

function DogDetail({ dog, onClose }) {
  if (!dog) return null;

  return (
    // The overlay that dims the background
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black" 
      onClick={onClose}
    >
      <div 
        className="bg-white opacity-100 rounded-md z-100 p-6 h-3/4 max-w-md w-full" 
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-bold text-2xl mb-4">{dog.name}</h2>
        <p className="italic mb-2">Breed: {dog.breed}</p>
        <p className="mb-2">Age: {dog.age}</p>
        <p className="mb-2">ZIP Code: {dog.zip_code}</p>
        <img 
          src={dog.img} 
          alt={dog.name} 
          className="w-full h-2/3 mb-4"
        />
        <button 
          onClick={onClose} 
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default DogDetail;

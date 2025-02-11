import React, { useState, useEffect } from 'react';
import DogDetail from './DogDetail'; 
import PawIcon from './PawIcon';
import '../App.css';
import '../DogList.css';

function FavoritesList() {
    const [favorites, setFavorites] = useState([]);
    const [selectedDog, setSelectedDog] = useState(null);
    const [isMatching, setIsMatching] = useState(false);
    const [matchError, setMatchError] = useState(null);

    // Load favorites from local storage 
    useEffect(() => {
        const stored = localStorage.getItem('favorites');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            console.log("Loaded favorites from localStorage:", parsed);
            setFavorites(parsed);
          } catch (err) {
            console.error('Error parsing stored favorites:', err);
          }
        }
      }, []);

    

    const generateMatch = async () => {
        if (favorites.length === 0) return;
        setIsMatching(true);
        setMatchError(null);

        // Create an array of dog IDs from the favorites list.
        const dogIds = favorites.map((dog) => dog.id);
        console.log("Sending dog IDs to /dogs/match:", dogIds);

        try {
            const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include credentials if required by your API
                body: JSON.stringify(dogIds)
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.json();
            console.log("Match generated:", result.match);

            
            const matchedDog = favorites.find((dog) => dog.id === result.match);
            if (matchedDog) {
                setSelectedDog(matchedDog);
            } else {
                console.warn("Matched dog not found in favorites.");
            }
        } catch (error) {
            console.error("Error generating match:", error);
            setMatchError("Failed to generate match.");
        } finally {
            setIsMatching(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Your Favorites</h2>

            {favorites.length === 0 ? (
                <p className="text-center">No favorites added yet.</p>
            ) : (
                <>
                    
                    <div className="mb-4 text-center">
                        <button
                            onClick={generateMatch}
                            disabled={isMatching}
                            className="bg-orange-600 text-white p-2 rounded"
                        >
                            {isMatching ? "Matching..." : "Match Me to a Pet"}
                        </button>
                    </div>
                    <section className="bg-[url(./assets/mainbg.jpg)] bg-center bg-repeat z-1 opacity-90 rounded drop-shadow-2xl mt-2 px-4 pt-4 pb-8 mb-10">

                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 z-1000">

                            {favorites.map((dog) => (
                                <div className="shadow-lg p-4 bg-contain bg-[url('./assets/paws.jpeg')] z-1000 cursor-pointer z-20 rounded-md p-2">
                                    {/* <PawIcon dogId={dog.id} onToggle={() => toggleFavorite(dog)} /> */}
                                    <div className='bg-white opacity-95'>
                                        <h2 className="font-extrabold text-lg">{dog.name}</h2>
                                        <p className="italic">Breed: {dog.breed}</p>
                                        <p>Age: {dog.age}</p>
                                        <p>ZIP Code: {dog.zip_code}</p>
                                        <img className="w-full h-auto object-fill p-1" src={dog.img} alt={dog.name} />
                                    </div></div>
                            ))}
                        </ul>
                    </section>
                    {matchError && <p className="text-red-500 text-center">{matchError}</p>}
                </>

            )}

            {/* Modal for displaying the selected (or matched) dog */}
            {selectedDog && (
                <DogDetail dog={selectedDog} onClose={() => setSelectedDog(null)} />
            )}
        </div>
    );
}

export default FavoritesList;

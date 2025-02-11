import React, { useState, useEffect } from 'react';
import DogDetail from './DogDetail';
import PawIcon from './PawIcon';
import '../App.css';
import '../DogList.css';

function DogList() {
    // Set states for various fields
    const [dogs, setDogs] = useState([]);
    const [selectedDog, setSelectedDog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextQuery, setNextQuery] = useState(null);
    const [breed, setBreed] = useState('');
    const [zipCodes, setZipCodes] = useState('');
    const [ageMin, setAgeMin] = useState('');
    const [ageMax, setAgeMax] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [breedOptions, setBreedOptions] = useState([]);

    // Build a query string from search fields
    const filterQueryString = () => {
        const params = new URLSearchParams();
        if (breed) params.append('breeds', breed);
        if (zipCodes) params.append('zipCodes', zipCodes);
        if (ageMin) params.append('ageMin', ageMin);
        if (ageMax) params.append('ageMax', ageMax);
        params.append('size', '20');
        return params.toString();
    };

    // Function to fetch dogs data 
    const fetchDogsData = async (
        url = 'https://frontend-take-home-service.fetch.com/dogs/search'
    ) => {
        try {
            const searchResponse = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            if (!searchResponse.ok) {
                throw new Error(
                    `Search Error: ${searchResponse.status} ${searchResponse.statusText}`
                );
            }
            const searchData = await searchResponse.json();
            const dogIds = searchData.resultIds;
            setNextQuery(searchData.next);
            if (!dogIds || dogIds.length === 0) return [];
            const dogsResponse = await fetch(
                'https://frontend-take-home-service.fetch.com/dogs',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(dogIds)
                }
            );
            if (!dogsResponse.ok) {
                throw new Error(
                    `Dogs Fetch Error: ${dogsResponse.status} ${dogsResponse.statusText}`
                );
            }
            const dogsData = await dogsResponse.json();
            return dogsData;
        } catch (err) {
            setError(err.message);
            return [];
        }
    };
    // Store favorites in local storage for retrieval.
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
        console.log("Favorites updated and stored in localStorage:", favorites);
    }, [favorites]);

    // Favorite toggle (add/remove from favorites list)
    const toggleFavorite = (dog) => {
        console.log('Toggling favorite for:', dog);
        setFavorites((prevFavorites) => {
            const exists = prevFavorites.find((fav) => fav.id === dog.id);
            if (exists) {
                console.log('Dog already in favorites; removing it.');
                return prevFavorites.filter((fav) => fav.id !== dog.id);
            } else {
                console.log('Adding new favorite:', dog);
                return [...prevFavorites, dog];
            }
        });
        setSelectedDog(dog);
    };

    // Send all favorited dog IDs to the /dogs/match endpoint.
    const generateMatch = async () => {
        if (favorites.length === 0) return;
        setIsMatching(true);
        setMatchError(null);
        const dogIds = favorites.map((dog) => dog.id);
        console.log("Sending dog IDs to /dogs/match:", dogIds);

        try {
            const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
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

    // Display initial list of dogs
    useEffect(() => {
        const loadInitialDogs = async () => {
          const initialDogs = await fetchDogsData();
          // Sort dogs alphabetically by breed (ascending order)
          const sortedDogs = [...initialDogs].sort((a, b) =>
            (a.breed || "").localeCompare(b.breed || "")
          );
          console.log("Sorted dogs:", sortedDogs);
          setDogs(sortedDogs);
          setLoading(false);
        };
        loadInitialDogs();
      }, []);
      

    // Fetch available breed options 
    useEffect(() => {
        const fetchBreedOptions = async () => {
            try {
                const response = await fetch(
                    'https://frontend-take-home-service.fetch.com/dogs/breeds',
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include'
                    }
                );
                if (!response.ok) {
                    throw new Error(
                        `Error fetching breed info: ${response.status} ${response.statusText}`
                    );
                }
                const options = await response.json();
                setBreedOptions(options);
            } catch (err) {
                console.error('Cannot fetch breed information.', err);
            }
        };
        fetchBreedOptions();
    }, []);

    // Search form submission
    const handleSearch = async (e) => {
        e.preventDefault();
        const filter = filterQueryString();
        const url = `https://frontend-take-home-service.fetch.com/dogs/search?${filter}`;
        setLoading(true);
        const searchedDogs = await fetchDogsData(url);
        setDogs(searchedDogs);
        setLoading(false);
    };

    // Loading more dogs 
    const loadMoreDogs = async () => {
        const url = `https://frontend-take-home-service.fetch.com${nextQuery}`;
        setLoading(true);
        const moreDogs = await fetchDogsData(url);
        const sortedDogs = [...moreDogs].sort((a, b) =>
            (a.breed || "").localeCompare(b.breed || "")
          );
          setDogs(sortedDogs);
          setLoading(false);
    };

    // Modal Display
    const openDogDetail = (dog) => {
        setSelectedDog(dog);
    };


    useEffect(() => {
        if (favorites.length === 0) return; // Only send if there's at least one favorite
        const sendFavoritesMatch = async () => {
            const favoriteIds = favorites.map((dog) => dog.id);
            console.log("Sending favorite IDs to /dogs/match:", favoriteIds);
            try {
                const response = await fetch(
                    'https://frontend-take-home-service.fetch.com/dogs/match',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify(favoriteIds)
                    }
                );
                if (!response.ok) {
                    throw new Error(
                        `Match Error: ${response.status} ${response.statusText}`
                    );
                }
                const result = await response.json();
                console.log("Match generated:", result.match);

            } catch (err) {
                console.error("Error generating match:", err);
            }
        };
        sendFavoritesMatch();
    }, [favorites]);

    if (loading && dogs.length === 0) {
        return <div className="text-center py-8">Loading dogs...</div>;
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-600">
                Error loading dogs: {error}
            </div>
        );
    }
    // Function to sort dogs alphabetically by breed.
    const sortByBreedUp = () => {
        const sortedDogs = [...dogs].sort((a, b) =>
            a.breed.localeCompare(b.breed)
        );
        setDogs(sortedDogs);
    };
    const sortByBreedDown = () => {
        const sortedDogs = [...dogs].sort((a, b) =>
            b.breed.localeCompare(a.breed)
        );
        setDogs(sortedDogs);
    };
    return (

        <div>

            <section className="bg-[url(./assets/dog2.jpg)] bg-bottom bg-cover bg-no-repeat shadow-2xl shadow-black-500/50 mb-5 mt-5 ml-20 mr-20 pb-10 align-center rounded">

                <div className="backdrop-blur-xs font-extrabold text-white text-xl text-center pt-10 pb-3">
                    <h2>Find Your Next Furry Friend</h2>
                </div>
                <form onSubmit={handleSearch} className="px-4 sm:px-8">
                    <div className="flex justify-center gap-2 pb-10">
                        <div className="w-full sm:w-1/2 md:w-1/4">
                            <select
                                className="w-full p-2 text-center bg-white shadow-lg text-black border border-gray-300 rounded appearance-none"
                                value={breed}
                                onChange={(e) => setBreed(e.target.value)}
                            >
                                <option value="">Select a Breed</option>
                                {breedOptions.map((option, idx) => (
                                    <option key={idx} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/4">
                            <input
                                className="w-full p-2 text-center bg-white shadow-lg text-black border border-gray-300 rounded"
                                type="text"
                                value={zipCodes}
                                onChange={(e) => setZipCodes(e.target.value)}
                                placeholder="ZIP Code"
                            />
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/4">
                            <input
                                className="w-full p-2 text-center bg-white shadow-lg text-black border border-gray-300 rounded"
                                type="number"
                                value={ageMin}
                                onChange={(e) => setAgeMin(e.target.value)}
                                placeholder="Minimum Age"
                            />
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/4">
                            <input
                                className="w-full p-2 text-center bg-white shadow-lg text-black border border-gray-300 rounded"
                                type="number"
                                value={ageMax}
                                onChange={(e) => setAgeMax(e.target.value)}
                                placeholder="Maximum Age"
                            />
                        </div>
                    </div>
                    <div className="flex justify-center pb-4">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 pb-4 rounded" type="submit">
                            Search
                        </button>
                    </div>
                </form>
            </section>
            
            {/* Pagination Buttons */}
            <section className="flex rounded justify-between items-center px-4 py-4">

                <div className='justify-end'>
                    {nextQuery && (
                        <button
                            className="underline hover:text-white"
                            onClick={loadMoreDogs}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : '<< Previous Page'}
                        </button>
                    )}
                </div>
                <div className='left-0'>
                    
                        <button
                            className="underline hover:text-white focus:outline-none"
                            onClick={sortByBreedUp}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Sort Ascending'}
                        </button>
                   
                </div>
                <div className='float-right'>
                    
                        <button
                            className="underline hover:text-white focus:outline-none"
                            onClick={sortByBreedDown}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Sort Descending'}
                        </button>
                 
                </div>
                <div className='justify-start'>
                    {nextQuery && (
                        <button
                            className="underline hover:text-white"
                            onClick={loadMoreDogs}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Next Page >>'}
                        </button>
                    )}
                </div>
            </section>


            {/* Dog Info */}
            <section className="bg-[url(./assets/mainbg.jpg)] bg-center bg-repeat rounded drop-shadow-2xl mt-2 px-4 pt-4 pb-8 mb-10">
                <h3 className="text-lg mb-3 text-center">Click the paw icon to add/remove from your favorites</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {dogs.map((dog) => (
                        <li
                            key={dog.id}
                            className="shadow-lg p-4 bg-contain bg-[url('./assets/paws.jpeg')] cursor-pointer"
                        onClick={() => openDogDetail(dog)}
                        >
                            <div className="bg-white opacity-95 z-20 rounded-md p-2">
                                <PawIcon dogId={dog.id} onToggle={() => toggleFavorite(dog)} />

                                <h2 className="font-extrabold text-lg">{dog.name}</h2>
                                <p className="italic">Breed: {dog.breed}</p>
                                <p>Age: {dog.age}</p>
                                <p>ZIP Code: {dog.zip_code}</p>
                                <img className="w-full h-auto object-fill p-1" src={dog.img} alt={dog.name} />
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
            {/* Display Favorites */}
            {favorites.length > 0 && (
                <section className="px-4 py-4 bg-gray-100 rounded mb-10">
                    <h2 className="text-2xl font-bold text-center mb-4">Your Favorite Dogs</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {favorites.map((dog) => (
                            <li key={dog.id} className="shadow-lg p-4 bg-contain bg-[url('./assets/paws.jpeg')] cursor-pointer">
                                <div className='bg-white opacity-95 z-20 rounded-md p-2'>
                                    <h3 className="font-bold text-lg">{dog.name}</h3>
                                    <p className="italic">Breed: {dog.breed}</p>
                                    <p>Age: {dog.age}</p>
                                    <p>ZIP Code: {dog.zip_code}</p>
                                    <img className="w-full h-auto object-cover mt-2" src={dog.img} alt={dog.name} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            {/* Modal for Selected Dog */}
            <div className="text-black">
                {selectedDog && (
                    <DogDetail dog={selectedDog} onClose={() => setSelectedDog(null)} />
                )}
            </div>
        </div>
    );
}

export default DogList;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestBody = {
      name: name,
      email: email
    };

    console.log('Sending request with body:', requestBody);

    try {
      const response = await fetch("https://frontend-take-home-service.fetch.com/auth/login", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: myHeaders,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to login: ${errorData}`);
      }

      const responseText = await response.text();
      console.log('Login successful:', responseText);

      navigate('/DogList');
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div className="bg-[url(./assets/bg-texture.jpeg)] bg-center h-screen w-2/5 flex absolute bottom-0 left-0 items-center justify-center px-4">
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white rounded shadow-lg"
      >
        <h2 className="mb-8 text-center text-2xl font-bold text-purple-900">
          Please Login Below to Browse Our Collection of Dogs
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Your Name"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <div className="mb-6">
          
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Your Email"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;

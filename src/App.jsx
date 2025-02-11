import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login.jsx';
import DogList from './components/DogList.jsx';
import FavoritesList from './components/FavoritesList.jsx';
import './index.css';
import './App.css';

function App() {
  return (
    
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/DogList" element={<DogList />} />
        <Route path="/FavoritesList" element={<FavoritesList />} />
      </Routes>
  
  );
}

export default App;

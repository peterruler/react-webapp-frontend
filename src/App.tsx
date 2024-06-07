import React from 'react';
import Loader from './Loader';
import UploadImage from './UploadImage';
import Footer from './Footer';
import './App.css';

const App: React.FC = () => {
  return (
    <>
      <Loader />
      <div className="App">
        <UploadImage />
      </div>
      <Footer />
    </>
  );
};

export default App;

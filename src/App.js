import React from 'react';
import Navbar from './components/navbar.js';
import Map from './components/map.js';
// import LayerSelector from './components/layerSelector.js';

import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Map/>
      {/* <LayerSelector/> */}
    </div>
  );
}

export default App;
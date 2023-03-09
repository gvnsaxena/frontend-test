import React, { useState } from "react";

import "./App.css";

import Autocomplete from "./Autocomplete";
import ProductDetail from "./ProductDetail";

function App() {
  const [selectedSuggestion, setSelectedSuggestion] = useState(0)

  function handleClick(productId) {
    setSelectedSuggestion(productId)
  }
  return (
    <div className="App">
      <Autocomplete handleClick={handleClick}/>
      <ProductDetail productId={selectedSuggestion} />
    </div>
  );
}

export default App;

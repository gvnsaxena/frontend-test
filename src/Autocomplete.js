import React, { useEffect, useState } from "react"

import { fetchSuggestions } from "./utils/api"

import "./Autocomplete.css"

const Autocomplete = ({ handleClick }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [debouncedValue, setDebouncedValue] = useState('')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(searchTerm)
    }, 500)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchTerm])
  
  useEffect(() => {
    if(debouncedValue) {
      fetchSuggestions(debouncedValue).then((_suggestions) => 
        setSuggestions(_suggestions)
      ).catch((error) => {
        console.error(`Error in fetching Suggestion List: ${error}`)
      })
    } else {
      setSuggestions([])
    }
  }, [debouncedValue])

  const handleOnClick = (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
      handleClick(event.target.id)
      setSuggestions([])
      setSearchTerm('')
      setDebouncedValue('')
    }
  }
  return (
    <div className="search-container">
      <input
        type="text"
        value={searchTerm}
        className="search-box"
        placeholder="Search for a product"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="list-menu">
        {suggestions ? suggestions.slice(0,10).map((suggestion) => {
          return( 
            <li tabIndex="0" key={suggestion.id} onClick={handleOnClick} 
            id={suggestion.id}
            onKeyDown={handleOnClick}>
              {suggestion.title}
            </li>
          )
        }) : null}
      </ul>
    </div>
  )
}

export default Autocomplete

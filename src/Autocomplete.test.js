import React from "react"
import {render, screen, fireEvent, waitFor} from '@testing-library/react'

import Autocomplete from "./Autocomplete"

describe("Autocomplete", () => {
  let fetchSpy = jest.spyOn(global, 'fetch')
  const handleClick = jest.fn()

  beforeEach(() => {
    fetchSpy.mockResolvedValue({
      json: async () => [
        { id: 1, title: 'Title 1' },
      ],
    })
    render(<Autocomplete handleClick={handleClick}/>)
  })

  afterEach(jest.resetAllMocks)

  it("renders correctly", () => {
    const input = screen.getByRole('textbox', {placeholder: /search for a product/i})
    
    expect(input).toBeInTheDocument()
  })
  
  it("renders no suggestions when Input is not entered", async () => {
    await waitFor(() => {
      const searchResults = screen.queryAllByRole('listitem')
      expect(searchResults.length).toBe(0)
    })
  })

  it("renders suggestions in list when Input is entered ", async () => {
    const input = screen.getByRole('textbox', {placeholder: /search for a product/i})

    fireEvent.change(input, { target: { value: 'a' } })

    await waitFor(() => {
      const searchResults = screen.getAllByRole('listitem')
      expect(searchResults.length).toBe(1)
    })
  })

  it("renders maximum of 10 suggestions when Input is entered", async () => {
    const list = new Array(20).fill(1)
    
    fetchSpy.mockResolvedValue({
      json: async () => 
        list.map((item, index) => ({
          id: index,
          title: "Title"
        })
      )
    })

    const input = screen.getByRole('textbox', {placeholder: /search for a product/i})

    fireEvent.change(input, { target: { value: 'a' } })

    await waitFor(() => {
      const searchResults = screen.getAllByRole('listitem')
      expect(searchResults.length).toBe(10)
    })
  })

  it("should select the clicked suggestion Item from suggestions list", async () => {
    const input = screen.getByRole('textbox', {placeholder: /search for a product/i})

    fireEvent.change(input, { target: { value: 'a' } })

    await waitFor(() => {
      const searchResults = screen.getByText('Title 1')
      fireEvent.click(searchResults)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  it("renders no suggestions list and clears Input box when one suggestion is selected from the list", async () => {
    const input = screen.getByRole('textbox', {placeholder: /search for a product/i})

    fireEvent.change(input, { target: { value: 'a' } })

    await waitFor(() => {
      const searchResults = screen.getByText('Title 1')
      fireEvent.click(searchResults)

      const listSearchResults = screen.queryAllByRole('listitem')
      expect(listSearchResults.length).toBe(0)
    })
    
    expect(input.value).toBe('')
  })

  it('should debounce the network request', async () => {
    const input = screen.getByRole('textbox', {placeholder: /search for a product/i})
    
    fireEvent.change(input, { target: { value: 'a' } })
    fireEvent.change(input, { target: { value: 'ab' } })
    fireEvent.change(input, { target: { value: 'abc' } })
    
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1))
  })

  it("should select the sugesstion Item from the suggestions list on Enter Keypress", async () => {
    const input = screen.getByRole('textbox', {placeholder: /search for a product/i})

    fireEvent.change(input, { target: { value: 'a' } })

    await waitFor(() => {
      const searchResults = screen.getByText('Title 1')
      fireEvent.keyDown(searchResults, { key: 'Enter' })
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  it("should catch error while featching Suggestion list", async () => {
    fetchSpy.mockRejectedValue(new Error('fetching problem'))
    const consoleSpy = jest.spyOn(console, 'error').mockReturnValue(() => {});

    const input = screen.getByRole('textbox', {placeholder: /search for a product/i})

    fireEvent.change(input, { target: { value: 'a' } })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith('Error in fetching Suggestion List: Error: fetching problem')
    })
  })
})

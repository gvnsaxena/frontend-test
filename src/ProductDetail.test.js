import React from "react"
import {render, screen, waitFor} from '@testing-library/react'

import ProductDetail from "./ProductDetail"

describe("Product Details", () => {
  afterEach(jest.resetAllMocks)

  it("renders Empty Product Details Component", () => {
    const { container } = render(<ProductDetail />)

    expect(container.children.length).toBe(0)
  })

  it("renders Product Details Component with Product details", async () => {
    render(<ProductDetail productId={1}/>)

    jest.spyOn(global, 'fetch').mockReturnValue({
      json: async () => [{
          "id": 1,
          "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
          "price": 109.95,
          "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
          "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
        }],
    })

    await waitFor(() => {
      expect(screen.getByText('Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops')).toBeInTheDocument()
      expect(screen.getByText('Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday')).toBeInTheDocument()
      expect(screen.getByText('£109.95')).toBeInTheDocument()
      expect(screen.getByRole('img').getAttribute('src')).toBe('https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg')
    })
  })

  it("should catch error while featching Product Details", async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('fetching problem'))
    render(<ProductDetail productId={1}/>)
    const consoleSpy = jest.spyOn(console, 'error').mockReturnValue(() => {});

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith('Error in fetching Product Details: Error: fetching problem')
    })
  })
})

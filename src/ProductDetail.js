import React, { useState, useEffect } from "react"

import { fetchProductDetail } from "./utils/api"

import "./ProductDetail.css"

const ProductDetail = ({ productId }) => {
  const [productInfo, setProductInfo] = useState(null)

  useEffect(() => {
    if (!productId) return

    fetchProductDetail(productId).then((productInfo) =>
      setProductInfo(productInfo)
    ).catch((error) => {
      console.error(`Error in fetching Product Details: ${error}`)
    })
  }, [productId])

  return productInfo && (
    <div className="detail-container">
      <div className="row">
        <img tabIndex="0" src={productInfo.image} className="product-image" alt="productimage"/>
      </div>
      <div className="row">
        <div tabIndex="0" className="row-title">{productInfo.title}</div>
      </div>
      <div className="row">
        <div tabIndex="0" className="row-body">{productInfo.description}</div>
      </div>
      <div className="row">
        <div tabIndex="0" className="row-title">£{productInfo.price}</div>
      </div>
    </div>
  )
}

export default ProductDetail

import axios from "axios";
import { server } from "../../server";

// Create Product
export const createProduct = (
  name,
  description,
  category,
  tags,
  originalPrice,
  discountPrice,
  stock,
  shopId,
  images
) => async (dispatch) => {
  try {
    dispatch({ type: "productCreateRequest" });

    const { data } = await axios.post(`${server}/product/create-product`, {
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      shopId,
      images,
    });

    dispatch({
      type: "productCreateSuccess",
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: "productCreateFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get All Products of a Shop
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({ type: "getAllProductsShopRequest" });

    const { data } = await axios.get(`${server}/product/get-all-products-shop/${id}`);
    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};


export const deleteProduct = (id) => async (dispatch) => {
  try {
    const response = await axios.delete(`/api/v1/delete-shop-product/${id}`);
    dispatch({ type: "deleteProductSuccess", payload: response.data });
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    dispatch({ type: "deleteProductFail", payload: error.message });
  }
};


// Get All Products
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllProductsRequest" });

    const { data } = await axios.get(`${server}/product/get-all-products`);
    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

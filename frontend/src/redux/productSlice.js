import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    products: [],

    selectedProduct: null,

    loading: false,

    error: null

};

const productSlice = createSlice({

    name: "product",

    initialState,

    reducers: {

        setLoading(state) {

            state.loading = true;

            state.error = null;

        },

        setProducts(state, action) {

            state.products = action.payload;

            state.loading = false;

        },

        setSelectedProduct(state, action) {

            state.selectedProduct = action.payload;

            state.loading = false;

        },

        setError(state, action) {

            state.loading = false;

            state.error = action.payload;

        }

    }

});

export const {

    setLoading,

    setProducts,

    setSelectedProduct,

    setError

} = productSlice.actions;

export default productSlice.reducer;
export const endpoints = {
  auth: {
    login: "/api/auth/loginCustomer",
    register: "/api/auth/register",
    isRegistered: "/api/auth/isRegistered",
    register: "/api/auth/register",
    forgetPassword: "/api/auth/forgetPassword",
    smsCodeVerification: "/api/auth/smsCodeVerification",
    sendVerifyCodeForgetPassword: "/api/auth/sendVerifyCodeForForgetPassword",
  },
  address: {
    addAddress: "/api/address/addAddress",
    editAddress: "/api/address/editAddress/",
    deleteAddress: "/api/address/deleteAddress/",
    getAllAddresses: "/api/address/getAllAddresses",
    getAddressByCustumerId: "/api/address/getAddressesByCustomerId/",
  },
  brand: {
    getAllBrands: "",
    getBrandById: "",
  },
  category: {
    categoryBlocks: {
      getCategoryByBlockTypeMenu_1: "/api/categoryBlock/getAllByCategoryBlockType/MENU_1",
      getCategoryByBlockTypeMenu_2: "/api/categoryBlock/getAllByCategoryBlockType/MENU_2",
    }
  },
  products: {
    getProductByCategoryId: "/api/product/getProductByCategoryId/",
    getProductById: '/api/product/getProductById/',
    searchProduct: '/api/product/searchProduct/',
  },
  cart: {
    addCartItem: "/api/cartItem/addCartItem",
    getCart: "/api/cartItem/byCustomerId/"
  },
  favorites: {
    addFavoriteItem: "/api/likedItem/addLikedItem",
    deleteFavriteItem: "/api/likedItem/deleteLikedItem/",
    getFavorites: "/api/likedItem/getByCustomerId/",
  }
};

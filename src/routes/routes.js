import React from "react";

export const routes = [
  {
    path: "/",
    element: React.lazy(() => import("../pages/home/home")),
  },
  {
    path: "/categoryDetail/:id/:name",
    element: React.lazy(() => import("../pages/categoryDetail/categoryDetail")),
  },
  {
    path: "/looks",
    element: React.lazy(() => import("../pages/looks/looks")),
  },
  {
    path: "/looksDetail/:id",
    element: React.lazy(() => import("../pages/looks/looks-detail")),
  },
  {
    path: "/productDetail/:id/:name",
    element: React.lazy(() => import("../pages/ProductDetail/ProductDetail")),
  },
  {
    path: "/searchResult/:name", 
    element: React.lazy(() => import("../pages/searchResult/serachResult")), 
  },
  {
    path: "/cart",
    element: React.lazy(() => import("../pages/cart/cart")),
  },
  {
    path: "/favorites",
    element: React.lazy(() => import("../pages/favorites/favorites")),
  },
  {
    path: "/profile",
    element: React.lazy(() => import("../pages/profile/profile")),
  },
  {
    path: "/about",
    element: React.lazy(() => import("../pages/FooterPages/AboutPage")),
  },
  {
    path: "/terms",
    element: React.lazy(() => import("../pages/FooterPages/terms-page")),
  },
  {
    path: "/branches",
    element: React.lazy(() => import("../pages/FooterPages/branch-page")),
  },
  {
    path: "/contact",
    element: React.lazy(() => import("../pages/FooterPages/contact-page")),
  },
  {
    path: "/my-profile/:name",
    element: React.lazy(() => import("../pages/profile/my-profile")),
  },
  {
    path: "/my-orders",
    element: React.lazy(() => import("../pages/profile/my-orders")),
  },
  {
    path: "/my-comments",
    element: React.lazy(() => import("../pages/profile/my-comments")),
  },
  {
    path: "/my-address",
    element: React.lazy(() => import("../pages/profile/my-address")),
  },
  {
    path: "/my-notifications",
    element: React.lazy(() => import("../pages/profile/my-notifications")),
  },
  {
    path: "/my-status",
    element: React.lazy(() => import("../pages/profile/my-status")),
  },
  {
    path: "/my-coupons",
    element: React.lazy(() => import("../pages/profile/my-coupons")),
  },
  {
    path: "/catalogs",
    element: React.lazy(() => import("../pages/catalog/catalog")),
  },
  {
    path: "/catalog/:id",
    element: React.lazy(() => import("../pages/catalog/catalog-sub")),
  },
  {
    path: "/privacy",
    element: React.lazy(() => import("../pages/privacy/privacy")),
  },
];

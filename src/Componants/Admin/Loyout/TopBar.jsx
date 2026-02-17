// import React, { useEffect, useState } from 'react'
// import { useDispatch } from 'react-redux'
// import { logoutUser } from "../../../Store/feature/Auth/authslice";

// export default function TopBar({ user }) {
// const dispatch = useDispatch()
// const logout = async () => {
//   dispatch(logoutUser())
// }
//   const [sidebarSize, setSidebarSize] = useState("lg");
//   useEffect(() => {
//     document.documentElement.setAttribute(
//       "data-sidebar-size",
//       sidebarSize
//     );
//   }, [sidebarSize]);

//   const toggleSidebar = () => {
//     const isMobile = window.innerWidth <= 768;

//     if (isMobile) {
//       // ✅ MOBILE SIDEBAR
//       document.body.classList.toggle("vertical-sidebar-enable");
//     } else {
//       // ✅ DESKTOP SIDEBAR
//       setSidebarSize((prev) =>
//         prev === "sm-hover" ? "lg" : "sm-hover"
//       );
//     }
//   };



//   return (
//     <>
//       <header id="page-topbar">
//         <div className="layout-width">
//           <div className="navbar-header">
//             <div className="d-flex">
//               {/* LOGO */}
//               <div className="navbar-brand-box horizontal-logo">
//                 <a href="index-2.html" className="logo logo-dark">
//                   <span className="logo-sm">
//                     <img src="/assets/images/logo-sm.png" alt="" height={22} />
//                   </span>
//                   <span className="logo-lg">
//                     <img src="/assets/images/logo-dark.png" alt="" height={17} />
//                   </span>
//                 </a>
//                 <a href="index-2.html" className="logo logo-light">
//                   <span className="logo-sm">
//                     <img src="/assets/images/logo-sm.png" alt="" height={22} />
//                   </span>
//                   <span className="logo-lg">
//                     <img src="/assets/images/logo-light.png" alt="" height={17} />
//                   </span>
//                 </a>
//               </div>
//               <button
//                 type="button"
//                 className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
//                 id="topnav-hamburger-icon" onClick={toggleSidebar}
//               >
//                 <span className="hamburger-icon">
//                   <span />
//                   <span />
//                   <span />
//                 </span>
//               </button>
//               {/* App Search*/}
//               <form className="app-search d-none d-md-block">
//                 <div className="position-relative">
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Search..."
//                     autoComplete="off"
//                     id="search-options"
//                     defaultValue=""
//                   />
//                   <span className="mdi mdi-magnify search-widget-icon" />
//                   <span
//                     className="mdi mdi-close-circle search-widget-icon search-widget-icon-close d-none"
//                     id="search-close-options"
//                   />
//                 </div>
//                 <div
//                   className="dropdown-menu dropdown-menu-lg"
//                   id="search-dropdown"
//                 >
//                   <div data-simplebar="" style={{ maxHeight: 320 }}>
//                     {/* item*/}
//                     <div className="dropdown-header">
//                       <h6 className="text-overflow text-muted mb-0 text-uppercase">
//                         Recent Searches
//                       </h6>
//                     </div>
//                     <div className="dropdown-item bg-transparent text-wrap">
//                       <a
//                         href="index-2.html"
//                         className="btn btn-soft-secondary btn-sm rounded-pill"
//                       >
//                         how to setup <i className="mdi mdi-magnify ms-1" />
//                       </a>
//                       <a
//                         href="index-2.html"
//                         className="btn btn-soft-secondary btn-sm rounded-pill"
//                       >
//                         buttons <i className="mdi mdi-magnify ms-1" />
//                       </a>
//                     </div>
//                     {/* item*/}
//                     <div className="dropdown-header mt-2">
//                       <h6 className="text-overflow text-muted mb-1 text-uppercase">
//                         Pages
//                       </h6>
//                     </div>
//                     {/* item*/}
//                     <a
//                       href="javascript:void(0);"
//                       className="dropdown-item notify-item"
//                     >
//                       <i className="ri-bubble-chart-line align-middle fs-18 text-muted me-2" />
//                       <span>Analytics Dashboard</span>
//                     </a>
//                     {/* item*/}
//                     <a
//                       href="javascript:void(0);"
//                       className="dropdown-item notify-item"
//                     >
//                       <i className="ri-lifebuoy-line align-middle fs-18 text-muted me-2" />
//                       <span>Help Center</span>
//                     </a>
//                     {/* item*/}
//                     <a
//                       href="javascript:void(0);"
//                       className="dropdown-item notify-item"
//                     >
//                       <i className="ri-user-settings-line align-middle fs-18 text-muted me-2" />
//                       <span>My account settings</span>
//                     </a>
//                     {/* item*/}
//                     <div className="dropdown-header mt-2">
//                       <h6 className="text-overflow text-muted mb-2 text-uppercase">
//                         Members
//                       </h6>
//                     </div>
//                     <div className="notification-list">
//                       {/* item */}
//                       <a
//                         href="javascript:void(0);"
//                         className="dropdown-item notify-item py-2"
//                       >
//                         <div className="d-flex">
//                           <img
//                             src="/assets/images/users/avatar-2.jpg"
//                             className="me-3 rounded-circle avatar-xs"
//                             alt="user-pic"
//                           />
//                           <div className="flex-grow-1">
//                             <h6 className="m-0">Angela Bernier</h6>
//                             <span className="fs-11 mb-0 text-muted">Manager</span>
//                           </div>
//                         </div>
//                       </a>
//                       {/* item */}
//                       <a
//                         href="javascript:void(0);"
//                         className="dropdown-item notify-item py-2"
//                       >
//                         <div className="d-flex">
//                           <img
//                             src="/assets/images/users/avatar-3.jpg"
//                             className="me-3 rounded-circle avatar-xs"
//                             alt="user-pic"
//                           />
//                           <div className="flex-grow-1">
//                             <h6 className="m-0">David Grasso</h6>
//                             <span className="fs-11 mb-0 text-muted">
//                               Web Designer
//                             </span>
//                           </div>
//                         </div>
//                       </a>
//                       {/* item */}
//                       <a
//                         href="javascript:void(0);"
//                         className="dropdown-item notify-item py-2"
//                       >
//                         <div className="d-flex">
//                           <img
//                             src="/assets/images/users/avatar-5.jpg"
//                             className="me-3 rounded-circle avatar-xs"
//                             alt="user-pic"
//                           />
//                           <div className="flex-grow-1">
//                             <h6 className="m-0">Mike Bunch</h6>
//                             <span className="fs-11 mb-0 text-muted">
//                               React Developer
//                             </span>
//                           </div>
//                         </div>
//                       </a>
//                     </div>
//                   </div>
//                   <div className="text-center pt-3 pb-1">
//                     <a
//                       href="pages-search-results.html"
//                       className="btn btn-primary btn-sm"
//                     >
//                       View All Results
//                       <i className="ri-arrow-right-line ms-1" />
//                     </a>
//                   </div>
//                 </div>
//               </form>
//             </div>
//             <div className="d-flex align-items-center">
//               <div className="dropdown d-md-none topbar-head-dropdown header-item">
//                 <button
//                   type="button"
//                   className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
//                   id="page-header-search-dropdown"
//                   data-bs-toggle="dropdown"
//                   aria-haspopup="true"
//                   aria-expanded="false"
//                 >
//                   <i className="bx bx-search fs-22" />
//                 </button>
//                 <div
//                   className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
//                   aria-labelledby="page-header-search-dropdown"
//                 >
//                   <form className="p-3">
//                     <div className="form-group m-0">
//                       <div className="input-group">
//                         <input
//                           type="text"
//                           className="form-control"
//                           placeholder="Search ..."
//                           aria-label="Recipient's username"
//                         />
//                         <button className="btn btn-primary" type="submit">
//                           <i className="mdi mdi-magnify" />
//                         </button>
//                       </div>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//               <div className="dropdown ms-1 topbar-head-dropdown header-item">
//                 <button
//                   type="button"
//                   className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
//                   data-bs-toggle="dropdown"
//                   aria-haspopup="true"
//                   aria-expanded="false"
//                 >
//                   <img
//                     id="header-lang-img"
//                     src="/assets/images/flags/us.svg"
//                     alt="Header Language"
//                     height={20}
//                     className="rounded"
//                   />
//                 </button>
//                 <div className="dropdown-menu dropdown-menu-end">
//                   {/* item*/}
//                   <a
//                     href="javascript:void(0);"
//                     className="dropdown-item notify-item language py-2"
//                     data-lang="en"
//                     title="English"
//                   >
//                     <img
//                       src="/assets/images/flags/us.svg"
//                       alt="user-image"
//                       className="me-2 rounded"
//                       height={18}
//                     />
//                     <span className="align-middle">English</span>
//                   </a>
//                   {/* item*/}
//                   <a
//                     href="javascript:void(0);"
//                     className="dropdown-item notify-item language"
//                     data-lang="sp"
//                     title="Spanish"
//                   >
//                     <img
//                       src="/assets/images/flags/spain.svg"
//                       alt="user-image"
//                       className="me-2 rounded"
//                       height={18}
//                     />
//                     <span className="align-middle">Española</span>
//                   </a>
//                   {/* item*/}
//                   <a
//                     href="javascript:void(0);"
//                     className="dropdown-item notify-item language"
//                     data-lang="gr"
//                     title="German"
//                   >
//                     <img
//                       src="/assets/images/flags/germany.svg"
//                       alt="user-image"
//                       className="me-2 rounded"
//                       height={18}
//                     />{" "}
//                     <span className="align-middle">Deutsche</span>
//                   </a>
//                   {/* item*/}
//                   <a
//                     href="javascript:void(0);"
//                     className="dropdown-item notify-item language"
//                     data-lang="it"
//                     title="Italian"
//                   >
//                     <img
//                       src="/assets/images/flags/italy.svg"
//                       alt="user-image"
//                       className="me-2 rounded"
//                       height={18}
//                     />
//                     <span className="align-middle">Italiana</span>
//                   </a>
//                   {/* item*/}
//                   <a
//                     href="javascript:void(0);"
//                     className="dropdown-item notify-item language"
//                     data-lang="ru"
//                     title="Russian"
//                   >
//                     <img
//                       src="/assets/images/flags/russia.svg"
//                       alt="user-image"
//                       className="me-2 rounded"
//                       height={18}
//                     />
//                     <span className="align-middle">русский</span>
//                   </a>
//                   {/* item*/}
//                   <a
//                     href="javascript:void(0);"
//                     className="dropdown-item notify-item language"
//                     data-lang="ch"
//                     title="Chinese"
//                   >
//                     <img
//                       src="/assets/images/flags/china.svg"
//                       alt="user-image"
//                       className="me-2 rounded"
//                       height={18}
//                     />
//                     <span className="align-middle">中国人</span>
//                   </a>
//                   {/* item*/}
//                   <a
//                     href="javascript:void(0);"
//                     className="dropdown-item notify-item language"
//                     data-lang="fr"
//                     title="French"
//                   >
//                     <img
//                       src="/assets/images/flags/french.svg"
//                       alt="user-image"
//                       className="me-2 rounded"
//                       height={18}
//                     />
//                     <span className="align-middle">français</span>
//                   </a>
//                   {/* item*/}
//                   <a
//                     href="javascript:void(0);"
//                     className="dropdown-item notify-item language"
//                     data-lang="ar"
//                     title="Arabic"
//                   >
//                     <img
//                       src="/assets/images/flags/ae.svg"
//                       alt="user-image"
//                       className="me-2 rounded"
//                       height={18}
//                     />
//                     <span className="align-middle">Arabic</span>
//                   </a>
//                 </div>
//               </div>
//               <div className="dropdown topbar-head-dropdown ms-1 header-item">
//                 <button
//                   type="button"
//                   className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
//                   data-bs-toggle="dropdown"
//                   aria-haspopup="true"
//                   aria-expanded="false"
//                 >
//                   <i className="bx bx-category-alt fs-22" />
//                 </button>
//                 <div className="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
//                   <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
//                     <div className="row align-items-center">
//                       <div className="col">
//                         <h6 className="m-0 fw-semibold fs-15"> Web Apps </h6>
//                       </div>
//                       <div className="col-auto">
//                         <a href="#!" className="btn btn-sm btn-soft-info">
//                           {" "}
//                           View All Apps
//                           <i className="ri-arrow-right-s-line align-middle" />
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="p-2">
//                     <div className="row g-0">
//                       <div className="col">
//                         <a className="dropdown-icon-item" href="#!">
//                           <img
//                             src="/assets/images/brands/github.png"
//                             alt="Github"
//                           />
//                           <span>GitHub</span>
//                         </a>
//                       </div>
//                       <div className="col">
//                         <a className="dropdown-icon-item" href="#!">
//                           <img
//                             src="/assets/images/brands/bitbucket.png"
//                             alt="bitbucket"
//                           />
//                           <span>Bitbucket</span>
//                         </a>
//                       </div>
//                       <div className="col">
//                         <a className="dropdown-icon-item" href="#!">
//                           <img
//                             src="/assets/images/brands/dribbble.png"
//                             alt="dribbble"
//                           />
//                           <span>Dribbble</span>
//                         </a>
//                       </div>
//                     </div>
//                     <div className="row g-0">
//                       <div className="col">
//                         <a className="dropdown-icon-item" href="#!">
//                           <img
//                             src="/assets/images/brands/dropbox.png"
//                             alt="dropbox"
//                           />
//                           <span>Dropbox</span>
//                         </a>
//                       </div>
//                       <div className="col">
//                         <a className="dropdown-icon-item" href="#!">
//                           <img
//                             src="/assets/images/brands/mail_chimp.png"
//                             alt="mail_chimp"
//                           />
//                           <span>Mail Chimp</span>
//                         </a>
//                       </div>
//                       <div className="col">
//                         <a className="dropdown-icon-item" href="#!">
//                           <img src="/assets/images/brands/slack.png" alt="slack" />
//                           <span>Slack</span>
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="dropdown topbar-head-dropdown ms-1 header-item">
//                 <button
//                   type="button"
//                   className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
//                   id="page-header-cart-dropdown"
//                   data-bs-toggle="dropdown"
//                   data-bs-auto-close="outside"
//                   aria-haspopup="true"
//                   aria-expanded="false"
//                 >
//                   <i className="bx bx-shopping-bag fs-22" />
//                   <span className="position-absolute topbar-badge cartitem-badge fs-10 translate-middle badge rounded-pill bg-info">
//                     5
//                   </span>
//                 </button>
//                 <div
//                   className="dropdown-menu dropdown-menu-xl dropdown-menu-end p-0 dropdown-menu-cart"
//                   aria-labelledby="page-header-cart-dropdown"
//                 >
//                   <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
//                     <div className="row align-items-center">
//                       <div className="col">
//                         <h6 className="m-0 fs-16 fw-semibold"> My Cart</h6>
//                       </div>
//                       <div className="col-auto">
//                         <span className="badge bg-warning-subtle text-warning fs-13">
//                           <span className="cartitem-badge">7</span>
//                           items
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <div data-simplebar="" style={{ maxHeight: 300 }}>
//                     <div className="p-2">
//                       <div className="text-center empty-cart" id="empty-cart">
//                         <div className="avatar-md mx-auto my-3">
//                           <div className="avatar-title bg-info-subtle text-info fs-36 rounded-circle">
//                             <i className="bx bx-cart" />
//                           </div>
//                         </div>
//                         <h5 className="mb-3">Your Cart is Empty!</h5>
//                         <a
//                           href="apps-ecommerce-products.html"
//                           className="btn btn-success w-md mb-3"
//                         >
//                           Shop Now
//                         </a>
//                       </div>
//                       <div className="d-block dropdown-item dropdown-item-cart text-wrap px-3 py-2">
//                         <div className="d-flex align-items-center">
//                           <img
//                             src="/assets/images/products/img-1.png"
//                             className="me-3 rounded-circle avatar-sm p-2 bg-light"
//                             alt="user-pic"
//                           />
//                           <div className="flex-grow-1">
//                             <h6 className="mt-0 mb-1 fs-14">
//                               <a
//                                 href="apps-ecommerce-product-details.html"
//                                 className="text-reset"
//                               >
//                                 Branded T-Shirts
//                               </a>
//                             </h6>
//                             <p className="mb-0 fs-12 text-muted">
//                               Quantity: <span>10 x $32</span>
//                             </p>
//                           </div>
//                           <div className="px-2">
//                             <h5 className="m-0 fw-normal">
//                               $<span className="cart-item-price">320</span>
//                             </h5>
//                           </div>
//                           <div className="ps-2">
//                             <button
//                               type="button"
//                               className="btn btn-icon btn-sm btn-ghost-secondary remove-item-btn"
//                             >
//                               <i className="ri-close-fill fs-16" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="d-block dropdown-item dropdown-item-cart text-wrap px-3 py-2">
//                         <div className="d-flex align-items-center">
//                           <img
//                             src="/assets/images/products/img-2.png"
//                             className="me-3 rounded-circle avatar-sm p-2 bg-light"
//                             alt="user-pic"
//                           />
//                           <div className="flex-grow-1">
//                             <h6 className="mt-0 mb-1 fs-14">
//                               <a
//                                 href="apps-ecommerce-product-details.html"
//                                 className="text-reset"
//                               >
//                                 Bentwood Chair
//                               </a>
//                             </h6>
//                             <p className="mb-0 fs-12 text-muted">
//                               Quantity: <span>5 x $18</span>
//                             </p>
//                           </div>
//                           <div className="px-2">
//                             <h5 className="m-0 fw-normal">
//                               $<span className="cart-item-price">89</span>
//                             </h5>
//                           </div>
//                           <div className="ps-2">
//                             <button
//                               type="button"
//                               className="btn btn-icon btn-sm btn-ghost-secondary remove-item-btn"
//                             >
//                               <i className="ri-close-fill fs-16" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="d-block dropdown-item dropdown-item-cart text-wrap px-3 py-2">
//                         <div className="d-flex align-items-center">
//                           <img
//                             src="/assets/images/products/img-3.png"
//                             className="me-3 rounded-circle avatar-sm p-2 bg-light"
//                             alt="user-pic"
//                           />
//                           <div className="flex-grow-1">
//                             <h6 className="mt-0 mb-1 fs-14">
//                               <a
//                                 href="apps-ecommerce-product-details.html"
//                                 className="text-reset"
//                               >
//                                 Borosil Paper Cup
//                               </a>
//                             </h6>
//                             <p className="mb-0 fs-12 text-muted">
//                               Quantity: <span>3 x $250</span>
//                             </p>
//                           </div>
//                           <div className="px-2">
//                             <h5 className="m-0 fw-normal">
//                               $<span className="cart-item-price">750</span>
//                             </h5>
//                           </div>
//                           <div className="ps-2">
//                             <button
//                               type="button"
//                               className="btn btn-icon btn-sm btn-ghost-secondary remove-item-btn"
//                             >
//                               <i className="ri-close-fill fs-16" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="d-block dropdown-item dropdown-item-cart text-wrap px-3 py-2">
//                         <div className="d-flex align-items-center">
//                           <img
//                             src="/assets/images/products/img-6.png"
//                             className="me-3 rounded-circle avatar-sm p-2 bg-light"
//                             alt="user-pic"
//                           />
//                           <div className="flex-grow-1">
//                             <h6 className="mt-0 mb-1 fs-14">
//                               <a
//                                 href="apps-ecommerce-product-details.html"
//                                 className="text-reset"
//                               >
//                                 Gray Styled T-Shirt
//                               </a>
//                             </h6>
//                             <p className="mb-0 fs-12 text-muted">
//                               Quantity: <span>1 x $1250</span>
//                             </p>
//                           </div>
//                           <div className="px-2">
//                             <h5 className="m-0 fw-normal">
//                               $ <span className="cart-item-price">1250</span>
//                             </h5>
//                           </div>
//                           <div className="ps-2">
//                             <button
//                               type="button"
//                               className="btn btn-icon btn-sm btn-ghost-secondary remove-item-btn"
//                             >
//                               <i className="ri-close-fill fs-16" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="d-block dropdown-item dropdown-item-cart text-wrap px-3 py-2">
//                         <div className="d-flex align-items-center">
//                           <img
//                             src="/assets/images/products/img-5.png"
//                             className="me-3 rounded-circle avatar-sm p-2 bg-light"
//                             alt="user-pic"
//                           />
//                           <div className="flex-grow-1">
//                             <h6 className="mt-0 mb-1 fs-14">
//                               <a
//                                 href="apps-ecommerce-product-details.html"
//                                 className="text-reset"
//                               >
//                                 Stillbird Helmet
//                               </a>
//                             </h6>
//                             <p className="mb-0 fs-12 text-muted">
//                               Quantity: <span>2 x $495</span>
//                             </p>
//                           </div>
//                           <div className="px-2">
//                             <h5 className="m-0 fw-normal">
//                               $<span className="cart-item-price">990</span>
//                             </h5>
//                           </div>
//                           <div className="ps-2">
//                             <button
//                               type="button"
//                               className="btn btn-icon btn-sm btn-ghost-secondary remove-item-btn"
//                             >
//                               <i className="ri-close-fill fs-16" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div
//                     className="p-3 border-bottom-0 border-start-0 border-end-0 border-dashed border"
//                     id="checkout-elem"
//                   >
//                     <div className="d-flex justify-content-between align-items-center pb-3">
//                       <h5 className="m-0 text-muted">Total:</h5>
//                       <div className="px-2">
//                         <h5 className="m-0" id="cart-item-total">
//                           $1258.58
//                         </h5>
//                       </div>
//                     </div>
//                     <a
//                       href="apps-ecommerce-checkout.html"
//                       className="btn btn-success text-center w-100"
//                     >
//                       Checkout
//                     </a>
//                   </div>
//                 </div>
//               </div>
//               <div className="ms-1 header-item d-none d-sm-flex">
//                 <button
//                   type="button"
//                   className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
//                   data-toggle="fullscreen"
//                 >
//                   <i className="bx bx-fullscreen fs-22" />
//                 </button>
//               </div>
//               <div className="ms-1 header-item d-none d-sm-flex">
//                 <button
//                   type="button"
//                   className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle light-dark-mode"
//                 >
//                   <i className="bx bx-moon fs-22" />
//                 </button>
//               </div>
//               <div
//                 className="dropdown topbar-head-dropdown ms-1 header-item"
//                 id="notificationDropdown"
//               >
//                 <button
//                   type="button"
//                   className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
//                   id="page-header-notifications-dropdown"
//                   data-bs-toggle="dropdown"
//                   data-bs-auto-close="outside"
//                   aria-haspopup="true"
//                   aria-expanded="false"
//                 >
//                   <i className="bx bx-bell fs-22" />
//                   <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
//                     3<span className="visually-hidden">unread messages</span>
//                   </span>
//                 </button>
//                 <div
//                   className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
//                   aria-labelledby="page-header-notifications-dropdown"
//                 >
//                   <div className="dropdown-head bg-primary bg-pattern rounded-top">
//                     <div className="p-3">
//                       <div className="row align-items-center">
//                         <div className="col">
//                           <h6 className="m-0 fs-16 fw-semibold text-white">
//                             {" "}
//                             Notifications{" "}
//                           </h6>
//                         </div>
//                         <div className="col-auto dropdown-tabs">
//                           <span className="badge bg-light-subtle text-body fs-13">
//                             {" "}
//                             4 New
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="px-2 pt-2">
//                       <ul
//                         className="nav nav-tabs dropdown-tabs nav-tabs-custom"
//                         data-dropdown-tabs="true"
//                         id="notificationItemsTab"
//                         role="tablist"
//                       >
//                         <li className="nav-item waves-effect waves-light">
//                           <a
//                             className="nav-link active"
//                             data-bs-toggle="tab"
//                             href="#all-noti-tab"
//                             role="tab"
//                             aria-selected="true"
//                           >
//                             All (4)
//                           </a>
//                         </li>
//                         <li className="nav-item waves-effect waves-light">
//                           <a
//                             className="nav-link"
//                             data-bs-toggle="tab"
//                             href="#messages-tab"
//                             role="tab"
//                             aria-selected="false"
//                           >
//                             Messages
//                           </a>
//                         </li>
//                         <li className="nav-item waves-effect waves-light">
//                           <a
//                             className="nav-link"
//                             data-bs-toggle="tab"
//                             href="#alerts-tab"
//                             role="tab"
//                             aria-selected="false"
//                           >
//                             Alerts
//                           </a>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                   <div
//                     className="tab-content position-relative"
//                     id="notificationItemsTabContent"
//                   >
//                     <div
//                       className="tab-pane fade show active py-2 ps-2"
//                       id="all-noti-tab"
//                       role="tabpanel"
//                     >
//                       <div
//                         data-simplebar=""
//                         style={{ maxHeight: 300 }}
//                         className="pe-2"
//                       >
//                         <div className="text-reset notification-item d-block dropdown-item position-relative">
//                           <div className="d-flex">
//                             <div className="avatar-xs me-3 flex-shrink-0">
//                               <span className="avatar-title bg-info-subtle text-info rounded-circle fs-16">
//                                 <i className="bx bx-badge-check" />
//                               </span>
//                             </div>
//                             <div className="flex-grow-1">
//                               <a href="#!" className="stretched-link">
//                                 <h6 className="mt-0 mb-2 lh-base">
//                                   Your <b>Elite</b> author Graphic Optimization{" "}
//                                   <span className="text-secondary">reward</span>
//                                   is ready!
//                                 </h6>
//                               </a>
//                               <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
//                                 <span>
//                                   <i className="mdi mdi-clock-outline" /> Just 30
//                                   sec ago
//                                 </span>
//                               </p>
//                             </div>
//                             <div className="px-2 fs-15">
//                               <div className="form-check notification-check">
//                                 <input
//                                   className="form-check-input"
//                                   type="checkbox"
//                                   defaultValue=""
//                                   id="all-notification-check01"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="all-notification-check01"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-reset notification-item d-block dropdown-item position-relative">
//                           <div className="d-flex">
//                             <img
//                               src="/assets/images/users/avatar-2.jpg"
//                               className="me-3 rounded-circle avatar-xs flex-shrink-0"
//                               alt="user-pic"
//                             />
//                             <div className="flex-grow-1">
//                               <a href="#!" className="stretched-link">
//                                 <h6 className="mt-0 mb-1 fs-13 fw-semibold">
//                                   Angela Bernier
//                                 </h6>
//                               </a>
//                               <div className="fs-13 text-muted">
//                                 <p className="mb-1">
//                                   Answered to your comment on the cash flow
//                                   forecast's graph 🔔.
//                                 </p>
//                               </div>
//                               <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
//                                 <span>
//                                   <i className="mdi mdi-clock-outline" /> 48 min
//                                   ago
//                                 </span>
//                               </p>
//                             </div>
//                             <div className="px-2 fs-15">
//                               <div className="form-check notification-check">
//                                 <input
//                                   className="form-check-input"
//                                   type="checkbox"
//                                   defaultValue=""
//                                   id="all-notification-check02"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="all-notification-check02"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-reset notification-item d-block dropdown-item position-relative">
//                           <div className="d-flex">
//                             <div className="avatar-xs me-3 flex-shrink-0">
//                               <span className="avatar-title bg-danger-subtle text-danger rounded-circle fs-16">
//                                 <i className="bx bx-message-square-dots" />
//                               </span>
//                             </div>
//                             <div className="flex-grow-1">
//                               <a href="#!" className="stretched-link">
//                                 <h6 className="mt-0 mb-2 fs-13 lh-base">
//                                   You have received{" "}
//                                   <b className="text-success">20</b> new messages
//                                   in the conversation
//                                 </h6>
//                               </a>
//                               <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
//                                 <span>
//                                   <i className="mdi mdi-clock-outline" /> 2 hrs
//                                   ago
//                                 </span>
//                               </p>
//                             </div>
//                             <div className="px-2 fs-15">
//                               <div className="form-check notification-check">
//                                 <input
//                                   className="form-check-input"
//                                   type="checkbox"
//                                   defaultValue=""
//                                   id="all-notification-check03"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="all-notification-check03"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-reset notification-item d-block dropdown-item position-relative">
//                           <div className="d-flex">
//                             <img
//                               src="/assets/images/users/avatar-8.jpg"
//                               className="me-3 rounded-circle avatar-xs flex-shrink-0"
//                               alt="user-pic"
//                             />
//                             <div className="flex-grow-1">
//                               <a href="#!" className="stretched-link">
//                                 <h6 className="mt-0 mb-1 fs-13 fw-semibold">
//                                   Maureen Gibson
//                                 </h6>
//                               </a>
//                               <div className="fs-13 text-muted">
//                                 <p className="mb-1">
//                                   We talked about a project on linkedin.
//                                 </p>
//                               </div>
//                               <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
//                                 <span>
//                                   <i className="mdi mdi-clock-outline" /> 4 hrs
//                                   ago
//                                 </span>
//                               </p>
//                             </div>
//                             <div className="px-2 fs-15">
//                               <div className="form-check notification-check">
//                                 <input
//                                   className="form-check-input"
//                                   type="checkbox"
//                                   defaultValue=""
//                                   id="all-notification-check04"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="all-notification-check04"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="my-3 text-center view-all">
//                           <button
//                             type="button"
//                             className="btn btn-soft-success waves-effect waves-light"
//                           >
//                             View All Notifications{" "}
//                             <i className="ri-arrow-right-line align-middle" />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                     <div
//                       className="tab-pane fade py-2 ps-2"
//                       id="messages-tab"
//                       role="tabpanel"
//                       aria-labelledby="messages-tab"
//                     >
//                       <div
//                         data-simplebar=""
//                         style={{ maxHeight: 300 }}
//                         className="pe-2"
//                       >
//                         <div className="text-reset notification-item d-block dropdown-item">
//                           <div className="d-flex">
//                             <img
//                               src="/assets/images/users/avatar-3.jpg"
//                               className="me-3 rounded-circle avatar-xs"
//                               alt="user-pic"
//                             />
//                             <div className="flex-grow-1">
//                               <a href="#!" className="stretched-link">
//                                 <h6 className="mt-0 mb-1 fs-13 fw-semibold">
//                                   James Lemire
//                                 </h6>
//                               </a>
//                               <div className="fs-13 text-muted">
//                                 <p className="mb-1">
//                                   We talked about a project on linkedin.
//                                 </p>
//                               </div>
//                               <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
//                                 <span>
//                                   <i className="mdi mdi-clock-outline" /> 30 min
//                                   ago
//                                 </span>
//                               </p>
//                             </div>
//                             <div className="px-2 fs-15">
//                               <div className="form-check notification-check">
//                                 <input
//                                   className="form-check-input"
//                                   type="checkbox"
//                                   defaultValue=""
//                                   id="messages-notification-check01"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="messages-notification-check01"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-reset notification-item d-block dropdown-item">
//                           <div className="d-flex">
//                             <img
//                               src="/assets/images/users/avatar-2.jpg"
//                               className="me-3 rounded-circle avatar-xs"
//                               alt="user-pic"
//                             />
//                             <div className="flex-grow-1">
//                               <a href="#!" className="stretched-link">
//                                 <h6 className="mt-0 mb-1 fs-13 fw-semibold">
//                                   Angela Bernier
//                                 </h6>
//                               </a>
//                               <div className="fs-13 text-muted">
//                                 <p className="mb-1">
//                                   Answered to your comment on the cash flow
//                                   forecast's graph 🔔.
//                                 </p>
//                               </div>
//                               <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
//                                 <span>
//                                   <i className="mdi mdi-clock-outline" /> 2 hrs
//                                   ago
//                                 </span>
//                               </p>
//                             </div>
//                             <div className="px-2 fs-15">
//                               <div className="form-check notification-check">
//                                 <input
//                                   className="form-check-input"
//                                   type="checkbox"
//                                   defaultValue=""
//                                   id="messages-notification-check02"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="messages-notification-check02"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-reset notification-item d-block dropdown-item">
//                           <div className="d-flex">
//                             <img
//                               src="/assets/images/users/avatar-6.jpg"
//                               className="me-3 rounded-circle avatar-xs"
//                               alt="user-pic"
//                             />
//                             <div className="flex-grow-1">
//                               <a href="#!" className="stretched-link">
//                                 <h6 className="mt-0 mb-1 fs-13 fw-semibold">
//                                   Kenneth Brown
//                                 </h6>
//                               </a>
//                               <div className="fs-13 text-muted">
//                                 <p className="mb-1">
//                                   Mentionned you in his comment on 📃 invoice
//                                   #12501.
//                                 </p>
//                               </div>
//                               <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
//                                 <span>
//                                   <i className="mdi mdi-clock-outline" /> 10 hrs
//                                   ago
//                                 </span>
//                               </p>
//                             </div>
//                             <div className="px-2 fs-15">
//                               <div className="form-check notification-check">
//                                 <input
//                                   className="form-check-input"
//                                   type="checkbox"
//                                   defaultValue=""
//                                   id="messages-notification-check03"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="messages-notification-check03"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-reset notification-item d-block dropdown-item">
//                           <div className="d-flex">
//                             <img
//                               src="/assets/images/users/avatar-8.jpg"
//                               className="me-3 rounded-circle avatar-xs"
//                               alt="user-pic"
//                             />
//                             <div className="flex-grow-1">
//                               <a href="#!" className="stretched-link">
//                                 <h6 className="mt-0 mb-1 fs-13 fw-semibold">
//                                   Maureen Gibson
//                                 </h6>
//                               </a>
//                               <div className="fs-13 text-muted">
//                                 <p className="mb-1">
//                                   We talked about a project on linkedin.
//                                 </p>
//                               </div>
//                               <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
//                                 <span>
//                                   <i className="mdi mdi-clock-outline" /> 3 days
//                                   ago
//                                 </span>
//                               </p>
//                             </div>
//                             <div className="px-2 fs-15">
//                               <div className="form-check notification-check">
//                                 <input
//                                   className="form-check-input"
//                                   type="checkbox"
//                                   defaultValue=""
//                                   id="messages-notification-check04"
//                                 />
//                                 <label
//                                   className="form-check-label"
//                                   htmlFor="messages-notification-check04"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="my-3 text-center view-all">
//                           <button
//                             type="button"
//                             className="btn btn-soft-success waves-effect waves-light"
//                           >
//                             View All Messages{" "}
//                             <i className="ri-arrow-right-line align-middle" />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                     <div
//                       className="tab-pane fade p-4"
//                       id="alerts-tab"
//                       role="tabpanel"
//                       aria-labelledby="alerts-tab"
//                     />
//                     <div
//                       className="notification-actions"
//                       id="notification-actions"
//                     >
//                       <div className="d-flex text-muted justify-content-center">
//                         Select{" "}
//                         <div
//                           id="select-content"
//                           className="text-body fw-semibold px-1"
//                         >
//                           0
//                         </div>
//                         Result{" "}
//                         <button
//                           type="button"
//                           className="btn btn-link link-danger p-0 ms-3"
//                           data-bs-toggle="modal"
//                           data-bs-target="#removeNotificationModal"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="dropdown ms-sm-3 header-item topbar-user">
//                 <button
//                   type="button"
//                   className="btn"
//                   id="page-header-user-dropdown"
//                   data-bs-toggle="dropdown"
//                   aria-haspopup="true"
//                   aria-expanded="false"
//                 >
//                   <span className="d-flex align-items-center">
//                     <img
//                       className="rounded-circle header-profile-user"
//                       src="/assets/images/users/avatar-1.jpg"
//                       alt="Header Avatar"
//                     />
//                     <span className="text-start ms-xl-2">
//                       <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
//                         Anna Adame
//                       </span>
//                       <span className="d-none d-xl-block ms-1 fs-12 user-name-sub-text">
//                         Founder
//                       </span>
//                     </span>
//                   </span>
//                 </button>
//                 <div className="dropdown-menu dropdown-menu-end">
//                   {/* item*/}
//                   <h6 className="dropdown-header">Welcome Anna!</h6>
//                   <a className="dropdown-item" href="pages-profile.html">
//                     <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1" />{" "}
//                     <span className="align-middle">Profile</span>
//                   </a>
//                   <a className="dropdown-item" href="apps-chat.html">
//                     <i className="mdi mdi-message-text-outline text-muted fs-16 align-middle me-1" />
//                     <span className="align-middle">Messages</span>
//                   </a>
//                   <a className="dropdown-item" href="apps-tasks-kanban.html">
//                     <i className="mdi mdi-calendar-check-outline text-muted fs-16 align-middle me-1" />
//                     <span className="align-middle">Taskboard</span>
//                   </a>
//                   <a className="dropdown-item" href="pages-faqs.html">
//                     <i className="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1" />{" "}
//                     <span className="align-middle">Help</span>
//                   </a>
//                   <div className="dropdown-divider" />
//                   <a className="dropdown-item" href="pages-profile.html">
//                     <i className="mdi mdi-wallet text-muted fs-16 align-middle me-1" />{" "}
//                     <span className="align-middle">
//                       Balance : <b>$5971.67</b>
//                     </span>
//                   </a>
//                   <a className="dropdown-item" href="pages-profile-settings.html">
//                     <span className="badge bg-success-subtle text-success mt-1 float-end">
//                       New
//                     </span>
//                     <i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1" />{" "}
//                     <span className="align-middle">Settings</span>
//                   </a>
//                   <a className="dropdown-item" href="auth-lockscreen-basic.html">
//                     <i className="mdi mdi-lock text-muted fs-16 align-middle me-1" />{" "}
//                     <span className="align-middle">Lock screen</span>
//                   </a>
//                   <a className="dropdown-item" href="#" onClick={logout}>
//                     <i className="mdi mdi-logout text-muted fs-16 align-middle me-1" />{" "}
//                     <span className="align-middle" data-key="t-logout" >
//                       Logout
//                     </span>
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>
//       {/* removeNotificationModal */}
//       <div
//         id="removeNotificationModal"
//         className="modal fade zoomIn"
//         tabIndex={-1}
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-dialog-centered">
//           <div className="modal-content">
//             <div className="modal-header">
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//                 id="NotificationModalbtn-close"
//               />
//             </div>
//             <div className="modal-body">
//               <div className="mt-2 text-center">
//                 <lord-icon
//                   src="https://cdn.lordicon.com/gsqxdxog.json"
//                   trigger="loop"
//                   colors="primary:#f7b84b,secondary:#f06548"
//                   style={{ width: 100, height: 100 }}
//                 />
//                 <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
//                   <h4>Are you sure ?</h4>
//                   <p className="text-muted mx-4 mb-0">
//                     Are you sure you want to remove this Notification ?
//                   </p>
//                 </div>
//               </div>
//               <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
//                 <button
//                   type="button"
//                   className="btn w-sm btn-light"
//                   data-bs-dismiss="modal"
//                 >
//                   Close
//                 </button>
//                 <button
//                   type="button"
//                   className="btn w-sm btn-danger"
//                   id="delete-notification"
//                 >
//                   Yes, Delete It!
//                 </button>
//               </div>
//             </div>
//           </div>
//           {/* /.modal-content */}
//         </div>
//         {/* /.modal-dialog */}
//       </div>
//     </>
//   )
// }



import React from 'react'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../../../Store/feature/Auth/authslice'

export default function TopBar({ user }) {
  const dispatch = useDispatch()
  const logout = async () => {
    dispatch(logoutUser())
  }
  return (
    <>
      <header className="nxl-header">
        <div className="header-wrapper">
          <div className="header-left d-flex align-items-center gap-4">
            <a
              href="javascript:void(0);"
              className="nxl-head-mobile-toggler"
              id="mobile-collapse"
            >
              <div className="hamburger hamburger--arrowturn">
                <div className="hamburger-box">
                  <div className="hamburger-inner" />
                </div>
              </div>
            </a>

            <div className="nxl-navigation-toggle">
              <a href="javascript:void(0);" id="menu-mini-button">
                <i className="feather-align-left" />
              </a>
              <a
                href="javascript:void(0);"
                id="menu-expend-button"
                style={{ display: "none" }}
              >
                <i className="feather-arrow-right" />
              </a>
            </div>

            <div className="nxl-lavel-mega-menu-toggle d-flex d-lg-none">
              <a href="javascript:void(0);" id="nxl-lavel-mega-menu-open">
                <i className="feather-align-left" />
              </a>
            </div>

            <div className="nxl-drp-link nxl-lavel-mega-menu">
              <div className="nxl-lavel-mega-menu-toggle d-flex d-lg-none">
                <a href="javascript:void(0)" id="nxl-lavel-mega-menu-hide">
                  <i className="feather-arrow-left me-2" />
                  <span>Back</span>
                </a>
              </div>
              <div className="nxl-lavel-mega-menu-wrapper d-flex gap-3">
                <div className="dropdown nxl-h-item nxl-lavel-menu">
                  <a
                    href="javascript:void(0);"
                    className="avatar-text avatar-md bg-primary text-white"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                  >
                    <i className="feather-plus" />
                  </a>
                  <div className="dropdown-menu nxl-h-dropdown">
                    <div className="dropdown nxl-level-menu">
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="feather-send" />
                          <span>Applications</span>
                        </span>
                        <i className="feather-chevron-right ms-auto me-0" />
                      </a>
                      <div className="dropdown-menu nxl-h-dropdown">
                        <a href="apps-chat.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Chat</span>
                        </a>
                        <a href="apps-email.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Email</span>
                        </a>
                        <a href="apps-tasks.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Tasks</span>
                        </a>
                        <a href="apps-notes.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Notes</span>
                        </a>
                        <a href="apps-storage.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Storage</span>
                        </a>
                        <a href="apps-calendar.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Calendar</span>
                        </a>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <div className="dropdown nxl-level-menu">
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="feather-cast" />
                          <span>Reports</span>
                        </span>
                        <i className="feather-chevron-right ms-auto me-0" />
                      </a>
                      <div className="dropdown-menu nxl-h-dropdown">
                        <a href="reports-sales.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Sales Report</span>
                        </a>
                        <a href="reports-leads.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Leads Report</span>
                        </a>
                        <a href="reports-project.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Project Report</span>
                        </a>
                        <a href="reports-timesheets.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Timesheets Report</span>
                        </a>
                      </div>
                    </div>
                    <div className="dropdown nxl-level-menu">
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="feather-at-sign" />
                          <span>Proposal</span>
                        </span>
                        <i className="feather-chevron-right ms-auto me-0" />
                      </a>
                      <div className="dropdown-menu nxl-h-dropdown">
                        <a href="proposal.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Proposal</span>
                        </a>
                        <a href="proposal-view.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Proposal View</span>
                        </a>
                        <a href="proposal-edit.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Proposal Edit</span>
                        </a>
                        <a href="proposal-create.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Proposal Create</span>
                        </a>
                      </div>
                    </div>
                    <div className="dropdown nxl-level-menu">
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="feather-dollar-sign" />
                          <span>Payment</span>
                        </span>
                        <i className="feather-chevron-right ms-auto me-0" />
                      </a>
                      <div className="dropdown-menu nxl-h-dropdown">
                        <a href="payment.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Payment</span>
                        </a>
                        <a href="invoice-view.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Invoice View</span>
                        </a>
                        <a href="invoice-create.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Invoice Create</span>
                        </a>
                      </div>
                    </div>
                    <div className="dropdown nxl-level-menu">
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="feather-users" />
                          <span>Customers</span>
                        </span>
                        <i className="feather-chevron-right ms-auto me-0" />
                      </a>
                      <div className="dropdown-menu nxl-h-dropdown">
                        <a href="customers.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Customers</span>
                        </a>
                        <a href="customers-view.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Customers View</span>
                        </a>
                        <a href="customers-create.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Customers Create</span>
                        </a>
                      </div>
                    </div>
                    <div className="dropdown nxl-level-menu">
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="feather-alert-circle" />
                          <span>Leads</span>
                        </span>
                        <i className="feather-chevron-right ms-auto me-0" />
                      </a>
                      <div className="dropdown-menu nxl-h-dropdown">
                        <a href="leads.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Leads</span>
                        </a>
                        <a href="leads-view.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Leads View</span>
                        </a>
                        <a href="leads-create.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Leads Create</span>
                        </a>
                      </div>
                    </div>
                    <div className="dropdown nxl-level-menu">
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="feather-briefcase" />
                          <span>Projects</span>
                        </span>
                        <i className="feather-chevron-right ms-auto me-0" />
                      </a>
                      <div className="dropdown-menu nxl-h-dropdown">
                        <a href="projects.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Projects</span>
                        </a>
                        <a href="projects-view.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Projects View</span>
                        </a>
                        <a href="projects-create.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Projects Create</span>
                        </a>
                      </div>
                    </div>
                    <div className="dropdown nxl-level-menu">
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="feather-layout" />
                          <span>Widgets</span>
                        </span>
                        <i className="feather-chevron-right ms-auto me-0" />
                      </a>
                      <div className="dropdown-menu nxl-h-dropdown">
                        <a href="widgets-lists.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Lists</span>
                        </a>
                        <a href="widgets-tables.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Tables</span>
                        </a>
                        <a href="widgets-charts.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Charts</span>
                        </a>
                        <a href="widgets-statistics.html" className="dropdown-item">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Statistics</span>
                        </a>
                      </div>
                    </div>
                    <div className="dropdown nxl-level-menu">
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="feather-power" />
                          <span>Authentication</span>
                        </span>
                        <i className="feather-chevron-right ms-auto me-0" />
                      </a>
                      <div className="dropdown-menu nxl-h-dropdown">
                        <div className="dropdown nxl-level-menu">
                          <a href="javascript:void(0);" className="dropdown-item">
                            <span className="hstack">
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Login</span>
                            </span>
                            <i className="feather-chevron-right ms-auto me-0" />
                          </a>
                          <div className="dropdown-menu nxl-h-dropdown">
                            <a
                              href="./auth-login-cover.html"
                              className="dropdown-item"
                            >
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Cover</span>
                            </a>
                            <a
                              href="./auth-login-minimal.html"
                              className="dropdown-item"
                            >
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Minimal</span>
                            </a>
                            <a
                              href="./auth-login-creative.html"
                              className="dropdown-item"
                            >
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Creative</span>
                            </a>
                          </div>
                        </div>
                        <div className="dropdown nxl-level-menu">
                          <a href="javascript:void(0);" className="dropdown-item">
                            <span className="hstack">
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Register</span>
                            </span>
                            <i className="feather-chevron-right ms-auto me-0" />
                          </a>
                          <div className="dropdown-menu nxl-h-dropdown">
                            <a
                              href="./auth-register-cover.html"
                              className="dropdown-item"
                            >
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Cover</span>
                            </a>
                            <a
                              href="./auth-register-minimal.html"
                              className="dropdown-item"
                            >
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Minimal</span>
                            </a>
                            <a
                              href="./auth-register-creative.html"
                              className="dropdown-item"
                            >
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Creative</span>
                            </a>
                          </div>
                        </div>
                        <div className="dropdown nxl-level-menu">
                          <a href="javascript:void(0);" className="dropdown-item">
                            <span className="hstack">
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Error-404</span>
                            </span>
                            <i className="feather-chevron-right ms-auto me-0" />
                          </a>
                          <div className="dropdown-menu nxl-h-dropdown">
                            <a
                              href="./auth-404-cover.html"
                              className="dropdown-item"
                            >
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Cover</span>
                            </a>
                            <a
                              href="./auth-404-minimal.html"
                              className="dropdown-item"
                            >
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Minimal</span>
                            </a>
                            <a
                              href="./auth-404-creative.html"
                              className="dropdown-item"
                            >
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Creative</span>
                            </a>
                          </div>
                        </div>
                        <div className="dropdown nxl-level-menu">
                          <a href="javascript:void(0);" className="dropdown-item">
                            <span className="hstack">
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Reset Pass</span>
                            </span>
                            <i className="feather-chevron-right ms-auto me-0" />
                          </a>
                          <div className="dropdown-menu nxl-h-dropdown">
                            <a
                              href="./auth-reset-cover.html"
                              className="dropdown-item"
                            >
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Cover</span>
                            </a>
                            <a
                              href="./auth-reset-minimal.html"
                              className="dropdown-item"
                            >
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Minimal</span>
                            </a>
                            <a
                              href="./auth-reset-creative.html"
                              className="dropdown-item"
                            >
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Creative</span>
                            </a>
                          </div>
                        </div>
                        <div className="dropdown nxl-level-menu">
                          <a href="javascript:void(0);" className="dropdown-item">
                            <span className="hstack">
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Verify OTP</span>
                            </span>
                            <i className="feather-chevron-right ms-auto me-0" />
                          </a>
                          <div className="dropdown-menu nxl-h-dropdown">
                            <a
                              href="./auth-verify-cover.html"
                              className="dropdown-item"
                            >
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Cover</span>
                            </a>
                            <a
                              href="./auth-verify-minimal.html"
                              className="dropdown-item"
                            >
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Minimal</span>
                            </a>
                            <a
                              href="./auth-verify-creative.html"
                              className="dropdown-item"
                            >
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Creative</span>
                            </a>
                          </div>
                        </div>
                        <div className="dropdown nxl-level-menu">
                          <a href="javascript:void(0);" className="dropdown-item">
                            <span className="hstack">
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Maintenance</span>
                            </span>
                            <i className="feather-chevron-right ms-auto me-0" />
                          </a>
                          <div className="dropdown-menu nxl-h-dropdown">
                            <a
                              href="./auth-maintenance-cover.html"
                              className="dropdown-item"
                            >
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Cover</span>
                            </a>
                            <a
                              href="./auth-maintenance-minimal.html"
                              className="dropdown-item"
                            >
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Minimal</span>
                            </a>
                            <a
                              href="./auth-maintenance-creative.html"
                              className="dropdown-item"
                            >
                              <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                              <span>Creative</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <a href="javascript:void(0);" className="dropdown-item">
                      <i className="feather-plus" />
                      <span>Add New Items</span>
                    </a>
                  </div>
                </div>
                {/*! [End] nxl-lavel-menu !*/}
                {/*! [Start] nxl-h-item nxl-mega-menu !*/}
                <div className="dropdown nxl-h-item nxl-mega-menu">
                  <a
                    href="javascript:void(0);"
                    className="btn btn-light-brand"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                  >
                    {" "}
                    Mega Menu{" "}
                  </a>
                  <div
                    className="dropdown-menu nxl-h-dropdown"
                    id="mega-menu-dropdown"
                  >
                    <div className="d-lg-flex align-items-start">
                      {/*! [Start] nxl-mega-menu-tabs !*/}
                      <div
                        className="nav flex-column nxl-mega-menu-tabs"
                        role="tablist"
                        aria-orientation="vertical"
                      >
                        <button
                          className="nav-link active nxl-mega-menu-sm"
                          data-bs-toggle="pill"
                          data-bs-target="#v-pills-general"
                          type="button"
                          role="tab"
                        >
                          <span className="menu-icon">
                            <i className="feather-airplay" />
                          </span>
                          <span className="menu-title">General</span>
                          <span className="menu-arrow">
                            <i className="feather-chevron-right" />
                          </span>
                        </button>
                        <button
                          className="nav-link nxl-mega-menu-md"
                          data-bs-toggle="pill"
                          data-bs-target="#v-pills-applications"
                          type="button"
                          role="tab"
                        >
                          <span className="menu-icon">
                            <i className="feather-send" />
                          </span>
                          <span className="menu-title">Applications</span>
                          <span className="menu-arrow">
                            <i className="feather-chevron-right" />
                          </span>
                        </button>
                        <button
                          className="nav-link nxl-mega-menu-lg"
                          data-bs-toggle="pill"
                          data-bs-target="#v-pills-integrations"
                          type="button"
                          role="tab"
                        >
                          <span className="menu-icon">
                            <i className="feather-link-2" />
                          </span>
                          <span className="menu-title">Integrations</span>
                          <span className="menu-arrow">
                            <i className="feather-chevron-right" />
                          </span>
                        </button>
                        <button
                          className="nav-link nxl-mega-menu-xl"
                          data-bs-toggle="pill"
                          data-bs-target="#v-pills-components"
                          type="button"
                          role="tab"
                        >
                          <span className="menu-icon">
                            <i className="feather-layers" />
                          </span>
                          <span className="menu-title">Components</span>
                          <span className="menu-arrow">
                            <i className="feather-chevron-right" />
                          </span>
                        </button>
                        <button
                          className="nav-link nxl-mega-menu-xxl"
                          data-bs-toggle="pill"
                          data-bs-target="#v-pills-authentication"
                          type="button"
                          role="tab"
                        >
                          <span className="menu-icon">
                            <i className="feather-cpu" />
                          </span>
                          <span className="menu-title">Authentication</span>
                          <span className="menu-arrow">
                            <i className="feather-chevron-right" />
                          </span>
                        </button>
                        <button
                          className="nav-link nxl-mega-menu-full"
                          data-bs-toggle="pill"
                          data-bs-target="#v-pills-miscellaneous"
                          type="button"
                          role="tab"
                        >
                          <span className="menu-icon">
                            <i className="feather-bluetooth" />
                          </span>
                          <span className="menu-title">Miscellaneous</span>
                          <span className="menu-arrow">
                            <i className="feather-chevron-right" />
                          </span>
                        </button>
                      </div>
                      {/*! [End] nxl-mega-menu-tabs !*/}
                      {/*! [Start] nxl-mega-menu-tabs-content !*/}
                      <div className="tab-content nxl-mega-menu-tabs-content">
                        {/*! [Start] v-pills-general !*/}
                        <div
                          className="tab-pane fade show active"
                          id="v-pills-general"
                          role="tabpanel"
                        >
                          <div className="mb-4 rounded-3 border">
                            <img
                              src="assets/images/banner/mockup.png"
                              alt=""
                              className="img-fluid rounded-3"
                            />
                          </div>
                          <h6 className="fw-bolder">
                            Duralux - Admin Dashboard UiKit
                          </h6>
                          <p className="fs-12 fw-normal text-muted text-truncate-3-line">
                            Get started Duralux with Duralux up and running. Duralux
                            bootstrap template docs helps you to get started with
                            simple html codes.
                          </p>
                          <a
                            href="javascript:void(0);"
                            className="fs-13 fw-bold text-primary"
                          >
                            Get Started →
                          </a>
                        </div>
                        {/*! [End] v-pills-general !*/}
                        {/*! [Start] v-pills-applications !*/}
                        <div
                          className="tab-pane fade"
                          id="v-pills-applications"
                          role="tabpanel"
                        >
                          <div className="row g-4">
                            <div className="col-lg-6">
                              <h6 className="dropdown-item-title">Applications</h6>
                              <a href="apps-chat.html" className="dropdown-item">
                                <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                <span>Chat</span>
                              </a>
                              <a href="apps-email.html" className="dropdown-item">
                                <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                <span>Email</span>
                              </a>
                              <a href="apps-tasks.html" className="dropdown-item">
                                <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                <span>Tasks</span>
                              </a>
                              <a href="apps-notes.html" className="dropdown-item">
                                <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                <span>Notes</span>
                              </a>
                              <a href="apps-storage.html" className="dropdown-item">
                                <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                <span>Storage</span>
                              </a>
                              <a
                                href="apps-calendar.html"
                                className="dropdown-item"
                              >
                                <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                <span>Calendar</span>
                              </a>
                            </div>
                            <div className="col-lg-6">
                              <div className="nxl-mega-menu-image">
                                <img
                                  src="assets/images/general/full-avatar.png"
                                  alt=""
                                  className="img-fluid full-user-avtar"
                                />
                              </div>
                            </div>
                          </div>
                          <hr className="border-top-dashed" />
                          <div className="d-lg-flex align-items-center justify-content-between">
                            <div>
                              <h6 className="menu-item-heading text-truncate-1-line">
                                Need more application?
                              </h6>
                              <p className="fs-12 text-muted mb-0 text-truncate-3-line">
                                We are ready to build custom applications.
                              </p>
                            </div>
                            <div className="mt-2 mt-lg-0">
                              <a
                                href="mailto:theme_ocean@example.com"
                                className="fs-13 fw-bold text-primary"
                              >
                                Contact Us →
                              </a>
                            </div>
                          </div>
                        </div>
                        {/*! [End] v-pills-applications !*/}
                        {/*! [Start] v-pills-integrations !*/}
                        <div
                          className="tab-pane fade"
                          id="v-pills-integrations"
                          role="tabpanel"
                        >
                          <div className="row g-lg-4 nxl-mega-menu-integrations">
                            <div className="col-lg-12 d-lg-flex align-items-center justify-content-between mb-4 mb-lg-0">
                              <div>
                                <h6 className="fw-bolder text-dark">
                                  Integrations
                                </h6>
                                <p className="fs-12 text-muted mb-0">
                                  Connect amazing apps on your bucket.
                                </p>
                              </div>
                              <div className="mt-2 mt-lg-0">
                                <a
                                  href="javascript:void(0);"
                                  className="fs-13 text-primary"
                                >
                                  Add New →
                                </a>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <a
                                href="javascript:void(0);"
                                className="dropdown-item"
                              >
                                <div className="menu-item-icon">
                                  <img
                                    src="assets/images/brand/app-store.png"
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="menu-item-title">App Store</div>
                                <div className="menu-item-arrow">
                                  <i className="feather-arrow-right" />
                                </div>
                              </a>
                              <a
                                href="javascript:void(0);"
                                className="dropdown-item"
                              >
                                <div className="menu-item-icon">
                                  <img
                                    src="assets/images/brand/spotify.png"
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="menu-item-title">Spotify</div>
                                <div className="menu-item-arrow">
                                  <i className="feather-arrow-right" />
                                </div>
                              </a>
                              <a
                                href="javascript:void(0);"
                                className="dropdown-item"
                              >
                                <div className="menu-item-icon">
                                  <img
                                    src="assets/images/brand/figma.png"
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="menu-item-title">Figma</div>
                                <div className="menu-item-arrow">
                                  <i className="feather-arrow-right" />
                                </div>
                              </a>
                              <a
                                href="javascript:void(0);"
                                className="dropdown-item"
                              >
                                <div className="menu-item-icon">
                                  <img
                                    src="assets/images/brand/shopify.png"
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="menu-item-title">Shopify</div>
                                <div className="menu-item-arrow">
                                  <i className="feather-arrow-right" />
                                </div>
                              </a>
                              <a
                                href="javascript:void(0);"
                                className="dropdown-item"
                              >
                                <div className="menu-item-icon">
                                  <img
                                    src="assets/images/brand/paypal.png"
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="menu-item-title">Paypal</div>
                                <div className="menu-item-arrow">
                                  <i className="feather-arrow-right" />
                                </div>
                              </a>
                            </div>
                            <div className="col-lg-4">
                              <a
                                href="javascript:void(0);"
                                className="dropdown-item"
                              >
                                <div className="menu-item-icon">
                                  <img
                                    src="assets/images/brand/gmail.png"
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="menu-item-title">Gmail</div>
                                <div className="menu-item-arrow">
                                  <i className="feather-arrow-right" />
                                </div>
                              </a>
                              <a
                                href="javascript:void(0);"
                                className="dropdown-item"
                              >
                                <div className="menu-item-icon">
                                  <img
                                    src="assets/images/brand/dropbox.png"
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="menu-item-title">Dropbox</div>
                                <div className="menu-item-arrow">
                                  <i className="feather-arrow-right" />
                                </div>
                              </a>
                              <a
                                href="javascript:void(0);"
                                className="dropdown-item"
                              >
                                <div className="menu-item-icon">
                                  <img
                                    src="assets/images/brand/google-drive.png"
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="menu-item-title">Google Drive</div>
                                <div className="menu-item-arrow">
                                  <i className="feather-arrow-right" />
                                </div>
                              </a>
                              <a
                                href="javascript:void(0);"
                                className="dropdown-item"
                              >
                                <div className="menu-item-icon">
                                  <img
                                    src="assets/images/brand/github.png"
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="menu-item-title">Github</div>
                                <div className="menu-item-arrow">
                                  <i className="feather-arrow-right" />
                                </div>
                              </a>
                              <a
                                href="javascript:void(0);"
                                className="dropdown-item"
                              >
                                <div className="menu-item-icon">
                                  <img
                                    src="assets/images/brand/gitlab.png"
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="menu-item-title">Gitlab</div>
                                <div className="menu-item-arrow">
                                  <i className="feather-arrow-right" />
                                </div>
                              </a>
                            </div>
                            <div className="col-lg-4">
                              <a
                                href="javascript:void(0);"
                                className="dropdown-item"
                              >
                                <div className="menu-item-icon">
                                  <img
                                    src="assets/images/brand/facebook.png"
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="menu-item-title">Facebook</div>
                                <div className="menu-item-arrow">
                                  <i className="feather-arrow-right" />
                                </div>
                              </a>
                              <a
                                href="javascript:void(0);"
                                className="dropdown-item"
                              >
                                <div className="menu-item-icon">
                                  <img
                                    src="assets/images/brand/pinterest.png"
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="menu-item-title">Pinterest</div>
                                <div className="menu-item-arrow">
                                  <i className="feather-arrow-right" />
                                </div>
                              </a>
                              <a
                                href="javascript:void(0);"
                                className="dropdown-item"
                              >
                                <div className="menu-item-icon">
                                  <img
                                    src="assets/images/brand/instagram.png"
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="menu-item-title">Instagram</div>
                                <div className="menu-item-arrow">
                                  <i className="feather-arrow-right" />
                                </div>
                              </a>
                              <a
                                href="javascript:void(0);"
                                className="dropdown-item"
                              >
                                <div className="menu-item-icon">
                                  <img
                                    src="assets/images/brand/twitter.png"
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="menu-item-title">Twitter</div>
                                <div className="menu-item-arrow">
                                  <i className="feather-arrow-right" />
                                </div>
                              </a>
                              <a
                                href="javascript:void(0);"
                                className="dropdown-item"
                              >
                                <div className="menu-item-icon">
                                  <img
                                    src="assets/images/brand/youtube.png"
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="menu-item-title">Youtube</div>
                                <div className="menu-item-arrow">
                                  <i className="feather-arrow-right" />
                                </div>
                              </a>
                            </div>
                          </div>
                          <hr className="border-top-dashed" />
                          <p className="fs-13 text-muted mb-0">
                            Need help? Contact our{" "}
                            <a href="javascript:void(0);" className="fst-italic">
                              support center
                            </a>
                          </p>
                        </div>
                        {/*! [End] v-pills-integrations !*/}
                        {/*! [Start] v-pills-components !*/}
                        <div
                          className="tab-pane fade"
                          id="v-pills-components"
                          role="tabpanel"
                        >
                          <div className="row g-4 align-items-center">
                            <div className="col-xl-8">
                              <div className="row g-4">
                                <div className="col-lg-4">
                                  <h6 className="dropdown-item-title">
                                    Navigation
                                  </h6>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    CRM
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Analytics
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Sales
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Leads
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Projects
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Timesheets
                                  </a>
                                </div>
                                <div className="col-lg-4">
                                  <h6 className="dropdown-item-title">Pages</h6>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Leads{" "}
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Payments
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Projects
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Proposals
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Customers
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Documentations
                                  </a>
                                </div>
                                <div className="col-lg-4">
                                  <h6 className="dropdown-item-title">
                                    Authentication
                                  </h6>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Login
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Regiser
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Error-404
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Reset Pass
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Verify OTP
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Maintenance
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-4">
                              <div className="nxl-mega-menu-image">
                                <img
                                  src="assets/images/banner/1.jpg"
                                  alt=""
                                  className="img-fluid"
                                />
                              </div>
                              <div className="mt-4">
                                <a
                                  href="mailto:theme_ocean@example.com"
                                  className="fs-13 fw-bold"
                                >
                                  View all resources on Duralux →
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/*! [End] v-pills-components !*/}
                        {/*! [Start] v-pills-authentication !*/}
                        <div
                          className="tab-pane fade"
                          id="v-pills-authentication"
                          role="tabpanel"
                        >
                          <div className="row g-4 align-items-center nxl-mega-menu-authentication">
                            <div className="col-xl-8">
                              <div className="row g-4">
                                <div className="col-lg-4">
                                  <h6 className="dropdown-item-title">Cover</h6>
                                  <a
                                    href="./auth-login-cover.html"
                                    className="dropdown-item"
                                  >
                                    <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                    <span>Login</span>
                                  </a>
                                  <a
                                    href="./auth-register-cover.html"
                                    className="dropdown-item"
                                  >
                                    <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                    <span>Register</span>
                                  </a>
                                  <a
                                    href="./auth-404-cover.html"
                                    className="dropdown-item"
                                  >
                                    <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                    <span>Error-404</span>
                                  </a>
                                  <a
                                    href="./auth-reset-cover.html"
                                    className="dropdown-item"
                                  >
                                    <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                    <span>Reset Pass</span>
                                  </a>
                                  <a
                                    href="./auth-verify-cover.html"
                                    className="dropdown-item"
                                  >
                                    <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                    <span>Verify OTP</span>
                                  </a>
                                  <a
                                    href="./auth-maintenance-cover.html"
                                    className="dropdown-item"
                                  >
                                    <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                    <span>Maintenance</span>
                                  </a>
                                </div>
                                <div className="col-lg-4">
                                  <h6 className="dropdown-item-title">Minimal</h6>
                                  <a
                                    href="./auth-login-minimal.html"
                                    className="dropdown-item"
                                  >
                                    <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                    <span>Login</span>
                                  </a>
                                  <a
                                    href="./auth-register-minimal.html"
                                    className="dropdown-item"
                                  >
                                    <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                    <span>Register</span>
                                  </a>
                                  <a
                                    href="./auth-404-minimal.html"
                                    className="dropdown-item"
                                  >
                                    <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                    <span>Error-404</span>
                                  </a>
                                  <a
                                    href="./auth-reset-minimal.html"
                                    className="dropdown-item"
                                  >
                                    <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                    <span>Reset Pass</span>
                                  </a>
                                  <a
                                    href="./auth-verify-minimal.html"
                                    className="dropdown-item"
                                  >
                                    <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                    <span>Verify OTP</span>
                                  </a>
                                  <a
                                    href="./auth-maintenance-minimal.html"
                                    className="dropdown-item"
                                  >
                                    <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                    <span>Maintenance</span>
                                  </a>
                                </div>
                                <div className="col-lg-4">
                                  <h6 className="dropdown-item-title">Creative</h6>
                                  <a
                                    href="./auth-login-creative.html"
                                    className="dropdown-item"
                                  >
                                    <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                    <span>Login</span>
                                  </a>
                                  <a
                                    href="./auth-register-creative.html"
                                    className="dropdown-item"
                                  >
                                    <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                    <span>Register</span>
                                  </a>
                                  <a
                                    href="./auth-404-creative.html"
                                    className="dropdown-item"
                                  >
                                    <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                    <span>Error-404</span>
                                  </a>
                                  <a
                                    href="./auth-reset-creative.html"
                                    className="dropdown-item"
                                  >
                                    <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                    <span>Reset Pass</span>
                                  </a>
                                  <a
                                    href="./auth-verify-creative.html"
                                    className="dropdown-item"
                                  >
                                    <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                    <span>Verify OTP</span>
                                  </a>
                                  <a
                                    href="./auth-maintenance-creative.html"
                                    className="dropdown-item"
                                  >
                                    <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                                    <span>Maintenance</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-4">
                              <div
                                id="carouselResourcesCaptions"
                                className="carousel slide"
                                data-bs-ride="carousel"
                              >
                                <div className="carousel-indicators">
                                  <button
                                    type="button"
                                    data-bs-target="#carouselResourcesCaptions"
                                    data-bs-slide-to={0}
                                    className="active"
                                    aria-current="true"
                                  />
                                  <button
                                    type="button"
                                    data-bs-target="#carouselResourcesCaptions"
                                    data-bs-slide-to={1}
                                  />
                                  <button
                                    type="button"
                                    data-bs-target="#carouselResourcesCaptions"
                                    data-bs-slide-to={2}
                                  />
                                  <button
                                    type="button"
                                    data-bs-target="#carouselResourcesCaptions"
                                    data-bs-slide-to={3}
                                  />
                                  <button
                                    type="button"
                                    data-bs-target="#carouselResourcesCaptions"
                                    data-bs-slide-to={4}
                                  />
                                  <button
                                    type="button"
                                    data-bs-target="#carouselResourcesCaptions"
                                    data-bs-slide-to={5}
                                  />
                                </div>
                                <div className="carousel-inner rounded-3">
                                  <div className="carousel-item active">
                                    <div className="nxl-mega-menu-image">
                                      <img
                                        src="assets/images/banner/6.jpg"
                                        alt=""
                                        className="img-fluid d-block w-100"
                                      />
                                    </div>
                                    <div className="carousel-caption">
                                      <h5 className="carousel-caption-title text-truncate-1-line">
                                        Shopify eCommerce Store
                                      </h5>
                                      <p className="carousel-caption-desc">
                                        Some representative placeholder content for
                                        the first slide.
                                      </p>
                                    </div>
                                  </div>
                                  <div className="carousel-item">
                                    <div className="nxl-mega-menu-image">
                                      <img
                                        src="assets/images/banner/5.jpg"
                                        alt=""
                                        className="img-fluid d-block w-100"
                                      />
                                    </div>
                                    <div className="carousel-caption">
                                      <h5 className="carousel-caption-title text-truncate-1-line">
                                        iOS Apps Development
                                      </h5>
                                      <p className="carousel-caption-desc">
                                        Some representative placeholder content for
                                        the second slide.
                                      </p>
                                    </div>
                                  </div>
                                  <div className="carousel-item">
                                    <div className="nxl-mega-menu-image">
                                      <img
                                        src="assets/images/banner/4.jpg"
                                        alt=""
                                        className="img-fluid d-block w-100"
                                      />
                                    </div>
                                    <div className="carousel-caption">
                                      <h5 className="carousel-caption-title text-truncate-1-line">
                                        Figma Dashboard Design
                                      </h5>
                                      <p className="carousel-caption-desc">
                                        Some representative placeholder content for
                                        the third slide.
                                      </p>
                                    </div>
                                  </div>
                                  <div className="carousel-item">
                                    <div className="nxl-mega-menu-image">
                                      <img
                                        src="assets/images/banner/3.jpg"
                                        alt=""
                                        className="img-fluid d-block w-100"
                                      />
                                    </div>
                                    <div className="carousel-caption">
                                      <h5 className="carousel-caption-title text-truncate-1-line">
                                        React Dashboard Design
                                      </h5>
                                      <p className="carousel-caption-desc">
                                        Some representative placeholder content for
                                        the third slide.
                                      </p>
                                    </div>
                                  </div>
                                  <div className="carousel-item">
                                    <div className="nxl-mega-menu-image">
                                      <img
                                        src="assets/images/banner/2.jpg"
                                        alt=""
                                        className="img-fluid d-block w-100"
                                      />
                                    </div>
                                    <div className="carousel-caption">
                                      <h5 className="carousel-caption-title text-truncate-1-line">
                                        Standup Team Meeting
                                      </h5>
                                      <p className="carousel-caption-desc">
                                        Some representative placeholder content for
                                        the third slide.
                                      </p>
                                    </div>
                                  </div>
                                  <div className="carousel-item">
                                    <div className="nxl-mega-menu-image">
                                      <img
                                        src="assets/images/banner/1.jpg"
                                        alt=""
                                        className="img-fluid d-block w-100"
                                      />
                                    </div>
                                    <div className="carousel-caption">
                                      <h5 className="carousel-caption-title text-truncate-1-line">
                                        Zoom Team Meeting
                                      </h5>
                                      <p className="carousel-caption-desc">
                                        Some representative placeholder content for
                                        the third slide.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  className="carousel-control-prev"
                                  type="button"
                                  data-bs-target="#carouselResourcesCaptions"
                                  data-bs-slide="prev"
                                >
                                  <span
                                    className="carousel-control-prev-icon"
                                    aria-hidden="true"
                                  />
                                  <span className="visually-hidden">Previous</span>
                                </button>
                                <button
                                  className="carousel-control-next"
                                  type="button"
                                  data-bs-target="#carouselResourcesCaptions"
                                  data-bs-slide="next"
                                >
                                  <span
                                    className="carousel-control-next-icon"
                                    aria-hidden="true"
                                  />
                                  <span className="visually-hidden">Next</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/*! [End] v-pills-authentication !*/}
                        {/*! [Start] v-pills-miscellaneous !*/}
                        <div
                          className="tab-pane fade nxl-mega-menu-miscellaneous"
                          id="v-pills-miscellaneous"
                          role="tabpanel"
                        >
                          {/* Nav tabs */}
                          <ul
                            className="nav nav-tabs flex-column flex-lg-row nxl-mega-menu-miscellaneous-tabs"
                            role="tablist"
                          >
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link active"
                                data-bs-toggle="tab"
                                data-bs-target="#v-pills-projects"
                                type="button"
                                role="tab"
                              >
                                <span className="menu-icon">
                                  <i className="feather-cast" />
                                </span>
                                <span className="menu-title">Projects</span>
                              </button>
                            </li>
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link"
                                data-bs-toggle="tab"
                                data-bs-target="#v-pills-services"
                                type="button"
                                role="tab"
                              >
                                <span className="menu-icon">
                                  <i className="feather-check-square" />
                                </span>
                                <span className="menu-title">Services</span>
                              </button>
                            </li>
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link"
                                data-bs-toggle="tab"
                                data-bs-target="#v-pills-features"
                                type="button"
                                role="tab"
                              >
                                <span className="menu-icon">
                                  <i className="feather-airplay" />
                                </span>
                                <span className="menu-title">Features</span>
                              </button>
                            </li>
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link"
                                data-bs-toggle="tab"
                                data-bs-target="#v-pills-blogs"
                                type="button"
                                role="tab"
                              >
                                <span className="menu-icon">
                                  <i className="feather-bold" />
                                </span>
                                <span className="menu-title">Blogs</span>
                              </button>
                            </li>
                          </ul>
                          {/* Tab panes */}
                          <div className="tab-content nxl-mega-menu-miscellaneous-content">
                            <div
                              className="tab-pane fade active show"
                              id="v-pills-projects"
                              role="tabpanel"
                            >
                              <div className="row g-4">
                                <div className="col-xxl-2 d-lg-none d-xxl-block">
                                  <h6 className="dropdown-item-title">
                                    Categories
                                  </h6>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Support
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Services
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Applicatios
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    eCommerce
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Development
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Miscellaneous
                                  </a>
                                </div>
                                <div className="col-xxl-10">
                                  <div className="row g-4">
                                    <div className="col-xl-6">
                                      <div className="d-lg-flex align-items-center gap-3">
                                        <div className="wd-150 rounded-3">
                                          <img
                                            src="assets/images/banner/1.jpg"
                                            alt=""
                                            className="img-fluid rounded-3"
                                          />
                                        </div>
                                        <div className="mt-3 mt-lg-0 ms-lg-3 item-text">
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              Shopify eCommerce Store
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum dolor sit amet, consectetur
                                            adipisicing elit. Sint nam ullam iure
                                            eum sed rerum libero quis doloremque
                                            maiores veritatis?
                                          </p>
                                          <div className="hstack gap-2 mt-3">
                                            <div className="avatar-image avatar-sm">
                                              <img
                                                src="assets/images/avatar/1.png"
                                                alt=""
                                                className="img-fluid"
                                              />
                                            </div>
                                            <a
                                              href="javascript:void(0);"
                                              className="fs-12"
                                            >
                                              Alexandra Della
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-xl-6">
                                      <div className="d-lg-flex align-items-center gap-3">
                                        <div className="wd-150 rounded-3">
                                          <img
                                            src="assets/images/banner/2.jpg"
                                            alt=""
                                            className="img-fluid rounded-3"
                                          />
                                        </div>
                                        <div className="mt-3 mt-lg-0 ms-lg-3 item-text">
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              iOS Apps Development
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum dolor sit amet, consectetur
                                            adipisicing elit. Sint nam ullam iure
                                            eum sed rerum libero quis doloremque
                                            maiores veritatis?
                                          </p>
                                          <div className="hstack gap-2 mt-3">
                                            <div className="avatar-image avatar-sm">
                                              <img
                                                src="assets/images/avatar/2.png"
                                                alt=""
                                                className="img-fluid"
                                              />
                                            </div>
                                            <a
                                              href="javascript:void(0);"
                                              className="fs-12"
                                            >
                                              Green Cute
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-xl-6">
                                      <div className="d-lg-flex align-items-center gap-3">
                                        <div className="wd-150 rounded-3">
                                          <img
                                            src="assets/images/banner/3.jpg"
                                            alt=""
                                            className="img-fluid rounded-3"
                                          />
                                        </div>
                                        <div className="mt-3 mt-lg-0 ms-lg-3 item-text">
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              Figma Dashboard Design
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum dolor sit amet, consectetur
                                            adipisicing elit. Sint nam ullam iure
                                            eum sed rerum libero quis doloremque
                                            maiores veritatis?
                                          </p>
                                          <div className="hstack gap-2 mt-3">
                                            <div className="avatar-image avatar-sm">
                                              <img
                                                src="assets/images/avatar/3.png"
                                                alt=""
                                                className="img-fluid"
                                              />
                                            </div>
                                            <a
                                              href="javascript:void(0);"
                                              className="fs-12"
                                            >
                                              Malanie Hanvey
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-xl-6">
                                      <div className="d-lg-flex align-items-center gap-3">
                                        <div className="wd-150 rounded-3">
                                          <img
                                            src="assets/images/banner/4.jpg"
                                            alt=""
                                            className="img-fluid rounded-3"
                                          />
                                        </div>
                                        <div className="mt-3 mt-lg-0 ms-lg-3 item-text">
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              React Dashboard Design
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum dolor sit amet, consectetur
                                            adipisicing elit. Sint nam ullam iure
                                            eum sed rerum libero quis doloremque
                                            maiores veritatis?
                                          </p>
                                          <div className="hstack gap-2 mt-3">
                                            <div className="avatar-image avatar-sm">
                                              <img
                                                src="assets/images/avatar/4.png"
                                                alt=""
                                                className="img-fluid"
                                              />
                                            </div>
                                            <a
                                              href="javascript:void(0);"
                                              className="fs-12"
                                            >
                                              Kenneth Hune
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              className="tab-pane fade"
                              id="v-pills-services"
                              role="tabpanel"
                            >
                              <div className="row g-4 nxl-mega-menu-miscellaneous-services">
                                <div className="col-xl-8">
                                  <div className="row g-4">
                                    <div className="col-lg-6">
                                      <div className="d-flex align-items-start gap-3">
                                        <div className="avatar-text avatar-lg rounded bg-primary text-white">
                                          <i className="feather-bar-chart-2 mx-auto" />
                                        </div>
                                        <div>
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              Analytics Services
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum dolor sit amet consectetur
                                            adipisicing elit Unde numquam rem
                                            dignissimos. elit Unde numquam rem
                                            dignissimos.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="d-flex align-items-start gap-3">
                                        <div className="avatar-text avatar-lg rounded bg-danger text-white">
                                          <i className="feather-feather mx-auto" />
                                        </div>
                                        <div>
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              Content Writing
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum dolor sit amet consectetur
                                            adipisicing elit Unde numquam rem
                                            dignissimos. elit Unde numquam rem
                                            dignissimos.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="d-flex align-items-start gap-3">
                                        <div className="avatar-text avatar-lg rounded bg-warning text-white">
                                          <i className="feather-bell mx-auto" />
                                        </div>
                                        <div>
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              SEO (Search Engine Optimization)
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum dolor sit amet consectetur
                                            adipisicing elit Unde numquam rem
                                            dignissimos. elit Unde numquam rem
                                            dignissimos.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="d-flex align-items-start gap-3">
                                        <div className="avatar-text avatar-lg rounded bg-success text-white">
                                          <i className="feather-shield mx-auto" />
                                        </div>
                                        <div>
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              Security Services
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum dolor sit amet consectetur
                                            adipisicing elit Unde numquam rem
                                            dignissimos. elit Unde numquam rem
                                            dignissimos.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="d-flex align-items-start gap-3">
                                        <div className="avatar-text avatar-lg rounded bg-teal text-white">
                                          <i className="feather-shopping-cart mx-auto" />
                                        </div>
                                        <div>
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              eCommerce Services
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum dolor sit amet consectetur
                                            adipisicing elit Unde numquam rem
                                            dignissimos. elit Unde numquam rem
                                            dignissimos.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="d-flex align-items-start gap-3">
                                        <div className="avatar-text avatar-lg rounded bg-dark text-white">
                                          <i className="feather-life-buoy mx-auto" />
                                        </div>
                                        <div>
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              Support Services
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum dolor sit amet consectetur
                                            adipisicing elit Unde numquam rem
                                            dignissimos. elit Unde numquam rem
                                            dignissimos.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-12">
                                      <div className="p-3 bg-soft-dark text-dark rounded d-lg-flex align-items-center justify-content-between">
                                        <div className="fs-13">
                                          <i className="feather-star me-2" />
                                          <span>View all services on Duralux.</span>
                                        </div>
                                        <div className="mt-2 mt-lg-0">
                                          <a
                                            href="javascript:void(0);"
                                            className="fs-13 text-primary"
                                          >
                                            Learn More →
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-xl-4">
                                  <div
                                    id="carouselServicesCaptions"
                                    className="carousel slide"
                                    data-bs-ride="carousel"
                                  >
                                    <div className="carousel-indicators">
                                      <button
                                        type="button"
                                        data-bs-target="#carouselServicesCaptions"
                                        data-bs-slide-to={0}
                                        className="active"
                                        aria-current="true"
                                      />
                                      <button
                                        type="button"
                                        data-bs-target="#carouselServicesCaptions"
                                        data-bs-slide-to={1}
                                      />
                                      <button
                                        type="button"
                                        data-bs-target="#carouselServicesCaptions"
                                        data-bs-slide-to={2}
                                      />
                                      <button
                                        type="button"
                                        data-bs-target="#carouselServicesCaptions"
                                        data-bs-slide-to={3}
                                      />
                                      <button
                                        type="button"
                                        data-bs-target="#carouselServicesCaptions"
                                        data-bs-slide-to={4}
                                      />
                                      <button
                                        type="button"
                                        data-bs-target="#carouselServicesCaptions"
                                        data-bs-slide-to={5}
                                      />
                                    </div>
                                    <div className="carousel-inner rounded-3">
                                      <div className="carousel-item active">
                                        <div className="nxl-mega-menu-image">
                                          <img
                                            src="assets/images/banner/6.jpg"
                                            alt=""
                                            className="img-fluid d-block w-100"
                                          />
                                        </div>
                                        <div className="carousel-caption">
                                          <h5 className="carousel-caption-title text-truncate-1-line">
                                            Shopify eCommerce Store
                                          </h5>
                                          <p className="carousel-caption-desc">
                                            Some representative placeholder content
                                            for the first slide.
                                          </p>
                                        </div>
                                      </div>
                                      <div className="carousel-item">
                                        <div className="nxl-mega-menu-image">
                                          <img
                                            src="assets/images/banner/5.jpg"
                                            alt=""
                                            className="img-fluid d-block w-100"
                                          />
                                        </div>
                                        <div className="carousel-caption">
                                          <h5 className="carousel-caption-title text-truncate-1-line">
                                            iOS Apps Development
                                          </h5>
                                          <p className="carousel-caption-desc">
                                            Some representative placeholder content
                                            for the second slide.
                                          </p>
                                        </div>
                                      </div>
                                      <div className="carousel-item">
                                        <div className="nxl-mega-menu-image">
                                          <img
                                            src="assets/images/banner/4.jpg"
                                            alt=""
                                            className="img-fluid d-block w-100"
                                          />
                                        </div>
                                        <div className="carousel-caption">
                                          <h5 className="carousel-caption-title text-truncate-1-line">
                                            Figma Dashboard Design
                                          </h5>
                                          <p className="carousel-caption-desc">
                                            Some representative placeholder content
                                            for the third slide.
                                          </p>
                                        </div>
                                      </div>
                                      <div className="carousel-item">
                                        <div className="nxl-mega-menu-image">
                                          <img
                                            src="assets/images/banner/3.jpg"
                                            alt=""
                                            className="img-fluid d-block w-100"
                                          />
                                        </div>
                                        <div className="carousel-caption">
                                          <h5 className="carousel-caption-title text-truncate-1-line">
                                            React Dashboard Design
                                          </h5>
                                          <p className="carousel-caption-desc">
                                            Some representative placeholder content
                                            for the third slide.
                                          </p>
                                        </div>
                                      </div>
                                      <div className="carousel-item">
                                        <div className="nxl-mega-menu-image">
                                          <img
                                            src="assets/images/banner/2.jpg"
                                            alt=""
                                            className="img-fluid d-block w-100"
                                          />
                                        </div>
                                        <div className="carousel-caption">
                                          <h5 className="carousel-caption-title text-truncate-1-line">
                                            Standup Team Meeting
                                          </h5>
                                          <p className="carousel-caption-desc">
                                            Some representative placeholder content
                                            for the third slide.
                                          </p>
                                        </div>
                                      </div>
                                      <div className="carousel-item">
                                        <div className="nxl-mega-menu-image">
                                          <img
                                            src="assets/images/banner/1.jpg"
                                            alt=""
                                            className="img-fluid d-block w-100"
                                          />
                                        </div>
                                        <div className="carousel-caption">
                                          <h5 className="carousel-caption-title text-truncate-1-line">
                                            Zoom Team Meeting
                                          </h5>
                                          <p className="carousel-caption-desc">
                                            Some representative placeholder content
                                            for the third slide.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      className="carousel-control-prev"
                                      type="button"
                                      data-bs-target="#carouselServicesCaptions"
                                      data-bs-slide="prev"
                                    >
                                      <span
                                        className="carousel-control-prev-icon"
                                        aria-hidden="true"
                                      />
                                      <span className="visually-hidden">
                                        Previous
                                      </span>
                                    </button>
                                    <button
                                      className="carousel-control-next"
                                      type="button"
                                      data-bs-target="#carouselServicesCaptions"
                                      data-bs-slide="next"
                                    >
                                      <span
                                        className="carousel-control-next-icon"
                                        aria-hidden="true"
                                      />
                                      <span className="visually-hidden">Next</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              className="tab-pane fade"
                              id="v-pills-features"
                              role="tabpanel"
                            >
                              <div className="row g-4 nxl-mega-menu-miscellaneous-features">
                                <div className="col-xl-8">
                                  <div className="row g-4">
                                    <div className="col-lg-6">
                                      <div className="d-flex align-items-start gap-3">
                                        <div className="avatar-text avatar-lg bg-soft-primary text-primary border-soft-primary rounded">
                                          <i className="feather-bell mx-auto" />
                                        </div>
                                        <div>
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              Notifications
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum dolor sit amet consectetur
                                            adipisicing elit Unde numquam rem
                                            dignissimos. elit Unde numquam rem
                                            dignissimos.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="d-flex align-items-start gap-3">
                                        <div className="avatar-text avatar-lg bg-soft-danger text-danger border-soft-danger rounded">
                                          <i className="feather-bar-chart-2 mx-auto" />
                                        </div>
                                        <div>
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              Analytics
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum dolor sit amet consectetur
                                            adipisicing elit Unde numquam rem
                                            dignissimos. elit Unde numquam rem
                                            dignissimos.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="d-flex align-items-start gap-3">
                                        <div className="avatar-text avatar-lg bg-soft-success text-success border-soft-success rounded">
                                          <i className="feather-link-2 mx-auto" />
                                        </div>
                                        <div>
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              Ingetrations
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum dolor sit amet consectetur
                                            adipisicing elit Unde numquam rem
                                            dignissimos. elit Unde numquam rem
                                            dignissimos.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="d-flex align-items-start gap-3">
                                        <div className="avatar-text avatar-lg bg-soft-indigo text-indigo border-soft-indigo rounded">
                                          <i className="feather-book mx-auto" />
                                        </div>
                                        <div>
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              Documentations
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum dolor sit amet consectetur
                                            adipisicing elit Unde numquam rem
                                            dignissimos. elit Unde numquam rem
                                            dignissimos.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="d-flex align-items-start gap-3">
                                        <div className="avatar-text avatar-lg bg-soft-warning text-warning border-soft-warning rounded">
                                          <i className="feather-shield mx-auto" />
                                        </div>
                                        <div>
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              Security
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum dolor sit amet consectetur
                                            adipisicing elit Unde numquam rem
                                            dignissimos. elit Unde numquam rem
                                            dignissimos.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="d-flex align-items-start gap-3">
                                        <div className="avatar-text avatar-lg bg-soft-teal text-teal border-soft-teal rounded">
                                          <i className="feather-life-buoy mx-auto" />
                                        </div>
                                        <div>
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              Support
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum dolor sit amet consectetur
                                            adipisicing elit Unde numquam rem
                                            dignissimos. elit Unde numquam rem
                                            dignissimos.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-xxl-3 offset-xxl-1 col-xl-4">
                                  <div className="nxl-mega-menu-image">
                                    <img
                                      src="assets/images/banner/1.jpg"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="mt-4">
                                    <a
                                      href="mailto:theme_ocean@example.com"
                                      className="fs-13 fw-bold"
                                    >
                                      View all features on Duralux →
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              className="tab-pane fade"
                              id="v-pills-blogs"
                              role="tabpanel"
                            >
                              <div className="row g-4">
                                <div className="col-xxl-2 d-lg-none d-xxl-block">
                                  <h6 className="dropdown-item-title">
                                    Categories
                                  </h6>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Support
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Services
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Applicatios
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    eCommerce
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Development
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="dropdown-item"
                                  >
                                    Miscellaneous
                                  </a>
                                </div>
                                <div className="col-xxl-10">
                                  <div className="row g-4">
                                    <div className="col-xxl-4 col-lg-6">
                                      <div className="d-flex align-items-center gap-3">
                                        <div className="wd-100 rounded-3">
                                          <img
                                            src="assets/images/banner/1.jpg"
                                            alt=""
                                            className="img-fluid rounded-3 border border-3"
                                          />
                                        </div>
                                        <div>
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              Lorem ipsum dolor sit
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum, dolor sit amet consectetur
                                            adipisicing elit. Eius dolor quo commodi
                                            nisi animi error minus quia aliquam.
                                          </p>
                                          <span className="fs-11 text-gray-500">
                                            26 March, 2023
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-xxl-4 col-lg-6">
                                      <div className="d-flex align-items-center gap-3">
                                        <div className="wd-100 rounded-3">
                                          <img
                                            src="assets/images/banner/2.jpg"
                                            alt=""
                                            className="img-fluid rounded-3 border border-3"
                                          />
                                        </div>
                                        <div>
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              Lorem ipsum dolor sit
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum, dolor sit amet consectetur
                                            adipisicing elit. Eius dolor quo commodi
                                            nisi animi error minus quia aliquam.
                                          </p>
                                          <span className="fs-11 text-gray-500">
                                            26 March, 2023
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-xxl-4 col-lg-6">
                                      <div className="d-flex align-items-center gap-3">
                                        <div className="wd-100 rounded-3">
                                          <img
                                            src="assets/images/banner/3.jpg"
                                            alt=""
                                            className="img-fluid rounded-3 border border-3"
                                          />
                                        </div>
                                        <div>
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              Lorem ipsum dolor sit
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum, dolor sit amet consectetur
                                            adipisicing elit. Eius dolor quo commodi
                                            nisi animi error minus quia aliquam.
                                          </p>
                                          <span className="fs-11 text-gray-500">
                                            26 March, 2023
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-xxl-4 col-lg-6">
                                      <div className="d-flex align-items-center gap-3">
                                        <div className="wd-100 rounded-3">
                                          <img
                                            src="assets/images/banner/4.jpg"
                                            alt=""
                                            className="img-fluid rounded-3 border border-3"
                                          />
                                        </div>
                                        <div>
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              Lorem ipsum dolor sit
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum, dolor sit amet consectetur
                                            adipisicing elit. Eius dolor quo commodi
                                            nisi animi error minus quia aliquam.
                                          </p>
                                          <span className="fs-11 text-gray-500">
                                            26 March, 2023
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-xxl-4 col-lg-6">
                                      <div className="d-flex align-items-center gap-3">
                                        <div className="wd-100 rounded-3">
                                          <img
                                            src="assets/images/banner/5.jpg"
                                            alt=""
                                            className="img-fluid rounded-3 border border-3"
                                          />
                                        </div>
                                        <div>
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              Lorem ipsum dolor sit
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum, dolor sit amet consectetur
                                            adipisicing elit. Eius dolor quo commodi
                                            nisi animi error minus quia aliquam.
                                          </p>
                                          <span className="fs-11 text-gray-500">
                                            26 March, 2023
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-xxl-4 col-lg-6">
                                      <div className="d-flex align-items-center gap-3">
                                        <div className="wd-100 rounded-3">
                                          <img
                                            src="assets/images/banner/6.jpg"
                                            alt=""
                                            className="img-fluid rounded-3 border border-3"
                                          />
                                        </div>
                                        <div>
                                          <a href="javascript:void(0);">
                                            <h6 className="menu-item-heading text-truncate-1-line">
                                              Lorem ipsum dolor sit
                                            </h6>
                                          </a>
                                          <p className="fs-12 fw-normal text-muted mb-0 text-truncate-2-line">
                                            Lorem ipsum, dolor sit amet consectetur
                                            adipisicing elit. Eius dolor quo commodi
                                            nisi animi error minus quia aliquam.
                                          </p>
                                          <span className="fs-11 text-gray-500">
                                            26 March, 2023
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-12">
                                      <div className="p-3 bg-soft-dark text-dark rounded d-flex align-items-center justify-content-between gap-4">
                                        <div className="fs-13 text-truncate-1-line">
                                          <i className="feather-star me-2" />
                                          <strong>Version 2.3.2 is out!</strong>
                                          <span>
                                            Learn more about our news and schedule
                                            reporting.
                                          </span>
                                        </div>
                                        <div className="wd-100 text-end">
                                          <a
                                            href="javascript:void(0);"
                                            className="fs-13 text-primary"
                                          >
                                            Learn More →
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="header-right ms-auto">
            <div className="d-flex align-items-center">
              <div className="dropdown nxl-h-item nxl-header-search">
                <a
                  href="javascript:void(0);"
                  className="nxl-head-link me-0"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                >
                  <i className="feather-search" />
                </a>
                <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-search-dropdown">
                  <div className="input-group search-form">
                    <span className="input-group-text">
                      <i className="feather-search fs-6 text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control search-input-field"
                      placeholder="Search...."
                    />
                    <span className="input-group-text">
                      <button type="button" className="btn-close" />
                    </span>
                  </div>
                  <div className="dropdown-divider mt-0" />
                  <div className="search-items-wrapper">
                    <div className="searching-for px-4 py-2">
                      <p className="fs-11 fw-medium text-muted">
                        I'm searching for...
                      </p>
                      <div className="d-flex flex-wrap gap-1">
                        <a
                          href="javascript:void(0);"
                          className="flex-fill border rounded py-1 px-2 text-center fs-11 fw-semibold"
                        >
                          Projects
                        </a>
                        <a
                          href="javascript:void(0);"
                          className="flex-fill border rounded py-1 px-2 text-center fs-11 fw-semibold"
                        >
                          Leads
                        </a>
                        <a
                          href="javascript:void(0);"
                          className="flex-fill border rounded py-1 px-2 text-center fs-11 fw-semibold"
                        >
                          Contacts
                        </a>
                        <a
                          href="javascript:void(0);"
                          className="flex-fill border rounded py-1 px-2 text-center fs-11 fw-semibold"
                        >
                          Inbox
                        </a>
                        <a
                          href="javascript:void(0);"
                          className="flex-fill border rounded py-1 px-2 text-center fs-11 fw-semibold"
                        >
                          Invoices
                        </a>
                        <a
                          href="javascript:void(0);"
                          className="flex-fill border rounded py-1 px-2 text-center fs-11 fw-semibold"
                        >
                          Tasks
                        </a>
                        <a
                          href="javascript:void(0);"
                          className="flex-fill border rounded py-1 px-2 text-center fs-11 fw-semibold"
                        >
                          Customers
                        </a>
                        <a
                          href="javascript:void(0);"
                          className="flex-fill border rounded py-1 px-2 text-center fs-11 fw-semibold"
                        >
                          Notes
                        </a>
                        <a
                          href="javascript:void(0);"
                          className="flex-fill border rounded py-1 px-2 text-center fs-11 fw-semibold"
                        >
                          Affiliate
                        </a>
                        <a
                          href="javascript:void(0);"
                          className="flex-fill border rounded py-1 px-2 text-center fs-11 fw-semibold"
                        >
                          Storage
                        </a>
                        <a
                          href="javascript:void(0);"
                          className="flex-fill border rounded py-1 px-2 text-center fs-11 fw-semibold"
                        >
                          Calendar
                        </a>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <div className="recent-result px-4 py-2">
                      <h4 className="fs-13 fw-normal text-gray-600 mb-3">
                        Recnet{" "}
                        <span className="badge small bg-gray-200 rounded ms-1 text-dark">
                          3
                        </span>
                      </h4>
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar-text rounded">
                            <i className="feather-airplay" />
                          </div>
                          <div>
                            <a
                              href="javascript:void(0);"
                              className="font-body fw-bold d-block mb-1"
                            >
                              CRM dashboard redesign
                            </a>
                            <p className="fs-11 text-muted mb-0">
                              Home / project / crm
                            </p>
                          </div>
                        </div>
                        <div>
                          <a
                            href="javascript:void(0);"
                            className="badge border rounded text-dark"
                          >
                            /<i className="feather-command ms-1 fs-10" />
                          </a>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar-text rounded">
                            <i className="feather-file-plus" />
                          </div>
                          <div>
                            <a
                              href="javascript:void(0);"
                              className="font-body fw-bold d-block mb-1"
                            >
                              Create new document
                            </a>
                            <p className="fs-11 text-muted mb-0">
                              Home / tasks / docs
                            </p>
                          </div>
                        </div>
                        <div>
                          <a
                            href="javascript:void(0);"
                            className="badge border rounded text-dark"
                          >
                            N /<i className="feather-command ms-1 fs-10" />
                          </a>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar-text rounded">
                            <i className="feather-user-plus" />
                          </div>
                          <div>
                            <a
                              href="javascript:void(0);"
                              className="font-body fw-bold d-block mb-1"
                            >
                              Invite project colleagues
                            </a>
                            <p className="fs-11 text-muted mb-0">
                              Home / project / invite
                            </p>
                          </div>
                        </div>
                        <div>
                          <a
                            href="javascript:void(0);"
                            className="badge border rounded text-dark"
                          >
                            P /<i className="feather-command ms-1 fs-10" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown-divider my-3" />
                    <div className="users-result px-4 py-2">
                      <h4 className="fs-13 fw-normal text-gray-600 mb-3">
                        Users{" "}
                        <span className="badge small bg-gray-200 rounded ms-1 text-dark">
                          5
                        </span>
                      </h4>
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar-image rounded">
                            <img
                              src="assets/images/avatar/1.png"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div>
                            <a
                              href="javascript:void(0);"
                              className="font-body fw-bold d-block mb-1"
                            >
                              {user?.name}
                            </a>
                            <p className="fs-11 text-muted mb-0">
                              {user?.role.name} - {user?.email}
                            </p>
                          </div>
                        </div>
                        <a
                          href="javascript:void(0);"
                          className="avatar-text avatar-md"
                        >
                          <i className="feather-chevron-right" />
                        </a>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar-image rounded">
                            <img
                              src="assets/images/avatar/2.png"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div>
                            <a
                              href="javascript:void(0);"
                              className="font-body fw-bold d-block mb-1"
                            >
                              Green Cute
                            </a>
                            <p className="fs-11 text-muted mb-0">
                              green.cute@outlook.com
                            </p>
                          </div>
                        </div>
                        <a
                          href="javascript:void(0);"
                          className="avatar-text avatar-md"
                        >
                          <i className="feather-chevron-right" />
                        </a>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar-image rounded">
                            <img
                              src="assets/images/avatar/3.png"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div>
                            <a
                              href="javascript:void(0);"
                              className="font-body fw-bold d-block mb-1"
                            >
                              Malanie Hanvey
                            </a>
                            <p className="fs-11 text-muted mb-0">
                              malanie.anvey@outlook.com
                            </p>
                          </div>
                        </div>
                        <a
                          href="javascript:void(0);"
                          className="avatar-text avatar-md"
                        >
                          <i className="feather-chevron-right" />
                        </a>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar-image rounded">
                            <img
                              src="assets/images/avatar/4.png"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div>
                            <a
                              href="javascript:void(0);"
                              className="font-body fw-bold d-block mb-1"
                            >
                              Kenneth Hune
                            </a>
                            <p className="fs-11 text-muted mb-0">
                              kenth.hune@outlook.com
                            </p>
                          </div>
                        </div>
                        <a
                          href="javascript:void(0);"
                          className="avatar-text avatar-md"
                        >
                          <i className="feather-chevron-right" />
                        </a>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-0">
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar-image rounded">
                            <img
                              src="assets/images/avatar/5.png"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div>
                            <a
                              href="javascript:void(0);"
                              className="font-body fw-bold d-block mb-1"
                            >
                              Archie Cantones
                            </a>
                            <p className="fs-11 text-muted mb-0">
                              archie.cones@outlook.com
                            </p>
                          </div>
                        </div>
                        <a
                          href="javascript:void(0);"
                          className="avatar-text avatar-md"
                        >
                          <i className="feather-chevron-right" />
                        </a>
                      </div>
                    </div>
                    <div className="dropdown-divider my-3" />
                    <div className="file-result px-4 py-2">
                      <h4 className="fs-13 fw-normal text-gray-600 mb-3">
                        Files{" "}
                        <span className="badge small bg-gray-200 rounded ms-1 text-dark">
                          3
                        </span>
                      </h4>
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar-image bg-gray-200 rounded">
                            <img
                              src="assets/images/file-icons/css.png"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div>
                            <a
                              href="javascript:void(0);"
                              className="font-body fw-bold d-block mb-1"
                            >
                              Project Style CSS
                            </a>
                            <p className="fs-11 text-muted mb-0">05.74 MB</p>
                          </div>
                        </div>
                        <a
                          href="javascript:void(0);"
                          className="avatar-text avatar-md"
                        >
                          <i className="feather-download" />
                        </a>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar-image bg-gray-200 rounded">
                            <img
                              src="assets/images/file-icons/zip.png"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div>
                            <a
                              href="javascript:void(0);"
                              className="font-body fw-bold d-block mb-1"
                            >
                              Dashboard Project Zip
                            </a>
                            <p className="fs-11 text-muted mb-0">46.83 MB</p>
                          </div>
                        </div>
                        <a
                          href="javascript:void(0);"
                          className="avatar-text avatar-md"
                        >
                          <i className="feather-download" />
                        </a>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-0">
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar-image bg-gray-200 rounded">
                            <img
                              src="assets/images/file-icons/pdf.png"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div>
                            <a
                              href="javascript:void(0);"
                              className="font-body fw-bold d-block mb-1"
                            >
                              Project Document PDF
                            </a>
                            <p className="fs-11 text-muted mb-0">12.85 MB</p>
                          </div>
                        </div>
                        <a
                          href="javascript:void(0);"
                          className="avatar-text avatar-md"
                        >
                          <i className="feather-download" />
                        </a>
                      </div>
                    </div>
                    <div className="dropdown-divider mt-3 mb-0" />
                    <a
                      href="javascript:void(0);"
                      className="p-3 fs-10 fw-bold text-uppercase text-center d-block"
                    >
                      Loar More
                    </a>
                  </div>
                </div>
              </div>
              <div className="dropdown nxl-h-item nxl-header-language d-none d-sm-flex">
                <a
                  href="javascript:void(0);"
                  className="nxl-head-link me-0 nxl-language-link"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                >
                  <img
                    src="assets/vendors/img/flags/4x3/us.svg"
                    alt=""
                    className="img-fluid wd-20"
                  />
                </a>
                <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-language-dropdown">
                  <div className="dropdown-divider mt-0" />
                  <div className="language-items-wrapper">
                    <div className="select-language px-4 py-2 hstack justify-content-between gap-4">
                      <div className="lh-lg">
                        <h6 className="mb-0">Select Language</h6>
                        <p className="fs-11 text-muted mb-0">
                          12 languages avaiable!
                        </p>
                      </div>
                      <a
                        href="javascript:void(0);"
                        className="avatar-text avatar-md"
                        data-bs-toggle="tooltip"
                        title="Add Language"
                      >
                        <i className="feather-plus" />
                      </a>
                    </div>
                    <div className="dropdown-divider" />
                    <div className="row px-4 pt-3">
                      <div className="col-sm-4 col-6 language_select">
                        <a
                          href="javascript:void(0);"
                          className="d-flex align-items-center gap-2"
                        >
                          <div className="avatar-image avatar-sm">
                            <img
                              src="assets/vendors/img/flags/1x1/sa.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <span>Arabic</span>
                        </a>
                      </div>
                      <div className="col-sm-4 col-6 language_select">
                        <a
                          href="javascript:void(0);"
                          className="d-flex align-items-center gap-2"
                        >
                          <div className="avatar-image avatar-sm">
                            <img
                              src="assets/vendors/img/flags/1x1/bd.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <span>Bengali</span>
                        </a>
                      </div>
                      <div className="col-sm-4 col-6 language_select">
                        <a
                          href="javascript:void(0);"
                          className="d-flex align-items-center gap-2"
                        >
                          <div className="avatar-image avatar-sm">
                            <img
                              src="assets/vendors/img/flags/1x1/ch.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <span>Chinese</span>
                        </a>
                      </div>
                      <div className="col-sm-4 col-6 language_select">
                        <a
                          href="javascript:void(0);"
                          className="d-flex align-items-center gap-2"
                        >
                          <div className="avatar-image avatar-sm">
                            <img
                              src="assets/vendors/img/flags/1x1/nl.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <span>Dutch</span>
                        </a>
                      </div>
                      <div className="col-sm-4 col-6 language_select active">
                        <a
                          href="javascript:void(0);"
                          className="d-flex align-items-center gap-2"
                        >
                          <div className="avatar-image avatar-sm">
                            <img
                              src="assets/vendors/img/flags/1x1/us.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <span>English</span>
                        </a>
                      </div>
                      <div className="col-sm-4 col-6 language_select">
                        <a
                          href="javascript:void(0);"
                          className="d-flex align-items-center gap-2"
                        >
                          <div className="avatar-image avatar-sm">
                            <img
                              src="assets/vendors/img/flags/1x1/fr.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <span>French</span>
                        </a>
                      </div>
                      <div className="col-sm-4 col-6 language_select">
                        <a
                          href="javascript:void(0);"
                          className="d-flex align-items-center gap-2"
                        >
                          <div className="avatar-image avatar-sm">
                            <img
                              src="assets/vendors/img/flags/1x1/de.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <span>German</span>
                        </a>
                      </div>
                      <div className="col-sm-4 col-6 language_select">
                        <a
                          href="javascript:void(0);"
                          className="d-flex align-items-center gap-2"
                        >
                          <div className="avatar-image avatar-sm">
                            <img
                              src="assets/vendors/img/flags/1x1/in.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <span>Hindi</span>
                        </a>
                      </div>
                      <div className="col-sm-4 col-6 language_select">
                        <a
                          href="javascript:void(0);"
                          className="d-flex align-items-center gap-2"
                        >
                          <div className="avatar-image avatar-sm">
                            <img
                              src="assets/vendors/img/flags/1x1/ru.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <span>Russian</span>
                        </a>
                      </div>
                      <div className="col-sm-4 col-6 language_select">
                        <a
                          href="javascript:void(0);"
                          className="d-flex align-items-center gap-2"
                        >
                          <div className="avatar-image avatar-sm">
                            <img
                              src="assets/vendors/img/flags/1x1/es.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <span>Spanish</span>
                        </a>
                      </div>
                      <div className="col-sm-4 col-6 language_select">
                        <a
                          href="javascript:void(0);"
                          className="d-flex align-items-center gap-2"
                        >
                          <div className="avatar-image avatar-sm">
                            <img
                              src="assets/vendors/img/flags/1x1/tr.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <span>Turkish</span>
                        </a>
                      </div>
                      <div className="col-sm-4 col-6 language_select">
                        <a
                          href="javascript:void(0);"
                          className="d-flex align-items-center gap-2"
                        >
                          <div className="avatar-image avatar-sm">
                            <img
                              src="assets/vendors/img/flags/1x1/pk.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <span>Urdo</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="nxl-h-item d-none d-sm-flex">
                <div className="full-screen-switcher">
                  <a
                    href="javascript:void(0);"
                    className="nxl-head-link me-0"
                    onClick={() => $('body').fullScreenHelper('toggle')}
                  >
                    <i className="feather-maximize maximize" />
                    <i className="feather-minimize minimize" />
                  </a>
                </div>
              </div>
              <div className="nxl-h-item dark-light-theme">
                <a
                  href="javascript:void(0);"
                  className="nxl-head-link me-0 dark-button"
                >
                  <i className="feather-moon" />
                </a>
                <a
                  href="javascript:void(0);"
                  className="nxl-head-link me-0 light-button"
                  style={{ display: "none" }}
                >
                  <i className="feather-sun" />
                </a>
              </div>
              <div className="dropdown nxl-h-item">
                <a
                  href="javascript:void(0);"
                  className="nxl-head-link me-0"
                  data-bs-toggle="dropdown"
                  role="button"
                  data-bs-auto-close="outside"
                >
                  <i className="feather-clock" />
                  <span className="badge bg-success nxl-h-badge">2</span>
                </a>
                <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-timesheets-menu">
                  <div className="d-flex justify-content-between align-items-center timesheets-head">
                    <h6 className="fw-bold text-dark mb-0">Timesheets</h6>
                    <a
                      href="javascript:void(0);"
                      className="fs-11 text-success text-end ms-auto"
                      data-bs-toggle="tooltip"
                      title="Upcomming Timers"
                    >
                      <i className="feather-clock" />
                      <span>3 Upcomming</span>
                    </a>
                  </div>
                  <div className="d-flex justify-content-between align-items-center flex-column timesheets-body">
                    <i className="feather-clock fs-1 mb-4" />
                    <p className="text-muted">No started timers found yes!</p>
                    <a
                      href="javascript:void(0);"
                      className="btn btn-sm btn-primary"
                    >
                      Started Timer
                    </a>
                  </div>
                  <div className="text-center timesheets-footer">
                    <a
                      href="javascript:void(0);"
                      className="fs-13 fw-semibold text-dark"
                    >
                      Alls Timesheets
                    </a>
                  </div>
                </div>
              </div>
              <div className="dropdown nxl-h-item">
                <a
                  className="nxl-head-link me-3"
                  data-bs-toggle="dropdown"
                  href="#"
                  role="button"
                  data-bs-auto-close="outside"
                >
                  <i className="feather-bell" />
                  <span className="badge bg-danger nxl-h-badge">3</span>
                </a>
                <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-notifications-menu">
                  <div className="d-flex justify-content-between align-items-center notifications-head">
                    <h6 className="fw-bold text-dark mb-0">Notifications</h6>
                    <a
                      href="javascript:void(0);"
                      className="fs-11 text-success text-end ms-auto"
                      data-bs-toggle="tooltip"
                      title="Make as Read"
                    >
                      <i className="feather-check" />
                      <span>Make as Read</span>
                    </a>
                  </div>
                  <div className="notifications-item">
                    <img
                      src="assets/images/avatar/2.png"
                      alt=""
                      className="rounded me-3 border"
                    />
                    <div className="notifications-desc">
                      <a
                        href="javascript:void(0);"
                        className="font-body text-truncate-2-line"
                      >
                        {" "}
                        <span className="fw-semibold text-dark">
                          Malanie Hanvey
                        </span>{" "}
                        We should talk about that at lunch!
                      </a>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="notifications-date text-muted border-bottom border-bottom-dashed">
                          2 minutes ago
                        </div>
                        <div className="d-flex align-items-center float-end gap-2">
                          <a
                            href="javascript:void(0);"
                            className="d-block wd-8 ht-8 rounded-circle bg-gray-300"
                            data-bs-toggle="tooltip"
                            title="Make as Read"
                          />
                          <a
                            href="javascript:void(0);"
                            className="text-danger"
                            data-bs-toggle="tooltip"
                            title="Remove"
                          >
                            <i className="feather-x fs-12" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="notifications-item">
                    <img
                      src="assets/images/avatar/3.png"
                      alt=""
                      className="rounded me-3 border"
                    />
                    <div className="notifications-desc">
                      <a
                        href="javascript:void(0);"
                        className="font-body text-truncate-2-line"
                      >
                        {" "}
                        <span className="fw-semibold text-dark">
                          Valentine Maton
                        </span>{" "}
                        You can download the latest invoices now.
                      </a>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="notifications-date text-muted border-bottom border-bottom-dashed">
                          36 minutes ago
                        </div>
                        <div className="d-flex align-items-center float-end gap-2">
                          <a
                            href="javascript:void(0);"
                            className="d-block wd-8 ht-8 rounded-circle bg-gray-300"
                            data-bs-toggle="tooltip"
                            title="Make as Read"
                          />
                          <a
                            href="javascript:void(0);"
                            className="text-danger"
                            data-bs-toggle="tooltip"
                            title="Remove"
                          >
                            <i className="feather-x fs-12" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="notifications-item">
                    <img
                      src="assets/images/avatar/4.png"
                      alt=""
                      className="rounded me-3 border"
                    />
                    <div className="notifications-desc">
                      <a
                        href="javascript:void(0);"
                        className="font-body text-truncate-2-line"
                      >
                        {" "}
                        <span className="fw-semibold text-dark">
                          Archie Cantones
                        </span>{" "}
                        Don't forget to pickup Jeremy after school!
                      </a>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="notifications-date text-muted border-bottom border-bottom-dashed">
                          53 minutes ago
                        </div>
                        <div className="d-flex align-items-center float-end gap-2">
                          <a
                            href="javascript:void(0);"
                            className="d-block wd-8 ht-8 rounded-circle bg-gray-300"
                            data-bs-toggle="tooltip"
                            title="Make as Read"
                          />
                          <a
                            href="javascript:void(0);"
                            className="text-danger"
                            data-bs-toggle="tooltip"
                            title="Remove"
                          >
                            <i className="feather-x fs-12" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center notifications-footer">
                    <a
                      href="javascript:void(0);"
                      className="fs-13 fw-semibold text-dark"
                    >
                      Alls Notifications
                    </a>
                  </div>
                </div>
              </div>
              <div className="dropdown nxl-h-item">
                <a
                  href="javascript:void(0);"
                  data-bs-toggle="dropdown"
                  role="button"
                  data-bs-auto-close="outside"
                >
                  <img
                    src="assets/images/avatar/1.png"
                    alt="user-image"
                    className="img-fluid user-avtar me-0"
                  />
                </a>
                <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-user-dropdown">
                  <div className="dropdown-header">
                    <div className="d-flex align-items-center">
                      <img
                        src="assets/images/avatar/1.png"
                        alt="user-image"
                        className="img-fluid user-avtar"
                      />
                      <div>
                        <h6 className="text-dark mb-0">
                          {user?.name}{" "}
                          <span className="badge bg-soft-success text-success ms-1">
                            {user?.role.name}
                          </span>
                        </h6>
                        <span className="fs-12 fw-medium text-muted">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown">
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item"
                      data-bs-toggle="dropdown"
                    >
                      <span className="hstack">
                        <i className="wd-10 ht-10 border border-2 border-gray-1 bg-success rounded-circle me-2" />
                        <span>Active</span>
                      </span>
                      <i className="feather-chevron-right ms-auto me-0" />
                    </a>
                    <div className="dropdown-menu">
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="wd-10 ht-10 border border-2 border-gray-1 bg-warning rounded-circle me-2" />
                          <span>Always</span>
                        </span>
                      </a>
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="wd-10 ht-10 border border-2 border-gray-1 bg-success rounded-circle me-2" />
                          <span>Active</span>
                        </span>
                      </a>
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="wd-10 ht-10 border border-2 border-gray-1 bg-danger rounded-circle me-2" />
                          <span>Bussy</span>
                        </span>
                      </a>
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="wd-10 ht-10 border border-2 border-gray-1 bg-info rounded-circle me-2" />
                          <span>Inactive</span>
                        </span>
                      </a>
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="wd-10 ht-10 border border-2 border-gray-1 bg-dark rounded-circle me-2" />
                          <span>Disabled</span>
                        </span>
                      </a>
                      <div className="dropdown-divider" />
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="wd-10 ht-10 border border-2 border-gray-1 bg-primary rounded-circle me-2" />
                          <span>Cutomization</span>
                        </span>
                      </a>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  <div className="dropdown">
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item"
                      data-bs-toggle="dropdown"
                    >
                      <span className="hstack">
                        <i className="feather-dollar-sign me-2" />
                        <span>Subscriptions</span>
                      </span>
                      <i className="feather-chevron-right ms-auto me-0" />
                    </a>
                    <div className="dropdown-menu">
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Plan</span>
                        </span>
                      </a>
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Billings</span>
                        </span>
                      </a>
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Referrals</span>
                        </span>
                      </a>
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Payments</span>
                        </span>
                      </a>
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Statements</span>
                        </span>
                      </a>
                      <div className="dropdown-divider" />
                      <a href="javascript:void(0);" className="dropdown-item">
                        <span className="hstack">
                          <i className="wd-5 ht-5 bg-gray-500 rounded-circle me-3" />
                          <span>Subscriptions</span>
                        </span>
                      </a>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  <a href="javascript:void(0);" className="dropdown-item">
                    <i className="feather-user" />
                    <span>Profile Details</span>
                  </a>
                  <a href="javascript:void(0);" className="dropdown-item">
                    <i className="feather-activity" />
                    <span>Activity Feed</span>
                  </a>
                  <a href="javascript:void(0);" className="dropdown-item">
                    <i className="feather-dollar-sign" />
                    <span>Billing Details</span>
                  </a>
                  <a href="javascript:void(0);" className="dropdown-item">
                    <i className="feather-bell" />
                    <span>Notifications</span>
                  </a>
                  <a href="javascript:void(0);" className="dropdown-item">
                    <i className="feather-settings" />
                    <span>Account Settings</span>
                  </a>
                  <div className="dropdown-divider" />
                  <a href="#" onClick={logout} className="dropdown-item">
                    <i className="feather-log-out" />
                    <span>Logout</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </header>
    </>
  )
}

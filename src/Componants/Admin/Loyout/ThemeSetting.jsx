// import React from 'react'

// export default function ThemeSetting() {
//   return (
//     <>
//        {/* END layout-wrapper */}
//       {/*start back-to-top*/}
//       <button
//         onClick="topFunction()"
//         className="btn btn-danger btn-icon"
//         id="back-to-top"
//       >
//         <i className="ri-arrow-up-line" />
//       </button>
//       {/*end back-to-top*/}
//       {/*preloader*/}
//       {/* <div id="preloader">
//           <div id="status">
//             <div className="spinner-border text-primary avatar-sm" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         </div> */}

//       <div className="customizer-setting d-none d-md-block">
//         <div
//           className="btn-info rounded-pill shadow-lg btn btn-icon btn-lg p-2"
//           data-bs-toggle="offcanvas"
//           data-bs-target="#theme-settings-offcanvas"
//           aria-controls="theme-settings-offcanvas"
//         >
//           <i className="mdi mdi-spin mdi-cog-outline fs-22" />
//         </div>
//       </div>
//       {/* Theme Settings */}

//       <div
//         className="offcanvas offcanvas-end border-0"
//         tabIndex={-1}
//         id="theme-settings-offcanvas"
//       >
//         <div className="d-flex align-items-center bg-primary bg-gradient p-3 offcanvas-header">
//           <h5 className="m-0 me-2 text-white">Theme Customizer</h5>
//           <button
//             type="button"
//             className="btn-close btn-close-white ms-auto"
//             id="customizerclose-btn"
//             data-bs-dismiss="offcanvas"
//             aria-label="Close"
//           />
//         </div>

//         <div className="offcanvas-body p-0">
//           <div data-simplebar="" className="h-100">
//             <div className="p-4">
//               <h6 className="mb-0 fw-semibold text-uppercase">Layout</h6>
//               <p className="text-muted">Choose your layout</p>
//               <div className="row gy-3">
//                 <div className="col-4">
//                   <div className="form-check card-radio">
//                     <input
//                       id="customizer-layout01"
//                       name="data-layout"
//                       type="radio"
//                       defaultValue="vertical"
//                       className="form-check-input"
//                     />
//                     <label
//                       className="form-check-label p-0 avatar-md w-100"
//                       htmlFor="customizer-layout01"
//                     >
//                       <span className="d-flex gap-1 h-100">
//                         <span className="flex-shrink-0">
//                           <span className="bg-light d-flex h-100 flex-column gap-1 p-1">
//                             <span className="d-block p-1 px-2 bg-primary-subtle rounded mb-2" />
//                             <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                             <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                             <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                           </span>
//                         </span>
//                         <span className="flex-grow-1">
//                           <span className="d-flex h-100 flex-column">
//                             <span className="bg-light d-block p-1" />
//                             <span className="bg-light d-block p-1 mt-auto" />
//                           </span>
//                         </span>
//                       </span>
//                     </label>
//                   </div>
//                   <h5 className="fs-13 text-center mt-2">Vertical</h5>
//                 </div>
//                 <div className="col-4">
//                   <div className="form-check card-radio">
//                     <input
//                       id="customizer-layout02"
//                       name="data-layout"
//                       type="radio"
//                       defaultValue="horizontal"
//                       className="form-check-input"
//                     />
//                     <label
//                       className="form-check-label p-0 avatar-md w-100"
//                       htmlFor="customizer-layout02"
//                     >
//                       <span className="d-flex h-100 flex-column gap-1">
//                         <span className="bg-light d-flex p-1 gap-1 align-items-center">
//                           <span className="d-block p-1 bg-primary-subtle rounded me-1" />
//                           <span className="d-block p-1 pb-0 px-2 bg-primary-subtle ms-auto" />
//                           <span className="d-block p-1 pb-0 px-2 bg-primary-subtle" />
//                         </span>
//                         <span className="bg-light d-block p-1" />
//                         <span className="bg-light d-block p-1 mt-auto" />
//                       </span>
//                     </label>
//                   </div>
//                   <h5 className="fs-13 text-center mt-2">Horizontal</h5>
//                 </div>
//                 <div className="col-4">
//                   <div className="form-check card-radio">
//                     <input
//                       id="customizer-layout03"
//                       name="data-layout"
//                       type="radio"
//                       defaultValue="twocolumn"
//                       className="form-check-input"
//                     />
//                     <label
//                       className="form-check-label p-0 avatar-md w-100"
//                       htmlFor="customizer-layout03"
//                     >
//                       <span className="d-flex gap-1 h-100">
//                         <span className="flex-shrink-0">
//                           <span className="bg-light d-flex h-100 flex-column gap-1">
//                             <span className="d-block p-1 bg-primary-subtle mb-2" />
//                             <span className="d-block p-1 pb-0 bg-primary-subtle" />
//                             <span className="d-block p-1 pb-0 bg-primary-subtle" />
//                             <span className="d-block p-1 pb-0 bg-primary-subtle" />
//                           </span>
//                         </span>
//                         <span className="flex-shrink-0">
//                           <span className="bg-light d-flex h-100 flex-column gap-1 p-1">
//                             <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                             <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                             <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                             <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                           </span>
//                         </span>
//                         <span className="flex-grow-1">
//                           <span className="d-flex h-100 flex-column">
//                             <span className="bg-light d-block p-1" />
//                             <span className="bg-light d-block p-1 mt-auto" />
//                           </span>
//                         </span>
//                       </span>
//                     </label>
//                   </div>
//                   <h5 className="fs-13 text-center mt-2">Two Column</h5>
//                 </div>
//                 {/* end col */}
//                 <div className="col-4">
//                   <div className="form-check card-radio">
//                     <input
//                       id="customizer-layout04"
//                       name="data-layout"
//                       type="radio"
//                       defaultValue="semibox"
//                       className="form-check-input"
//                     />
//                     <label
//                       className="form-check-label p-0 avatar-md w-100"
//                       htmlFor="customizer-layout04"
//                     >
//                       <span className="d-flex gap-1 h-100">
//                         <span className="flex-shrink-0 p-1">
//                           <span className="bg-light d-flex h-100 flex-column gap-1 p-1">
//                             <span className="d-block p-1 px-2 bg-primary-subtle rounded mb-2" />
//                             <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                             <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                             <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                           </span>
//                         </span>
//                         <span className="flex-grow-1">
//                           <span className="d-flex h-100 flex-column pt-1 pe-2">
//                             <span className="bg-light d-block p-1" />
//                             <span className="bg-light d-block p-1 mt-auto" />
//                           </span>
//                         </span>
//                       </span>
//                     </label>
//                   </div>
//                   <h5 className="fs-13 text-center mt-2">Semi Box</h5>
//                 </div>
//                 {/* end col */}
//               </div>
//               <h6 className="mt-4 mb-0 fw-semibold text-uppercase">Color Scheme</h6>
//               <p className="text-muted">Choose Light or Dark Scheme.</p>
//               <div className="colorscheme-cardradio">
//                 <div className="row">
//                   <div className="col-4">
//                     <div className="form-check card-radio">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="data-bs-theme"
//                         id="layout-mode-light"
//                         defaultValue="light"
//                       />
//                       <label
//                         className="form-check-label p-0 avatar-md w-100"
//                         htmlFor="layout-mode-light"
//                       >
//                         <span className="d-flex gap-1 h-100">
//                           <span className="flex-shrink-0">
//                             <span className="bg-light d-flex h-100 flex-column gap-1 p-1">
//                               <span className="d-block p-1 px-2 bg-primary-subtle rounded mb-2" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                             </span>
//                           </span>
//                           <span className="flex-grow-1">
//                             <span className="d-flex h-100 flex-column">
//                               <span className="bg-light d-block p-1" />
//                               <span className="bg-light d-block p-1 mt-auto" />
//                             </span>
//                           </span>
//                         </span>
//                       </label>
//                     </div>
//                     <h5 className="fs-13 text-center mt-2">Light</h5>
//                   </div>
//                   <div className="col-4">
//                     <div className="form-check card-radio dark">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="data-bs-theme"
//                         id="layout-mode-dark"
//                         defaultValue="dark"
//                       />
//                       <label
//                         className="form-check-label p-0 avatar-md w-100 bg-dark"
//                         htmlFor="layout-mode-dark"
//                       >
//                         <span className="d-flex gap-1 h-100">
//                           <span className="flex-shrink-0">
//                             <span className="bg-white bg-opacity-10 d-flex h-100 flex-column gap-1 p-1">
//                               <span className="d-block p-1 px-2 bg-white bg-opacity-10 rounded mb-2" />
//                               <span className="d-block p-1 px-2 pb-0 bg-white bg-opacity-10" />
//                               <span className="d-block p-1 px-2 pb-0 bg-white bg-opacity-10" />
//                               <span className="d-block p-1 px-2 pb-0 bg-white bg-opacity-10" />
//                             </span>
//                           </span>
//                           <span className="flex-grow-1">
//                             <span className="d-flex h-100 flex-column">
//                               <span className="bg-white bg-opacity-10 d-block p-1" />
//                               <span className="bg-white bg-opacity-10 d-block p-1 mt-auto" />
//                             </span>
//                           </span>
//                         </span>
//                       </label>
//                     </div>
//                     <h5 className="fs-13 text-center mt-2">Dark</h5>
//                   </div>
//                 </div>
//               </div>
//               <div id="sidebar-visibility">
//                 <h6 className="mt-4 mb-0 fw-semibold text-uppercase">
//                   Sidebar Visibility
//                 </h6>
//                 <p className="text-muted">Choose show or Hidden sidebar.</p>
//                 <div className="row">
//                   <div className="col-4">
//                     <div className="form-check card-radio">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="data-sidebar-visibility"
//                         id="sidebar-visibility-show"
//                         defaultValue="show"
//                       />
//                       <label
//                         className="form-check-label p-0 avatar-md w-100"
//                         htmlFor="sidebar-visibility-show"
//                       >
//                         <span className="d-flex gap-1 h-100">
//                           <span className="flex-shrink-0 p-1">
//                             <span className="bg-light d-flex h-100 flex-column gap-1 p-1">
//                               <span className="d-block p-1 px-2 bg-primary-subtle rounded mb-2" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                             </span>
//                           </span>
//                           <span className="flex-grow-1">
//                             <span className="d-flex h-100 flex-column pt-1 pe-2">
//                               <span className="bg-light d-block p-1" />
//                               <span className="bg-light d-block p-1 mt-auto" />
//                             </span>
//                           </span>
//                         </span>
//                       </label>
//                     </div>
//                     <h5 className="fs-13 text-center mt-2">Show</h5>
//                   </div>
//                   <div className="col-4">
//                     <div className="form-check card-radio">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="data-sidebar-visibility"
//                         id="sidebar-visibility-hidden"
//                         defaultValue="hidden"
//                       />
//                       <label
//                         className="form-check-label p-0 avatar-md w-100 px-2"
//                         htmlFor="sidebar-visibility-hidden"
//                       >
//                         <span className="d-flex gap-1 h-100">
//                           <span className="flex-grow-1">
//                             <span className="d-flex h-100 flex-column pt-1 px-2">
//                               <span className="bg-light d-block p-1" />
//                               <span className="bg-light d-block p-1 mt-auto" />
//                             </span>
//                           </span>
//                         </span>
//                       </label>
//                     </div>
//                     <h5 className="fs-13 text-center mt-2">Hidden</h5>
//                   </div>
//                 </div>
//               </div>
//               <div id="layout-width">
//                 <h6 className="mt-4 mb-0 fw-semibold text-uppercase">
//                   Layout Width
//                 </h6>
//                 <p className="text-muted">Choose Fluid or Boxed layout.</p>
//                 <div className="row">
//                   <div className="col-4">
//                     <div className="form-check card-radio">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="data-layout-width"
//                         id="layout-width-fluid"
//                         defaultValue="fluid"
//                       />
//                       <label
//                         className="form-check-label p-0 avatar-md w-100"
//                         htmlFor="layout-width-fluid"
//                       >
//                         <span className="d-flex gap-1 h-100">
//                           <span className="flex-shrink-0">
//                             <span className="bg-light d-flex h-100 flex-column gap-1 p-1">
//                               <span className="d-block p-1 px-2 bg-primary-subtle rounded mb-2" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                             </span>
//                           </span>
//                           <span className="flex-grow-1">
//                             <span className="d-flex h-100 flex-column">
//                               <span className="bg-light d-block p-1" />
//                               <span className="bg-light d-block p-1 mt-auto" />
//                             </span>
//                           </span>
//                         </span>
//                       </label>
//                     </div>
//                     <h5 className="fs-13 text-center mt-2">Fluid</h5>
//                   </div>
//                   <div className="col-4">
//                     <div className="form-check card-radio">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="data-layout-width"
//                         id="layout-width-boxed"
//                         defaultValue="boxed"
//                       />
//                       <label
//                         className="form-check-label p-0 avatar-md w-100 px-2"
//                         htmlFor="layout-width-boxed"
//                       >
//                         <span className="d-flex gap-1 h-100 border-start border-end">
//                           <span className="flex-shrink-0">
//                             <span className="bg-light d-flex h-100 flex-column gap-1 p-1">
//                               <span className="d-block p-1 px-2 bg-primary-subtle rounded mb-2" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                             </span>
//                           </span>
//                           <span className="flex-grow-1">
//                             <span className="d-flex h-100 flex-column">
//                               <span className="bg-light d-block p-1" />
//                               <span className="bg-light d-block p-1 mt-auto" />
//                             </span>
//                           </span>
//                         </span>
//                       </label>
//                     </div>
//                     <h5 className="fs-13 text-center mt-2">Boxed</h5>
//                   </div>
//                 </div>
//               </div>
//               <div id="layout-position">
//                 <h6 className="mt-4 mb-0 fw-semibold text-uppercase">
//                   Layout Position
//                 </h6>
//                 <p className="text-muted">
//                   Choose Fixed or Scrollable Layout Position.
//                 </p>
//                 <div className="btn-group radio" role="group">
//                   <input
//                     type="radio"
//                     className="btn-check"
//                     name="data-layout-position"
//                     id="layout-position-fixed"
//                     defaultValue="fixed"
//                   />
//                   <label
//                     className="btn btn-light w-sm"
//                     htmlFor="layout-position-fixed"
//                   >
//                     Fixed
//                   </label>
//                   <input
//                     type="radio"
//                     className="btn-check"
//                     name="data-layout-position"
//                     id="layout-position-scrollable"
//                     defaultValue="scrollable"
//                   />
//                   <label
//                     className="btn btn-light w-sm ms-0"
//                     htmlFor="layout-position-scrollable"
//                   >
//                     Scrollable
//                   </label>
//                 </div>
//               </div>
//               <h6 className="mt-4 mb-0 fw-semibold text-uppercase">Topbar Color</h6>
//               <p className="text-muted">Choose Light or Dark Topbar Color.</p>
//               <div className="row">
//                 <div className="col-4">
//                   <div className="form-check card-radio">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="data-topbar"
//                       id="topbar-color-light"
//                       defaultValue="light"
//                     />
//                     <label
//                       className="form-check-label p-0 avatar-md w-100"
//                       htmlFor="topbar-color-light"
//                     >
//                       <span className="d-flex gap-1 h-100">
//                         <span className="flex-shrink-0">
//                           <span className="bg-light d-flex h-100 flex-column gap-1 p-1">
//                             <span className="d-block p-1 px-2 bg-primary-subtle rounded mb-2" />
//                             <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                             <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                             <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                           </span>
//                         </span>
//                         <span className="flex-grow-1">
//                           <span className="d-flex h-100 flex-column">
//                             <span className="bg-light d-block p-1" />
//                             <span className="bg-light d-block p-1 mt-auto" />
//                           </span>
//                         </span>
//                       </span>
//                     </label>
//                   </div>
//                   <h5 className="fs-13 text-center mt-2">Light</h5>
//                 </div>
//                 <div className="col-4">
//                   <div className="form-check card-radio">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="data-topbar"
//                       id="topbar-color-dark"
//                       defaultValue="dark"
//                     />
//                     <label
//                       className="form-check-label p-0 avatar-md w-100"
//                       htmlFor="topbar-color-dark"
//                     >
//                       <span className="d-flex gap-1 h-100">
//                         <span className="flex-shrink-0">
//                           <span className="bg-light d-flex h-100 flex-column gap-1 p-1">
//                             <span className="d-block p-1 px-2 bg-primary-subtle rounded mb-2" />
//                             <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                             <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                             <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                           </span>
//                         </span>
//                         <span className="flex-grow-1">
//                           <span className="d-flex h-100 flex-column">
//                             <span className="bg-primary d-block p-1" />
//                             <span className="bg-light d-block p-1 mt-auto" />
//                           </span>
//                         </span>
//                       </span>
//                     </label>
//                   </div>
//                   <h5 className="fs-13 text-center mt-2">Dark</h5>
//                 </div>
//               </div>
//               <div id="sidebar-size">
//                 <h6 className="mt-4 mb-0 fw-semibold text-uppercase">
//                   Sidebar Size
//                 </h6>
//                 <p className="text-muted">Choose a size of Sidebar.</p>
//                 <div className="row">
//                   <div className="col-4">
//                     <div className="form-check sidebar-setting card-radio">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="data-sidebar-size"
//                         id="sidebar-size-default"
//                         defaultValue="lg"
//                       />
//                       <label
//                         className="form-check-label p-0 avatar-md w-100"
//                         htmlFor="sidebar-size-default"
//                       >
//                         <span className="d-flex gap-1 h-100">
//                           <span className="flex-shrink-0">
//                             <span className="bg-light d-flex h-100 flex-column gap-1 p-1">
//                               <span className="d-block p-1 px-2 bg-primary-subtle rounded mb-2" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                             </span>
//                           </span>
//                           <span className="flex-grow-1">
//                             <span className="d-flex h-100 flex-column">
//                               <span className="bg-light d-block p-1" />
//                               <span className="bg-light d-block p-1 mt-auto" />
//                             </span>
//                           </span>
//                         </span>
//                       </label>
//                     </div>
//                     <h5 className="fs-13 text-center mt-2">Default</h5>
//                   </div>
//                   <div className="col-4">
//                     <div className="form-check sidebar-setting card-radio">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="data-sidebar-size"
//                         id="sidebar-size-compact"
//                         defaultValue="md"
//                       />
//                       <label
//                         className="form-check-label p-0 avatar-md w-100"
//                         htmlFor="sidebar-size-compact"
//                       >
//                         <span className="d-flex gap-1 h-100">
//                           <span className="flex-shrink-0">
//                             <span className="bg-light d-flex h-100 flex-column gap-1 p-1">
//                               <span className="d-block p-1 bg-primary-subtle rounded mb-2" />
//                               <span className="d-block p-1 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 pb-0 bg-primary-subtle" />
//                             </span>
//                           </span>
//                           <span className="flex-grow-1">
//                             <span className="d-flex h-100 flex-column">
//                               <span className="bg-light d-block p-1" />
//                               <span className="bg-light d-block p-1 mt-auto" />
//                             </span>
//                           </span>
//                         </span>
//                       </label>
//                     </div>
//                     <h5 className="fs-13 text-center mt-2">Compact</h5>
//                   </div>
//                   <div className="col-4">
//                     <div className="form-check sidebar-setting card-radio">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="data-sidebar-size"
//                         id="sidebar-size-small"
//                         defaultValue="sm"
//                       />
//                       <label
//                         className="form-check-label p-0 avatar-md w-100"
//                         htmlFor="sidebar-size-small"
//                       >
//                         <span className="d-flex gap-1 h-100">
//                           <span className="flex-shrink-0">
//                             <span className="bg-light d-flex h-100 flex-column gap-1">
//                               <span className="d-block p-1 bg-primary-subtle mb-2" />
//                               <span className="d-block p-1 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 pb-0 bg-primary-subtle" />
//                             </span>
//                           </span>
//                           <span className="flex-grow-1">
//                             <span className="d-flex h-100 flex-column">
//                               <span className="bg-light d-block p-1" />
//                               <span className="bg-light d-block p-1 mt-auto" />
//                             </span>
//                           </span>
//                         </span>
//                       </label>
//                     </div>
//                     <h5 className="fs-13 text-center mt-2">Small (Icon View)</h5>
//                   </div>
//                   <div className="col-4">
//                     <div className="form-check sidebar-setting card-radio">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="data-sidebar-size"
//                         id="sidebar-size-small-hover"
//                         defaultValue="sm-hover"
//                       />
//                       <label
//                         className="form-check-label p-0 avatar-md w-100"
//                         htmlFor="sidebar-size-small-hover"
//                       >
//                         <span className="d-flex gap-1 h-100">
//                           <span className="flex-shrink-0">
//                             <span className="bg-light d-flex h-100 flex-column gap-1">
//                               <span className="d-block p-1 bg-primary-subtle mb-2" />
//                               <span className="d-block p-1 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 pb-0 bg-primary-subtle" />
//                             </span>
//                           </span>
//                           <span className="flex-grow-1">
//                             <span className="d-flex h-100 flex-column">
//                               <span className="bg-light d-block p-1" />
//                               <span className="bg-light d-block p-1 mt-auto" />
//                             </span>
//                           </span>
//                         </span>
//                       </label>
//                     </div>
//                     <h5 className="fs-13 text-center mt-2">Small Hover View</h5>
//                   </div>
//                 </div>
//               </div>
//               <div id="sidebar-view">
//                 <h6 className="mt-4 mb-0 fw-semibold text-uppercase">
//                   Sidebar View
//                 </h6>
//                 <p className="text-muted">
//                   Choose Default or Detached Sidebar view.
//                 </p>
//                 <div className="row">
//                   <div className="col-4">
//                     <div className="form-check sidebar-setting card-radio">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="data-layout-style"
//                         id="sidebar-view-default"
//                         defaultValue="default"
//                       />
//                       <label
//                         className="form-check-label p-0 avatar-md w-100"
//                         htmlFor="sidebar-view-default"
//                       >
//                         <span className="d-flex gap-1 h-100">
//                           <span className="flex-shrink-0">
//                             <span className="bg-light d-flex h-100 flex-column gap-1 p-1">
//                               <span className="d-block p-1 px-2 bg-primary-subtle rounded mb-2" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                             </span>
//                           </span>
//                           <span className="flex-grow-1">
//                             <span className="d-flex h-100 flex-column">
//                               <span className="bg-light d-block p-1" />
//                               <span className="bg-light d-block p-1 mt-auto" />
//                             </span>
//                           </span>
//                         </span>
//                       </label>
//                     </div>
//                     <h5 className="fs-13 text-center mt-2">Default</h5>
//                   </div>
//                   <div className="col-4">
//                     <div className="form-check sidebar-setting card-radio">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="data-layout-style"
//                         id="sidebar-view-detached"
//                         defaultValue="detached"
//                       />
//                       <label
//                         className="form-check-label p-0 avatar-md w-100"
//                         htmlFor="sidebar-view-detached"
//                       >
//                         <span className="d-flex h-100 flex-column">
//                           <span className="bg-light d-flex p-1 gap-1 align-items-center px-2">
//                             <span className="d-block p-1 bg-primary-subtle rounded me-1" />
//                             <span className="d-block p-1 pb-0 px-2 bg-primary-subtle ms-auto" />
//                             <span className="d-block p-1 pb-0 px-2 bg-primary-subtle" />
//                           </span>
//                           <span className="d-flex gap-1 h-100 p-1 px-2">
//                             <span className="flex-shrink-0">
//                               <span className="bg-light d-flex h-100 flex-column gap-1 p-1">
//                                 <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                                 <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                                 <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                               </span>
//                             </span>
//                           </span>
//                           <span className="bg-light d-block p-1 mt-auto px-2" />
//                         </span>
//                       </label>
//                     </div>
//                     <h5 className="fs-13 text-center mt-2">Detached</h5>
//                   </div>
//                 </div>
//               </div>
//               <div id="sidebar-color">
//                 <h6 className="mt-4 mb-0 fw-semibold text-uppercase">
//                   Sidebar Color
//                 </h6>
//                 <p className="text-muted">Choose a color of Sidebar.</p>
//                 <div className="row">
//                   <div className="col-4">
//                     <div
//                       className="form-check sidebar-setting card-radio"
//                       data-bs-toggle="collapse"
//                       data-bs-target="#collapseBgGradient.show"
//                     >
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="data-sidebar"
//                         id="sidebar-color-light"
//                         defaultValue="light"
//                       />
//                       <label
//                         className="form-check-label p-0 avatar-md w-100"
//                         htmlFor="sidebar-color-light"
//                       >
//                         <span className="d-flex gap-1 h-100">
//                           <span className="flex-shrink-0">
//                             <span className="bg-white border-end d-flex h-100 flex-column gap-1 p-1">
//                               <span className="d-block p-1 px-2 bg-primary-subtle rounded mb-2" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                             </span>
//                           </span>
//                           <span className="flex-grow-1">
//                             <span className="d-flex h-100 flex-column">
//                               <span className="bg-light d-block p-1" />
//                               <span className="bg-light d-block p-1 mt-auto" />
//                             </span>
//                           </span>
//                         </span>
//                       </label>
//                     </div>
//                     <h5 className="fs-13 text-center mt-2">Light</h5>
//                   </div>
//                   <div className="col-4">
//                     <div
//                       className="form-check sidebar-setting card-radio"
//                       data-bs-toggle="collapse"
//                       data-bs-target="#collapseBgGradient.show"
//                     >
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="data-sidebar"
//                         id="sidebar-color-dark"
//                         defaultValue="dark"
//                       />
//                       <label
//                         className="form-check-label p-0 avatar-md w-100"
//                         htmlFor="sidebar-color-dark"
//                       >
//                         <span className="d-flex gap-1 h-100">
//                           <span className="flex-shrink-0">
//                             <span className="bg-primary d-flex h-100 flex-column gap-1 p-1">
//                               <span className="d-block p-1 px-2 bg-white bg-opacity-10 rounded mb-2" />
//                               <span className="d-block p-1 px-2 pb-0 bg-white bg-opacity-10" />
//                               <span className="d-block p-1 px-2 pb-0 bg-white bg-opacity-10" />
//                               <span className="d-block p-1 px-2 pb-0 bg-white bg-opacity-10" />
//                             </span>
//                           </span>
//                           <span className="flex-grow-1">
//                             <span className="d-flex h-100 flex-column">
//                               <span className="bg-light d-block p-1" />
//                               <span className="bg-light d-block p-1 mt-auto" />
//                             </span>
//                           </span>
//                         </span>
//                       </label>
//                     </div>
//                     <h5 className="fs-13 text-center mt-2">Dark</h5>
//                   </div>
//                   <div className="col-4">
//                     <button
//                       className="btn btn-link avatar-md w-100 p-0 overflow-hidden border collapsed"
//                       type="button"
//                       data-bs-toggle="collapse"
//                       data-bs-target="#collapseBgGradient"
//                       aria-expanded="false"
//                       aria-controls="collapseBgGradient"
//                     >
//                       <span className="d-flex gap-1 h-100">
//                         <span className="flex-shrink-0">
//                           <span className="bg-vertical-gradient d-flex h-100 flex-column gap-1 p-1">
//                             <span className="d-block p-1 px-2 bg-white bg-opacity-10 rounded mb-2" />
//                             <span className="d-block p-1 px-2 pb-0 bg-white bg-opacity-10" />
//                             <span className="d-block p-1 px-2 pb-0 bg-white bg-opacity-10" />
//                             <span className="d-block p-1 px-2 pb-0 bg-white bg-opacity-10" />
//                           </span>
//                         </span>
//                         <span className="flex-grow-1">
//                           <span className="d-flex h-100 flex-column">
//                             <span className="bg-light d-block p-1" />
//                             <span className="bg-light d-block p-1 mt-auto" />
//                           </span>
//                         </span>
//                       </span>
//                     </button>
//                     <h5 className="fs-13 text-center mt-2">Gradient</h5>
//                   </div>
//                 </div>
//                 {/* end row */}
//                 <div className="collapse" id="collapseBgGradient">
//                   <div className="d-flex gap-2 flex-wrap img-switch p-2 px-3 bg-light rounded">
//                     <div className="form-check sidebar-setting card-radio">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="data-sidebar"
//                         id="sidebar-color-gradient"
//                         defaultValue="gradient"
//                       />
//                       <label
//                         className="form-check-label p-0 avatar-xs rounded-circle"
//                         htmlFor="sidebar-color-gradient"
//                       >
//                         <span className="avatar-title rounded-circle bg-vertical-gradient" />
//                       </label>
//                     </div>
//                     <div className="form-check sidebar-setting card-radio">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="data-sidebar"
//                         id="sidebar-color-gradient-2"
//                         defaultValue="gradient-2"
//                       />
//                       <label
//                         className="form-check-label p-0 avatar-xs rounded-circle"
//                         htmlFor="sidebar-color-gradient-2"
//                       >
//                         <span className="avatar-title rounded-circle bg-vertical-gradient-2" />
//                       </label>
//                     </div>
//                     <div className="form-check sidebar-setting card-radio">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="data-sidebar"
//                         id="sidebar-color-gradient-3"
//                         defaultValue="gradient-3"
//                       />
//                       <label
//                         className="form-check-label p-0 avatar-xs rounded-circle"
//                         htmlFor="sidebar-color-gradient-3"
//                       >
//                         <span className="avatar-title rounded-circle bg-vertical-gradient-3" />
//                       </label>
//                     </div>
//                     <div className="form-check sidebar-setting card-radio">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="data-sidebar"
//                         id="sidebar-color-gradient-4"
//                         defaultValue="gradient-4"
//                       />
//                       <label
//                         className="form-check-label p-0 avatar-xs rounded-circle"
//                         htmlFor="sidebar-color-gradient-4"
//                       >
//                         <span className="avatar-title rounded-circle bg-vertical-gradient-4" />
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div id="sidebar-img">
//                 <h6 className="mt-4 mb-0 fw-semibold text-uppercase">
//                   Sidebar Images
//                 </h6>
//                 <p className="text-muted">Choose a image of Sidebar.</p>
//                 <div className="d-flex gap-2 flex-wrap img-switch">
//                   <div className="form-check sidebar-setting card-radio">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="data-sidebar-image"
//                       id="sidebarimg-none"
//                       defaultValue="none"
//                     />
//                     <label
//                       className="form-check-label p-0 avatar-sm h-auto"
//                       htmlFor="sidebarimg-none"
//                     >
//                       <span className="avatar-md w-auto bg-light d-flex align-items-center justify-content-center">
//                         <i className="ri-close-fill fs-20" />
//                       </span>
//                     </label>
//                   </div>
//                   <div className="form-check sidebar-setting card-radio">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="data-sidebar-image"
//                       id="sidebarimg-01"
//                       defaultValue="img-1"
//                     />
//                     <label
//                       className="form-check-label p-0 avatar-sm h-auto"
//                       htmlFor="sidebarimg-01"
//                     >
//                       <img
//                         src="/assets/images/sidebar/img-1.jpg"
//                         alt=""
//                         className="avatar-md w-auto object-fit-cover"
//                       />
//                     </label>
//                   </div>
//                   <div className="form-check sidebar-setting card-radio">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="data-sidebar-image"
//                       id="sidebarimg-02"
//                       defaultValue="img-2"
//                     />
//                     <label
//                       className="form-check-label p-0 avatar-sm h-auto"
//                       htmlFor="sidebarimg-02"
//                     >
//                       <img
//                         src="/assets/images/sidebar/img-2.jpg"
//                         alt=""
//                         className="avatar-md w-auto object-fit-cover"
//                       />
//                     </label>
//                   </div>
//                   <div className="form-check sidebar-setting card-radio">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="data-sidebar-image"
//                       id="sidebarimg-03"
//                       defaultValue="img-3"
//                     />
//                     <label
//                       className="form-check-label p-0 avatar-sm h-auto"
//                       htmlFor="sidebarimg-03"
//                     >
//                       <img
//                         src="/assets/images/sidebar/img-3.jpg"
//                         alt=""
//                         className="avatar-md w-auto object-fit-cover"
//                       />
//                     </label>
//                   </div>
//                   <div className="form-check sidebar-setting card-radio">
//                     <input
//                       className="form-check-input"
//                       type="radio"
//                       name="data-sidebar-image"
//                       id="sidebarimg-04"
//                       defaultValue="img-4"
//                     />
//                     <label
//                       className="form-check-label p-0 avatar-sm h-auto"
//                       htmlFor="sidebarimg-04"
//                     >
//                       <img
//                         src="/assets/images/sidebar/img-4.jpg"
//                         alt=""
//                         className="avatar-md w-auto object-fit-cover"
//                       />
//                     </label>
//                   </div>
//                 </div>
//               </div>
//               <div id="preloader-menu">
//                 <h6 className="mt-4 mb-0 fw-semibold text-uppercase">Preloader</h6>
//                 <p className="text-muted">Choose a preloader.</p>
//                 <div className="row">
//                   <div className="col-4">
//                     <div className="form-check sidebar-setting card-radio">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="data-preloader"
//                         id="preloader-view-custom"
//                         defaultValue="enable"
//                       />
//                       <label
//                         className="form-check-label p-0 avatar-md w-100"
//                         htmlFor="preloader-view-custom"
//                       >
//                         <span className="d-flex gap-1 h-100">
//                           <span className="flex-shrink-0">
//                             <span className="bg-light d-flex h-100 flex-column gap-1 p-1">
//                               <span className="d-block p-1 px-2 bg-primary-subtle rounded mb-2" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                             </span>
//                           </span>
//                           <span className="flex-grow-1">
//                             <span className="d-flex h-100 flex-column">
//                               <span className="bg-light d-block p-1" />
//                               <span className="bg-light d-block p-1 mt-auto" />
//                             </span>
//                           </span>
//                         </span>
//                         {/* <div id="preloader"> */}
//                         <div
//                           id="status"
//                           className="d-flex align-items-center justify-content-center"
//                         >
//                           <div
//                             className="spinner-border text-primary avatar-xxs m-auto"
//                             role="status"
//                           >
//                             <span className="visually-hidden">Loading...</span>
//                           </div>
//                         </div>
//                         {/* </div> */}
//                       </label>
//                     </div>
//                     <h5 className="fs-13 text-center mt-2">Enable</h5>
//                   </div>
//                   <div className="col-4">
//                     <div className="form-check sidebar-setting card-radio">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="data-preloader"
//                         id="preloader-view-none"
//                         defaultValue="disable"
//                       />
//                       <label
//                         className="form-check-label p-0 avatar-md w-100"
//                         htmlFor="preloader-view-none"
//                       >
//                         <span className="d-flex gap-1 h-100">
//                           <span className="flex-shrink-0">
//                             <span className="bg-light d-flex h-100 flex-column gap-1 p-1">
//                               <span className="d-block p-1 px-2 bg-primary-subtle rounded mb-2" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                               <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
//                             </span>
//                           </span>
//                           <span className="flex-grow-1">
//                             <span className="d-flex h-100 flex-column">
//                               <span className="bg-light d-block p-1" />
//                               <span className="bg-light d-block p-1 mt-auto" />
//                             </span>
//                           </span>
//                         </span>
//                       </label>
//                     </div>
//                     <h5 className="fs-13 text-center mt-2">Disable</h5>
//                   </div>
//                 </div>
//               </div>
//               {/* end preloader-menu */}
//             </div>
//           </div>
//         </div>

//         <div className="offcanvas-footer border-top p-3 text-center">
//           <div className="row">
//             <div className="col-6">
//               <button
//                 type="button"
//                 className="btn btn-light w-100"
//                 id="reset-layout"
//               >
//                 Reset
//               </button>
//             </div>
//             <div className="col-6">
//               <a
//                 href="https://1.envato.market/velzon-admin"
//                 target="_blank"
//                 className="btn btn-primary w-100"
//               >
//                 Buy Now
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }




import React from 'react'

export default function ThemeSetting() {
  return (
    <>
    <div className="theme-customizer">
        <div className="customizer-handle">
          <a
            href="javascript:void(0);"
            className="cutomizer-open-trigger bg-primary"
          >
            <i className="feather-settings" />
          </a>
        </div>
        <div className="customizer-sidebar-wrapper">
          <div className="customizer-sidebar-header px-4 ht-80 border-bottom d-flex align-items-center justify-content-between">
            <h5 className="mb-0">Theme Settings</h5>
            <a
              href="javascript:void(0);"
              className="cutomizer-close-trigger d-flex"
            >
              <i className="feather-x" />
            </a>
          </div>
          <div
            className="customizer-sidebar-body position-relative p-4"
            data-scrollbar-target="#psScrollbarInit"
          >
            {/*! BEGIN: [Navigation] !*/}
            <div className="position-relative px-3 pb-3 pt-4 mt-3 mb-5 border border-gray-2 theme-options-set">
              <label
                className="py-1 px-2 fs-8 fw-bold text-uppercase text-muted text-spacing-2 bg-white border border-gray-2 position-absolute rounded-2 options-label"
                style={{ top: "-12px" }}
              >
                Navigation
              </label>
              <div
                className="row g-2 theme-options-items app-navigation"
                id="appNavigationList"
              >
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-navigation-light"
                    name="app-navigation"
                    defaultValue={1}
                    data-app-navigation="app-navigation-light"
                    defaultChecked=""
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-navigation-light"
                  >
                    Light
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-navigation-dark"
                    name="app-navigation"
                    defaultValue={2}
                    data-app-navigation="app-navigation-dark"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-navigation-dark"
                  >
                    Dark
                  </label>
                </div>
              </div>
            </div>
            {/*! END: [Navigation] !*/}
            {/*! BEGIN: [Header] !*/}
            <div className="position-relative px-3 pb-3 pt-4 mt-3 mb-5 border border-gray-2 theme-options-set mt-5">
              <label
                className="py-1 px-2 fs-8 fw-bold text-uppercase text-muted text-spacing-2 bg-white border border-gray-2 position-absolute rounded-2 options-label"
                style={{ top: "-12px" }}
              >
                Header
              </label>
              <div
                className="row g-2 theme-options-items app-header"
                id="appHeaderList"
              >
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-header-light"
                    name="app-header"
                    defaultValue={1}
                    data-app-header="app-header-light"
                    defaultChecked=""
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-header-light"
                  >
                    Light
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-header-dark"
                    name="app-header"
                    defaultValue={2}
                    data-app-header="app-header-dark"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-header-dark"
                  >
                    Dark
                  </label>
                </div>
              </div>
            </div>
            {/*! END: [Header] !*/}
            {/*! BEGIN: [Skins] !*/}
            <div className="position-relative px-3 pb-3 pt-4 mt-3 mb-5 border border-gray-2 theme-options-set">
              <label
                className="py-1 px-2 fs-8 fw-bold text-uppercase text-muted text-spacing-2 bg-white border border-gray-2 position-absolute rounded-2 options-label"
                style={{ top: "-12px" }}
              >
                Skins
              </label>
              <div
                className="row g-2 theme-options-items app-skin"
                id="appSkinList"
              >
                <div className="col-6 text-center position-relative single-option light-button active">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-skin-light"
                    name="app-skin"
                    defaultValue={1}
                    data-app-skin="app-skin-light"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-skin-light"
                  >
                    Light
                  </label>
                </div>
                <div className="col-6 text-center position-relative single-option dark-button">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-skin-dark"
                    name="app-skin"
                    defaultValue={2}
                    data-app-skin="app-skin-dark"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-skin-dark"
                  >
                    Dark
                  </label>
                </div>
              </div>
            </div>
            {/*! END: [Skins] !*/}
            {/*! BEGIN: [Typography] !*/}
            <div className="position-relative px-3 pb-3 pt-4 mt-3 mb-0 border border-gray-2 theme-options-set">
              <label
                className="py-1 px-2 fs-8 fw-bold text-uppercase text-muted text-spacing-2 bg-white border border-gray-2 position-absolute rounded-2 options-label"
                style={{ top: "-12px" }}
              >
                Typography
              </label>
              <div
                className="row g-2 theme-options-items font-family"
                id="fontFamilyList"
              >
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-lato"
                    name="font-family"
                    defaultValue={1}
                    data-font-family="app-font-family-lato"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-lato"
                  >
                    Lato
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-rubik"
                    name="font-family"
                    defaultValue={2}
                    data-font-family="app-font-family-rubik"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-rubik"
                  >
                    Rubik
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-inter"
                    name="font-family"
                    defaultValue={3}
                    data-font-family="app-font-family-inter"
                    defaultChecked=""
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-inter"
                  >
                    Inter
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-cinzel"
                    name="font-family"
                    defaultValue={4}
                    data-font-family="app-font-family-cinzel"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-cinzel"
                  >
                    Cinzel
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-nunito"
                    name="font-family"
                    defaultValue={6}
                    data-font-family="app-font-family-nunito"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-nunito"
                  >
                    Nunito
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-roboto"
                    name="font-family"
                    defaultValue={7}
                    data-font-family="app-font-family-roboto"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-roboto"
                  >
                    Roboto
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-ubuntu"
                    name="font-family"
                    defaultValue={8}
                    data-font-family="app-font-family-ubuntu"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-ubuntu"
                  >
                    Ubuntu
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-poppins"
                    name="font-family"
                    defaultValue={9}
                    data-font-family="app-font-family-poppins"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-poppins"
                  >
                    Poppins
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-raleway"
                    name="font-family"
                    defaultValue={10}
                    data-font-family="app-font-family-raleway"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-raleway"
                  >
                    Raleway
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-system-ui"
                    name="font-family"
                    defaultValue={11}
                    data-font-family="app-font-family-system-ui"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-system-ui"
                  >
                    System UI
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-noto-sans"
                    name="font-family"
                    defaultValue={12}
                    data-font-family="app-font-family-noto-sans"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-noto-sans"
                  >
                    Noto Sans
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-fira-sans"
                    name="font-family"
                    defaultValue={13}
                    data-font-family="app-font-family-fira-sans"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-fira-sans"
                  >
                    Fira Sans
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-work-sans"
                    name="font-family"
                    defaultValue={14}
                    data-font-family="app-font-family-work-sans"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-work-sans"
                  >
                    Work Sans
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-open-sans"
                    name="font-family"
                    defaultValue={15}
                    data-font-family="app-font-family-open-sans"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-open-sans"
                  >
                    Open Sans
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-maven-pro"
                    name="font-family"
                    defaultValue={16}
                    data-font-family="app-font-family-maven-pro"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-maven-pro"
                  >
                    Maven Pro
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-quicksand"
                    name="font-family"
                    defaultValue={17}
                    data-font-family="app-font-family-quicksand"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-quicksand"
                  >
                    Quicksand
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-montserrat"
                    name="font-family"
                    defaultValue={18}
                    data-font-family="app-font-family-montserrat"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-montserrat"
                  >
                    Montserrat
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-josefin-sans"
                    name="font-family"
                    defaultValue={19}
                    data-font-family="app-font-family-josefin-sans"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-josefin-sans"
                  >
                    Josefin Sans
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-ibm-plex-sans"
                    name="font-family"
                    defaultValue={20}
                    data-font-family="app-font-family-ibm-plex-sans"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-ibm-plex-sans"
                  >
                    IBM Plex Sans
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-source-sans-pro"
                    name="font-family"
                    defaultValue={5}
                    data-font-family="app-font-family-source-sans-pro"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-source-sans-pro"
                  >
                    Source Sans Pro
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-montserrat-alt"
                    name="font-family"
                    defaultValue={21}
                    data-font-family="app-font-family-montserrat-alt"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-montserrat-alt"
                  >
                    Montserrat Alt
                  </label>
                </div>
                <div className="col-6 text-center single-option">
                  <input
                    type="radio"
                    className="btn-check"
                    id="app-font-family-roboto-slab"
                    name="font-family"
                    defaultValue={22}
                    data-font-family="app-font-family-roboto-slab"
                  />
                  <label
                    className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label"
                    htmlFor="app-font-family-roboto-slab"
                  >
                    Roboto Slab
                  </label>
                </div>
              </div>
            </div>
            {/*! END: [Typography] !*/}
          </div>
          <div className="customizer-sidebar-footer px-4 ht-60 border-top d-flex align-items-center gap-2">
            <div className="flex-fill w-50">
              <a
                href="javascript:void(0);"
                className="btn btn-danger"
                data-style="reset-all-common-style"
              >
                Reset
              </a>
            </div>
            <div className="flex-fill w-50">
              <a
                href="https://www.themewagon.com/themes/Duralux-admin"
                target="_blank"
                className="btn btn-primary"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      </div>
      
    </>
  )
}

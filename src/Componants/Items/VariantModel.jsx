// import React, { useState } from "react";
// import "./VariantModel.css";
// export default function VariantModal({ item, menu, onClose, onAdd }) {
//   const groups = menu.variantGroups.filter(
//     (g) => g.menuItem === item._id
//   );

//   const [selected, setSelected] = useState({});

//   const handleSelect = (group, variant) => {
//     setSelected((prev) => {
//       const prevGroup = prev[group._id] || [];

//       if (group.isMultiple) {
//         return {
//           ...prev,
//           [group._id]: prevGroup.some((v) => v._id === variant._id)
//             ? prevGroup.filter((v) => v._id !== variant._id)
//             : [...prevGroup, variant],
//         };
//       } else {
//         return { ...prev, [group._id]: [variant] };
//       }
//     });
//   };

//   const isValid = groups.every(
//     (g) => !g.isRequired || selected[g._id]?.length > 0
//   );

//   const selectedVariants = Object.values(selected).flat();

//   const totalPrice =
//     item.basePrice +
//     selectedVariants.reduce((s, v) => s + v.price, 0);

//   return (
//     <div className="variant-overlay">
//       <div className="variant-sheet">
//         <div className="variant-header">
//           <h3>{item.name}</h3>
//           <button className="close-btn" onClick={onClose}>✕</button>
//         </div>

//         {groups.map((group) => (
//           <div key={group._id} className="variant-group">
//             <h4>
//               {group.name}
//               {group.isRequired && (
//                 <span className="required">Required</span>
//               )}
//             </h4>

//             {menu.variants
//               .filter((v) => v.variantGroup === group._id)
//               .map((variant) => {
//                 const checked =
//                   selected[group._id]?.some(
//                     (v) => v._id === variant._id
//                   ) || false;

//                 return (
//                   <label key={variant._id} className="variant-option">
//                     <input
//                       type={group.isMultiple ? "checkbox" : "radio"}
//                       checked={checked}
//                       onChange={() => handleSelect(group, variant)}
//                     />
//                     <span>{variant.name}</span>
//                     <span className="price">+₹{variant.price}</span>
//                   </label>
//                 );
//               })}
//           </div>
//         ))}

//         <button
//           disabled={!isValid}
//           className="add-cart-btn"
//           onClick={() => {
//             onAdd(item, selectedVariants, totalPrice);
//             onClose();
//           }}
//         >
//           ADD ₹{totalPrice}
//         </button>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";

// export default function VariantModal({ item, menu, onClose, onAdd }) {
//   const groups = menu.variantGroups.filter(
//     g => g.menuItem === item._id
//   );

//   const [selected, setSelected] = useState({});

//   const handleSelect = (group, variant) => {
//     setSelected(prev => {
//       const prevGroup = prev[group._id] || [];

//       if (group.isMultiple) {
//         return {
//           ...prev,
//           [group._id]: prevGroup.some(v => v._id === variant._id)
//             ? prevGroup.filter(v => v._id !== variant._id)
//             : [...prevGroup, variant],
//         };
//       }
//       return { ...prev, [group._id]: [variant] };
//     });
//   };

//   const isValid = groups.every(
//     g => !g.isRequired || selected[g._id]?.length > 0
//   );

//   const selectedVariants = Object.values(selected).flat();
//   const totalPrice =
//     item.basePrice +
//     selectedVariants.reduce((s, v) => s + v.price, 0);

//   return (
//     <>
//       {/* BACKDROP */}
//       <div className="modal-backdrop fade show" onClick={onClose}></div>

//       {/* DRAWER */}
//       <div
//         className="modal fade show d-block"
//         tabIndex="-1"
//         style={{ background: "rgba(0,0,0,0.3)" }}
//       >
//         <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down modal-bottom">
//           <div className="modal-content rounded-top">

//             {/* IMAGE */}
//             {item.image && (
//               <img
//                 src={item.image}
//                 alt={item.name}
//                 className="w-100 rounded-top"
//                 style={{ height: 180, objectFit: "cover" }}
//               />
//             )}

//             {/* HEADER */}
//             <div className="modal-header">
//               <div>
//                 <h5 className="modal-title">{item.name}</h5>
//                 <small className="text-muted">
//                   Base price ₹{item.basePrice}
//                 </small>
//               </div>
//               <button className="btn-close" onClick={onClose}></button>
//             </div>

//             {/* BODY */}
//             <div className="modal-body">
//               {groups.map(group => (
//                 <div key={group._id} className="mb-4">
//                   <div className="d-flex align-items-center gap-2 mb-2">
//                     <h6 className="mb-0">{group.name}</h6>
//                     {group.isRequired && (
//                       <span className="badge bg-danger">Required</span>
//                     )}
//                     {group.isMultiple && (
//                       <span className="badge bg-primary">Multiple</span>
//                     )}
//                   </div>

//                   {menu.variants
//                     .filter(v => v.variantGroup === group._id)
//                     .map(variant => {
//                       const checked =
//                         selected[group._id]?.some(v => v._id === variant._id) || false;

//                       return (
//                         <div
//                           key={variant._id}
//                           className={`form-check d-flex justify-content-between align-items-center p-2 border rounded mb-2
//                             ${checked ? "border-success bg-light" : ""}
//                           `}
//                           onClick={() => handleSelect(group, variant)}
//                           style={{ cursor: "pointer" }}
//                         >
//                           <div>
//                             <input
//                               className="form-check-input me-2"
//                               type={group.isMultiple ? "checkbox" : "radio"}
//                               checked={checked}
//                               readOnly
//                             />
//                             <label className="form-check-label">
//                               {variant.name}
//                             </label>
//                           </div>
//                           <strong>+₹{variant.price}</strong>
//                         </div>
//                       );
//                     })}
//                 </div>
//               ))}
//             </div>

//             {/* FOOTER */}
//             <div className="modal-footer d-flex justify-content-between">
//               <h5 className="mb-0">₹{totalPrice}</h5>
//               <button
//                 className="btn btn-success"
//                 disabled={!isValid}
//                 onClick={() => {
//                   onAdd(item, selectedVariants, totalPrice);
//                   onClose();
//                 }}
//               >
//                 Add Item
//               </button>
//             </div>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }



// import React, { useEffect, useState } from "react";
// import "./VariantModel.css";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Slider from "react-slick";
// import "./VariantModel.css";
// import { useDispatch, useSelector } from "react-redux";
// import { addToCart } from "../../Store/feature/Items/cartSlice";
// export default function VariantDrawer({ open, onClose, item, onAdd, setQuantity }) {
//   const [selected, setSelected] = useState({});

//   const dispatch = useDispatch()
//   debugger
//   const menu = useSelector(state => state.menu.data);
//   const { restaurant, table } = useSelector(
//   state => state.context
// );


//   if (!open || !item || !menu) return null;

//   const groups = menu.variantGroups.filter(
//     g => g.menuItem === item._id
//   );

//   useEffect(() => {
//     if (!open) setSelected({});
//   }, [open]);

//   if (!open) return null;

//   // const groups = menu.variantGroups.filter(g => g.menuItem === item._id);

//   const handleSelect = (group, variant) => {
//     setSelected(prev => {
//       const list = prev[group._id] || [];

//       // 🔁 MULTIPLE VARIANTS
//       if (group.isMultiple) {
//         const exists = list.find(v => v._id === variant._id);

//         return {
//           ...prev,
//           [group._id]: exists
//             // ❌ remove variant
//             ? list.filter(v => v._id !== variant._id)
//             // ✅ add variant with quantity = 1
//             : [...list, { ...variant, quantity: 1 }]
//         };
//       }

//       // 🔁 SINGLE VARIANT (radio-type)
//       return {
//         ...prev,
//         [group._id]: [{ ...variant, quantity: 1 }]
//       };
//     });
//   };


//   const isValid = groups.every(g => !g.isRequired || selected[g._id]?.length);
//   const selectedVariants = Object.values(selected).flat();
//   const totalPrice =
//     item.basePrice + selectedVariants.reduce((s, v) => s + v.price, 0);

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 700,
//     autoplay: true,
//     autoplaySpeed: 3500,
//     arrows: false,
//     pauseOnHover: true,
//   };


//   return (
//     <div className="fixed inset-0 z-50 flex items-end justify-center">
//       {/* Backdrop */}
//       <div
//         onClick={onClose}
//         className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//       />

//       {/* Floating Close Button */}
//       <button
//         onClick={onClose}
//         className="absolute top-6 left-1/2 -translate-x-1/2 z-50
//           w-10 h-10 
//           shadow-xl border border-white/40
//           flex items-center justify-center
//           text-xl font-semibold
//           hover:scale-105 transition" style={{ borderRadius: "50px", color: "white" }}
//       >
//         <i class="bi bi-x-lg"></i>
//       </button>

//       {/* Drawer */}
//       <div className="relative w-full max-w-[430px] max-h-[90vh] bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.25)] animate-slideUp flex flex-col overflow-hidden">

//         {/* Image */}
//         {item.image && (
//           <div className="h-60 w-full">
//             {/* <img
//               src={item.image?.[0] ? `/assets/images/menu/${item.image[0]}` : `https://source.unsplash.com/600x400/?${item.name.replace(/\s+/g,'')}`}
//               alt={item.name}
//               className="w-full h-full object-cover"
//             /> */}

//             <Slider {...sliderSettings} className="custom-slider">
//               {item.image.map((img, index) => (
//                 <div key={index}>
//                   <img
//                     src={`/assets/images/menu/${img}`}
//                     alt={item.name}
//                     className="w-full h-60 object-cover rounded-t-[32px]"
//                   />
//                 </div>
//               ))}
//             </Slider>

//           </div>
//         )}
//         <div className="overflow-y-auto flex-1 flex flex-col px-3 pt-2">
//           {/* Info */}
//           <div className=" border-b">
//             <div className={`vegBox ${item.isVeg ? "veg" : "nonVeg"} mb-1`}>
//               <div className="vegSymbol"></div>
//             </div>


//             <h6 className="text-[18px] font-bold tracking-tight">
//               {item.name}
//             </h6>
//             <p className=" text-gray-700">
//               {item.description}
//             </p>
//             <p className="text-sm text-gray-800">

//               Base price ₹{item.basePrice}
//             </p>
//           </div>

//           {/* Variants */}
//           <div className="flex-1 mt-2 mb-4 space-y-7">
//             {groups.map(group => (
//               <div key={group._id}>
//                 <div className="flex items-center gap-2 mb-3">
//                   <h5 className="font-semibold text-lg">{group.name}</h5>
//                   {group.isRequired && (
//                     <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
//                       Required
//                     </span>
//                   )}
//                   {group.isMultiple && (
//                     <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
//                       Multiple
//                     </span>
//                   )}
//                 </div>

//                 <div className="space-y-3 ">
//                   {menu.variants
//                     .filter(v => v.variantGroup === group._id)
//                     .map(variant => {
//                       const checked =
//                         selected[group._id]?.some(v => v._id === variant._id);

//                       return (
//                         <div
//                           key={variant._id}
//                           onClick={() => handleSelect(group, variant)}
//                           className={`flex items-center justify-between p-3 mb-1 rounded-2xl cursor-pointer transition-all
//                           ${checked
//                               ? "bg-green-50 border border-green-500 shadow-sm"
//                               : "bg-white border border-gray-200 hover:shadow-md"
//                             }`}
//                         >
//                           <div className="flex items-center gap-4">
//                             <input
//                               type={group.isMultiple ? "checkbox" : "radio"}
//                               checked={checked}
//                               readOnly
//                               className="accent-green-600 w-5 h-5"
//                             />
//                             <span className="font-medium text-gray-800">
//                               {variant.name}
//                             </span>
//                           </div>

//                           <span className="font-semibold text-gray-700">
//                             +₹{variant.price}
//                           </span>
//                         </div>
//                       );
//                     })}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Footer */}
//           <div className="sticky bottom-2 z-50 px-4 py-2  backdrop-blur border-t shadow-[0_-6px_24px_rgba(0,0,0,0.08)]  flex items-center justify-between" style={{ borderRadius: "50px" }}>

//             {/* Price Section */}
//             <div className="flex flex-col leading-tight">
//               <span className="text-[11px] uppercase tracking-wide" style={{ color: "#07024e", fontWeight: "600" }}>
//                 Total Amount
//               </span>
//               <span className="text-2xl" id="headingTextColor">
//                 ₹{totalPrice}
//               </span>
//             </div>

//             {/* Action Button */}
//             <button
//               disabled={!isValid}
//               onClick={() => {
//                 dispatch(
//                   addToCart({
//                     item,
//                     variants: selectedVariants,
//                     restaurant,
//                     table
//                   })
//                 );
//                 onClose();
//               }}

//               className={`px-4 py-2 font-semibold text-white transition-all duration-300 ease-out
//     focus:outline-none focus:ring-4 focus:ring-emerald-300
//     ${isValid
//                   ? `bg-gradient-to-r from-green-600 via-emerald-800 to-green-600
// hover:from-green-600 hover:via-emerald-900 hover:to-green-700
// shadow-[0_8px_24px_rgba(34,197,94,0.35)]
// focus:ring-green-300
// `
//                   : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
//                 }
//   `}
//               style={{ borderRadius: "20px" }}
//             >
//               Add Item
//             </button>

//           </div>

//         </div>

//       </div>


//     </div>
//   );
// }



// import React, { useEffect, useMemo, useState } from "react";
// import Slider from "react-slick";
// import { useDispatch, useSelector } from "react-redux";
// import { addToCart } from "../../Store/feature/Items/cartSlice";
// import "./VariantModel.css";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// export default function VariantDrawer({ open, onClose, item }) {
//   const dispatch = useDispatch();
//   const [selected, setSelected] = useState({});

//   const menu = useSelector(state => state.menu.data);
//   const { restaurant, table } = useSelector(state => state.context);

//   // 🔐 Guard
//   if (!open || !item || !menu || !restaurant || !table) return null;

//   // ✅ Variant Groups
//   const groups = useMemo(() => {
//     return menu.variantGroups?.filter(
//       g => g.menuItem === item._id
//     ) || [];
//   }, [menu, item]);

//   // 🧹 Reset on close
//   useEffect(() => {
//     if (!open) setSelected({});
//   }, [open]);

//   // 🎯 Select Variant
//   const handleSelect = (group, variant) => {
//     setSelected(prev => {
//       const list = prev[group._id] || [];

//       if (group.isMultiple) {
//         const exists = list.some(v => v._id === variant._id);
//         return {
//           ...prev,
//           [group._id]: exists
//             ? list.filter(v => v._id !== variant._id)
//             : [...list, { ...variant, quantity: 1 }]
//         };
//       }

//       return {
//         ...prev,
//         [group._id]: [{ ...variant, quantity: 1 }]
//       };
//     });
//   };

//   // ✅ Validation
//   const isValid = groups.every(
//     g => !g.isRequired || selected[g._id]?.length
//   );

//   const selectedVariants = Object.values(selected).flat();

//   const totalPrice = useMemo(() => {
//     return (
//       item.basePrice +
//       selectedVariants.reduce((sum, v) => sum + v.price, 0)
//     );
//   }, [item, selectedVariants]);

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 700,
//     autoplay: true,
//     autoplaySpeed: 3500,
//     arrows: false
//   };

//   // 🛒 Add to Cart
//   const handleAddToCart = () => {
//     dispatch(
//       addToCart({
//         item,
//         variants: selectedVariants,
//         restaurant,
//         table
//       })
//     );
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-end justify-center">
//       <div
//         className="absolute inset-0 bg-black/50"
//         onClick={onClose}
//       />

//       <div className="relative w-full max-w-[430px] max-h-[90vh] bg-white rounded-t-[32px] overflow-hidden flex flex-col">

//         {/* Images */}
//         {item.image?.length > 0 && (
//           <Slider {...sliderSettings}>
//             {item.image.map((img, i) => (
//               <img
//                 key={i}
//                 src={`/assets/images/menu/${img}`}
//                 alt={item.name}
//                 className="h-60 w-full object-cover"
//               />
//             ))}
//           </Slider>
//         )}

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto px-4 pt-3">

//           <h4 className="font-bold text-lg">{item.name}</h4>
//           <p className="text-sm text-gray-600">{item.description}</p>
//           <p className="text-sm mt-1">Base ₹{item.basePrice}</p>

//           {/* Variants */}
//           <div className="mt-4 space-y-6">
//             {groups.map(group => (
//               <div key={group._id}>
//                 <h5 className="font-semibold mb-2">
//                   {group.name}
//                   {group.isRequired && (
//                     <span className="ml-2 text-xs text-red-600">Required</span>
//                   )}
//                 </h5>

//                 {menu.variants
//                   ?.filter(v => v.variantGroup === group._id)
//                   .map(variant => {
//                     const checked = selected[group._id]?.some(
//                       v => v._id === variant._id
//                     );

//                     return (
//                       <div
//                         key={variant._id}
//                         onClick={() => handleSelect(group, variant)}
//                         className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer
//                         ${checked ? "border-green-500 bg-green-50" : ""}`}
//                       >
//                         <span>{variant.name}</span>
//                         <span>+₹{variant.price}</span>
//                       </div>
//                     );
//                   })}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="p-4 border-t flex justify-between items-center">
//           <div>
//             <p className="text-xs">Total</p>
//             <p className="text-xl font-bold">₹{totalPrice}</p>
//           </div>

//           <button
//             disabled={!isValid}
//             onClick={handleAddToCart}
//             className={`px-5 py-2 rounded-xl text-white font-semibold
//               ${isValid ? "bg-green-600" : "bg-gray-300 cursor-not-allowed"}`}
//           >
//             Add Item
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import "./VariantModel.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Store/feature/Items/cartSlice";
import { showInfoMsg } from "../../utils/ShowMessages";
export default function VariantDrawer({ open, onClose, item }) {
  const [selected, setSelected] = useState({});
  // debugger

  const dispatch = useDispatch()
  const menu = useSelector(state => state.menu.data);
  const { restaurant, table } = useSelector(
    state => state.context
  );


  if (!open || !item || !menu || !restaurant || !table) return null;

  const groups = menu.variantGroups.filter(
    g => g.menuItem === item._id
  );

  useEffect(() => {
    if (!open) setSelected({});
  }, [open]);

  if (!open) return null;

  // const groups = menu.variantGroups.filter(g => g.menuItem === item._id);

  const handleSelect = (group, variant) => {
    setSelected(prev => {
      const list = prev[group._id] || [];

      // 🔁 MULTIPLE VARIANTS
      if (group.isMultiple) {
        const exists = list.find(v => v._id === variant._id);

        return {
          ...prev,
          [group._id]: exists
            // ❌ remove variant
            ? list.filter(v => v._id !== variant._id)
            // ✅ add variant with quantity = 1
            : [...list, { ...variant, quantity: 1 }]
        };
      }

      // 🔁 SINGLE VARIANT (radio-type)
      return {
        ...prev,
        [group._id]: [{ ...variant, quantity: 1 }]
      };
    });
  };


  const isValid = groups.every(g => !g.isRequired || selected[g._id]?.length);
  const selectedVariants = Object.values(selected).flat();
  const totalPrice =
    item.basePrice + selectedVariants.reduce((s, v) => s + v.price, 0);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    pauseOnHover: true,
  };


  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Floating Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 left-1/2 -translate-x-1/2 z-50
          w-10 h-10 
          shadow-xl border border-white/40
          flex items-center justify-center
          text-xl font-semibold
          hover:scale-105 transition" style={{ borderRadius: "50px", color: "white" }}
      >
        <i class="bi bi-x-lg"></i>
      </button>

      {/* Drawer */}
      <div className="relative w-full max-w-[430px] max-h-[90vh] bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.25)] animate-slideUp flex flex-col overflow-hidden">

        {/* Image */}
        {item.image && (
          <div className="h-60 w-full">
            {/* <img
              src={item.image?.[0] ? `/assets/images/menu/${item.image[0]}` : `https://source.unsplash.com/600x400/?${item.name.replace(/\s+/g,'')}`}
              alt={item.name}
              className="w-full h-full object-cover"
            /> */}

            <Slider {...sliderSettings} className="custom-slider">
              {item.image.map((img, index) => (
                <div key={index}>
                  <img
                    src={`/assets/images/menu/${img}`}
                    alt={item.name}
                    className="w-full h-60 object-cover rounded-t-[32px]"
                  />
                </div>
              ))}
            </Slider>

          </div>
        )}
        <div className="overflow-y-auto flex-1 flex flex-col px-3 pt-2">
          {/* Info */}
          <div className=" border-b">
            <div className={`vegBox ${item.isVeg ? "veg" : "nonVeg"} mb-1`}>
              <div className="vegSymbol"></div>
            </div>


            <h6 className="text-[18px] font-bold tracking-tight">
              {item.name}
            </h6>
            <p className=" text-gray-700">
              {item.description}
            </p>
            <p className="text-sm text-gray-800">

              Base price ₹{item.basePrice}
            </p>
          </div>

          {/* Variants */}
          <div className="flex-1 mt-2 mb-4 space-y-7">
            {groups.map(group => (
              <div key={group._id}>
                <div className="flex items-center gap-2 mb-3">
                  <h5 className="font-semibold text-lg">{group.name}</h5>
                  {group.isRequired && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      Required
                    </span>
                  )}
                  {group.isMultiple && (
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                      Multiple
                    </span>
                  )}
                </div>

                <div className="space-y-3 ">
                  {menu.variants
                    .filter(v => v.variantGroup === group._id)
                    .map(variant => {
                      const checked =
                        selected[group._id]?.some(v => v._id === variant._id);

                      return (
                        <div
                          key={variant._id}
                          onClick={() => handleSelect(group, variant)}
                          className={`flex items-center justify-between p-3 mb-1 rounded-2xl cursor-pointer transition-all
                          ${checked
                              ? "bg-green-50 border border-green-500 shadow-sm"
                              : "bg-white border border-gray-200 hover:shadow-md"
                            }`}
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type={group.isMultiple ? "checkbox" : "radio"}
                              checked={checked}
                              readOnly
                              className="accent-green-600 w-5 h-5"
                            />
                            <span className="font-medium text-gray-800">
                              {variant.name}
                            </span>
                          </div>

                          <span className="font-semibold text-gray-700">
                            +₹{variant.price}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="sticky bottom-2 z-50 px-4 py-2  backdrop-blur border-t shadow-[0_-6px_24px_rgba(0,0,0,0.08)]  flex items-center justify-between" style={{ borderRadius: "50px" }}>

            {/* Price Section */}
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] uppercase tracking-wide" style={{ color: "#07024e", fontWeight: "600" }}>
                Total Amount
              </span>
              <span className="text-2xl" id="headingTextColor">
                ₹{totalPrice}
              </span>
            </div>

            {/* Action Button */}
            <button
              disabled={!isValid}
              onClick={() => {
                dispatch(
                  addToCart({
                    item,
                    variants: selectedVariants,
                    restaurant,
                    table,
                    showMsg: showInfoMsg
                    
                  })
                );
                onClose();
              }}

              className={`px-4 py-2 font-semibold text-white transition-all duration-300 ease-out
    focus:outline-none focus:ring-4 focus:ring-emerald-300
    ${isValid
                  ? `bg-gradient-to-r from-green-600 via-emerald-800 to-green-600
hover:from-green-600 hover:via-emerald-900 hover:to-green-700
shadow-[0_8px_24px_rgba(34,197,94,0.35)]
focus:ring-green-300
`
                  : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                }
  `}
              style={{ borderRadius: "20px" }}
            >
              Add Item
            </button>

          </div>

        </div>

      </div>


    </div>
  );
}

// import axiosInstance from '../../apiHandler/axiosInstance';
// import React, { useEffect, useState } from 'react'

// export default function Cart() {
//     const [menu, setMenu] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const [cartData, setCartData] = useState(null);

//     useEffect(() => {
//         const storedCart = localStorage.getItem("cart");

//         if (!storedCart) return;

//         let parsed;
//         try {
//             parsed = JSON.parse(storedCart);
//         } catch (err) {
//             console.error("Invalid cart JSON");
//             return;
//         }

//         // ✅ cart data state
//         setCartData(parsed);

//         const restaurant = parsed.restaurant;
//         const table = parsed.table;

//         if (!restaurant || !table) return;

//         const fetchMenu = async () => {
//             if (loading) return;

//             try {
//                 setLoading(true);

//                 const res = await axiosInstance.get("/api/v1/menu", {
//                     params: {
//                         restaurant,
//                         table,
//                         page: 1,
//                         limit: 10, 
//                     },
//                 });
//                 // debugger

//                 setMenu(res.data.data);
//             } catch (err) {
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchMenu();
//     }, []);


//     const cartTotal = cartData?.items.reduce(
//         (sum, c) => sum + c.totalPrice,
//         0
//     );




//     if (!cartData || cartData.items.length === 0) {
//         return (
//             <div className="h-screen flex flex-col items-center justify-center text-center">
//                 <div className="text-6xl mb-4">🛒</div>
//                 <h2 className="text-xl font-semibold">Your cart is empty</h2>
//                 <p className="text-gray-500 mt-2">Add some delicious food 😋</p>
//             </div>
//         );
//     }
//     return (
//         <div className="max-w-3xl mx-auto pb-28">

//             {/* Restaurant Header */}
//             <div className="sticky top-0 bg-white z-20 shadow-sm p-3 flex items-center gap-3">
//                 <img
//                     src={`/assets/images/categories/${menu?.categories[0]?.restaurant?.logo}`}
//                     alt="restaurant"
//                     className="w-14 h-14 rounded-xl object-cover"
//                 />

//                 <div>
//                     <h2 className="text-lg font-semibold">
//                         {menu?.categories[0]?.restaurant?.name}
//                     </h2>
//                     <p className="text-sm text-gray-500 flex items-center gap-1">
//                         <i className="fa-solid fa-star text-yellow-400"></i>
//                         {menu?.categories[0]?.restaurant?.rating || 4.4}
//                     </p>
//                 </div>
//             </div>

//             {/* Cart Items */}
//             <div className="p-3 space-y-4">
//                 {cartData.items.map((c, index) => (
//                     <div
//                         key={index}
//                         className="bg-white rounded-xl shadow-sm p-3 flex gap-3"
//                     >
//                         {/* Item Image */}
//                         <img
//                             src={
//                                 c.item.image?.[0]
//                                     ? `/assets/images/menu/${c.item.image[0]}`
//                                     : "https://source.unsplash.com/100x100/?food"
//                             }
//                             alt={c.item.name}
//                             className="w-20 h-20 rounded-lg object-cover"
//                         />

//                         {/* Item Info */}
//                         <div className="flex-1">
//                             <h3 className="font-semibold">{c.item.name}</h3>

//                             {c.variants?.length > 0 && (
//                                 <p className="text-sm text-gray-500">
//                                     {c.variants.map(v => v.name).join(", ")}
//                                 </p>
//                             )}

//                             <div className="flex items-center justify-between mt-2">
//                                 <span className="font-semibold text-gray-800">
//                                     ₹{c.totalPrice}
//                                 </span>

//                                 {/* Quantity Control (UI only for now) */}
//                                 <div className="flex items-center border rounded-lg overflow-hidden">
//                                     <button className="px-3 py-1 text-lg">−</button>
//                                     <span className="px-3">1</span>
//                                     <button className="px-3 py-1 text-lg">+</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Bill Summary */}
//             <div className="p-4 bg-white rounded-t-2xl shadow-inner space-y-2">
//                 <div className="flex justify-between text-sm">
//                     <span>Item Total</span>
//                     <span>₹{cartTotal}</span>
//                 </div>

//                 <div className="flex justify-between text-sm">
//                     <span>GST & Charges</span>
//                     <span>₹20</span>
//                 </div>

//                 <div className="border-t pt-2 flex justify-between font-semibold text-lg">
//                     <span>Grand Total</span>
//                     <span>₹{cartTotal + 20}</span>
//                 </div>
//             </div>

//             {/* Checkout Bar */}
//             <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-between items-center max-w-3xl mx-auto">
//                 <div>
//                     <p className="text-sm text-gray-500">Payable Amount</p>
//                     <p className="text-xl font-bold">₹{cartTotal + 20}</p>
//                 </div>

//                 <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition">
//                     Place Order
//                 </button>
//             </div>

//         </div>
//     );

// }



// import axiosInstance from '../../apiHandler/axiosInstance';
// import React, { useEffect, useState } from 'react'

// export default function Cart() {
//     const [menu, setMenu] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [cartData, setCartData] = useState(null);
//     const [Quantity, setQuantity] = useState(0);


//     useEffect(() => {
//         const storedCart = localStorage.getItem("cart");
//         if (!storedCart) return;

//         let parsed;
//         try {
//             parsed = JSON.parse(storedCart);
//         } catch (err) {
//             console.error("Invalid cart JSON");
//             return;
//         }

//         setCartData(parsed);

//         const restaurant = parsed.restaurant;
//         const table = parsed.table;

//         if (!restaurant || !table) return;

//         const fetchMenu = async () => {
//             if (loading) return;
//             try {
//                 setLoading(true);
//                 const res = await axiosInstance.get("/api/v1/menu", {
//                     params: { restaurant, table, page: 1, limit: 10 },
//                 });
//                 setMenu(res.data.data);
//             } catch (err) {
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchMenu();
//     }, []);
//     const getItemPrice = (item) =>
//         item.price ?? item.basePrice ?? item.sellingPrice ?? 0;

//     const cartTotal = cartData?.items?.reduce((sum, cartItem) => {
//         // main item ka total
//         const itemTotal = cartItem.totalPrice ?? 0;
//         debugger
//         // variants ka total
//         const variantsTotal = (cartItem.variants || []).reduce(
//             (vSum, v) => vSum + ((v.quantity || 0) * (getItemPrice(v) || 0)),
//             0
//         );

//         return sum + itemTotal + variantsTotal;
//     }, 0) ?? 0; // agar cartData undefined ho to 0


//     const handleIncrease = (itemId) => {
//         updateQuantity(itemId, 1);
//     };

//     const handleDecrease = (itemId, qty) => {
//         if (qty <= 1) {
//             removeFromCart(itemId);
//             return;
//         }
//         updateQuantity(itemId, -1);
//     };
//     const removeFromCart = (itemId) => {
//         setCartData((prev) => {
//             // prev ek object hai, jisme items array hai
//             const updatedItems = prev.items.filter(
//                 (cartItem) => cartItem.item._id !== itemId
//             );

//             const updatedCart = { ...prev, items: updatedItems };

//             // update localStorage
//             localStorage.setItem("cart", JSON.stringify(updatedCart));

//             return updatedCart;
//         });
//     };


//     const updateQuantity = (itemId, change) => {
//         // debugger
//         setCartData((prev) => {
//             const updatedItems = prev.items
//                 .map((cartItem) => {
//                     if (cartItem.item._id !== itemId) return cartItem;

//                     const newQty = cartItem.quantity + change;
//                     if (newQty <= 0) return null;

//                     // const price = cartItem.item.price; // ✅ correct key
//                     const price = getItemPrice(cartItem.item);


//                     return {
//                         ...cartItem,
//                         quantity: newQty,
//                         totalPrice: newQty * price,
//                     };
//                 })
//                 .filter(Boolean);

//             const updatedCart = { ...prev, items: updatedItems };
//             localStorage.setItem("cart", JSON.stringify(updatedCart));
//             return updatedCart;
//         });
//     };


//     const handleVariantDecrease = (itemId, variantId) => {
//         setCartData((prev) => {
//             const updatedItems = prev.items
//                 .map((cartItem) => {
//                     if (cartItem.item._id !== itemId) return cartItem;

//                     const updatedVariants = cartItem.variants
//                         .map((v) =>
//                             v._id === variantId
//                                 ? { ...v, quantity: v.quantity - 1 }
//                                 : v
//                         )
//                         .filter((v) => v.quantity > 0); // sirf 0 quantity remove

//                     return {
//                         ...cartItem,
//                         variants: updatedVariants,
//                     };
//                 })
//                 // sirf remove cartItem agar **variants khatam** ho gaye ho
//                 .filter((cartItem) => cartItem.variants && cartItem.variants.length > 0);

//             const updatedCart = { ...prev, items: updatedItems };
//             localStorage.setItem("cart", JSON.stringify(updatedCart));
//             return updatedCart;
//         });
//     };

//     const handleVariantIncrease = (itemId, variantId) => {
//         setCartData((prev) => {
//             const updatedItems = prev.items.map((cartItem) => {
//                 if (cartItem.item._id !== itemId) return cartItem;

//                 const updatedVariants = cartItem.variants.map((v) =>
//                     v._id === variantId
//                         ? { ...v, quantity: v.quantity + 1 }
//                         : v
//                 );

//                 return {
//                     ...cartItem,
//                     variants: updatedVariants,
//                 };
//             });

//             const updatedCart = { ...prev, items: updatedItems };
//             localStorage.setItem("cart", JSON.stringify(updatedCart));
//             return updatedCart;
//         });
//     };



//     if (!cartData || cartData.items.length === 0) {
//         return (
//             <div className="h-screen flex flex-col items-center justify-center text-center">
//                 <div className="text-6xl mb-4">🛒</div>
//                 <h2 className="text-xl font-semibold">Your cart is empty</h2>
//                 <p className="text-gray-500 mt-2">Add some delicious food 😋</p>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-3xl mx-auto pb-32">

//             {/* Restaurant Header */}
//             <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
//                 <div className="flex items-center gap-4 p-4">
//                     <img
//                         src={`/assets/images/categories/${menu?.categories[0]?.restaurant?.logo}`}
//                         className="w-16 h-16 rounded-2xl object-cover shadow"
//                         alt="restaurant"
//                     />
//                     <div className="flex-1">
//                         <h2 className="text-xl font-bold">
//                             {menu?.categories[0]?.restaurant?.name}
//                         </h2>
//                         <div className="flex items-center gap-2 text-sm text-gray-500">
//                             <span className="flex items-center gap-1">
//                                 ⭐ {menu?.categories[0]?.restaurant?.rating || 4.4}
//                             </span>
//                             <span>• 15–20 mins</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div
//                 onClick={() => window.history.back()}
//                 className="flex items-center gap-2 px-4 h-10 
//              rounded-full bg-gray-100 hover:bg-gray-200 
//              cursor-pointer transition-all duration-200 
//              active:scale-95 shadow-sm"
//             >
//                 <i className="fa-solid fa-chevron-left text-gray-700 text-sm"></i>
//                 <span className="text-sm font-medium text-gray-700">Back</span>
//             </div>



//             {/* Cart Items */}
//             <div className="p-1 customerCart">
//                 {cartData.items.map((c) => (
//                     <div
//                         key={c.item.id}
//                         className="bg-white rounded-2xl shadow-sm border p-2 flex gap-2 mt-1"
//                     >
//                         <div className={`vegBox ${c.item.isVeg ? "veg" : "nonVeg"}`}>
//                             <div
//                                 className={`vegSymbol ${c.item.isVeg ? "vegSymbolveg" : "vegSymbolnonVeg"
//                                     }`}
//                             />
//                         </div>

//                         {/* Item Details */}
//                         <div className="flex justify-between w-full items-start itemsDetails">
//                             <div className="flex-1">
//                                 <p className="font-medium">{c.item.name}</p>

//                                 <span className="text-sm text-gray-500">
//                                     {c.item.description.length > 40
//                                         ? `${c.item.description.slice(0, 40)}...`
//                                         : c.item.description}
//                                 </span>

//                                 {/* 🔥 VARIANTS LIST */}
//                                 {c.variants?.length > 0 && (
//                                     <div className="mt-2 space-y-2">
//                                         {c.variants.map((v) => (
//                                             <div
//                                                 key={v._id}
//                                                 className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2"
//                                             >
//                                                 <span className="text-sm font-medium">{v.name}</span>

//                                                 {/* Variant Quantity */}
//                                                 <div className="flex items-center bg-white rounded-full shadow">
//                                                     <button
//                                                         onClick={() => handleVariantDecrease(c.item._id, v._id)}
//                                                         className="px-3 py-1 font-bold"
//                                                     >
//                                                         −
//                                                     </button>

//                                                     <span className="px-3 text-sm">{v.quantity}</span>

//                                                     <button
//                                                         onClick={() => handleVariantIncrease(c.item._id, v._id)}
//                                                         className="px-3 py-1 font-bold"
//                                                     >
//                                                         +
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}

//                                 <p className="text-lg font-bold text-green-600 mt-2">
//                                     ₹{c.totalPrice}
//                                 </p>
//                             </div>

//                             {/* 🔥 ITEM QUANTITY (ONLY WHEN NO VARIANTS) */}
//                             {(!c.variants || c.variants.length === 0) && (
//                                 <div className="flex items-center bg-gray-100 rounded-full h-fit">
//                                     <button
//                                         onClick={() => handleDecrease(c.item._id, c.quantity)}
//                                         className="px-4 py-1 text-xl font-bold"
//                                     >
//                                         −
//                                     </button>


//                                     <span className="px-3 font-medium">{c.quantity}</span>

//                                     <button
//                                         onClick={() => handleIncrease(c.item._id)}
//                                         className="px-4 py-1 text-xl font-bold"
//                                     >
//                                         +
//                                     </button>
//                                 </div>
//                             )}
//                         </div>

//                     </div>
//                 ))}
//             </div>

//             {/* Bill Summary */}
//             <div className="mx-4 mt-6 bg-white rounded-2xl p-4 shadow border space-y-3">
//                 <div className="flex justify-between text-sm text-gray-600">
//                     <span>Item Total</span>
//                     <span>₹{cartTotal}</span>
//                 </div>

//                 <div className="flex justify-between text-sm text-gray-600">
//                     <span>GST & Charges</span>
//                     <span>₹20</span>
//                 </div>

//                 <div className="border-t pt-3 flex justify-between font-bold text-lg">
//                     <span>Grand Total</span>
//                     <span>₹{cartTotal + 20}</span>
//                 </div>
//             </div>

//             {/* Checkout Bar */}
//             <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl">
//                 <div className="max-w-3xl mx-auto p-4 flex justify-between items-center">
//                     <div>
//                         <p className="text-xs text-gray-500">Payable Amount</p>
//                         <p className="text-2xl font-extrabold">₹{cartTotal + 20}</p>
//                     </div>

//                     <button className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg active:scale-95 transition">
//                         Place Order →
//                     </button>
//                 </div>
//             </div>

//         </div>
//     );
// }




// import axiosInstance from '../../apiHandler/axiosInstance';
// import React, { useEffect, useState } from 'react'
// import { useDispatch } from "react-redux";
// import { openVariantModal } from "../../Store/feature/Items/menuModalSlice";
// import {
//     increaseQty,
//     decreaseQty,
//     increaseVariantQty,
//     decreaseVariantQty,
//     removeItem
// } from "../../Store/feature/Items/cartSlice";

// export default function Cart() {
//     const [menu, setMenu] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [cartData, setCartData] = useState(null);
//     const [Quantity, setQuantity] = useState(0);
//     const [selectedItem, setSelectedItem] = useState(null);
//     const dispatch = useDispatch()


//     useEffect(() => {
//         const storedCart = localStorage.getItem("cart");
//         if (!storedCart) return;

//         let parsed;
//         try {
//             parsed = JSON.parse(storedCart);
//         } catch (err) {
//             console.error("Invalid cart JSON");
//             return;
//         }

//         setCartData(parsed);

//         const restaurant = parsed.restaurant;
//         const table = parsed.table;

//         if (!restaurant || !table) return;

//         const fetchMenu = async () => {
//             if (loading) return;
//             try {
//                 setLoading(true);
//                 const res = await axiosInstance.get("/api/v1/menu", {
//                     params: { restaurant, table, page: 1, limit: 10 },
//                 });
//                 setMenu(res.data.data);
//             } catch (err) {
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchMenu();
//     }, []);

//     const getItemPrice = (item) =>
//         item.price ?? item.basePrice ?? item.sellingPrice ?? 0;

//     const calculateCartItemTotal = (cartItem) => {
//         const itemPrice = getItemPrice(cartItem.item);

//         // 🔥 CASE 1: VARIANTS EXIST
//         if (cartItem.variants && cartItem.variants.length > 0) {
//             return cartItem.variants.reduce((sum, v) => {
//                 const variantPrice = itemPrice + (v.price || 0);
//                 const qty = v.quantity || 1;
//                 return sum + variantPrice * qty;
//             }, 0);
//         }

//         // 🔥 CASE 2: NO VARIANTS
//         const qty = cartItem.quantity || 1;
//         return itemPrice * qty;
//     };

//     const cartTotal =
//         cartData?.items?.reduce(
//             (sum, item) => sum + (item.totalPrice || 0),
//             0
//         ) || 0;



//     const handleIncrease = (itemId) => {
//         updateQuantity(itemId, 1);
//     };

//     const handleDecrease = (itemId, qty) => {
//         if (qty <= 1) {
//             removeFromCart(itemId);
//             return;
//         }
//         updateQuantity(itemId, -1);
//     };
//     const removeFromCart = (itemId) => {
//         setCartData((prev) => {
//             // prev ek object hai, jisme items array hai
//             const updatedItems = prev.items.filter(
//                 (cartItem) => cartItem.item._id !== itemId
//             );

//             const updatedCart = { ...prev, items: updatedItems };

//             // update localStorage
//             localStorage.setItem("cart", JSON.stringify(updatedCart));

//             return updatedCart;
//         });
//     };

//     const updateQuantity = (itemId, change) => {
//         setCartData((prev) => {
//             const updatedItems = prev.items.map((cartItem) => {
//                 if (cartItem.item._id !== itemId) return cartItem;

//                 if (cartItem.variants && cartItem.variants.length > 0) {
//                     return cartItem;
//                 }

//                 const newQty = (cartItem.quantity || 1) + change;
//                 if (newQty <= 0) return null;

//                 const updated = {
//                     ...cartItem,
//                     quantity: newQty,
//                 };

//                 return {
//                     ...updated,
//                     totalPrice: calculateCartItemTotal(updated),
//                 };
//             }).filter(Boolean);

//             const updatedCart = { ...prev, items: updatedItems };
//             localStorage.setItem("cart", JSON.stringify(updatedCart));
//             return updatedCart;
//         });
//     };



//     const handleVariantDecrease = (itemId, variantId) => {
//         setCartData((prev) => {
//             const updatedItems = prev.items
//                 .map((cartItem) => {
//                     if (cartItem.item._id !== itemId) return cartItem;

//                     const updatedVariants = cartItem.variants
//                         .map((v) =>
//                             v._id === variantId
//                                 ? { ...v, quantity: v.quantity - 1 }
//                                 : v
//                         )
//                         .filter((v) => v.quantity > 0);

//                     const updatedCartItem = {
//                         ...cartItem,
//                         variants: updatedVariants,
//                     };

//                     return {
//                         ...updatedCartItem,
//                         totalPrice: calculateCartItemTotal(updatedCartItem),
//                     };
//                 })
//                 .filter(
//                     (cartItem) =>
//                         cartItem.quantity > 0 ||
//                         (cartItem.variants && cartItem.variants.length > 0)
//                 );

//             const updatedCart = { ...prev, items: updatedItems };
//             localStorage.setItem("cart", JSON.stringify(updatedCart));
//             return updatedCart;
//         });
//     };

//     const handleVariantIncrease = (itemId, variantId) => {
//         setCartData((prev) => {
//             const updatedItems = prev.items.map((cartItem) => {
//                 if (cartItem.item._id !== itemId) return cartItem;

//                 const updatedVariants = cartItem.variants.map((v) =>
//                     v._id === variantId
//                         ? { ...v, quantity: (v.quantity || 1) + 1 }
//                         : v
//                 );

//                 const updatedCartItem = {
//                     ...cartItem,
//                     variants: updatedVariants,
//                 };

//                 return {
//                     ...updatedCartItem,
//                     totalPrice: calculateCartItemTotal(updatedCartItem),
//                 };
//             });

//             const updatedCart = { ...prev, items: updatedItems };
//             localStorage.setItem("cart", JSON.stringify(updatedCart));
//             return updatedCart;
//         });
//     };




//     if (!cartData || cartData.items.length === 0) {
//         return (
//             <div className="h-screen flex flex-col items-center justify-center text-center">
//                 <div className="text-6xl mb-4">🛒</div>
//                 <h2 className="text-xl font-semibold">Your cart is empty</h2>
//                 <p className="text-gray-500 mt-2">Add some delicious food 😋</p>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-3xl mx-auto pb-32">

//             {/* Restaurant Header */}
//             <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
//                 <div className="flex items-center gap-4 p-4">
//                     <img
//                         src={`/assets/images/categories/${menu?.categories[0]?.restaurant?.logo}`}
//                         className="w-16 h-16 rounded-2xl object-cover shadow"
//                         alt="restaurant"
//                     />
//                     <div className="flex-1">
//                         <h2 className="text-xl font-bold">
//                             {menu?.categories[0]?.restaurant?.name}
//                         </h2>
//                         <div className="flex items-center gap-2 text-sm text-gray-500">
//                             <span className="flex items-center gap-1">
//                                 ⭐ {menu?.categories[0]?.restaurant?.rating || 4.4}
//                             </span>
//                             <span>• 15–20 mins</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div
//                 onClick={() => window.history.back()}
//                 className="flex items-center gap-2 px-4 h-10 
//              rounded-full bg-gray-100 hover:bg-gray-200 
//              cursor-pointer transition-all duration-200 
//              active:scale-95 shadow-sm"
//             >
//                 <i className="fa-solid fa-chevron-left text-gray-700 text-sm"></i>
//                 <span className="text-sm font-medium text-gray-700">Back</span>
//             </div>



//             {/* Cart Items */}
//             <div className="p-1 customerCart">
//                 {cartData.items.map((c) => (
//                     <div
//                         key={c.item.id}
//                         className="bg-white rounded-2xl shadow-sm border p-2 flex gap-2 mt-1"
//                     >
//                         <div className={`vegBox ${c.item.isVeg ? "veg" : "nonVeg"}`}>
//                             <div
//                                 className={`vegSymbol ${c.item.isVeg ? "vegSymbolveg" : "vegSymbolnonVeg"
//                                     }`}
//                             />
//                         </div>

//                         {/* Item Details */}
//                         <div className="flex justify-between w-full items-start itemsDetails">
//                             <div className="flex-1">
//                                 <p className="font-medium">{c.item.name}</p>

//                                 <span className="text-sm text-gray-500">
//                                     {c.item.description.length > 40
//                                         ? `${c.item.description.slice(0, 40)}...`
//                                         : c.item.description}
//                                 </span>

//                                 {/* 🔥 VARIANTS LIST */}
//                                 {c.variants?.length > 0 && (
//                                     <div className="mt-2 space-y-2">
//                                         {c.variants.map((v) => (
//                                             <div
//                                                 key={v._id}
//                                                 className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2"
//                                             >
//                                                 <span className="text-sm font-medium">{v.name}</span>

//                                                 {/* Variant Quantity */}
//                                                 <div className="flex items-center bg-white rounded-full shadow">
//                                                     <button
//                                                         // onClick={() => handleVariantDecrease(c.item._id, v._id)}
//                                                         className="px-3 py-1 font-bold"
//                                                         onClick={() =>
//                                                             dispatch(
//                                                                 decreaseVariantQty({
//                                                                     itemId: c.item._id,
//                                                                     variantId: v._id
//                                                                 })
//                                                             )
//                                                         }
//                                                     >
//                                                         −
//                                                     </button>

//                                                     <span className="px-3 text-sm">{v.quantity}</span>

//                                                     <button
//                                                         // onClick={() => handleVariantIncrease(c.item._id, v._id)}
//                                                         className="px-3 py-1 font-bold"
//                                                         onClick={() =>
//                                                             dispatch(
//                                                                 increaseVariantQty({
//                                                                     itemId: c.item._id,
//                                                                     variantId: v._id
//                                                                 })
//                                                             )
//                                                         }
//                                                     >
//                                                         +
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}

//                                 <p
//                                     style={{ color: "red" }}
//                                     className="cursor-pointer flex items-center gap-2"
//                                     onClick={() => dispatch(openVariantModal(c.item))}   // 👈 yahi main cheez
//                                 >
//                                     <i className="fa-solid fa-plus"></i>
//                                     Add More Items
//                                 </p>

//                                 <p className="text-lg font-bold text-green-600 mt-2">
//                                     ₹{c.totalPrice}
//                                 </p>
//                             </div>

//                             {/* 🔥 ITEM QUANTITY (ONLY WHEN NO VARIANTS) */}
//                             {(!c.variants || c.variants.length === 0) && (
//                                 <div className="flex items-center bg-gray-100 rounded-full h-fit">
//                                     <button
//                                         // onClick={() => handleDecrease(c.item._id, c.quantity)}
//                                         onClick={() => dispatch(decreaseQty(c.item._id))}
//                                         className="px-4 py-1 text-xl font-bold"
//                                     >
//                                         −
//                                     </button>


//                                     <span className="px-3 font-medium">{c.quantity}</span>

//                                     <button
//                                         // onClick={() => handleIncrease(c.item._id)}
//                                         onClick={() => dispatch(increaseQty(c.item._id))}

//                                         className="px-4 py-1 text-xl font-bold"
//                                     >
//                                         +
//                                     </button>
//                                 </div>
//                             )}
//                         </div>

//                     </div>
//                 ))}
//             </div>

//             {/* Bill Summary */}
// <div className="mx-4 mt-6 bg-white rounded-2xl p-4 shadow border space-y-3">
//     <div className="flex justify-between text-sm text-gray-600">
//         <span>Item Total</span>
//         <span>₹{cartTotal}</span>
//     </div>

//     <div className="flex justify-between text-sm text-gray-600">
//         <span>GST & Charges</span>
//         <span>₹20</span>
//     </div>

//     <div className="border-t pt-3 flex justify-between font-bold text-lg">
//         <span>Grand Total</span>
//         <span>₹{cartTotal + 20}</span>
//     </div>
// </div>

//             {/* Checkout Bar */}
//             <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl">
//                 <div className="max-w-3xl mx-auto p-4 flex justify-between items-center">
//                     <div>
//                         <p className="text-xs text-gray-500">Payable Amount</p>
//                         <p className="text-2xl font-extrabold">₹{cartTotal + 20}</p>
//                     </div>

//                     <button className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg active:scale-95 transition">
//                         Place Order →
//                     </button>
//                 </div>
//             </div>


//         </div>
//     );
// }



// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { 
//     increaseQty, 
//     decreaseQty, 
//     increaseVariantQty, 
//     decreaseVariantQty, 
//     removeItem 
// } from "../../Store/feature/Items/cartSlice";
// import { openVariantModal } from "../../Store/feature/Items/menuModalSlice";
// import axiosInstance from '../../apiHandler/axiosInstance';

// const Cart = () => {
//     const dispatch = useDispatch();

//     const { items, restaurant, table } = useSelector(state => state.cart);

//     const [menu, setMenu] = useState(null);
//     const [loading, setLoading] = useState(false);

//     /* ================= FETCH MENU ================= */
//     useEffect(() => {
//         if (!restaurant || !table) return;

//         const fetchMenu = async () => {
//             try {
//                 setLoading(true);
//                 const res = await axiosInstance.get("/api/v1/menu", {
//                     params: { restaurant, table, page: 1, limit: 10 }
//                 });
//                 setMenu(res.data.data);
//             } catch (err) {
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchMenu();
//     }, [restaurant, table]);

//     /* ================= TOTAL ================= */
//     const cartTotal =
//         items.reduce((sum, i) => sum + (i.totalPrice || 0), 0) || 0;

//     /* ================= EMPTY ================= */
//     if (!items || items.length === 0) {
//         return (
//             <div className="h-screen flex flex-col items-center justify-center text-center">
//                 <div className="text-6xl mb-4">🛒</div>
//                 <h2 className="text-xl font-semibold">Your cart is empty</h2>
//                 <p className="text-gray-500 mt-2">Add some delicious food 😋</p>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-3xl mx-auto pb-32">

//             {/* ===== Restaurant Header ===== */}
//             <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
//                 <div className="flex items-center gap-4 p-4">
//                     <img
//                         src={`/assets/images/categories/${menu?.categories[0]?.restaurant?.logo}`}
//                         className="w-16 h-16 rounded-2xl object-cover shadow"
//                         alt="restaurant"
//                     />
//                     <div className="flex-1">
//                         <h2 className="text-xl font-bold">
//                             {menu?.categories[0]?.restaurant?.name}
//                         </h2>
//                         <div className="flex items-center gap-2 text-sm text-gray-500">
//                             ⭐ {menu?.categories[0]?.restaurant?.rating || 4.4}
//                             <span>• 15–20 mins</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* ===== Back ===== */}
//             <div
//                 onClick={() => window.history.back()}
//                 className="flex items-center gap-2 px-4 h-10 rounded-full bg-gray-100 cursor-pointer w-fit m-3"
//             >
//                 <i className="fa-solid fa-chevron-left text-sm"></i>
//                 <span className="text-sm">Back</span>
//             </div>

//             {/* ===== Cart Items ===== */}
//             <div className="p-1 customerCart">
//                 {items.map(c => (
//                     <div
//                         key={c.item._id}
//                         className="bg-white rounded-2xl shadow-sm border p-2 flex gap-2 mt-1"
//                     >
//                         <div className={`vegBox ${c.item.isVeg ? "veg" : "nonVeg"}`}>
//                             <div className={`vegSymbol ${c.item.isVeg ? "vegSymbolveg" : "vegSymbolnonVeg"}`} />
//                         </div>

//                         <div className="flex justify-between w-full">
//                             <div className="flex-1">
//                                 <p className="font-medium">{c.item.name}</p>
//                                 <span className="text-sm text-gray-500">
//                                     {c.item.description?.slice(0, 40)}
//                                 </span>

//                                 {/* ===== Variants ===== */}
//                                 {c.variants?.length > 0 && (
//                                     <div className="mt-2 space-y-2">
//                                         {c.variants.map(v => (
//                                             <div
//                                                 key={v._id}
//                                                 className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2"
//                                             >
//                                                 <span className="text-sm font-medium">{v.name}</span>

//                                                 <div className="flex items-center bg-white rounded-full shadow">
//                                                     <button
//                                                         className="px-3 py-1 font-bold"
//                                                         onClick={() =>
//                                                             dispatch(
//                                                                 decreaseVariantQty({
//                                                                     itemId: c.item._id,
//                                                                     variantId: v._id
//                                                                 })
//                                                             )
//                                                         }
//                                                     >
//                                                         −
//                                                     </button>

//                                                     <span className="px-3 text-sm">{v.quantity}</span>

//                                                     <button
//                                                         className="px-3 py-1 font-bold"
//                                                         onClick={() =>
//                                                             dispatch(
//                                                                 increaseVariantQty({
//                                                                     itemId: c.item._id,
//                                                                     variantId: v._id
//                                                                 })
//                                                             )
//                                                         }
//                                                     >
//                                                         +
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}

//                                 <p
//                                     className="text-red-600 cursor-pointer flex items-center gap-2 mt-1"
//                                     onClick={() => dispatch(openVariantModal(c.item))}
//                                 >
//                                     <i className="fa-solid fa-plus"></i>
//                                     Add More Items
//                                 </p>

//                                 <p className="text-lg font-bold text-green-600 mt-2">
//                                     ₹{c.totalPrice}
//                                 </p>
//                             </div>

//                             {/* ===== Normal Qty ===== */}
//                             {(!c.variants || c.variants.length === 0) && (
//                                 <div className="flex items-center bg-gray-100 rounded-full h-fit">
//                                     <button
//                                         onClick={() => dispatch(decreaseQty(c.item._id))}
//                                         className="px-4 py-1 text-xl font-bold"
//                                     >
//                                         −
//                                     </button>

//                                     <span className="px-3 font-medium">{c.quantity}</span>

//                                     <button
//                                         onClick={() => dispatch(increaseQty(c.item._id))}
//                                         className="px-4 py-1 text-xl font-bold"
//                                     >
//                                         +
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* ===== Bill ===== */}
//             <div className="mx-1 mt-2  bg-white rounded-2xl p-4 shadow border space-y-3" style={{
//                 marginBottom: "100px"
//             }}>
//                 <div className="flex justify-between text-sm text-gray-600">
//                     <span>Item Total</span>
//                     <span>₹{cartTotal}</span>
//                 </div>

//                 <div className="flex justify-between text-sm text-gray-600">
//                     <span>GST & Charges</span>
//                     <span>₹20</span>
//                 </div>

//                 <div className="border-t pt-3 flex justify-between font-bold text-lg">
//                     <span>Grand Total</span>
//                     <span>₹{cartTotal + 20}</span>
//                 </div>
//             </div>

//             {/* ===== Checkout ===== */}
//             <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl">
//                 <div className="max-w-3xl mx-auto px-3 py-2 flex justify-between items-center">
//                     <div>
//                         <p className="text-xs text-gray-500">Payable Amount</p>
//                         <p className="text-2xl font-extrabold">₹{cartTotal + 20}</p>
//                     </div>

//                     <button className="bg-green-600 text-white px-8 py-3 rounded-2xl font-bold">
//                         Place Order →
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }




import axiosInstance from "../../apiHandler/axiosInstance";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openVariantModal } from "../../Store/feature/Items/menuModalSlice";
import {
    increaseQty,
    decreaseQty,
    increaseVariantQty,
    decreaseVariantQty,
    removeItem,
    clearCart
} from "../../Store/feature/Items/cartSlice";
import { showErrorMsg, showSuccessMsg } from "../../utils/ShowMessages";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const { items, restaurant, table } = useSelector(state => state.cart);

    const { data, pagination } = useSelector(state => state.menu);
    const menu = data;
    const [loading, setLoading] = useState(false);

    /* ================= FETCH MENU ================= */
    // useEffect(() => {
    //     if (!restaurant || !table) return;

    //     const fetchMenu = async () => {
    //         try {
    //             setLoading(true);
    //             const res = await axiosInstance.get("/api/v1/menu", {
    //                 params: { restaurant, table, page: 1, limit: 10 }
    //             });
    //             setMenu(res.data.data);
    //         } catch (err) {
    //             console.error(err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchMenu();
    // }, [restaurant, table]);

    /* ================= TOTAL ================= */
    const cartTotal =
        items.reduce((sum, i) => sum + (i.totalPrice || 0), 0) || 0;

    /* ================= EMPTY ================= */
    if (!items || items.length === 0) {
        return (
            <div className="h-screen flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-xl font-semibold">Your cart is empty</h2>
                <p className="text-gray-500 mt-2">Add some delicious food 😋</p>
            </div>
        );
    }

    const subTotal = items.reduce(
        (sum, ci) => sum + ci.totalPrice,
        0
    );

    const totalTax = items.reduce((sum, ci) => {
        const percent = ci.item?.tax?.percent || 0;
        const itemTax = (ci.totalPrice * percent) / 100;
        return sum + itemTax;
    }, 0);
    // debugger
    // const grandTotal = subTotal + totalTax;

    const billSummary = items.reduce(
        (acc, ci) => {
            const itemTotal = ci.totalPrice || 0;
            const taxPercent = ci.item?.tax?.percent || 0;

            const itemTax = (itemTotal * taxPercent) / 100;

            acc.subTotal += itemTotal;
            acc.totalTax += itemTax;

            return acc;
        },
        { subTotal: 0, totalTax: 0 }
    );

    const grandTotal = billSummary.subTotal + billSummary.totalTax;



    // const handlePlaceOrder = async () => {
    //     try {
    //         if (!items.length) {
    //             return showErrorMsg("Cart is empty");
    //         }

    //         const payload = {
    //             restaurant: restaurant,
    //             table: table,
    //             orderType: "DINE_IN",
    //             items: items.map(ci => ({
    //                 itemId: ci.item._id,
    //                 quantity: ci.quantity,
    //                 variants: ci.variants?.map(v => ({
    //                     variantId: v._id,
    //                     name: v.name,
    //                     price: v.price,
    //                     quantity: v.quantity
    //                 }))
    //             }))
    //         };

    //         const res = await axiosInstance.post("/api/v1/place-order", payload);

    //         if (res.data.success) {
    //             showSuccessMsg("Order placed successfully 🎉");
    //             dispatch(clearCart());
    //         }

    //     } catch (error) {
    //         toast.error(error.response?.data?.message || "Order failed");
    //     }
    // };

    const handlePlaceOrder = async () => {
        try {
            if (!items.length) {
                return showErrorMsg("Cart is empty");
            }
// debugger 
            const payload = {
                restaurant,
                table,
                orderType: "DINE_IN",
                items: items.map(ci => ({
                    itemId: ci.item._id,
                    images: ci.item.image || [],
                    basePrice: ci.item.basePrice || null,
                    quantity: ci.quantity,
                    totalPrice: ci.totalPrice,
                    variants: ci.variants?.map(v => ({
                        variantId: v._id,
                        quantity: v.quantity || 1
                    }))
                })),

                subTotal: billSummary.subTotal,
                taxAmount: billSummary.totalTax,
                grandTotal: grandTotal
            };


            const res = await axiosInstance.post(
                "/api/v1/place-order",
                payload, { withCredentials: true }
            );

            if (res.data.success) {
                showSuccessMsg("Order placed successfully ");
                dispatch(clearCart());
                navigate("/customer-order-history")
            }

        } catch (error) {
            showErrorMsg(
                error.response?.data?.message || "Order failed"
            );
        }
    };



    return (
        <div className="max-w-3xl mx-auto pb-32">

            {/* ===== Restaurant Header ===== */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
                <div className="flex items-center gap-4 p-4">
                    <img
                        src={`/assets/images/categories/${menu?.categories[0]?.restaurant?.logo}`}
                        className="w-16 h-16 rounded-2xl object-cover shadow"
                        alt="restaurant"
                    />
                    <div className="flex-1">
                        <h2 className="text-xl font-bold">
                            {menu?.categories[0]?.restaurant?.name}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            ⭐ {menu?.categories[0]?.restaurant?.rating || 4.4}
                            <span>• 15–20 mins</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Back ===== */}
            <div
                onClick={() => { window.history.back() }}
                className="flex items-center gap-2  h-5 rounded-full  cursor-pointer w-fit m-3 text-black"
            >
                <i className="fa-solid fa-chevron-left text-sm"></i>
                <span className="text-sm">Back</span>
            </div>

            {/* ===== Cart Items ===== */}
            <div className="p-1 customerCart">
                {items.map(c => (
                    <div
                        key={c.item._id}
                        className="bg-white rounded-2xl shadow-sm border p-2 flex gap-2 mt-1"
                    >
                        <div className={`vegBox ${c.item.isVeg ? "veg" : "nonVeg"}`}>
                            <div className={`vegSymbol ${c.item.isVeg ? "vegSymbolveg" : "vegSymbolnonVeg"}`} />
                        </div>

                        <div className="flex justify-between w-full">
                            <div className="flex-1">
                                <p className="font-medium text-blue-950">{c.item.name}</p>
                                <span className="text-sm text-gray-900">
                                    {c.item.description?.slice(0, 40)}
                                </span>

                                {/* ===== Variants ===== */}
                                {c.variants?.length > 0 && (
                                    <div className="mt-2 space-y-2">
                                        {c.variants.map(v => (
                                            <div
                                                key={v._id}
                                                className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2"
                                            >
                                                <span className="text-sm font-medium">{v.name}</span>

                                                <div className="flex items-center bg-white rounded-full shadow">
                                                    <button
                                                        className="px-3 py-1 font-bold"
                                                        onClick={() =>
                                                            dispatch(
                                                                decreaseVariantQty({
                                                                    itemId: c.item._id,
                                                                    variantId: v._id
                                                                })
                                                            )
                                                        }
                                                    >
                                                        −
                                                    </button>

                                                    <span className="px-3 text-sm">{v.quantity}</span>

                                                    <button
                                                        className="px-3 py-1 font-bold"
                                                        onClick={() =>
                                                            dispatch(
                                                                increaseVariantQty({
                                                                    itemId: c.item._id,
                                                                    variantId: v._id
                                                                })
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <p
                                    className="text-red-600 cursor-pointer flex items-center gap-2 mt-1"
                                    onClick={() => dispatch(openVariantModal(c.item))}
                                >
                                    <i className="fa-solid fa-plus"></i>
                                    Add More Items
                                </p>

                                <p className="text-lg font-bold text-green-600 mt-2">
                                    ₹{c.totalPrice}
                                </p>
                            </div>

                            {/* ===== Normal Qty ===== */}
                            {(!c.variants || c.variants.length === 0) && (
                                <div className="flex items-center bg-gray-100 rounded-full h-fit">
                                    <button
                                        onClick={() => dispatch(decreaseQty(c.item._id))}
                                        className="px-4 py-1 text-xl font-bold"
                                    >
                                        −
                                    </button>

                                    <span className="px-3 font-medium">{c.quantity}</span>

                                    <button
                                        onClick={() => dispatch(increaseQty(c.item._id))}
                                        className="px-4 py-1 text-xl font-bold"
                                    >
                                        +
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ===== Bill ===== */}
            <div
                className="mx-4 mt-4 bg-white rounded-2xl shadow-md border border-gray-100"
                style={{ marginBottom: "100px" }}
            >
                <div className="p-3">

                    {/* Title */}
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Bill Details
                    </h2>

                    {/* Item Total */}
                    {/* Item Total */}
                    <div className="flex justify-between items-center py-2 text-gray-600">
                        <span>Item Total</span>
                        <span className="font-medium text-gray-900">
                            ₹{billSummary.subTotal.toFixed(2)}
                        </span>
                    </div>

                    {/* GST */}
                    <div className="flex justify-between items-center py-2 text-gray-600">
                        <span>GST & Charges</span>
                        <span className="font-medium text-gray-900">
                            ₹{billSummary.totalTax.toFixed(2)}
                        </span>
                    </div>

                    <div className="border-t my-4"></div>

                    {/* Grand Total */}
                    <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-900">
                            Grand Total
                        </span>
                        <span className="text-xl font-bold text-black">
                            ₹{grandTotal.toFixed(2)}
                        </span>
                    </div>


                    {/* Divider */}
                    <div className="border-t my-4"></div>

                    {/* Grand Total */}


                </div>
            </div>



            {/* ===== Checkout ===== */}
            {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl">
                <div className="max-w-3xl mx-auto px-3 py-2 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-gray-500">Payable Amount</p>
                        <p className="text-2xl font-extrabold">₹{cartTotal + 20}</p>
                    </div>

                    <button className="bg-green-600 text-white px-8 py-3 rounded-2xl font-bold">
                        Place Order →
                    </button>
                </div>
            </div> */}

            <div className="fixed bottom-0 left-0 right-0 z-50">
                <div className="max-w-3xl mx-auto px-3 py-2">

                    <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-2xl rounded-2xl px-3 pt-2  flex items-center justify-between">

                        {/* Amount Section */}
                        <div>
                            <p className="text-xs tracking-wide text-gray-500 uppercase ">
                                Payable Amount
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                ₹{grandTotal.toFixed(2)}

                            </p>
                        </div>

                        {/* Button */}
                        <button className="bg-black hover:bg-gray-900 active:scale-95 transition-all duration-200 text-white px-3 py-3  font-semibold text-sm shadow-md " style={{ borderRadius: "50px" }} onClick={handlePlaceOrder}
                        >
                            Place Order →
                        </button>

                    </div>

                </div>
            </div>

        </div>
    );
}

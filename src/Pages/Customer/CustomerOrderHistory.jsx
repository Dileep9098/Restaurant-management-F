import axiosInstance from "../../apiHandler/axiosInstance";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openVariantModal } from "../../Store/feature/Items/menuModalSlice";
import {
    clearCart
} from "../../Store/feature/Items/cartSlice";
import { showErrorMsg, showSuccessMsg } from "../../utils/ShowMessages";
import socket from "../../Socket/socket";

export default function CustomerOrderHistory() {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const [myOrder, setMyOrder] = useState()
    const [items, setItems] = useState([])
    const [restaurantInfo, setRestaurantInfo] = useState()
    const [tableInfo, setTableInfo] = useState()

    /* ================= TOTAL ================= */


    /* ================= EMPTY ================= */
    // if (!items || items.length === 0) {
    //     return (
    //         <div className="h-screen flex flex-col items-center justify-center text-center">
    //             <div className="text-6xl mb-4">🛒</div>
    //             <h2 className="text-xl font-semibold">Your cart is empty</h2>
    //             <p className="text-gray-500 mt-2">Add some delicious food 😋</p>
    //         </div>
    //     );
    // }



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


    const handlePlaceOrder = async () => {
        try {
            if (!items.length) {
                return showErrorMsg("Cart is empty");
            }

            const payload = {
                restaurant,
                table,
                orderType: "DINE_IN",

                items: items.map(ci => ({
                    itemId: ci.item._id,
                    quantity: ci.quantity,
                    totalPrice: ci.totalPrice,   // important
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
            }

        } catch (error) {
            showErrorMsg(
                error.response?.data?.message || "Order failed"
            );
        }
    };


    const [timeLeft, setTimeLeft] = useState(0); 

    useEffect(() => {
        if (myOrder?.orderStatus !== "PREPARING") return;

        // Calculate elapsed time since order became PREPARING
        const calculateTimeLeft = () => {
            const preparationTimeMinutes = myOrder?.preparationTime || 0;
            const totalSeconds = preparationTimeMinutes * 60;
            
            // Find when order status changed to PREPARING
            // For now, we'll use a simple approach - check if we have a timestamp
            // In a real app, you'd store when status changed in the database
            const now = new Date();
            const orderUpdatedAt = myOrder?.updatedAt ? new Date(myOrder.updatedAt) : now;
            const elapsedSeconds = Math.floor((now - orderUpdatedAt) / 1000);
            
            const remainingTime = Math.max(0, totalSeconds - elapsedSeconds);
            return remainingTime;
        };

        // Set initial time
        setTimeLeft(calculateTimeLeft());

        // Update every second
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [myOrder?.orderStatus, myOrder?.preparationTime, myOrder?.updatedAt]);


    // Format function
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };


    useEffect(() => {

        // 🔥 Test socket connection
        console.log("🔥 Testing socket connection...");
        console.log("🔥 Socket ID:", socket.id);
        console.log("🔥 Socket connected:", socket.connected);

        const fetchMenu = async () => {
            try {
                const res = await axiosInstance.get("/api/v1/get-my-orders ", { withCredentials: true });
                console.log("📋 CustomerOrderHistory loaded order:", res.data.order);
                setMyOrder(res.data.order);
                setItems(res.data.order.items)
                setRestaurantInfo(res.data.order.restaurant)
                setTableInfo(res.data.order.table)

                // 🔥 Join order-specific room for real-time updates
                if (res.data.order?.orderAccessToken) {
                    const orderToken = res.data.order.orderAccessToken;
                    console.log("🔥 CustomerOrderHistory joining order room:", `order_${orderToken}`);
                    socket.emit("joinOrderRoom", orderToken);
                }

                // 🔥 Join restaurant room for general updates
                if (res.data.order?.restaurant?._id) {
                    const restaurantId = res.data.order.restaurant._id;
                    console.log("🔥 CustomerOrderHistory joining restaurant room:", restaurantId);
                    socket.emit("joinRestaurant", restaurantId);
                }

            } catch (err) {
                console.error(err);
            } finally {
            }
        };

        fetchMenu();

        // 🔥 Listen for order updates from kitchen
        const handleOrderUpdated = (updatedOrder) => {
            console.log("🔥 Order update received in CustomerOrderHistory:", updatedOrder);
            console.log("🔥 Current order ID:", myOrder?._id);
            console.log("🔥 Updated order ID:", updatedOrder?._id);
            
            if (!updatedOrder?._id) {
                console.log("❌ No order ID in updated order");
                return;
            }
            
            // Update order if it matches current order
            setMyOrder(prev => {
                console.log("🔥 Comparing - Previous order ID:", prev?._id);
                console.log("🔥 Comparing - Updated order ID:", updatedOrder._id);
                
                if (prev?._id === updatedOrder._id) {
                    console.log("✅ Updating current order status to:", updatedOrder.orderStatus);
                    return updatedOrder;
                }
                console.log("❌ Order IDs don't match, not updating");
                return prev;
            });

            // Update items if order was updated
            if (updatedOrder.items) {
                console.log("🔥 Updating items:", updatedOrder.items);
                setItems(updatedOrder.items);
            }
        };

        // 🔥 Listen for preparation time updates
        const handlePreparationTimeUpdated = (data) => {
            console.log("🔥 Preparation time update received in CustomerOrderHistory:", data);
            
            setMyOrder(prev => {
                if (prev?._id === data.orderId) {
                    console.log("✅ Updating preparation time to:", data.preparationTime);
                    return { ...prev, preparationTime: data.preparationTime };
                }
                return prev;
            });
        };

        socket.on("orderUpdated", handleOrderUpdated);
        socket.on("preparationTimeUpdated", handlePreparationTimeUpdated);

        return () => {
            socket.off("orderUpdated", handleOrderUpdated);
            socket.off("preparationTimeUpdated", handlePreparationTimeUpdated);
        };
    }, []);


    const handleDownloadInvoice = async () => {
        try {
            // debugger
            const res = await axiosInstance.get(
                `/api/v1/download-invoice/${myOrder?._id}`,
                { responseType: "blob", withCredentials: true }
            );

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Invoice-${myOrder?._id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download failed", error);
        }
    };

   


    return (
        <div className="max-w-3xl mx-auto pb-32">


            <div className="premium-header">
                <div className="header-top">

                    {/* Left */}
                    <div className="restaurant-info">
                        <img
                            src={`/assets/images/categories/${restaurantInfo?.logo}`}
                            className="restaurant-logo"
                            alt="restaurant"
                        />

                        <div>
                            <h4 className="restaurant-name">
                                {restaurantInfo?.name}
                            </h4>

                            <div className="restaurant-meta">
                                ⭐ {restaurantInfo?.rating || 4.4}
                                <span className="dot">•</span>
                                Table {tableInfo?.tableNumber || "-"}
                            </div>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="order-status-box">
                        <span className={`status-badge ${myOrder?.orderStatus}`}>
                            {myOrder?.orderStatus}
                        </span>

                        {myOrder?.preparationTime > 0 && (
                            <div className="preparation-time-display">
                                <i className="fa-solid fa-clock"></i>
                                <span>{myOrder.preparationTime} min</span>
                            </div>
                        )}

                        {myOrder?.orderStatus === "PREPARING" && timeLeft > 0 && (
                            <div className="premium-timer">
                                <i className="fa-solid fa-hourglass-half"></i>
                                <span>{formatTime(timeLeft)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="order-meta-row">
                    <div className="order-id">
                        Order ID: <strong>#{myOrder?.orderNumber}</strong>
                    </div>

                    <div className="order-date">
                        {new Date(myOrder?.createdAt).toLocaleString()}
                    </div>
                </div>
            </div>


            <div className="order-history-item d-flex align-items-center justify-content-between px-3 py-2">

                {/* Left Section */}
                <div className="d-flex align-items-center gap-3">
                    <span className="material-symbols-outlined icon">
                        history
                    </span>
                    <span className="label">
                        Order History
                    </span>
                </div>

                {/* Right Section */}
                <div className="status-wrapper text-end">
                    <span className={`status ${myOrder?.orderStatus}`}>
                        {myOrder?.orderStatus}
                    </span>

                    {myOrder?.orderStatus === "PREPARING" && timeLeft > 0 && (
                        <div className="timer">
                            <i class="fa-solid fa-hourglass-half"></i> {formatTime(timeLeft)}
                        </div>
                    )}
                </div>


            </div>


            {/* ===== Order Items ===== */}
            <div className="p-1 customerCart">
                {items.map(c => (
                    <div
                        key={c._id}
                        className="bg-white rounded-2xl shadow-sm border p-2 flex gap-2 mt-1"
                    >
                        {/* <div className={`vegBox ${c.item.isVeg ? "veg" : "nonVeg"}`}>
                            <div className={`vegSymbol ${c.item.isVeg ? "vegSymbolveg" : "vegSymbolnonVeg"}`} />
                        </div> */}

                        <div className="flex justify-between w-full">
                            <div className="flex-1">
                                <div className="item-left">
                                    <div className="item-image-wrapper">
                                        <img
                                            src={`/assets/images/menu/${c?.image[0] || "default.png"}`}
                                            alt={c?.name}
                                            className="item-image"
                                        />
                                    </div>
                                    <p className="font-medium text-blue-950">{c?.name}</p>
                                </div>
                                {/* <span className="text-sm text-gray-900">
                                    {c.item.description?.slice(0, 40)}
                                </span> */}

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
                                                    // onClick={() =>
                                                    //     dispatch(
                                                    //         decreaseVariantQty({
                                                    //             itemId: c.item._id,
                                                    //             variantId: v._id
                                                    //         })
                                                    //     )
                                                    // }
                                                    >
                                                        −
                                                    </button>

                                                    <span className="px-3 text-sm">{v.quantity}</span>

                                                    <button
                                                        className="px-3 py-1 font-bold"
                                                    // onClick={() =>
                                                    //     dispatch(
                                                    //         increaseVariantQty({
                                                    //             itemId: c.item._id,
                                                    //             variantId: v._id
                                                    //         })
                                                    //     )
                                                    // }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* <p
                                    className="text-red-600 cursor-pointer flex items-center gap-2 mt-1"
                                    onClick={() => dispatch(openVariantModal(c.item))}
                                >
                                    <i className="fa-solid fa-plus"></i>
                                    Add More Items
                                </p> */}

                                <p className="text-lg font-bold text-green-600 mt-2">
                                    ₹{c.totalPrice}
                                </p>
                            </div>

                            {/* ===== Normal Qty ===== */}
                            {(!c.variants || c.variants.length === 0) && (
                                <div className="flex items-center bg-gray-100 rounded-full h-fit">
                                    <button
                                        // onClick={() => dispatch(decreaseQty(c.item._id))}
                                        className="px-4 py-1 text-xl font-bold"
                                    >
                                        −
                                    </button>

                                    <span className="px-3 font-medium">{c.quantity}</span>

                                    <button
                                        // onClick={() => dispatch(increaseQty(c.item._id))}
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

            {/* ===== Invoice Section ===== */}
            <div className="premium-bill-card mt-4">
                <div className="bill-header">
                    <h6>Bill Summary</h6>
                </div>

                <div className="bill-body">

                    <div className="modern-bill-row">
                        <div className="bill-label">
                            <i className="fa-solid fa-receipt"></i>
                            <span>Item Total</span>
                        </div>
                        <span className="bill-amount">₹ {myOrder?.subTotal}</span>
                    </div>

                    <div className="modern-bill-row">
                        <div className="bill-label">
                            <i className="fa-solid fa-truck"></i>
                            <span>Delivery Fee</span>
                        </div>
                        <span className="bill-amount">₹ {myOrder?.deliveryFee || 0}</span>
                    </div>

                    <div className="modern-bill-row">
                        <div className="bill-label">
                            <i className="fa-solid fa-percent"></i>
                            <span>Tax & Charges</span>
                        </div>
                        <span className="bill-amount">₹ {myOrder?.taxAmount}</span>
                    </div>

                    <div className="bill-separator" />
                    <hr style={{ border: "1px solid gray" }} />

                    <div className="modern-bill-total">
                        <span>Total Bill</span>
                        <span>₹ {myOrder?.grandTotal}</span>
                    </div>
                    <div className="invoice-download-wrapper">
                        <button
                            className="invoice-download-btn"
                            onClick={() => handleDownloadInvoice()}
                        >
                            <i className="fa-solid fa-file-arrow-down"></i>
                            <span>Download Invoice / Credit Note</span>
                        </button>
                        {/* 🔥 Socket Test Button */}
                       
                    </div>



                </div>
            </div>



        </div>
    );
}



//   ===== Back =====
//     <div
//         onClick={() => { window.history.back() }}
//         className="flex items-center gap-2  h-5 rounded-full  cursor-pointer w-fit m-3 text-black"
//     >
//         <i className="fa-solid fa-chevron-left text-sm"></i>
//         <span className="text-sm">Back</span>
//     </div>

// {/* ===== Cart Items ===== */ }
// <div className="p-1 customerCart">
//     {items.map(c => (
//         <div
//             key={c.item._id}
//             className="bg-white rounded-2xl shadow-sm border p-2 flex gap-2 mt-1"
//         >
//             <div className={`vegBox ${c.item.isVeg ? "veg" : "nonVeg"}`}>
//                 <div className={`vegSymbol ${c.item.isVeg ? "vegSymbolveg" : "vegSymbolnonVeg"}`} />
//             </div>

//             <div className="flex justify-between w-full">
//                 <div className="flex-1">
//                     <p className="font-medium text-blue-950">{c.item.name}</p>
//                     <span className="text-sm text-gray-900">
//                         {c.item.description?.slice(0, 40)}
//                     </span>

//                     {/* ===== Variants ===== */}
//                     {c.variants?.length > 0 && (
//                         <div className="mt-2 space-y-2">
//                             {c.variants.map(v => (
//                                 <div
//                                     key={v._id}
//                                     className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2"
//                                 >
//                                     <span className="text-sm font-medium">{v.name}</span>

//                                     <div className="flex items-center bg-white rounded-full shadow">
//                                         <button
//                                             className="px-3 py-1 font-bold"
//                                             onClick={() =>
//                                                 dispatch(
//                                                     decreaseVariantQty({
//                                                         itemId: c.item._id,
//                                                         variantId: v._id
//                                                     })
//                                                 )
//                                             }
//                                         >
//                                             −
//                                         </button>

//                                         <span className="px-3 text-sm">{v.quantity}</span>

//                                         <button
//                                             className="px-3 py-1 font-bold"
//                                             onClick={() =>
//                                                 dispatch(
//                                                     increaseVariantQty({
//                                                         itemId: c.item._id,
//                                                         variantId: v._id
//                                                     })
//                                                 )
//                                             }
//                                         >
//                                             +
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}

//                     <p
//                         className="text-red-600 cursor-pointer flex items-center gap-2 mt-1"
//                         onClick={() => dispatch(openVariantModal(c.item))}
//                     >
//                         <i className="fa-solid fa-plus"></i>
//                         Add More Items
//                     </p>

//                     <p className="text-lg font-bold text-green-600 mt-2">
//                         ₹{c.totalPrice}
//                     </p>
//                 </div>

//                 {/* ===== Normal Qty ===== */}
//                 {(!c.variants || c.variants.length === 0) && (
//                     <div className="flex items-center bg-gray-100 rounded-full h-fit">
//                         <button
//                             onClick={() => dispatch(decreaseQty(c.item._id))}
//                             className="px-4 py-1 text-xl font-bold"
//                         >
//                             −
//                         </button>

//                         <span className="px-3 font-medium">{c.quantity}</span>

//                         <button
//                             onClick={() => dispatch(increaseQty(c.item._id))}
//                             className="px-4 py-1 text-xl font-bold"
//                         >
//                             +
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     ))}
// </div>

// {/* ===== Bill ===== */ }
//             <div
//                 className="mx-4 mt-4 bg-white rounded-2xl shadow-md border border-gray-100"
//                 style={{ marginBottom: "100px" }}
//             >
//                 <div className="p-3">

//                     {/* Title */}
//                     <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                         Bill Details
//                     </h2>

//                     {/* Item Total */}
//                     {/* Item Total */}
//                     <div className="flex justify-between items-center py-2 text-gray-600">
//                         <span>Item Total</span>
//                         <span className="font-medium text-gray-900">
//                             ₹{billSummary.subTotal.toFixed(2)}
//                         </span>
//                     </div>

//                     {/* GST */}
//                     <div className="flex justify-between items-center py-2 text-gray-600">
//                         <span>GST & Charges</span>
//                         <span className="font-medium text-gray-900">
//                             ₹{billSummary.totalTax.toFixed(2)}
//                         </span>
//                     </div>

//                     <div className="border-t my-4"></div>

//                     {/* Grand Total */}
//                     <div className="flex justify-between items-center">
//                         <span className="text-base font-semibold text-gray-900">
//                             Grand Total
//                         </span>
//                         <span className="text-xl font-bold text-black">
//                             ₹{grandTotal.toFixed(2)}
//                         </span>
//                     </div>

//                     {/* Divider */}
//                     <div className="border-t my-4"></div>
//                     {/* Grand Total */}
//                 </div>
//             </div>

//             <div className="fixed bottom-0 left-0 right-0 z-50">
//                 <div className="max-w-3xl mx-auto px-3 py-2">

//                     <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-2xl rounded-2xl px-3 pt-2  flex items-center justify-between">

//                         {/* Amount Section */}
//                         <div>
//                             <p className="text-xs tracking-wide text-gray-500 uppercase ">
//                                 Payable Amount
//                             </p>
//                             <p className="text-2xl font-bold text-gray-900">
//                                 ₹{grandTotal.toFixed(2)}

//                             </p>
//                         </div>

//                         {/* Button */}
//                         <button className="bg-black hover:bg-gray-900 active:scale-95 transition-all duration-200 text-white px-3 py-3  font-semibold text-sm shadow-md " style={{ borderRadius: "50px" }} onClick={handlePlaceOrder}
//                         >
//                             Place Order →
//                         </button>

//                     </div>

//                 </div>
//             </div>
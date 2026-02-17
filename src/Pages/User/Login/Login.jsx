
// import React, { useRef, useState } from "react";
// import axiosInstance from "../../../apiHandler/axiosInstance";
// import Config from "../../../Config/Config";
// import { Link, useNavigate } from "react-router-dom";
// import { showErrorMsg, showSuccessMsg } from "../../../utils/ShowMessages";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchMe, loginUser } from "../../../Store/feature/Auth/authslice";
// import { useEffect } from "react";
// export default function Login() {


//     const [changePage, setChangePage] = useState("login-page");
//     const navigate = useNavigate();
//     const dispatch = useDispatch()
//     const { user, token, loading } = useSelector((state) => state.auth);


//     const [formData, setFormData] = useState({
//         username: "",
//         password: "",
//         email: "",
//         remember: false,
//     });
//     const [showPassword, setShowPassword] = useState(false);

//     // handle input
//     const handleChange = (e) => {
//         const { id, value, type, checked } = e.target;
//         setFormData({
//             ...formData,
//             [id]: type === "checkbox" ? checked : value
//         });
//     };

//     const [userId, setUserId] = useState(null);
//     const [showOTPModal, setShowOTPModal] = useState(false);

//     // OTP state as array of digits
//     const OTP_LENGTH = 6;
//     const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(''));
//     const inputsRef = useRef([]);

//     // submit
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         console.log("Form Submitted:", formData);

//         try {
//             if (changePage === "login-page") {
//                 const result = await dispatch(
//                     loginUser({
//                         email: formData.email,
//                         password: formData.password
//                     })
//                 );

//                 if (loginUser.fulfilled.match(result)) {
//                     dispatch(fetchMe());
//                 } else {
//                     console.error(result.payload || result.error);
//                 }
//             } else {
//                 console.log("Signing up with:", formData);

//                 const response = await axiosInstance.post(
//                     Config.END_POINT_LIST['REGITER_USER'],
//                     {
//                         username: formData.username,
//                         password: formData.password,
//                         email: formData.email
//                     },
//                     { withCredentials: true }
//                 );

//                 console.log("SignUp Response:", response.data);

//                 if (response.data.success) {
//                     showSuccessMsg('OTP sent to your email');
//                     setUserId(response.data.userId);
//                     setShowOTPModal(true);
//                 }
//             }
//         } catch (error) {
//             console.error("Error during form submission:", error);
//         }
//     };


//     const handleOtpChange = (e, index) => {
//         const value = e.target.value.replace(/\D/, '');
//         if (!value) {
//             const newOtp = [...otpValues];
//             newOtp[index] = '';
//             setOtpValues(newOtp);
//             return;
//         }

//         const newOtp = [...otpValues];
//         newOtp[index] = value;
//         setOtpValues(newOtp);

//         if (index < OTP_LENGTH - 1) {
//             inputsRef.current[index + 1]?.focus();
//         }
//     };

//     const handleOtpKeyDown = (e, index) => {
//         if (e.key === 'Backspace') {
//             if (otpValues[index]) {
//                 const newOtp = [...otpValues];
//                 newOtp[index] = '';
//                 setOtpValues(newOtp);
//             } else if (index > 0) {
//                 inputsRef.current[index - 1]?.focus();
//             }
//         }
//     };

//     // Handle OTP verify button
//     const handleVerifyOtp = async () => {
//         const otp = otpValues.join('');
//         if (otp.length !== OTP_LENGTH) {
//             showErrorMsg('Please enter complete OTP');
//             return;
//         }

//         try {
//             const response = await axiosInstance.post(
//                 Config.END_POINT_LIST['VERIFY_OTP'],
//                 { userId, otp },
//                 { withCredentials: true }
//             );

//             if (response.data.success) {
//                 showSuccessMsg('OTP verified successfully!');
//                 setShowOTPModal(false);
//                 navigate('/');
//                 setChangePage("login-page");
//             } else {
//                 showErrorMsg('Invalid OTP');
//             }
//         } catch (error) {
//             showErrorMsg(error.response?.data?.message || 'Failed to verify OTP');
//         }
//     };


//     // Login success → Auto redirect
//     useEffect(() => {
//         if (user && token) {
//             navigate("/dashboard");
//         }
//     }, [user, token]);

//     return (
//         <>
//             <div className="auth-page-wrapper pt-5">

//                 {/* BG */}
//                 <div className="auth-one-bg-position auth-one-bg" id="auth-particles">
//                     <div className="bg-overlay" />
//                     <div className="shape">
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
//                             <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z" />
//                         </svg>
//                     </div>
//                 </div>

// {
//     changePage === "login-page" ? (
//         < div className="auth-page-content">
//             <div className="container">

//                 <div className="row">
//                     <div className="col-lg-12">
//                         <div className="text-center mt-sm-5 mb-4 text-white-50">
//                             <div>
//                                 <a href="#" className="d-inline-block auth-logo">
//                                     <img src="assets/images/logo-light.png" alt="" height={20} />
//                                 </a>
//                             </div>
//                             <p className="mt-3 fs-15 fw-medium">
//                                 Login & get started
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Login Card */}
//                 <div className="row justify-content-center">
//                     <div className="col-md-8 col-lg-6 col-xl-5">
//                         <div className="card mt-4">
//                             <div className="card-body p-4">

//                                 <div className="text-center mt-2">
//                                     <h5 className="text-primary">Welcome Back!</h5>
//                                     <p className="text-muted">Sign in to continue</p>
//                                 </div>

//                                 <div className="p-2 mt-4">

//                                     {/* React Form */}
//                                     <form onSubmit={handleSubmit}>

//                                         {/* Username */}
//                                         <div className="mb-3">
//                                             <label htmlFor="username" className="form-label">
//                                                 Email Address
//                                             </label>
//                                             <input
//                                                 type="email"
//                                                 id="email"
//                                                 className="form-control"
//                                                 placeholder="Enter username"
//                                                 value={formData.email}
//                                                 onChange={handleChange}
//                                                 autoComplete="off"
//                                             />
//                                         </div>

//                                         {/* Password */}
//                                         <div className="mb-3">
//                                             <div className="float-end">
//                                                 <a href="#" className="text-muted">Forgot password?</a>
//                                             </div>

//                                             <label className="form-label" htmlFor="password">
//                                                 Password
//                                             </label>

//                                             <div className="position-relative auth-pass-inputgroup mb-3">
//                                                 <input
//                                                     type={showPassword ? "text" : "password"} id="password"
//                                                     className="form-control pe-5"
//                                                     placeholder="Enter password"
//                                                     value={formData.password}
//                                                     onChange={handleChange}
//                                                     autoComplete="off"
//                                                 />
//                                                 <button
//                                                     className="btn btn-link position-absolute end-0 top-0 text-muted"
//                                                     type="button" onClick={() => setShowPassword(!showPassword)}
//                                                 >
//                                                     <i className="ri-eye-fill align-middle" />
//                                                 </button>
//                                             </div>
//                                         </div>

//                                         {/* Remember */}
//                                         <div className="form-check mb-3">
//                                             <input
//                                                 type="checkbox"
//                                                 className="form-check-input"
//                                                 id="remember"
//                                                 checked={formData.remember}
//                                                 onChange={handleChange}
//                                             />
//                                             <label htmlFor="remember" className="form-check-label">
//                                                 Remember me
//                                             </label>
//                                         </div>

//                                         {/* Button */}
//                                         <div className="mt-4">
//                                             <button type="submit" className="btn btn-secondary w-100">
//                                                 Sign In
//                                             </button>
//                                         </div>

//                                     </form>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Signup Link */}
//                         <div className="mt-4 text-center">
//                             <p className="mb-0">
//                                 Don't have an account?
//                                 <a href="#" onClick={() => setChangePage("sign-up-page")} className="fw-semibold text-primary text-decoration-underline">
//                                     Signup
//                                 </a>
//                             </p>
//                         </div>

//                     </div>
//                 </div>

//             </div>
//         </div>
//     ) :
//         < div className="auth-page-content">
//             <div className="container">

//                 <div className="row">
//                     <div className="col-lg-12">
//                         <div className="text-center mt-sm-5 mb-4 text-white-50">
//                             <div>
//                                 <a href="#" className="d-inline-block auth-logo">
//                                     <img src="assets/images/logo-light.png" alt="" height={20} />
//                                 </a>
//                             </div>
//                             <p className="mt-3 fs-15 fw-medium">
//                                 Sign-up & get started
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Login Card */}
//                 <div className="row justify-content-center">
//                     <div className="col-md-8 col-lg-6 col-xl-5">
//                         <div className="card mt-4">
//                             <div className="card-body p-4">

//                                 <div className="text-center mt-2">
//                                     <h5 className="text-primary">Create New Account</h5>
//                                     <p className="text-muted">Get your free velzon account now</p>
//                                 </div>

//                                 <div className="p-2 mt-4">

//                                     {/* React Form */}
//                                     <form onSubmit={handleSubmit}>

//                                         {/* Username */}
//                                         <div className="mb-3">
//                                             <label htmlFor="username" className="form-label">
//                                                 Email <span class="text-danger">*</span>
//                                             </label>
//                                             <input
//                                                 type="email"
//                                                 id="email"
//                                                 className="form-control"
//                                                 placeholder="Enter email"
//                                                 value={formData.email}
//                                                 onChange={handleChange}
//                                                 autoComplete="off"
//                                             />
//                                         </div>

//                                         <div className="mb-3">
//                                             <label htmlFor="username" className="form-label">
//                                                 Username<span class="text-danger">*</span>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 id="username"
//                                                 className="form-control"
//                                                 placeholder="Enter username"
//                                                 value={formData.username}
//                                                 onChange={handleChange}
//                                                 autoComplete="off"
//                                             />
//                                         </div>

//                                         {/* Password */}
//                                         <div className="mb-3">

//                                             <label className="form-label" htmlFor="password">
//                                                 Password
//                                             </label>

//                                             <div className="position-relative auth-pass-inputgroup mb-3">
//                                                 <input
//                                                     type={showPassword ? "text" : "password"} id="password"
//                                                     className="form-control pe-5"
//                                                     placeholder="Enter password"
//                                                     value={formData.password}
//                                                     onChange={handleChange}
//                                                     autoComplete="off"
//                                                 />
//                                                 <button
//                                                     className="btn btn-link position-absolute end-0 top-0 text-muted"
//                                                     type="button" onClick={() => setShowPassword(!showPassword)}
//                                                 >
//                                                     <i className="ri-eye-fill align-middle" />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                         <div class="mb-4">
//                                             <p class="mb-0 fs-12 text-muted fst-italic">By registering you agree to the Velzon <a href="#" class="text-primary text-decoration-underline fst-normal fw-medium">Terms of Use</a></p>
//                                         </div>
//                                         {/* Remember */}
//                                         <div className="form-check mb-3">
//                                             <input
//                                                 type="checkbox"
//                                                 className="form-check-input"
//                                                 id="remember"
//                                                 checked={formData.remember}
//                                                 onChange={handleChange}
//                                             />
//                                             <label htmlFor="remember" className="form-check-label">
//                                                 Remember me
//                                             </label>
//                                         </div>

//                                         <div id="password-contain" class="p-3 bg-light mb-2 rounded">
//                                             <h5 class="fs-13">Password must contain:</h5>
//                                             <p id="pass-length" class="invalid fs-12 mb-2">Minimum <b>8 characters</b></p>
//                                             <p id="pass-lower" class="invalid fs-12 mb-2">At <b>lowercase</b> letter (a-z)</p>
//                                             <p id="pass-upper" class="invalid fs-12 mb-2">At least <b>uppercase</b> letter (A-Z)</p>
//                                             <p id="pass-number" class="invalid fs-12 mb-0">A least <b>number</b> (0-9)</p>
//                                         </div>

//                                         <div class="mt-4">
//                                             <button class="btn btn-secondary w-100" type="submit">Sign Up</button>
//                                         </div>

//                                         <div class="mt-4 text-center">
//                                             <div class="signin-other-title">
//                                                 <h5 class="fs-13 mb-4 title text-muted">Create account with</h5>
//                                             </div>

//                                             <div>
//                                                 <button type="button" class="btn btn-primary btn-icon waves-effect waves-light"><i class="ri-facebook-fill fs-16"></i></button>
//                                                 <button type="button" class="btn btn-danger btn-icon waves-effect waves-light"><i class="ri-google-fill fs-16"></i></button>
//                                                 <button type="button" class="btn btn-dark btn-icon waves-effect waves-light"><i class="ri-github-fill fs-16"></i></button>
//                                                 <button type="button" class="btn btn-info btn-icon waves-effect waves-light"><i class="ri-twitter-fill fs-16"></i></button>
//                                             </div>
//                                         </div>

//                                     </form>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Signup Link */}
//                         {/* <div className="mt-4 text-center">
//                             <p className="mb-0">
//                                 Don't have an account?
//                                 <a href="#" onClick={() => setChangePage("sign-up-page")} className="fw-semibold text-primary text-decoration-underline">
//                                     Signup
//                                 </a>
//                             </p>
//                         </div> */}
//                         <div class="mt-4 text-center">
//                             <p class="mb-0">Already have an account ? <a href="#" class="fw-semibold text-primary text-decoration-underline" onClick={() => setChangePage("login-page")} > Signin </a> </p>
//                         </div>

//                     </div>
//                 </div>

//             </div>
//         </div>
// }


//                 <footer className="footer">
//                     <div className="container">
//                         <div className="text-center">
//                             <p className="mb-0 text-muted">
//                                 © Velzon. Crafted with <i className="mdi mdi-heart text-danger" /> by Themesbrand
//                             </p>
//                         </div>
//                     </div>
//                 </footer>

//             </div >

//             {showOTPModal && (
//                 <div
//                     style={{
//                         position: 'fixed',
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                         backgroundColor: 'rgba(0,0,0,0.4)',
//                         backdropFilter: 'blur(5px)',
//                         display: 'flex',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         zIndex: 2000,
//                     }}
//                 >
//                     <div
//                         style={{
//                             background: '#fff',
//                             padding: '30px 40px',
//                             borderRadius: '12px',
//                             width: '360px',
//                             boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
//                             textAlign: 'center',
//                             animation: 'fadeIn 0.3s ease-in-out',
//                         }}
//                     >
//                         <div
//                             style={{
//                                 height: '65px',
//                                 width: '65px',
//                                 background: '#4070f4',
//                                 color: '#fff',
//                                 fontSize: '2.5rem',
//                                 borderRadius: '50%',
//                                 margin: '0 auto',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                             }}
//                         >
//                             <i className="bx bxs-check-shield"></i>
//                         </div>
//                         <h4 style={{ margin: '20px 0 15px' }}>Enter OTP Code</h4>

//                         <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
//                             {otpValues.map((digit, idx) => (
//                                 <input
//                                     key={idx}
//                                     type="text"
//                                     maxLength={1}
//                                     value={digit}
//                                     onChange={(e) => handleOtpChange(e, idx)}
//                                     onKeyDown={(e) => handleOtpKeyDown(e, idx)}
//                                     ref={(el) => (inputsRef.current[idx] = el)}
//                                     style={{
//                                         width: '45px',
//                                         height: '50px',
//                                         fontSize: '20px',
//                                         textAlign: 'center',
//                                         borderRadius: '6px',
//                                         border: '1px solid #ddd',
//                                         outline: 'none',
//                                     }}
//                                 />
//                             ))}
//                         </div>

//                         <button
//                             className={`btn btn-primary w-100 ${otpValues.every((v) => v) ? 'active' : ''}`}
//                             onClick={handleVerifyOtp}
//                             disabled={otpValues.some((v) => v === '')}
//                         >
//                             Verify OTP
//                         </button>

//                         <button
//                             className="btn btn-link mt-2"
//                             onClick={() => setShowOTPModal(false)}
//                             style={{ fontSize: '0.9rem', color: '#999' }}
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </div>
//             )}

//         </>


//     );
// }







import React, { useRef, useState } from "react";
import axiosInstance from "../../../apiHandler/axiosInstance";
import Config from "../../../Config/Config";
import { Link, useNavigate } from "react-router-dom";
import { showErrorMsg, showSuccessMsg } from "../../../utils/ShowMessages";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe, loginUser } from "../../../Store/feature/Auth/authslice";
import { useEffect } from "react";

export default function Login() {


    const [changePage, setChangePage] = useState("login-page");
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { user, token, loading } = useSelector((state) => state.auth);


    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    // handle input
    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [id]: type === "checkbox" ? checked : value
        });
    };

    const [userId, setUserId] = useState(null);
    const [showOTPModal, setShowOTPModal] = useState(false);

    // OTP state as array of digits
    const OTP_LENGTH = 6;
    const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(''));
    const inputsRef = useRef([]);

    // submit
    const handleSubmit = async (e) => {
           e.preventDefault();
        console.log("Form Submitted:", formData);

        try {
            if (changePage === "login-page") {
                const result = await dispatch(
                    loginUser({
                        email: formData.email,
                        password: formData.password
                    })
                );

                if (loginUser.fulfilled.match(result)) {
                    dispatch(fetchMe());
                } else {
                    console.error(result.payload || result.error);
                }
            } else {
                console.log("Signing up with:", formData);

                const response = await axiosInstance.post(
                    Config.END_POINT_LIST['REGITER_USER'],
                    {
                        username: formData.username,
                        password: formData.password,
                        email: formData.email
                    },
                    { withCredentials: true }
                );

                console.log("SignUp Response:", response.data);

                if (response.data.success) {
                    showSuccessMsg('OTP sent to your email');
                    setUserId(response.data.userId);
                    setShowOTPModal(true);
                }
            }
        } catch (error) {
            console.error("Error during form submission:", error);
        }
    };


    const handleOtpChange = (e, index) => {
        const value = e.target.value.replace(/\D/, '');
        if (!value) {
            const newOtp = [...otpValues];
            newOtp[index] = '';
            setOtpValues(newOtp);
            return;
        }

        const newOtp = [...otpValues];
        newOtp[index] = value;
        setOtpValues(newOtp);

        if (index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (otpValues[index]) {
                const newOtp = [...otpValues];
                newOtp[index] = '';
                setOtpValues(newOtp);
            } else if (index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
        }
    };

    // Handle OTP verify button
    const handleVerifyOtp = async () => {
        const otp = otpValues.join('');
        if (otp.length !== OTP_LENGTH) {
            showErrorMsg('Please enter complete OTP');
            return;
        }

        try {
            const response = await axiosInstance.post(
                Config.END_POINT_LIST['VERIFY_OTP'],
                { userId, otp },
                { withCredentials: true }
            );

            if (response.data.success) {
                showSuccessMsg('OTP verified successfully!');
                setShowOTPModal(false);
                navigate('/');
                setChangePage("login-page");
            } else {
                showErrorMsg('Invalid OTP');
            }
        } catch (error) {
            showErrorMsg(error.response?.data?.message || 'Failed to verify OTP');
        }
    };


    // Login success → Auto redirect
    useEffect(() => {
        if (user && token) {
            navigate("/dashboard");
        }
    }, [user, token]);

    return (
        <>
            <main className="auth-minimal-wrapper">
                <div className="auth-minimal-inner">

                    <div className="minimal-card-wrapper">


                        {
                            changePage === "login-page" ? (


                                <div className="card mb-4 mt-5 mx-4 mx-sm-0 position-relative">
                                    <div className="wd-50 bg-white p-2 rounded-circle shadow-lg position-absolute translate-middle top-0 start-50">
                                        <img src="assets/images/logo-abbr.png" alt="" className="img-fluid" />
                                    </div>
                                    <div className="card-body p-sm-5">
                                        <h2 className="fs-20 fw-bolder mb-4">Login</h2>
                                        <h4 className="fs-13 fw-bold mb-2">Login to your account</h4>
                                        <p className="fs-12 fw-medium text-muted">
                                            Thank you for get back <strong>Nelel</strong> web applications,
                                            let's access our the best recommendation for you.
                                        </p>
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-4">
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Email or Username"
                                                    id="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="position-relative auth-pass-inputgroup mb-3">
                                                <input
                                                    type={showPassword ? "text" : "password"} id="password"
                                                    className="form-control pe-5"
                                                    placeholder="Enter password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    autoComplete="off"
                                                />
                                                <a
                                                    className="btn btn-link position-absolute end-0 top-0 text-muted"
                                                    onClick={() => setShowPassword(!showPassword)} href="javascript:void(0);"

                                                    data-bs-toggle="tooltip"
                                                    data-bs-trigger="hover"
                                                    title="Login with Facebook"
                                                >

                                                    <i className={`${showPassword ? "feather-eye" : "feather-eye-off"}`} />

                                                </a>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>
                                                    <div className="custom-control custom-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            id="remember"
                                                            checked={formData.remember}
                                                            onChange={handleChange}
                                                        />
                                                        <label
                                                            className="custom-control-label c-pointer"
                                                            htmlFor="remember"
                                                        >
                                                            Remember Me
                                                        </label>
                                                    </div>
                                                </div>
                                                <div>
                                                    <a
                                                        href="auth-reset-minimal.html"
                                                        className="fs-11 text-primary"
                                                    >
                                                        Forget password?
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="mt-5">
                                                <button type="submit" className="btn btn-lg btn-primary w-100">
                                                    Login
                                                </button>
                                            </div>
                                        </form>
                                        <div className="w-100 mt-5 text-center mx-auto">
                                            <div className="mb-4 border-bottom position-relative">
                                                <span className="small py-1 px-3 text-uppercase text-muted bg-white position-absolute translate-middle">
                                                    or
                                                </span>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center gap-2">
                                                <a
                                                    href="javascript:void(0);"
                                                    className="btn btn-light-brand flex-fill"
                                                    data-bs-toggle="tooltip"
                                                    data-bs-trigger="hover"
                                                    title="Login with Facebook"
                                                >
                                                    <i className="feather-facebook" />
                                                </a>
                                                <a
                                                    href="javascript:void(0);"
                                                    className="btn btn-light-brand flex-fill"
                                                    data-bs-toggle="tooltip"
                                                    data-bs-trigger="hover"
                                                    title="Login with Twitter"
                                                >
                                                    <i className="feather-twitter" />
                                                </a>
                                                <a
                                                    href="javascript:void(0);"
                                                    className="btn btn-light-brand flex-fill"
                                                    data-bs-toggle="tooltip"
                                                    data-bs-trigger="hover"
                                                    title="Login with Github"
                                                >
                                                    <i className="feather-github text" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="mt-5 text-muted">
                                            <span> Don't have an account?</span>
                                            <a href="#" onClick={() => setChangePage("sign-up-page")} className="fw-bold">
                                                Create an Account
                                            </a>
                                        </div>
                                    </div>
                                </div>



                            ) :
                                <div className="card mb-4 mt-5 mx-4 mx-sm-0 position-relative">
                                    <div className="wd-50 bg-white p-2 rounded-circle shadow-lg position-absolute translate-middle top-0 start-50">
                                        <img src="assets/images/logo-abbr.png" alt="" className="img-fluid" />
                                    </div>
                                    <div className="card-body p-sm-5">
                                        <h2 class="fs-20 fw-bolder mb-4">Register</h2>
                                        <h4 class="fs-13 fw-bold mb-2">Manage all your Duralux crm</h4>
                                        <p class="fs-12 fw-medium text-muted">Let's get you all setup, so you can verify your personal account and begine setting up your profile.</p>
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-4">
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Email or Username"
                                                    id="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Username"
                                                    id="username"
                                                    value={formData.username}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="position-relative auth-pass-inputgroup mb-3">
                                                <input
                                                    type={showPassword ? "text" : "password"} id="password"
                                                    className="form-control pe-5"
                                                    placeholder="Enter password"
                                                    onChange={handleChange}
                                                    value={formData.password}

                                                    autoComplete="off"
                                                />
                                                <a
                                                    className="btn btn-link position-absolute end-0 top-0 text-muted"
                                                    onClick={() => setShowPassword(!showPassword)} href="javascript:void(0);"

                                                    data-bs-toggle="tooltip"
                                                    data-bs-trigger="hover"
                                                    title="Login with Facebook"
                                                >

                                                    <i className={`${showPassword ? "feather-eye" : "feather-eye-off"}`} />

                                                </a>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>
                                                    <div className="custom-control custom-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            id="remember"
                                                            onChange={handleChange}
                                                            value={formData.remember}

                                                        />
                                                        <label
                                                            className="custom-control-label c-pointer"
                                                            htmlFor="remember"
                                                        >
                                                            Remember Me
                                                        </label>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="mt-5">
                                                <button type="submit" className="btn btn-lg btn-primary w-100">
                                                    Submit
                                                </button>
                                            </div>
                                        </form>

                                        <div className="mt-5 text-muted">
                                            <span> Don't have an account?</span>
                                            <a href="#" onClick={() => setChangePage("login-page")} className="fw-bold">
                                                Create an Account
                                            </a>
                                        </div>
                                    </div>
                                </div>
                        }

                    </div>

                </div>
            </main>


            {showOTPModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(5px)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 2000,
                    }}
                >
                    <div
                        style={{
                            background: '#fff',
                            padding: '30px 40px',
                            borderRadius: '12px',
                            width: '360px',
                            boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
                            textAlign: 'center',
                            animation: 'fadeIn 0.3s ease-in-out',
                        }}
                    >
                        <div
                            style={{
                                height: '65px',
                                width: '65px',
                                background: '#4070f4',
                                color: '#fff',
                                fontSize: '2.5rem',
                                borderRadius: '50%',
                                margin: '0 auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <i className="bx bxs-check-shield"></i>
                        </div>
                        <h4 style={{ margin: '20px 0 15px' }}>Enter OTP Code</h4>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                            {otpValues.map((digit, idx) => (
                                <input
                                    key={idx}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e, idx)}
                                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                                    ref={(el) => (inputsRef.current[idx] = el)}
                                    style={{
                                        width: '45px',
                                        height: '50px',
                                        fontSize: '20px',
                                        textAlign: 'center',
                                        borderRadius: '6px',
                                        border: '1px solid #ddd',
                                        outline: 'none',
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            className={`btn btn-primary w-100 ${otpValues.every((v) => v) ? 'active' : ''}`}
                            onClick={handleVerifyOtp}
                            disabled={otpValues.some((v) => v === '')}
                        >
                            Verify OTP
                        </button>

                        <button
                            className="btn btn-link mt-2"
                            onClick={() => setShowOTPModal(false)}
                            style={{ fontSize: '0.9rem', color: '#999' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

        </>


    );
}






{/* <div className="card mb-4 mt-5 mx-4 mx-sm-0 position-relative">
    <div className="wd-50 bg-white p-2 rounded-circle shadow-lg position-absolute translate-middle top-0 start-50">
        <img src="assets/images/logo-abbr.png" alt="" className="img-fluid" />
    </div>
    <div className="card-body p-sm-5">
        <h2 className="fs-20 fw-bolder mb-4">Register</h2>
        <h4 className="fs-13 fw-bold mb-2">Manage all your Duralux crm</h4>
        <p className="fs-12 fw-medium text-muted">
            Let's get you all setup, so you can verify your personal account and
            begine setting up your profile.
        </p>
        <form action="index.html" className="w-100 mt-4 pt-2">
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    required=""
                />
            </div>
            <div className="mb-4">
                <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    required=""
                />
            </div>
            <div className="mb-4">
                <input
                    type="tel"
                    className="form-control"
                    placeholder="Username"
                    required=""
                />
            </div>
            <div className="mb-4 generate-pass">
                <div className="input-group field">
                    <input
                        type="password"
                        className="form-control password"
                        id="newPassword"
                        placeholder="Password Confirm"
                    />
                    <div
                        className="input-group-text c-pointer gen-pass"
                        data-bs-toggle="tooltip"
                        title="Generate Password"
                    >
                        <i className="feather-hash" />
                    </div>
                    <div
                        className="input-group-text border-start bg-gray-2 c-pointer show-pass"
                        data-bs-toggle="tooltip"
                        title="Show/Hide Password"
                    >
                        <i />
                    </div>
                </div>
                <div className="progress-bar mt-2">
                    <div />
                    <div />
                    <div />
                    <div />
                </div>
            </div>
            <div className="mb-4">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Password again"
                    required=""
                />
            </div>
            <div className="mt-4">
                <div className="custom-control custom-checkbox mb-2">
                    <input
                        type="checkbox"
                        className="custom-control-input"
                        id="receiveMial"
                        required=""
                    />
                    <label
                        className="custom-control-label c-pointer text-muted"
                        htmlFor="receiveMial"
                        style={{ fontWeight: "400 !important" }}
                    >
                        Yes, I wnat to receive Duralux community emails
                    </label>
                </div>
                <div className="custom-control custom-checkbox">
                    <input
                        type="checkbox"
                        className="custom-control-input"
                        id="termsCondition"
                        required=""
                    />
                    <label
                        className="custom-control-label c-pointer text-muted"
                        htmlFor="termsCondition"
                        style={{ fontWeight: "400 !important" }}
                    >
                        I agree to all the <a href="">Terms &amp; Conditions</a> and{" "}
                        <a href="">Fees</a>.
                    </label>
                </div>
            </div>
            <div className="mt-5">
                <button type="submit" className="btn btn-lg btn-primary w-100">
                    Create Account
                </button>
            </div>
        </form>
        <div className="mt-5 text-muted">
            <span>Already have an account?</span>
            <a href="auth-login-minimal.html" className="fw-bold">
                Login
            </a>
        </div>
    </div>
</div> */}

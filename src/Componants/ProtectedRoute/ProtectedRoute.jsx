// import React from 'react';
// import { useSelector } from 'react-redux';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children, permission }) => {
//   const { user } = useSelector(state => state.auth);

//   if (!user) return <Navigate to="/" replace />;

//   if (permission) {
//     const perms = user.role?.permissions || [];
//     if (!perms.includes('*') && !perms.includes(permission)) {
//       return <div style={{ padding: 20 }}>Access Denied — You don't have permission.</div>;
//     }
//   }

//   return children;
// };

// export default ProtectedRoute;



// import React from 'react';
// import { useSelector } from 'react-redux';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children, permission }) => {
//   const { user } = useSelector(state => state.auth);

//   // ⛔ user ही नहीं है -> login page
//   if (!user) return <Navigate to="/" replace />;

//   // ⛔ permission नहीं है -> login page
//   if (permission) {
//     const perms = user.role?.permissions || [];
//     if (!perms.includes('*') && !perms.includes(permission)) {
//       return <Navigate to="/" replace />;   // 🔥 redirect to login
//     }
//   }

//   return children;
// };

// export default ProtectedRoute;




// import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ permission, children }) {
//   const { user, token } = useSelector((s) => s.auth);

//   if (!token || !user) return <Navigate to="/" replace />;

//   const userPermissions = user?.role?.permissions || [];

//   if (permission && !userPermissions.includes(permission)) {
//     return <h1>Access Denied (Permission Missing)</h1>;
//   }

//   return children;
// }



import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { hasPermission } from "../../hooks/hasPermission";

export default function ProtectedRoute({ children, permission }) {
  const { user } = useSelector(state => state.auth);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (permission && !hasPermission(user, permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// import React, { Fragment } from "react";
// import { useSelector } from "react-redux";
// import { BrowserRouter, Route } from "react-router-dom";

// const ProtectedRoute = ({  element: Element, ...rest }) => {
//   const { loading, isAuthenticated, customer } = useSelector((state) => state.user);

//   return (
//     <Fragment>
//       {loading === false && (
//         <Route
//           {...rest}
//           render={(props) => {
//             if (isAuthenticated === false) {
//               return <BrowserRouter to="/login" />;
//             }

//             // if (isAdmin === true && customer.role !== "admin") {
//             //   return <BrowserRouter to="/login" />;
//             // }

//             return <Element {...props} />;
//           }}
//         />
//       )}
//     </Fragment>
//   );
// };

// export default ProtectedRoute;
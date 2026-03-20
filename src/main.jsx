import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";


import Protected from "./components/AuthLayout.jsx";
import MainLayout from "./components/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // 1. THE PROTECTED ZONE (Requires Login)
      {
        path: "/",
        element: (
          <Protected authentication={true}>
            <MainLayout /> 
          </Protected>
        ),
        children: [
          {
            path: "", // Renders at tweetx.com/
            element: <Home />,
          },
          // {
          //   path: "profile/:username", // Renders at tweetx.com/profile/shashwat
          //   element: <Profile />,
          // },
        ],
      },

      // 2. THE PUBLIC ZONE (Forbidden if logged in)
      {
        path: "/login",
        element: (
          <Protected authentication={false}>
            <Login />
          </Protected>
        ),
      },
      {
        path: "/signup",
        element: (
          <Protected authentication={false}>
            <Signup />
          </Protected>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
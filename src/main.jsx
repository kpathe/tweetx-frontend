import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Protected, AuthToggle } from "./components/index.js";
import {
  Home,
  Login,
  Signup,
  Search,
  Profile,
  TweetPage,
} from "./pages/index.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // 1. THE SMART ROOT
      // This handles the "/" path dynamically using the toggle
      {
        path: "/",
        element: <AuthToggle />,
      },

      // 2. SPECIFIC PROTECTED ROUTES
      // These still need the Sidebar/MainLayout wrapper
      {
        path: "/search",
        element: (
          <Protected authentication={true}>
            <Search />
          </Protected>
        ),
      },
      {
        path: "/profile/:username",
        element: (
          <Protected authentication={true}>
            <Profile />
          </Protected>
        ),
      },
      {
        path: "/tweet/:tweetId",
        element: (
          <Protected authentication={true}>
            <TweetPage />
          </Protected>
        ),
      },

      // 3. THE AUTH GATES (Public Only)
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
  </StrictMode>,
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Protected, AuthToggle, MainLayout } from "./components/index.js";
import {
  Login,
  Signup,
  Search,
  Profile,
  TweetPage,
  Connect,
  Notifications,
} from "./pages/index.js";
import EditProfile from "./pages/EditProfile.jsx";

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
            <MainLayout>
              <Search />
            </MainLayout>
          </Protected>
        ),
      },
      {
        path: "/u/:username",
        element: (
          <Protected authentication={true}>
            <MainLayout>
              <Profile />
            </MainLayout>
          </Protected>
        ),
      },
      {
        path: "/follow",
        element: (
          <Protected authentication={true}>
            <MainLayout>
              <Connect />
            </MainLayout>
          </Protected>
        ),
      },
      {
        path: "/notifications",
        element: (
          <Protected authentication={true}>
            <MainLayout>
              <Notifications />
            </MainLayout>
          </Protected>
        ),
      },
      {
        path: "/tweet/:tweetId",
        element: (
          <Protected authentication={true}>
            <MainLayout>
              <TweetPage />
            </MainLayout>
          </Protected>
        ),
      },
      {
        path: "/edit-profile",
        element: (
          <Protected authentication={true}>
            <MainLayout>
              <EditProfile />
            </MainLayout>
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

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Protected from "./components/AuthLayout.jsx";
import MainLayout from "./components/MainLayout.jsx";
import { Home, Login, Signup, Search, Profile , TweetPage} from "./pages/index.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // --- THE PROTECTED ZONE (Sidebar stays visible) ---
      {
        path: "/",
        element: (
          <Protected authentication={true}>
            <MainLayout />
          </Protected>
        ),
        children: [
          {
            path: "", // Home Feed: tweetx.com/
            element: <Home />,
          },
          {
            path: "search", // Search: tweetx.com/search
            element: <Search />,
          },
          {
            path: "profile/:username", // Profile: tweetx.com/profile/shashwat
            element: <Profile />,
          },
          {
            path: "tweet/:tweetId", // Detail: tweetx.com/tweet/67a8b...
            element: <TweetPage />,
          },
        ],
      },

      // --- THE PUBLIC ZONE (No Sidebar) ---
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

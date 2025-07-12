import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Provider } from "react-redux";
import { Apptheme } from "../theme/Apptheme";
import { store } from "./store/store";

import { RouterProvider } from "react-router-dom";

import "@fontsource/roboto";
import router from "./router/AppRouter";
import { AuthProvider } from "./auth/AuthProvider";

import "react-toastify/dist/ReactToastify.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthProvider>
      <Apptheme>
        <RouterProvider
          router={router}
          future={{
            v7_fetcherPersist: true,
            v7_startTransition: true,
          }}
        ></RouterProvider>
      </Apptheme>
    </AuthProvider>
  </Provider>
);

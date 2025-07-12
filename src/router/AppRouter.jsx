//Main routes

import { AuthHandler } from "../auth/AuthHandler";
import homeRoutes from "../home/routes/Routes";
import ErrorBoundary from "../home/components/ErrorBoundary";
import NotFoundPage from "../home/components/NotFoundPage";
import { createBrowserRouter } from "react-router-dom";
import authRoutes from "../auth/routes/AuthRoutes";
import vocabRoutes from "../app/routes/vocabRoutes";

// import appRoutes from "../app/routes/appRoutes";

const routes = [
  //RUTAS PUBLICAS
  {
    path: "/",
    element: <AuthHandler />,
    children: [authRoutes, homeRoutes, vocabRoutes],
    errorBoundary: <ErrorBoundary />,
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_relativeSplatPath: true,
    v7_skipActionErrorRevalidation: true,
    v7_startTransition: true,
  },
});

export default router;

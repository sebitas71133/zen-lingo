//Main routes

import { PublicLayout } from "../layout/PublicLayout";
import HomePage from "../pages/HomePage";

const homeRoutes = {
  path: "/",

  element: <PublicLayout />,
  children: [
    { index: true, element: <HomePage /> },
    // { path: "answer", element: <AnswersPage /> },
  ],
};

export default homeRoutes;

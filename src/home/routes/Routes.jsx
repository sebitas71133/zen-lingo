//Main routes

import { AnswersPage } from "../pages/AnswersPage";
import { TranslatorPage } from "../pages/TranslatorPage";
import { PublicLayout } from "../layout/PublicLayout";

const homeRoutes = {
  path: "/",

  element: <PublicLayout />,
  children: [
    { index: true, element: <TranslatorPage /> },
    { path: "answer", element: <AnswersPage /> },
  ],
};

export default homeRoutes;

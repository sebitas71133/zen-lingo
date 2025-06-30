//Main routes

import { PhrasePage } from "../../vocab/pages/PhrasePage";
import { PrivateLayout } from "../layout/PrivateLayout";
import { AnswersPageUser } from "../pages/AnswersPageUser";
import { FavoritesPageUser } from "../pages/FavoritesPageUser";
import { ToolsPage } from "../pages/ToolsPage";
import { TranslatorPageUser } from "../pages/TranslatorPageUser";

const appRoutes = {
  path: "/app",

  element: <PrivateLayout />,
  children: [
    { index: true, element: <TranslatorPageUser /> },
    { path: "answer", element: <AnswersPageUser /> },
    { path: "favorite", element: <FavoritesPageUser /> },
    { path: "phrase", element: <PhrasePage /> },
  ],
};

export default appRoutes;

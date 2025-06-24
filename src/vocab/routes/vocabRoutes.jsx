import { VocabLayout } from "../layout/VocabLayout";
import { WordPage } from "../pages/WordPage";

const vocabRoutes = {
  path: "/app",

  element: <VocabLayout />,
  children: [
    { index: true, element: <WordPage /> },
    { path: "word", element: <WordPage /> },
    // { path: "favorite", element: <FavoritesPageUser /> },
    // { path: "tools", element: <ToolsPage /> },
  ],
};

export default vocabRoutes;

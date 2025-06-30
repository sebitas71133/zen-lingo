import { VocabLayout } from "../layout/VocabLayout";
import { PhrasePage } from "../pages/PhrasePage";
import { TagsPage } from "../pages/TagsPage";

import { WordPage } from "../pages/WordPage";

const vocabRoutes = {
  path: "/app",

  element: <VocabLayout />,
  children: [
    { index: true, element: <WordPage /> },
    { path: "word", element: <WordPage /> },
    // { path: "favorite", element: <FavoritesPageUser /> },
    { path: "tags", element: <TagsPage /> },
    { path: "phrase", element: <PhrasePage /> },
  ],
};

export default vocabRoutes;

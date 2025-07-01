import { VocabLayout } from "../layout/VocabLayout";
import { PhrasePage } from "../pages/PhrasePage";
import { TagsPage } from "../pages/TagsPage";
import { TextPage } from "../pages/TextPage";
import { VerbPage } from "../pages/VerbPage";

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
    { path: "verbs", element: <VerbPage /> },
    { path: "texts", element: <TextPage /> },
  ],
};

export default vocabRoutes;

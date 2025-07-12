import { VocabLayout } from "../layout/VocabLayout";
import { DashboardPage } from "../pages/DashboardPage";

import { PhrasePage } from "../pages/PhrasePage";
import { TagsPage } from "../pages/TagsPage";
import { TextPage } from "../pages/TextPage";
import { ToolsPage } from "../pages/ToolsPage";
import { VerbPage } from "../pages/VerbPage";

import { WordPage } from "../pages/WordPage";

const vocabRoutes = {
  path: "/app",

  element: <VocabLayout />,
  children: [
    { index: true, element: <WordPage /> },
    { path: "dashboard", element: <DashboardPage /> },
    { path: "word", element: <WordPage /> },
    { path: "tags", element: <TagsPage /> },
    { path: "phrase", element: <PhrasePage /> },
    { path: "verbs", element: <VerbPage /> },
    { path: "texts", element: <TextPage /> },
    { path: "tools", element: <ToolsPage /> },
  ],
};

export default vocabRoutes;

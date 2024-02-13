import { createBrowserRouter } from "react-router-dom";
import { loader as pollLoader } from "./poll";
import Poll from "./poll/poll";
import Root, { loader as pollsLoader } from "./root/root";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: pollsLoader,
  },
  {
    path: "poll/:pollId",
    element: <Poll />,
    loader: pollLoader,
  },
]);

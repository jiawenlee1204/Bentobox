import { createBrowserRouter } from "react-router";
import Kitchen from "./pages/Kitchen";
import BentoView from "./pages/BentoView";
import BalancePlate from "./pages/BalancePlate";
import Archive from "./pages/Archive";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Kitchen,
  },
  {
    path: "/bento",
    Component: BentoView,
  },
  {
    path: "/balance",
    Component: BalancePlate,
  },
  {
    path: "/archive",
    Component: Archive,
  },
]);

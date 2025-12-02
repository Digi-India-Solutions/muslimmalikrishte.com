import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  // Do NOT scroll to top on profile listing page (your page)
  if (pathname.includes("/profile-page-route")) {
    return null;
  }

  // Default: always scroll to top
  window.scrollTo(0, 0);
  return null;
}

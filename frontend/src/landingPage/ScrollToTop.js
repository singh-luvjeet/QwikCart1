import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;

//useLocation -> It’s a React Hook provided by react-router-dom. It gives you information about the current URL. The object it returns looks like this:
// {
//     pathname: "/about",
//     search: "?q=hello",
//     hash: "#section2",
//     state: null,
//     key: "abc123"
//   }

//const { pathname } = useLocation(); -> you’re using object destructuring to grab only the pathname property from that object.
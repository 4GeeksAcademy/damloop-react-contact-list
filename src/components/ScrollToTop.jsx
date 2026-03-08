import PropTypes from "prop-types";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ children }) => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return children;
};

ScrollToTop.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ScrollToTop;

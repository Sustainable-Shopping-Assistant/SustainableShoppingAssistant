/* eslint-disable import/no-extraneous-dependencies */
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <>
      <h1>Page Not Found</h1>
      <Link to="/">HOME PAGE</Link>
    </>
  );
}

export default NotFound;

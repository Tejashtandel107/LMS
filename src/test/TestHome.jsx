import { useContext } from "react";
import { Link } from "react-router-dom";
import { userContect } from "./CreateContext";

function TestHome() {
    const name = useContext(userContect);

  return (
    <div>
      <h1>Home</h1>

      <h2>user {name}</h2>
    </div>
  );
}

export default TestHome;
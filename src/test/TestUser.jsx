import { useParams } from "react-router-dom";

function TestUser() {
  const { id } = useParams();

  return <h1>User ID: {id}</h1>;
}

export default TestUser;
import { useNavigate } from "react-router-dom";

const Page404 = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/dashboard");
  };
  return (
    <div>
      <p>404</p>
      <button onClick={handleClick}>Go back</button>
    </div>
  );
};
export default Page404;

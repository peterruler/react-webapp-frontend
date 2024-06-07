
import loader from "./loading.gif";

const Loader = () => {
  return (
    <div className="loader">
      <img src={loader} alt="loading gif" width="140" height="42" />
    </div>
  );
};

export default Loader;
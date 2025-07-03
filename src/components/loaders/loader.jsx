import loadingLogo from "../../assets/images/loading-logo.png";

const Loader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <img loading="lazy" src={loadingLogo} alt="Loading..." />
    </div>
  );
};

export default Loader;

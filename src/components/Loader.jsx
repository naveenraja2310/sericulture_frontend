function Loader() {
  return (
    <div className="loader-container">
      <div className="loader" role="status" aria-label="Loading" />
      <span className="loader-text">Connecting to device…</span>
    </div>
  );
}

export default Loader;
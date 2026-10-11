import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { favoriteService } from "../../services/favoriteService";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    // Favorites now come from the database, so they follow the buyer to any browser or device.
    favoriteService.getFavorites()
      .then((response) => setFavorites(response.data.favorites))
      .catch(() => setError("Unable to load your favorites."))
      .finally(() => setLoading(false));
  }, []);

  async function handleRemove(productId) {
    setError("");
    setNotice("");

    try {
      await favoriteService.removeFavorite(productId);
      setFavorites((current) => current.filter((item) => item.product_id !== productId));
      setNotice("Removed from favorites.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to remove this favorite.");
    }
  }

  if (loading) return <LoadingSpinner label="Loading favorites..." />;

  return (
    <>
      <h1 className="section-title">Favorites</h1>
      <AlertMessage type="danger" message={error} />
      <AlertMessage type="success" message={notice} />
      {favorites.length === 0 ? (
        <div className="action-panel">
          <p className="text-muted mb-0">No favorites saved yet. Open a product detail page and save products you want to revisit.</p>
        </div>
      ) : (
        <div className="row g-3">
          {favorites.map((item) => (
            <div className="col-lg-6" key={item.id}>
              <div className="action-panel h-100">
                <div className="d-flex justify-content-between">
                  <h2 className="h5"><Link to={`/products/${item.product_id}`}>{item.product_name}</Link></h2>
                  <span className="badge bg-success-subtle text-success align-self-start">{item.availability_status}</span>
                </div>
                <p className="mb-1">{formatCurrency(item.price_per_unit)} / {item.unit}</p>
                <p className="small text-muted">{item.category_name} · {item.district} · saved {formatDate(item.saved_at)}</p>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(item.product_id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Favorites;

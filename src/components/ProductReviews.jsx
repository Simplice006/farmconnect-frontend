import { useEffect, useState } from "react";
import AlertMessage from "./AlertMessage";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { reviewService } from "../services/reviewService";
import { formatDate } from "../utils/formatDate";

function Stars({ value }) {
  return <span className="text-warning" aria-label={`${value} out of 5`}>{"★".repeat(value)}{"☆".repeat(5 - value)}</span>;
}

function ProductReviews({ productId }) {
  const { user } = useAuth();
  const isBuyer = user?.role === "buyer";
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ review_count: 0, average_rating: null });
  const [eligibility, setEligibility] = useState({ can_review: false, my_review: null });
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    const response = await reviewService.getReviews(productId);
    setReviews(response.data.reviews);
    setSummary(response.data.summary);

    if (isBuyer) {
      const check = await reviewService.getEligibility(productId);
      setEligibility(check.data);
      if (check.data.my_review) {
        setForm({ rating: check.data.my_review.rating, comment: check.data.my_review.comment || "" });
      }
    }
  }

  useEffect(() => {
    load().catch(() => setError("Unable to load reviews.")).finally(() => setLoading(false));
  }, [productId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);

    try {
      await reviewService.saveReview(productId, { rating: Number(form.rating), comment: form.comment });
      setNotice("Your review was saved.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save your review.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setError("");
    setNotice("");

    try {
      await reviewService.deleteReview(id);
      setForm({ rating: 5, comment: "" });
      setNotice("Review deleted.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete this review.");
    }
  }

  if (loading) return <LoadingSpinner label="Loading reviews..." />;

  return (
    <div className="action-panel mt-4">
      <h2 className="h4">
        Reviews{" "}
        {summary.review_count > 0 && (
          <small className="text-muted">
            <Stars value={Math.round(summary.average_rating)} /> {summary.average_rating} / 5 ({summary.review_count})
          </small>
        )}
      </h2>
      <AlertMessage type="danger" message={error} />
      <AlertMessage type="success" message={notice} />

      {reviews.length === 0 && <p className="text-muted">No reviews yet for this product.</p>}
      {reviews.map((review) => (
        <div className="border-bottom py-2" key={review.id}>
          <div className="d-flex justify-content-between">
            <strong>{review.buyer_name}</strong>
            <span className="small text-muted">{formatDate(review.created_at)}</span>
          </div>
          <Stars value={review.rating} />
          {review.comment && <p className="mb-1">{review.comment}</p>}
          {review.buyer_id === user?.id && (
            <button className="btn btn-sm btn-link text-danger p-0" onClick={() => handleDelete(review.id)}>Delete my review</button>
          )}
        </div>
      ))}

      {isBuyer && !eligibility.can_review && (
        <p className="small text-muted mt-3 mb-0">You can review this product once one of your orders for it is completed.</p>
      )}

      {isBuyer && eligibility.can_review && (
        <form className="mt-3" onSubmit={handleSubmit}>
          <h3 className="h6">{eligibility.my_review ? "Update your review" : "Write a review"}</h3>
          <select className="form-select mb-2" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>)}
          </select>
          <textarea className="form-control mb-2" maxLength={500} placeholder="Share your experience (optional)" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })}></textarea>
          <button className="btn btn-success" type="submit" disabled={saving}>{saving ? "Saving..." : "Save review"}</button>
        </form>
      )}
    </div>
  );
}

export default ProductReviews;

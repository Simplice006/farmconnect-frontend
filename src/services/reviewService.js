import api from "./api";

export const reviewService = {
  getReviews: (productId) => api.get(`/reviews/product/${productId}`),
  getEligibility: (productId) => api.get(`/reviews/product/${productId}/eligibility`),
  saveReview: (productId, data) => api.post(`/reviews/product/${productId}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`)
};

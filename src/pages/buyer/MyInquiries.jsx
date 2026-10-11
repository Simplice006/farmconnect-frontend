import { useEffect, useState } from "react";
import AlertMessage from "../../components/AlertMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import InquiryThread from "../../components/InquiryThread";
import { inquiryService } from "../../services/inquiryService";
import { formatDate } from "../../utils/formatDate";

function MyInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    inquiryService.getMyInquiries()
      .then((response) => setInquiries(response.data.inquiries))
      .catch(() => setError("Unable to load inquiries."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <h1 className="section-title">My Inquiries</h1>
      <AlertMessage type="danger" message={error} />
      {inquiries.length === 0 && !error && <p className="text-muted">You have not sent any inquiries yet.</p>}
      <div className="row g-3">
        {inquiries.map((inquiry) => (
          <div className="col-lg-6" key={inquiry.id}>
            <div className="action-panel h-100">
              <div className="d-flex justify-content-between">
                <h2 className="h5">{inquiry.product_name}</h2>
                <span className="badge bg-secondary align-self-start">{inquiry.status}</span>
              </div>
              <p>{inquiry.message}</p>
              <p className="small text-muted">{inquiry.farmer_name} · {formatDate(inquiry.created_at)}</p>
              <button className="btn btn-sm btn-outline-success" onClick={() => setOpenId(openId === inquiry.id ? null : inquiry.id)}>
                {openId === inquiry.id ? "Hide conversation" : "View conversation"}
              </button>
              {openId === inquiry.id && <InquiryThread inquiryId={inquiry.id} />}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default MyInquiries;

import { useEffect, useState } from "react";
import AlertMessage from "./AlertMessage";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { inquiryService } from "../services/inquiryService";
import { formatDate } from "../utils/formatDate";

// Conversation between a buyer and a farmer about one inquiry.
function InquiryThread({ inquiryId, onReplied }) {
  const { user } = useAuth();
  const [replies, setReplies] = useState([]);
  const [status, setStatus] = useState("open");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const response = await inquiryService.getReplies(inquiryId);
    setReplies(response.data.replies);
    setStatus(response.data.inquiry_status);
  }

  useEffect(() => {
    load().catch(() => setError("Unable to load the conversation.")).finally(() => setLoading(false));
  }, [inquiryId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSending(true);

    try {
      await inquiryService.addReply(inquiryId, message);
      setMessage("");
      await load();
      if (onReplied) onReplied();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send your reply.");
    } finally {
      setSending(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading conversation..." />;

  return (
    <div className="mt-3 border-top pt-3">
      <AlertMessage type="danger" message={error} />
      {replies.length === 0 && <p className="small text-muted">No replies yet.</p>}
      {replies.map((reply) => (
        <div key={reply.id} className={`mb-2 p-2 rounded ${reply.sender_id === user?.id ? "bg-success-subtle ms-4" : "bg-light me-4"}`}>
          <div className="small text-muted">{reply.sender_id === user?.id ? "You" : reply.sender_name} · {formatDate(reply.created_at)}</div>
          <div>{reply.message}</div>
        </div>
      ))}
      {status === "closed" ? (
        <p className="small text-muted mb-0">This inquiry is closed.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <textarea className="form-control mb-2" rows={2} maxLength={1000} placeholder="Write a reply" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
          <button className="btn btn-sm btn-success" type="submit" disabled={sending || !message.trim()}>{sending ? "Sending..." : "Send reply"}</button>
        </form>
      )}
    </div>
  );
}

export default InquiryThread;

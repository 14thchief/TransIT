const NotAvailableText = ({ text }: { text?: string }) => (
  <p style={{ color: "lightgray" }}>{text ?? "N/A"}</p>
);

export default NotAvailableText;

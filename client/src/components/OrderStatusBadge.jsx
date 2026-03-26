// client/src/components/OrderStatusBadge.jsx
// Colored badge for order status

const OrderStatusBadge = ({ status }) => {
  const styles = {
    PENDING:   "bg-yellow-900/40 text-yellow-400 border-yellow-700",
    SHIPPED:   "bg-blue-900/40 text-blue-400 border-blue-700",
    DELIVERED: "bg-green-900/40 text-green-400 border-green-700",
  };

  const labels = {
    PENDING:   "⏳ Pending",
    SHIPPED:   "🚚 Shipped",
    DELIVERED: "✅ Delivered",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded border font-medium ${styles[status] || styles.PENDING}`}>
      {labels[status] || status}
    </span>
  );
};

export default OrderStatusBadge;

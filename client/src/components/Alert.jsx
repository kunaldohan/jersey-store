// client/src/components/Alert.jsx
// Simple inline alert for success / error messages

const Alert = ({ type = "error", message }) => {
  if (!message) return null;

  const styles = {
    error: "bg-red-900/40 border-red-500 text-red-300",
    success: "bg-green-900/40 border-green-500 text-green-300",
    info: "bg-blue-900/40 border-blue-500 text-blue-300",
  };

  return (
    <div className={`border rounded px-4 py-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  );
};

export default Alert;

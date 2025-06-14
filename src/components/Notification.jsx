const Notification = ({ messages }) => {
  if (!messages.errorMessage && !messages.successMessage) {
    return null;
  }
  return (
    <>
      {messages.errorMessage && (
        <div className="error">{messages.errorMessage}</div>
      )}
      {messages.successMessage && (
        <div className="success">{messages.successMessage}</div>
      )}
    </>
  );
};

export default Notification;

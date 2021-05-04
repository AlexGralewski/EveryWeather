import React from "react";

const ReturnButton = (props) => {
  const { returnButtonDisplay, handleReturnButton } = props;
  return (
    <button
      onClick={handleReturnButton}
      style={{ display: returnButtonDisplay }}
      className="return-button"
    >
      <span className="return-icon">
        <i class="fas fa-chevron-left"></i>
      </span>
      <span className="return-text">Return</span>
    </button>
  );
};

export default ReturnButton;

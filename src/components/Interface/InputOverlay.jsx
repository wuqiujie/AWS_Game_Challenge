import { Html } from "@react-three/drei";

export default function InputOverlay({ isFloating, text, setText, handleSubmit }) {
  if (!isFloating) return null;

  const templateParagraph = `Dear ___[receiver]___,

I hope this letter finds you well. As your ___[relationship]___, I wanted to take a moment to wish you a wonderful ___[holiday]___. 

___[additional_info]___

With ___[tone]___ regards,
___[sender]___`;

  const handleInputChange = (value, fieldName) => {
    const newText = { ...text };
    newText[fieldName] = value;
    console.log(fieldName)
    setText(newText);
    console.log(newText);
  };

  return (
    <Html>
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: `translate(-50%, -50%) ${isFloating ? 'scale(1)' : 'scale(0)'}`,
          opacity: isFloating ? 1 : 0,
          transition: 'all 0.3s ease-in-out',
          width: "400px",
          height: "auto",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          border: "1px solid #ccc",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "20px",
          zIndex: 1000,
          fontFamily: "Courier New, Courier, monospace",
          lineHeight: "1.6",
        }}
      >
        <div style={{ whiteSpace: "pre-wrap" }}>
          {templateParagraph.split(/___\[(.*?)\]___/).map((part, index) => {
            if (index % 2 === 0) {
              // Regular text
              return <span key={index}>{part}</span>;
            } else {
              // Special handling for additional info
              if (part === 'additional_info') {
                return (
                  <textarea
                    key={index}
                    placeholder={part}
                    value={text[part] || ''}
                    onChange={(e) => handleInputChange(e.target.value, part)}
                    style={{
                      width: "95%",
                      height: "100px",
                      padding: "8px",
                      margin: "10px 0",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      backgroundColor: "rgba(255, 255, 255, 0.5)",
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                  />
                );
              }
              // Regular input fields for other parts
              return (
                <input
                  key={index}
                  type="text"
                  placeholder={part}
                  value={text[part] || ''}
                  onChange={(e) => handleInputChange(e.target.value, part)}
                  style={{
                    width: "120px",
                    padding: "2px 5px",
                    margin: "0 5px",
                    border: "none",
                    borderBottom: "1px solid #666",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    fontFamily: "inherit",
                  }}
                />
              );
            }
          })}
        </div>
        <button
          style={{
            marginTop: "20px",
            padding: "8px 16px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </Html>
  );
}

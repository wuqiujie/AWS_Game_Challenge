import React, { useState } from 'react';
import { submitChoice } from '../services/api';

const HtmlContainer = ({ content, index, isSelected, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(index)}
      style={{
        flex: 1,
        minWidth: '300px',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: isSelected 
          ? '0 0 15px rgba(52, 152, 219, 0.5)' 
          : '0 0 10px rgba(0,0,0,0.1)',
        backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
        margin: '10px',
        cursor: 'pointer',
        border: isSelected ? '2px solid #3498db' : '1px solid #ccc',
        transition: 'all 0.3s ease'
      }}
    >
      <div 
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          maxWidth: '100%',
          overflow: 'auto'
        }}
      />
    </div>
  );
};

const LoadingSpinner = () => {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '30px',
      borderRadius: '15px',
      zIndex: 1001,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        position: 'relative',
        height: '60px',
        width: '60px'
      }}>
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '40px',
              height: '60px',
              backgroundColor: 'white',
              border: '2px solid #3498db',
              borderRadius: '5px',
              animation: `card-shuffle 2s ease-in-out infinite ${index * 0.15}s`,
              transformOrigin: 'bottom right'
            }}
          />
        ))}
      </div>
      <div style={{ 
        marginTop: '15px', 
        fontSize: '16px',
        color: '#2c3e50',
        fontWeight: '500'
      }}>
        Creating your special messages...
      </div>
      <style>
        {`
          @keyframes card-shuffle {
            0% { transform: rotate(0deg) translateX(0); }
            25% { transform: rotate(-15deg) translateX(-5px); }
            75% { transform: rotate(15deg) translateX(5px); }
            100% { transform: rotate(0deg) translateX(0); }
          }
        `}
      </style>
    </div>
  );
};

const EmailSendingSpinner = () => {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '30px',
      borderRadius: '15px',
      zIndex: 1001,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        position: 'relative',
        width: '80px',
        height: '60px'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '60px',
          height: '40px',
          backgroundColor: 'white',
          border: '2px solid #3498db',
          borderRadius: '5px',
          animation: 'send-email 2s ease-in-out infinite'
        }}>
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '10px solid #3498db'
          }} />
        </div>
      </div>
      <div style={{ 
        marginTop: '15px', 
        fontSize: '16px',
        color: '#2c3e50',
        fontWeight: '500'
      }}>
        Sending your card...
      </div>
      <style>
        {`
          @keyframes send-email {
            0% { transform: translateX(0) translateY(0); opacity: 1; }
            50% { transform: translateX(20px) translateY(-20px); opacity: 0.5; }
            100% { transform: translateX(40px) translateY(0); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

const EmailInput = ({ onSubmit, onCancel }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    onSubmit(email);
  };

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 0 20px rgba(0,0,0,0.2)',
      zIndex: 1002,
      width: '90%',
      maxWidth: '400px'
    }}>
      <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>
        Enter your email to receive the card
      </h3>
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError('');
        }}
        placeholder="Enter your email address"
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '10px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          fontSize: '16px'
        }}
      />
      {error && (
        <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
          {error}
        </div>
      )}
      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        marginTop: '20px'
      }}>
        <button
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#3498db',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

const ResponseDisplay = ({ htmlContents, isLoading, onChoiceSubmitted }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [error, setError] = useState(null);

  const handleSelect = (index) => {
    setSelectedIndex(index);
  };

  const handleProceedToEmail = () => {
    if (selectedIndex === null) return;
    setShowEmailInput(true);
  };

  const handleSubmitChoice = async (email) => {
    if (selectedIndex === null) return;
    
    setIsSubmitting(true);
    setError(null);
    try {
      const body = {
        to_email: email,
        html_body: htmlContents[selectedIndex]
      };
      
      await submitChoice(body);
      // Reset all local states
      setSelectedIndex(null);
      setShowEmailInput(false);
      setIsSubmitting(false);
      if (typeof onChoiceSubmitted === 'function') {
        onChoiceSubmitted();
      }
    } catch (error) {
      console.error("Error submitting choice:", error);
      setError("Failed to send email. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isSubmitting) {
    return <EmailSendingSpinner />;
  }

  if (htmlContents.length === 0) {
    return null;
  }

  return (
    <>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '20px',
        borderRadius: '15px',
        maxHeight: '80vh',
        overflowY: 'auto',
        width: '80%',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          color: '#2c3e50'
        }}>
          <h2>Choose your favorite version</h2>
          <p>Click on a card to select it, then click "Choose This One" to confirm</p>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center'
        }}>
          {htmlContents.map((content, index) => (
            <HtmlContainer 
              key={index} 
              content={content} 
              index={index}
              isSelected={selectedIndex === index}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <button
          onClick={handleProceedToEmail}
          disabled={selectedIndex === null}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: selectedIndex !== null ? '#3498db' : '#cccccc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: selectedIndex !== null ? 'pointer' : 'not-allowed',
            margin: '20px auto',
            transition: 'all 0.3s ease'
          }}
        >
          Choose This One
        </button>
      </div>

      {showEmailInput && (
        <EmailInput 
          onSubmit={handleSubmitChoice}
          onCancel={() => setShowEmailInput(false)}
        />
      )}
    </>
  );
};

export default ResponseDisplay;

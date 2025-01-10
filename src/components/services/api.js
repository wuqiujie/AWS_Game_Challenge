// url for refine content, get 2 choices
const API_URL = "https://t1nwre2671.execute-api.us-east-1.amazonaws.com/";

export const generateContent = async (formData) => {
  const body = {
    to: formData.receiver,
    from: formData.sender,
    holiday: formData.holiday,
    relationship: formData.relationship,
    tone: formData.tone,
    additional_info: formData.additional_info,
  };

  const response = await fetch(API_URL + "content", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Failed to generate content');
  }

  return response.json();
};

export const submitChoice = async ({ to_email, html_body }) => {
    const response = await fetch(API_URL + "email", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: to_email,
        html_body: html_body
      }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to submit choice');
    }
  
    return response.json();
  };

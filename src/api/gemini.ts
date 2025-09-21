// src/api/gemini.ts
// Utility for Gemini API requests

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export function getGeminiApiKey() {
  return GEMINI_API_KEY;
}

// Example: Use this function to add Gemini API calls
// export async function callGeminiApi(endpoint: string, data: any) {
//   const response = await fetch(endpoint, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${GEMINI_API_KEY}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return response.json();
// }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content: 'You are a financial advisor helping people avoid predatory loans in Florida. Give clear practical advice in simple language. Always suggest safer alternatives like credit unions.'
        },
        ...req.body.messages
      ]
    })
  })
  
  const data = await response.json()
  if (data.choices && data.choices[0]) {
    res.json({ content: [{ text: data.choices[0].message.content }] })
  } else {
    res.status(500).json({ error: JSON.stringify(data) })
  }}
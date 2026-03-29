import { useState } from "react"

function App() {
  const [loanAmount, setLoanAmount] = useState('')
  const [loanType, setLoanType] = useState('400')
  const [months, setMonths] = useState('')
  const [result, setResult] = useState(null)
  const [question, setQuestion] = useState('')
  const [aiResponse, setAiResponse] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [shared, setShared] = useState(false)

  const calculate = () => {
    const principal = parseFloat(loanAmount)
    const apr = parseFloat(loanType)
    const m = parseFloat(months)
    if (!principal || !m) return
    const totalCost = principal * (1 + (apr / 100) * (m / 12))
    const interest = totalCost - principal
    const creditUnionCost = principal * (1 + 0.18 * (m / 12))
    const moneySaved = totalCost - creditUnionCost
    setResult({
      totalCost: totalCost.toFixed(2),
      interest: interest.toFixed(2),
      creditUnionCost: creditUnionCost.toFixed(2),
      moneySaved: moneySaved.toFixed(2)
    })
  }

  const askAI = async () => {
    if (!question) return
    setAiLoading(true)
    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `You are a financial advisor helping people avoid predatory loans in Florida. Give clear practical advice in simple language. Always suggest safer alternatives like credit unions. User question: ${question}`
          }]
        })
      })
      const data = await response.json()
      if (data.content && data.content[0]) {
        setAiResponse(data.content[0].text)
      } else {
        setAiResponse('Error: ' + JSON.stringify(data))
      }
    } catch (error) {
      setAiResponse('Error: ' + error.message)
    }
    setAiLoading(false)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'LoanShark Map',
        text: 'See how predatory lenders are targeting Florida communities',
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  const linkStyle = {
    padding: '8px 16px',
    backgroundColor: '#ff3333',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    textDecoration: 'none',
    display: 'inline-block'
  }

  const shareStyle = {
    padding: '8px 16px',
    backgroundColor: '#333',
    color: 'white',
    border: '1px solid #555',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderBottom: '2px solid #ff3333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h1 style={{ color: '#ff3333', margin: 0 }}>🦈 LoanShark Map</h1>
          <p style={{ color: '#aaa', margin: '5px 0 0 0' }}>Mapping predatory lending across Florida</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={handleShare} style={shareStyle}>
            {shared ? '✅ Copied!' : '🔗 Share'}
          </button>
          <a href="https://consumerfinance.gov/complaint/" target="_blank" rel="noreferrer" style={linkStyle}>
            🚨 Report a Lender
          </a>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', padding: '20px', backgroundColor: '#111', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#ff3333', fontSize: '2rem', fontWeight: 'bold' }}>2,782</div>
          <div style={{ color: '#aaa' }}>Florida Complaints</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#ff3333', fontSize: '2rem', fontWeight: 'bold' }}>554</div>
          <div style={{ color: '#aaa' }}>Zip Codes Affected</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#ff3333', fontSize: '2rem', fontWeight: 'bold' }}>$520</div>
          <div style={{ color: '#aaa' }}>Avg Loan Trap Cost</div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', padding: '10px 40px', backgroundColor: '#0a0a0a', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'red', flexShrink: 0 }}/>
          <span style={{ color: '#aaa' }}>High Risk (20+ complaints)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'orange', flexShrink: 0 }}/>
          <span style={{ color: '#aaa' }}>Medium Risk (10-19)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'yellow', flexShrink: 0 }}/>
          <span style={{ color: '#aaa' }}>Lower Risk (under 10)</span>
        </div>
      </div>

      {/* Map */}
      <div style={{ margin: '20px 40px', height: '600px', backgroundColor: '#1a1a1a', borderRadius: '10px', border: '1px solid #333', overflow: 'hidden' }}>
        <iframe src="/loanshark_map.html" width="100%" height="100%" style={{ border: 'none' }}/>
      </div>

      {/* Calculator */}
      <div style={{ margin: '20px 40px', padding: '30px', backgroundColor: '#1a1a1a', borderRadius: '10px', border: '1px solid #333' }}>
        <h2 style={{ color: '#ff3333', marginTop: 0 }}>💸 True Cost Calculator</h2>
        <p style={{ color: '#aaa' }}>See how much a predatory loan actually costs you</p>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ color: '#aaa', display: 'block', marginBottom: '5px' }}>Loan Amount ($)</label>
            <input type="number" placeholder="500" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#0a0a0a', color: 'white', fontSize: '1rem', width: '130px' }}/>
          </div>
          <div>
            <label style={{ color: '#aaa', display: 'block', marginBottom: '5px' }}>Loan Type</label>
            <select value={loanType} onChange={e => setLoanType(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#0a0a0a', color: 'white', fontSize: '1rem', width: '200px' }}>
              <option value="400">Payday Loan (400% APR)</option>
              <option value="300">Title Loan (300% APR)</option>
              <option value="200">Personal Loan (200% APR)</option>
            </select>
          </div>
          <div>
            <label style={{ color: '#aaa', display: 'block', marginBottom: '5px' }}>Months</label>
            <input type="number" placeholder="3" value={months} onChange={e => setMonths(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#0a0a0a', color: 'white', fontSize: '1rem', width: '90px' }}/>
          </div>
          <button onClick={calculate} style={{ padding: '10px 25px', backgroundColor: '#ff3333', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1rem', cursor: 'pointer' }}>
            Calculate
          </button>
        </div>
        {result && (
          <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#0a0a0a', borderRadius: '10px', border: '1px solid #333' }}>
            <h3 style={{ color: '#ff3333', marginTop: 0 }}>Results</h3>
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: '#aaa' }}>Total Repayment</div>
                <div style={{ color: '#ff3333', fontSize: '1.5rem', fontWeight: 'bold' }}>${result.totalCost}</div>
              </div>
              <div>
                <div style={{ color: '#aaa' }}>Interest Paid</div>
                <div style={{ color: '#ff3333', fontSize: '1.5rem', fontWeight: 'bold' }}>${result.interest}</div>
              </div>
              <div>
                <div style={{ color: '#aaa' }}>Credit Union Alternative</div>
                <div style={{ color: '#00cc00', fontSize: '1.5rem', fontWeight: 'bold' }}>${result.creditUnionCost}</div>
              </div>
              <div>
                <div style={{ color: '#aaa' }}>You Save</div>
                <div style={{ color: '#00cc00', fontSize: '1.5rem', fontWeight: 'bold' }}>${result.moneySaved}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Advisor */}
      <div style={{ margin: '20px 40px', padding: '30px', backgroundColor: '#1a1a1a', borderRadius: '10px', border: '1px solid #ff3333' }}>
        <h2 style={{ color: '#ff3333', marginTop: 0 }}>🤖 AI Loan Advisor</h2>
        <p style={{ color: '#aaa' }}>Describe your situation and get personalized advice</p>
        <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="Example: I need $500 for rent and a payday lender is offering me a loan. Is this a good idea?" style={{ width: '100%', height: '100px', padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#0a0a0a', color: 'white', fontSize: '1rem', resize: 'vertical', boxSizing: 'border-box' }}/>
        <button onClick={askAI} disabled={aiLoading} style={{ marginTop: '10px', padding: '10px 25px', backgroundColor: aiLoading ? '#555' : '#ff3333', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1rem', cursor: aiLoading ? 'not-allowed' : 'pointer' }}>
          {aiLoading ? 'Thinking...' : 'Get AI Advice'}
        </button>
        {aiResponse && (
          <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333', color: '#aaa', lineHeight: '1.6' }}>
            <strong style={{ color: '#ff3333' }}>AI Advisor:</strong>
            <p style={{ margin: '10px 0 0 0' }}>{aiResponse}</p>
          </div>
        )}
      </div>

      {/* Safer Alternatives */}
      <div style={{ margin: '20px 40px', padding: '30px', backgroundColor: '#1a1a1a', borderRadius: '10px', border: '1px solid #333' }}>
        <h2 style={{ color: '#00cc00', marginTop: 0 }}>✅ Safer Alternatives in Tallahassee</h2>
        <p style={{ color: '#aaa' }}>Instead of predatory lenders try these trusted local options:</p>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {[
            { name: 'Tallahassee-Leon Federal Credit Union', rate: '18% APR', phone: '(850) 576-4151', type: 'Credit Union' },
            { name: 'Capital City Bank', rate: '20% APR', phone: '(850) 402-7821', type: 'Community Bank' },
            { name: 'Florida Credit Union', rate: '17% APR', phone: '(800) 284-1144', type: 'Credit Union' },
            { name: 'FAMU Federal Credit Union', rate: '18% APR', phone: '(850) 599-3562', type: 'Credit Union' }
          ].map((alt, i) => (
            <div key={i} style={{ flex: '1', minWidth: '200px', padding: '15px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #00cc00' }}>
              <div style={{ color: '#00cc00', fontWeight: 'bold', marginBottom: '8px' }}>{alt.type}</div>
              <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>{alt.name}</div>
              <div style={{ color: '#aaa', marginBottom: '4px' }}>📊 Rate: {alt.rate}</div>
              <div style={{ color: '#aaa' }}>📞 {alt.phone}</div>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div style={{ margin: '20px 40px 40px 40px', padding: '30px', backgroundColor: '#1a1a1a', borderRadius: '10px', border: '1px solid #333' }}>
        <h2 style={{ color: '#ff3333', marginTop: 0 }}>📖 About LoanShark Map</h2>
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h3 style={{ color: 'white' }}>What is this?</h3>
            <p style={{ color: '#aaa', lineHeight: '1.6' }}>LoanShark Map visualizes predatory lending complaints across Florida using real CFPB data.</p>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h3 style={{ color: 'white' }}>Why does this matter?</h3>
            <p style={{ color: '#aaa', lineHeight: '1.6' }}>Predatory lenders charge 200-400% APR trapping low income families in cycles of debt. Florida has 2,782 documented complaints.</p>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h3 style={{ color: 'white' }}>What can you do?</h3>
            <p style={{ color: '#aaa', lineHeight: '1.6' }}>Use our calculator, find safer alternatives, share this map, and report predatory lenders to the CFPB.</p>
          </div>
        </div>
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#0a0a0a', borderRadius: '8px', borderLeft: '4px solid #ff3333' }}>
          <p style={{ color: '#aaa', margin: 0, lineHeight: '1.6' }}>
            📊 <strong style={{ color: 'white' }}>Data Source:</strong> CFPB Consumer Complaint Database. Built by a Tallahassee student to protect Florida communities.
          </p>
        </div>
      </div>

    </div>
  )
}

export default App
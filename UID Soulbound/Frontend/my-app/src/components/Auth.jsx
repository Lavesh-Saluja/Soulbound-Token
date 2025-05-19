import Persona from 'persona';
import "../App.css";
import { useEffect, useState } from 'react';

const Auth = ({ value }) => {
  const [email, setEmail] = useState("");
  const address = value;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Verify Your Identity</h2>
          <p className="auth-subtitle">Complete verification to mint your soulbound token</p>
        </div>
        
        <div className="email-input-container">
          <input 
            type="email" 
            value={email}
            className="email-input"
            placeholder="Enter your email address" 
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="input-underline"></div>
        </div>

        <div className="persona-container">
          {email && (
            <Persona.Inquiry
              templateId='itmpl_TZiZur7qbp2MeBdyjLB9qQdtbmYn'
              environmentId='env_qSNPPogYL25JkzHT4PaRnWgS1RhC'
              referenceId={address.current}
              fields={{
                emailAddress: email
              }}
              onLoad={() => { console.log('Loaded inline'); }}
              onComplete={({ inquiryId, status, fields }) => {
                console.log(`Sending finished inquiry ${inquiryId} to backend`);  
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
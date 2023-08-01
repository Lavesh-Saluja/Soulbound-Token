import Persona from 'persona';
import "../App.css"
import {useEffect, useState} from 'react'
const Auth = () => {

  const [isVerified, setIsVerified] = useState(false);
  useEffect(() => {
    console.log('------------------------------------');
    console.log(((localStorage.getItem('login'))));
    console.log('------------------------------------');
  });
  return (
    <div>
      {
        (localStorage.getItem('login')) === null?
             <Persona.Inquiry
        className = "auth"
      templateId='itmpl_fv6PDioHhzwTo4pH7K1HSMR4'
      environmentId='env_Qsmaa92ng7mE8rxekimRP48p'
      onLoad={() => { console.log('Loaded inline'); }}
      onComplete={({ inquiryId, status, fields }) => {
     	  // Inquiry completed. Optionally tell your server about it.
        console.log(`Sending finished inquiry ${inquiryId} to backend`);
        localStorage.setItem('login', JSON.stringify("true"));
        window.location.reload(true);

      }}
        
          /> :
          <div>
            Verified
          </div>
      }
      
   </div>
     
  
	);
};
export default Auth;
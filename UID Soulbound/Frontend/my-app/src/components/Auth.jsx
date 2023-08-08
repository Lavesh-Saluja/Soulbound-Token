import Persona from 'persona';
import "../App.css"
import {useEffect, useState} from 'react'
const Auth = (data) => {
  const [email, setEmail] = useState("");
  const address = data.value; 
  return (
    <div>
      <input placeholder="abc@xyz.com" onChange={(e)=>{setEmail(e.target.value)}}></input>
      <Persona.Inquiry
        templateId='itmpl_fv6PDioHhzwTo4pH7K1HSMR4'
        environmentId='env_Qsmaa92ng7mE8rxekimRP48p'
        referenceId={address.current}
       fields={{
    nameFirst: "Lavesh",
    emailAddress: email
  }}
      onLoad={() => { console.log('Loaded inline'); }}
      onComplete={({ inquiryId, status, fields }) => {
     	  // Inquiry completed. Optionally tell your server about it.
        console.log(`Sending finished inquiry ${inquiryId} to backend`);
      }}
        
          /> 
      
      
   </div>
     
  
	);
};
export default Auth;
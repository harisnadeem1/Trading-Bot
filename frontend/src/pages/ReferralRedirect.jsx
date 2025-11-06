import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ReferralRedirect = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      localStorage.setItem('referral_code', code);
      console.log('Referral code saved:', code);
    }
    // redirect to signup
    navigate('/signup');
  }, [code]);

  return null;
};

export default ReferralRedirect;

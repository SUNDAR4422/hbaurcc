import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Hcaptcha from '../components/Hcaptcha';
import FormError from '../components/FormError';

function CommonLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  
  const captchaRef = useRef(null);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) redirectToDashboard(user);
  }, [user, navigate]);

  const redirectToDashboard = (userData) => {
    if (userData.must_change_password) { navigate('/change-password'); return; }
    switch (userData.role) {
      case 'student': navigate('/student'); break;
      case 'warden': navigate('/warden'); break;
      case 'dean': navigate('/dean'); break;
      case 'admin': navigate('/admin'); break;
      default: navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    setError('');

    if (!captchaToken) {
      setError('Please complete the captcha verification.');
      return;
    }

    setLoading(true);

    try {
      const data = await login(identifier, password, captchaToken);
      redirectToDashboard(data.user);

    } catch (err) {

      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');

      // Reset CAPTCHA properly **AFTER error appears**
      setTimeout(() => {
        if (captchaRef.current) captchaRef.current.resetCaptcha();
        setCaptchaToken('');   // clear AFTER manual reset, not before
      }, 900);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="common-login-container">
      <div className="login-card">
        
        <div className="login-header">
          <img src="/anna-university-logo-png.png" alt="Logo" className="uni-logo"/>
          <h1 className="uni-title">Anna University <br />Regional Campus Coimbatore</h1>
          <p className="uni-subtitle">Hostel Bonafide Request System</p>
          <div className="portal-badge">CENTRAL PORTAL</div>
        </div>

        <div className="form-body">

          {/* Error ALWAYS stays visible */}
          <FormError message={error} />

          <form className="login-form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="identifier">Register Number</label>
              <input
                id="identifier"
                type="text"
                className="form-control"
                placeholder="Enter Register Number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="captcha-wrapper">
              <Hcaptcha 
                sitekey="f7d42932-1c94-4dbc-83a4-d390f06ef050"
                onVerify={setCaptchaToken}
                ref={captchaRef}
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>

          </form>
        </div>

        <div className="login-footer">
          <p>Having trouble? Contact the System Administrator.</p>
        </div>
      </div>

      {/* Your existing CSS left untouched */}
      <style>{`
        :root { --primary-blue: #003366; --bg-gray: #f4f6f9; --text-dark: #1f2937; --text-muted: #6b7280; --border-color: #e5e7eb; --white: #ffffff; }
        body { margin: 0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        .common-login-container { min-height: 100vh; background-color: var(--bg-gray); display: flex; align-items: center; justify-content: center; padding: 20px; }
        .login-card { background: var(--white); width: 100%; max-width: 420px; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1); padding: 32px 36px; box-sizing: border-box; }
        .login-header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid var(--border-color); margin-bottom: 24px; }
        .uni-logo { width: 80px; height: auto; margin-bottom: 16px; object-fit: contain; }
        .uni-title { font-size: 1.25rem; color: var(--primary-blue); font-weight: 700; margin: 0 0 6px 0; line-height: 1.3; }
        .uni-subtitle { font-size: 0.85rem; color: var(--text-muted); margin: 0 0 12px 0; font-weight: 500; }
        .portal-badge { display: inline-block; background-color: var(--primary-blue); color: var(--white); font-size: 0.7rem; font-weight: 600; padding: 4px 12px; border-radius: 16px; text-transform: uppercase; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 0.875rem; color: var(--text-dark); font-weight: 600; margin-bottom: 6px; }
        .form-control { width: 100%; padding: 12px 14px; font-size: 0.9rem; border: 1px solid var(--border-color); border-radius: 10px; box-sizing: border-box; }
        .form-control:focus { outline: none; border-color: var(--primary-blue); box-shadow: 0 0 0 3px rgba(0, 51, 102, 0.1); }
        .captcha-wrapper { margin: 16px 0; display: flex; justify-content: center; }
        .btn-primary { width: 100%; background-color: var(--primary-blue); color: var(--white); border: none; padding: 13px; font-size: 0.95rem; font-weight: 600; border-radius: 10px; cursor: pointer; transition: background-color 0.2s; }
        .btn-primary:hover:not(:disabled) { background-color: #002244; }
        .btn-primary:disabled { opacity: 0.7; }
        .login-footer { text-align: center; font-size: 0.8rem; color: var(--text-muted); border-top: 1px solid var(--border-color); padding-top: 18px; margin-top: 4px; }
      `}</style>
    </div>
  );
}

export default CommonLogin;

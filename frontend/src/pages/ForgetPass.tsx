// src/pages/ForgotPassword.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Loader2 } from 'lucide-react';
import { sendPasswordReset } from '../redux/slices/authSlice';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Button } from '../components/ui';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [infoMsg, setInfoMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    try {
      setLoadingLocal(true);
      const result = await dispatch(sendPasswordReset(email)).unwrap();
      // result typically contains { message: '...' } per backend
      setInfoMsg(result?.message ?? 'OTP sent to your email. Please check your inbox.');
      setEmail('');
      // Navigate to OTP verification page after a short delay
      setTimeout(() => navigate('/otp-verification', { state: { email } }), 1500);
    } catch (err: any) {
      console.error('sendPasswordReset error', err);
      // err is the rejectWithValue string (per thunk) or an Error
      setError(err ?? 'Could not send recovery email. Try again later.');
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card variant="elevated" padding="lg">
          <CardHeader className="text-center pb-6">
            <CardTitle>Reset password</CardTitle>
            <CardDescription>Enter your email and we will send an OTP to reset your password.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {infoMsg && (
                <div className="p-3 rounded bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-300">{infoMsg}</p>
                </div>
              )}

              <Input
                type="email"
                name="email"
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={16} />}
                required
                autoComplete="email"
              />

              <Button type="submit" className="w-full" size="lg" disabled={loadingLocal}>
                {loadingLocal ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} /> Sending...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center pt-4">
            <Button variant="link" onClick={() => navigate('/login')} className="p-0 h-auto font-medium">
              Back to Sign in
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { AlertCircle, Loader2, Shield, Stethoscope, User } from 'lucide-react';
import { UserRole } from '../types';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [secretCode, setSecretCode] = useState('');
  const [localError, setLocalError] = useState('');
  const { signup, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const requiresSecretCode = role === UserRole.ADMIN || role === UserRole.DOCTOR;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    if (requiresSecretCode && !secretCode) {
      setLocalError('Secret code is required for Admin/Doctor signup');
      return;
    }

    const success = await signup(name, email, password, role, secretCode);
    if (success) {
      navigate('/');
    }
  };

  const displayError = localError || error;

  const roleOptions = [
    { value: UserRole.USER, label: 'Patient', icon: User, description: 'Book appointments' },
    { value: UserRole.DOCTOR, label: 'Doctor', icon: Stethoscope, description: 'Manage patients' },
    { value: UserRole.ADMIN, label: 'Admin', icon: Shield, description: 'Full access' },
  ];

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-foreground">Create an Account</CardTitle>
          <p className="text-center text-sm text-muted-foreground">Enter your information to get started</p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {displayError && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{displayError}</span>
              </div>
            )}

            {/* Role Selector */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Account Type</label>
              <div className="grid grid-cols-3 gap-2">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = role === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setRole(option.value);
                        setSecretCode('');
                        clearError();
                        setLocalError('');
                      }}
                      className={`
                        flex flex-col items-center gap-1 p-3 rounded-lg border transition-all
                        ${isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-input bg-background hover:border-primary/50 text-muted-foreground hover:text-foreground'}
                      `}
                      disabled={loading}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {roleOptions.find(o => o.value === role)?.description}
              </p>
            </div>

            {/* Secret Code Field (for Admin/Doctor) */}
            {requiresSecretCode && (
              <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Input
                  id="secretCode"
                  type="password"
                  placeholder="Enter secret code"
                  label={`${role === UserRole.ADMIN ? 'Admin' : 'Doctor'} Secret Code`}
                  value={secretCode}
                  onChange={(e) => { setSecretCode(e.target.value); clearError(); setLocalError(''); }}
                  required
                  className="bg-background"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Contact administrator to get the secret code
                </p>
              </div>
            )}

            <div className="grid gap-2">
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-background"
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                label="Email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError(); setLocalError(''); }}
                required
                className="bg-background"
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Input
                id="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError(); setLocalError(''); }}
                required
                className="bg-background"
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Input
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setLocalError(''); }}
                required
                className="bg-background"
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="underline text-primary underline-offset-4">Sign in</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
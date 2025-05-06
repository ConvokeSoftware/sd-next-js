'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginUser, createUser, setUserInitialSports } from '../../actions/actions';
import { Trophy, Goal, Dumbbell } from 'lucide-react';

const SPORTS = [
  { label: 'Basketball', value: 'basketball', icon: Trophy },
  { label: 'American Football', value: 'american_football', icon: Goal },
  { label: 'European Football', value: 'european_football', icon: Trophy },
  { label: 'Ice Hockey', value: 'ice_hockey', icon: Trophy },
  { label: 'Baseball', value: 'baseball', icon: Trophy },
  { label: 'Tennis', value: 'tennis', icon: Trophy },
  { label: 'Golf', value: 'golf', icon: Trophy },
  { label: 'Boxing', value: 'boxing', icon: Dumbbell },
  { label: 'Cricket', value: 'cricket', icon: Trophy },
  { label: 'Rugby', value: 'rugby', icon: Goal },
];

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showSportsPanel, setShowSportsPanel] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isLogin) {
      try {
        const user = await loginUser(email, password);
        if (user) {
          router.push('/app');
        } else {
          setError('Invalid email or password');
        }
      } catch {
        setError('Something went wrong. Please try again.');
      }
    } else {
      if (!name.trim()) {
        setError('Name is required');
        return;
      }
      try {
        const user = await createUser(name, email, password);
        if (user && user.user_id) {
          setUserId(user.user_id);
          setShowSportsPanel(true);
        } else {
          setError('Failed to create user');
        }
      } catch {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  const handleFinishSetup = async () => {
    if (!userId) return;
    if (selectedSports.length === 0) {
      setError('Please select at least one sport');
      return;
    }
    try {
      await setUserInitialSports(userId, selectedSports);
      router.push('/app');
    } catch {
      setError('Failed to save sports selection');
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image with Blur and Gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://picsum.photos/1920/1080?random=1")',
        }}
      >
        <div className="absolute inset-0 backdrop-blur-sm bg-black/50" />
      </div>

      {/* Glass Morphism Card */}
      <Card className="w-full max-w-md relative z-10 bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            {isLogin ? 'Welcome Back' : showSportsPanel ? 'Finish Setup' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-white/80">
            {isLogin
              ? 'Sign in to your account to continue'
              : showSportsPanel
                ? 'Select up to 5 sports to personalize your experience'
                : 'Join us to start trading'}
          </CardDescription>
        </CardHeader>

        {!showSportsPanel ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="text-red-500 bg-white/20 rounded px-3 py-2 text-center">
                  {error}
                </div>
              )}
              {/* Test User Dropdown (only for login) */}
              {isLogin && (
                <div className="mb-2">
                  <label htmlFor="test-user" className="text-sm font-medium text-white">
                    Test Users
                  </label>
                  <select
                    id="test-user"
                    className="w-full mt-1 rounded bg-white/10 text-white p-2 focus:outline-none focus:ring-2 focus:ring-white/30"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) {
                        setEmail(`user-${val}@sd.com`);
                        setPassword('123');
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="">Select Test User</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Test User {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {/* Name Input (only for signup) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-white">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    required
                  />
                </div>
              )}
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-white text-black hover:bg-white/90">
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-white hover:bg-white/10"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <div>
            <CardContent className="space-y-4">
              <div className="text-white text-center mb-2">
                <span className="font-semibold">Congratulations!</span> Your account has been
                created.
                <br />
                You get <span className="font-bold">$100,000</span> in play money to test the
                system.
              </div>
              <div className="text-white text-center mb-2">
                Select up to 5 sports to personalize your experience:
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-[400px] mx-auto pb-4">
                {SPORTS.map(({ label, value, icon: Icon }) => {
                  const selected = selectedSports.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        if (selected) {
                          setSelectedSports(selectedSports.filter((s) => s !== value));
                        } else if (selectedSports.length < 5) {
                          setSelectedSports([...selectedSports, value]);
                        }
                      }}
                      className={`px-4 py-3 flex flex-col items-center justify-center rounded bg-white/10 border border-white/20 text-white transition
                        ${selected ? 'ring-2 ring-white bg-white/20' : ''}
                        ${selectedSports.length >= 5 && !selected ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      disabled={!selected && selectedSports.length >= 5}
                    >
                      <Icon size={32} />
                      <span className="text-xs text-center mt-1">{label}</span>
                    </button>
                  );
                })}
              </div>
              {error && (
                <div className="text-red-500 bg-white/20 rounded px-3 py-2 text-center">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="button"
                className="mt-4w-full bg-white text-black hover:bg-white/90"
                onClick={handleFinishSetup}
              >
                Finish Setup
              </Button>
            </CardFooter>
          </div>
        )}
      </Card>
    </main>
  );
}

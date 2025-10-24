import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppStore } from './lib/store'
import { auth } from './lib/supabase/client'

// Pages
import LandingPage from './pages/LandingPage'

// Placeholder components (to be created)
const LoginPage = () => <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Login Page - Coming Soon</h1></div>
const SignUpPage = () => <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">SignUp Page - Coming Soon</h1></div>
const DashboardPage = () => <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Dashboard - Coming Soon</h1></div>
const SetupWizardPage = () => <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Setup Wizard - Coming Soon</h1></div>
const PublicCardPage = () => <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Public Card - Coming Soon</h1></div>

function App() {
  const { setUser, setSession, setLoading, user } = useAppStore()

  useEffect(() => {
    // Check for existing session on mount
    auth.getCurrentSession().then((session) => {
      setSession(session)
      if (session?.user) {
        // Fetch full profile
        auth.getCurrentUser().then((user) => {
          if (user) {
            // In production, fetch profile from profiles table
            setUser({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || null,
              avatar_url: user.user_metadata?.avatar_url || null,
              plan_type: 'free',
              plan_expires_at: null,
              trial_ends_at: null,
              created_at: user.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
          }
        })
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      if (session?.user) {
        const user = await auth.getCurrentUser()
        if (user) {
          setUser({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || null,
            avatar_url: user.user_metadata?.avatar_url || null,
            plan_type: 'free',
            plan_expires_at: null,
            trial_ends_at: null,
            created_at: user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        }
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, setSession, setLoading])

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/:slug" element={<PublicCardPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={user ? <DashboardPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/setup"
          element={user ? <SetupWizardPage /> : <Navigate to="/login" />}
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App

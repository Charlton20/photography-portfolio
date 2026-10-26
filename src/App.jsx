import { useEffect, useState } from 'react'
import { getSession, signOut } from './api'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Gallery } from './components/Gallery'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { AuthDialog } from './components/AuthDialog'
import { OrderStatus } from './components/OrderStatus'

// Stripe sends people back to ...?order=<id> after paying.
// Read once when the page loads, outside the component so render stays pure.
const orderId = new URLSearchParams(window.location.search).get('order')

function App() {
  // the signed-in user, or null
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)

  // Ask the server once whether the login cookie belongs to someone
  useEffect(() => {
    getSession()
      .then((session) => setUser(session?.user ?? null))
      // server not reachable: just carry on signed out
      .catch(() => {})
  }, [])

  async function handleSignOut() {
    await signOut()
    setUser(null)
  }

  return (
    <>
      <Header user={user} onSignIn={() => setShowAuth(true)} onSignOut={handleSignOut} />
      <main>
        {orderId ? (
          <OrderStatus orderId={orderId} />
        ) : (
          <>
            <Hero />
            <Gallery user={user} onSignInNeeded={() => setShowAuth(true)} />
            <About />
            <Contact />
          </>
        )}
      </main>
      <Footer />

      {showAuth && (
        <AuthDialog
          onClose={() => setShowAuth(false)}
          onSignedIn={(signedInUser) => {
            setUser(signedInUser)
            setShowAuth(false)
          }}
        />
      )}
    </>
  )
}

export default App

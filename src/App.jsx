import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Gallery } from './components/Gallery'
import { About } from './components/About'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Gallery />
        <About />
      </main>
    </>
  )
}

export default App

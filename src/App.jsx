import { useCallback, useState } from 'react'
import Header from './components/header/Header'
import Hero from './components/hero/Hero'
import About from './components/about/About'
import Topics from './components/topics/Topics'
import Sessions from './components/sessions/Sessions'
import Community from './components/community/Community'
import Footer from './components/footer/Footer'
import ScheduleModal from './components/schedule-modal/ScheduleModal'
import Products from './components/products/Products'

export default function App() {
  // Apenas uma janela aberta por vez:
  // null | { type: 'schedule', topic? }
  const [modal, setModal] = useState(null)

  const close = useCallback(() => setModal(null), [])
  const openSchedule = (topic) => setModal({ type: 'schedule', topic })

  return (
    <>
      <Header onSchedule={() => openSchedule()} />
      <main>
        <Hero onSchedule={() => openSchedule()} />
        <About />
        <Topics onSchedule={openSchedule} />
        <Sessions onSchedule={() => openSchedule()} />
        <Products />
        <Community />
      </main>
      <Footer />

      {modal?.type === 'schedule' && <ScheduleModal initialTopic={modal.topic} onClose={close} />}
    </>
  )
}

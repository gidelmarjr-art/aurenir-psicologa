import { useCallback, useState } from 'react'
import Header from './components/header/Header'
import Hero from './components/hero/Hero'
import About from './components/about/About'
import Topics from './components/topics/Topics'
import Sessions from './components/sessions/Sessions'
import Community from './components/community/Community'
import Footer from './components/footer/Footer'
import ScheduleModal from './components/schedule-modal/ScheduleModal'
import InfoModal from './components/info-modal/InfoModal'
import ProductsModal from './components/products-modal/ProductsModal'

export default function App() {
  // Apenas uma janela aberta por vez:
  // null | { type: 'schedule', topic? } | { type: 'info', id } | { type: 'products' }
  const [modal, setModal] = useState(null)

  const close = useCallback(() => setModal(null), [])
  const openSchedule = (topic) => setModal({ type: 'schedule', topic })
  const openInfo = (id) => setModal({ type: 'info', id })
  const openProducts = () => setModal({ type: 'products' })

  return (
    <>
      <Header onSchedule={() => openSchedule()} onProducts={openProducts} />
      <main>
        <Hero onSchedule={() => openSchedule()} />
        <About />
        <Topics onOpen={openInfo} />
        <Sessions onSchedule={() => openSchedule()} />
        <Community onProducts={openProducts} />
      </main>
      <Footer />

      {modal?.type === 'schedule' && <ScheduleModal initialTopic={modal.topic} onClose={close} />}
      {modal?.type === 'info' && <InfoModal topicId={modal.id} onClose={close} onSchedule={openSchedule} />}
      {modal?.type === 'products' && <ProductsModal onClose={close} />}
    </>
  )
}

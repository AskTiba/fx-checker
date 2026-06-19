import { useUIStore } from './store/useUIStore'
import Header from './components/Header'
import Ticker from './components/Ticker'
import Converter from './components/Converter'
import CurrencyPicker from './components/CurrencyPicker'

export default function App() {
  const currencyPickerOpen = useUIStore((s) => s.currencyPickerOpen)

  return (
    <div className="min-h-dvh bg-surface-900">
      <Header />
      <Ticker />

      <main className="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 lg:grid-cols-[416px_1fr] lg:px-10 lg:py-8">
        <Converter />
      </main>

      {currencyPickerOpen && <CurrencyPicker />}
    </div>
  )
}

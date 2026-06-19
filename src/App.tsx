import { useUIStore } from './store/useUIStore'
import Header from './components/Header'
import Ticker from './components/Ticker'
import Converter from './components/Converter'
import TabPanel from './components/TabPanel'
import CurrencyPicker from './components/CurrencyPicker'

export default function App() {
  const currencyPickerOpen = useUIStore((s) => s.currencyPickerOpen)

  return (
    <div className="min-h-dvh bg-surface-900">
      <Header />
      <Ticker />

      <main className="mx-auto max-w-[960px] space-y-6 px-4 py-6 lg:px-8 lg:py-10">
        <Converter />
        <TabPanel />
      </main>

      {currencyPickerOpen && <CurrencyPicker />}
    </div>
  )
}

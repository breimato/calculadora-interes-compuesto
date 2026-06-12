import { CompoundInterestCalculator } from './components/calculator/CompoundInterestCalculator.tsx'
import { FinanceNav } from './components/ui/FinanceNav.tsx'
import { ThemeToggle } from './components/ui/ThemeToggle.tsx'

export default function App() {
  return (
    <>
      <a href="#calculator-title" className="skip-link">
        Saltar al contenido principal
      </a>
      <header className="app-header">
        <FinanceNav currentServiceId="calculadora-intereses" />
        <ThemeToggle />
      </header>
      <main id="main-content" className="app-main">
        <CompoundInterestCalculator />
      </main>
    </>
  )
}

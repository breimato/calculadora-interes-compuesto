import { CompoundInterestCalculator } from "@/components/compound-interest-calculator"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Calculadora de Interés Compuesto</h1>
      <CompoundInterestCalculator />
    </main>
  )
}


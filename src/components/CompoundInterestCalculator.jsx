"use client"

import { useState } from "react"
import { Card } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Select, SelectItem } from "./ui/select"
import { InvestmentChart } from "./InvestmentChart"
import { YearlyBreakdown } from "./YearlyBreakdown"
import { toast } from "./ui/toast"

export default function CompoundInterestCalculator() {
  const [initialAmount, setInitialAmount] = useState("1000")
  const [contributionAmount, setContributionAmount] = useState("100")
  const [contributionFrequency, setContributionFrequency] = useState("monthly")
  const [annualInterestRate, setAnnualInterestRate] = useState("5")
  const [years, setYears] = useState("10")
  const [result, setResult] = useState(null)

  const frequencyMap = {
    monthly: { label: "Mensual", times: 12 },
    quarterly: { label: "Trimestral", times: 4 },
    semiannual: { label: "Semestral", times: 2 },
    annual: { label: "Anual", times: 1 },
  }

  const validateInputs = () => {
    if (!initialAmount || initialAmount.trim() === "") {
      toast({
        title: "Campo requerido",
        description: "Por favor, ingrese una cantidad inicial",
        variant: "destructive",
      })
      return false
    }

    if (!contributionAmount || contributionAmount.trim() === "") {
      toast({
        title: "Campo requerido",
        description: "Por favor, ingrese un aporte periódico",
        variant: "destructive",
      })
      return false
    }

    if (!annualInterestRate || annualInterestRate.trim() === "") {
      toast({
        title: "Campo requerido",
        description: "Por favor, ingrese una tasa de interés anual",
        variant: "destructive",
      })
      return false
    }

    if (!years || years.trim() === "") {
      toast({
        title: "Campo requerido",
        description: "Por favor, ingrese los años a invertir",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const calculateCompoundInterest = () => {
    if (!validateInputs()) return

    const initialAmountNum = Number.parseFloat(initialAmount)
    const contributionAmountNum = Number.parseFloat(contributionAmount)
    const annualInterestRateNum = Number.parseFloat(annualInterestRate)
    const yearsNum = Number.parseInt(years)

    if (initialAmountNum < 0) {
      toast({
        title: "Valor inválido",
        description: "La cantidad inicial no puede ser negativa",
        variant: "destructive",
      })
      return
    }

    if (annualInterestRateNum < 0) {
      toast({
        title: "Valor inválido",
        description: "La tasa de interés no puede ser negativa",
        variant: "destructive",
      })
      return
    }

    if (yearsNum <= 0) {
      toast({
        title: "Valor inválido",
        description: "Los años a invertir deben ser mayores a cero",
        variant: "destructive",
      })
      return
    }

    const periodsPerYear = frequencyMap[contributionFrequency].times
    const interestRatePerPeriod = annualInterestRateNum / 100 / periodsPerYear

    let balance = initialAmountNum
    let totalContributions = initialAmountNum

    const yearlyData = []
    const yearsArray = []
    const totalInvestedArray = []
    const totalInterestArray = []
    const totalAmountArray = []

    for (let year = 1; year <= yearsNum; year++) {
      const startYearBalance = balance
      let yearlyContribution = 0
      let yearlyInterest = 0

      for (let period = 1; period <= periodsPerYear; period++) {
        // Add contribution
        balance += contributionAmountNum
        yearlyContribution += contributionAmountNum
        totalContributions += contributionAmountNum

        // Calculate interest for this period
        const periodInterest = balance * interestRatePerPeriod
        balance += periodInterest
        yearlyInterest += periodInterest
      }

      yearlyData.push({
        year,
        startBalance: startYearBalance,
        contribution: yearlyContribution,
        interest: yearlyInterest,
        endBalance: balance,
      })

      yearsArray.push(year)
      totalInvestedArray.push(totalContributions)
      totalInterestArray.push(balance - totalContributions)
      totalAmountArray.push(balance)
    }

    setResult({
      years: yearsArray,
      totalInvested: totalInvestedArray,
      totalInterest: totalInterestArray,
      totalAmount: totalAmountArray,
      yearlyData,
    })
  }

  return (
    <div className="space-y-8">
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">Parámetros de Inversión</h2>
          <p className="text-sm text-gray-500 mb-6">
            Ingrese los detalles de su inversión para calcular el interés compuesto. Puede usar valores negativos en el
            aporte periódico para simular retiradas.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="initialAmount">Cantidad Inicial (€)</Label>
              <Input
                id="initialAmount"
                type="number"
                min="0"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contributionAmount">Aporte Periódico (€)</Label>
              <Input
                id="contributionAmount"
                type="number"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Valores negativos representan retiradas periódicas</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contributionFrequency">Periodicidad del Aporte</Label>
              <Select value={contributionFrequency} onValueChange={(value) => setContributionFrequency(value)}>
                <SelectItem value="monthly">Mensual</SelectItem>
                <SelectItem value="quarterly">Trimestral</SelectItem>
                <SelectItem value="semiannual">Semestral</SelectItem>
                <SelectItem value="annual">Anual</SelectItem>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualInterestRate">Tasa Anual de Interés (%)</Label>
              <Input
                id="annualInterestRate"
                type="number"
                min="0"
                step="0.01"
                value={annualInterestRate}
                onChange={(e) => setAnnualInterestRate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="years">Años a Invertir</Label>
              <Input id="years" type="number" min="1" value={years} onChange={(e) => setYears(e.target.value)} />
            </div>

            <div className="flex items-end">
              <Button onClick={calculateCompoundInterest} className="w-full">
                Calcular
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {result && (
        <>
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Resultados</h2>
              <p className="text-sm text-gray-500 mb-6">Visualización de su inversión a lo largo del tiempo</p>
              <div className="mb-6 text-center">
                <h3 className="text-lg font-medium text-gray-500 mb-1">Cantidad Total al Final</h3>
                <p className="text-4xl font-bold">
                  {new Intl.NumberFormat("es-ES", {
                    style: "currency",
                    currency: "EUR",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(result.totalAmount[result.totalAmount.length - 1])}
                </p>
              </div>
              <div className="h-[300px]">
                <InvestmentChart result={result} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Desglose Anual</h2>
              <p className="text-sm text-gray-500 mb-6">Detalle del crecimiento de su inversión año por año</p>
              <YearlyBreakdown yearlyData={result.yearlyData} />
            </div>
          </Card>
        </>
      )}
    </div>
  )
}


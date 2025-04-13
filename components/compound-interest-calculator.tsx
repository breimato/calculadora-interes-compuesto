"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InvestmentChart } from "@/components/investment-chart"
import { YearlyBreakdown } from "@/components/yearly-breakdown"
import { toast } from "@/components/ui/use-toast"

type FrequencyType = "monthly" | "quarterly" | "semiannual" | "annual"

interface CalculationResult {
  years: number[]
  totalInvested: number[]
  totalInterest: number[]
  totalAmount: number[]
  yearlyData: {
    year: number
    startBalance: number
    contribution: number
    interest: number
    endBalance: number
  }[]
}

export function CompoundInterestCalculator() {
  const [initialAmount, setInitialAmount] = useState<string>("1000")
  const [contributionAmount, setContributionAmount] = useState<string>("100")
  const [contributionFrequency, setContributionFrequency] = useState<FrequencyType>("monthly")
  const [annualInterestRate, setAnnualInterestRate] = useState<string>("5")
  const [investmentYears, setInvestmentYears] = useState<string>("10")
  const [maintenanceYears, setMaintenanceYears] = useState<string>("5")
  const [result, setResult] = useState<CalculationResult | null>(null)

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

    if (!investmentYears || investmentYears.trim() === "") {
      toast({
        title: "Campo requerido",
        description: "Por favor, ingrese los años de inversión inicial",
        variant: "destructive",
      })
      return false
    }

    if (!maintenanceYears || maintenanceYears.trim() === "") {
      toast({
        title: "Campo requerido",
        description: "Por favor, ingrese los años de mantenimiento",
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
    const investmentYearsNum = Number.parseInt(investmentYears)
    const maintenanceYearsNum = Number.parseInt(maintenanceYears)

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

    if (investmentYearsNum <= 0) {
      toast({
        title: "Valor inválido",
        description: "Los años de inversión inicial deben ser mayores a cero",
        variant: "destructive",
      })
      return
    }

    if (maintenanceYearsNum < 0) {
      toast({
        title: "Valor inválido",
        description: "Los años de mantenimiento no pueden ser negativos",
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

    // Primera fase: Aportes regulares
    for (let year = 1; year <= investmentYearsNum; year++) {
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

    // Segunda fase: Mantenimiento sin aportes
    for (let year = investmentYearsNum + 1; year <= investmentYearsNum + maintenanceYearsNum; year++) {
      const startYearBalance = balance
      let yearlyInterest = 0

      for (let period = 1; period <= periodsPerYear; period++) {
        // Calculate interest for this period
        const periodInterest = balance * interestRatePerPeriod
        balance += periodInterest
        yearlyInterest += periodInterest
      }

      yearlyData.push({
        year,
        startBalance: startYearBalance,
        contribution: 0,
        interest: yearlyInterest,
        endBalance: balance,
      })

      yearsArray.push(year)
      totalInvestedArray.push(totalContributions) // No hay nuevos aportes
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
        <CardHeader>
          <CardTitle>Parámetros de Inversión</CardTitle>
          <CardDescription>
            Ingrese los detalles de su inversión para calcular el interés compuesto. Puede usar valores negativos en el
            aporte periódico para simular retiradas.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              <p className="text-xs text-muted-foreground mt-1">Valores negativos representan retiradas periódicas</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contributionFrequency">Periodicidad del Aporte</Label>
              <Select
                value={contributionFrequency}
                onValueChange={(value) => setContributionFrequency(value as FrequencyType)}
              >
                <SelectTrigger id="contributionFrequency">
                  <SelectValue placeholder="Seleccione frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="quarterly">Trimestral</SelectItem>
                  <SelectItem value="semiannual">Semestral</SelectItem>
                  <SelectItem value="annual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualInterestRate">Interés Anual (%)</Label>
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
              <Label htmlFor="maintenanceYears">Años de Mantenimiento</Label>
              <Input
                id="maintenanceYears"
                type="number"
                min="0"
                value={maintenanceYears}
                onChange={(e) => setMaintenanceYears(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={calculateCompoundInterest} className="w-full">
                Calcula
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
              <CardDescription>Visualización de su inversión a lo largo del tiempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 text-center">
                <h3 className="text-lg font-medium text-muted-foreground mb-1">Cantidad Total al Final</h3>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Desglose Anual</CardTitle>
              <CardDescription>Detalle del crecimiento de su inversión año por año</CardDescription>
            </CardHeader>
            <CardContent>
              <YearlyBreakdown yearlyData={result.yearlyData} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

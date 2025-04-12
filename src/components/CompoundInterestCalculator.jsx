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
  const [initialAmount, setInitialAmount] = useState("10000")
  const [contributionAmount, setContributionAmount] = useState("1000")
  const [contributionFrequency, setContributionFrequency] = useState("monthly")
  const [annualInterestRate, setAnnualInterestRate] = useState("8")
  const [years, setYears] = useState("20")
  const [result, setResult] = useState(null)
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)
  const [investmentPeriods, setInvestmentPeriods] = useState([
    { years: "10", contribution: "1000" },
    { years: "10", contribution: "0" }
  ])

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

    if (!isAdvancedMode && (!contributionAmount || contributionAmount.trim() === "")) {
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

    if (!isAdvancedMode && (!years || years.trim() === "")) {
      toast({
        title: "Campo requerido",
        description: "Por favor, ingrese los años a invertir",
        variant: "destructive",
      })
      return false
    }

    if (isAdvancedMode) {
      for (const period of investmentPeriods) {
        if (!period.years || period.years.trim() === "" || Number.parseInt(period.years) <= 0) {
          toast({
            title: "Valor inválido",
            description: "Todos los períodos deben tener una duración válida mayor a cero",
            variant: "destructive",
          })
          return false
        }

        if (!period.contribution || period.contribution.trim() === "") {
          toast({
            title: "Campo requerido",
            description: "Por favor, ingrese un aporte para cada período",
            variant: "destructive",
          })
          return false
        }
      }
    }

    return true
  }

  const calculateCompoundInterest = () => {
    if (!validateInputs()) return

    const initialAmountNum = Number.parseFloat(initialAmount)
    const annualInterestRateNum = Number.parseFloat(annualInterestRate)
    let totalYears = 0

    if (isAdvancedMode) {
      totalYears = investmentPeriods.reduce((sum, period) => sum + Number.parseInt(period.years), 0)
    } else {
      totalYears = Number.parseInt(years)
    }

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

    if (totalYears <= 0) {
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
    let currentYear = 1

    if (isAdvancedMode) {
      for (const period of investmentPeriods) {
        const periodYears = Number.parseInt(period.years)
        const periodContribution = Number.parseFloat(period.contribution)

        for (let year = 0; year < periodYears; year++) {
          const startYearBalance = balance
          let yearlyContribution = 0
          let yearlyInterest = 0

          for (let period = 1; period <= periodsPerYear; period++) {
            // Add contribution
            balance += periodContribution
            yearlyContribution += periodContribution
            totalContributions += periodContribution

            // Calculate interest for this period
            const periodInterest = balance * interestRatePerPeriod
            balance += periodInterest
            yearlyInterest += periodInterest
          }

          yearlyData.push({
            year: currentYear,
            startBalance: startYearBalance,
            contribution: yearlyContribution,
            interest: yearlyInterest,
            endBalance: balance,
          })

          yearsArray.push(currentYear)
          totalInvestedArray.push(totalContributions)
          totalInterestArray.push(balance - totalContributions)
          totalAmountArray.push(balance)
          currentYear++
        }
      }
    } else {
      const contributionAmountNum = Number.parseFloat(contributionAmount)
      for (let year = 1; year <= totalYears; year++) {
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Parámetros de Inversión</h2>
              <p className="text-sm text-gray-500">
                Ingrese los detalles de su inversión para calcular el interés compuesto.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="advancedMode">Modo Avanzado</Label>
              <input
                type="checkbox"
                id="advancedMode"
                checked={isAdvancedMode}
                onChange={(e) => setIsAdvancedMode(e.target.checked)}
                className="h-4 w-4"
              />
            </div>
          </div>
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

            {!isAdvancedMode ? (
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
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="contributionFrequency">Periodicidad del Aporte</Label>
              <Select value={contributionFrequency} onValueChange={(value) => setContributionFrequency(value)}>
                <SelectItem value="monthly">Mensual</SelectItem>
                <SelectItem value="quarterly">Trimestral</SelectItem>
                <SelectItem value="semiannual">Semestral</SelectItem>
                <SelectItem value="annual">Anual</SelectItem>
              </Select>
            </div>

            {isAdvancedMode && (
              <div className="col-span-3 space-y-4">
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Períodos de inversión</h3>
                  {investmentPeriods.map((period, index) => (
                    <div key={index} className="grid sm:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
                      <div className="space-y-2">
                        <Label htmlFor={`period-${index}-years`}>
                          Duración del período {index + 1} (años)
                        </Label>
                        <Input
                          type="number"
                          id={`period-${index}-years`}
                          value={period.years}
                          onChange={(e) => {
                            const newPeriods = [...investmentPeriods]
                            newPeriods[index].years = e.target.value
                            setInvestmentPeriods(newPeriods)
                          }}
                          min="1"
                          step="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`period-${index}-contribution`}>
                          Aportación {frequencyMap[contributionFrequency].label} (€)
                        </Label>
                        <Input
                          type="number"
                          id={`period-${index}-contribution`}
                          value={period.contribution}
                          onChange={(e) => {
                            const newPeriods = [...investmentPeriods]
                            newPeriods[index].contribution = e.target.value
                            setInvestmentPeriods(newPeriods)
                          }}
                        />
                        <p className="text-xs text-gray-500">Valores negativos representan retiradas</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-4">
                    <Button
                      type="button"
                      onClick={() => setInvestmentPeriods([...investmentPeriods, { years: "5", contribution: "0" }])}
                      variant="outline"
                    >
                      Añadir Período
                    </Button>
                    {investmentPeriods.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => setInvestmentPeriods(investmentPeriods.slice(0, -1))}
                        variant="outline"
                      >
                        Eliminar Último Período
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

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
              <Label htmlFor="years">
                {isAdvancedMode ? "Total de años" : "Años a invertir"}
              </Label>
              <Input
                id="years"
                type="number"
                min="1"
                value={isAdvancedMode 
                  ? investmentPeriods.reduce((sum, period) => sum + Number.parseInt(period.years || 0), 0)
                  : years
                }
                onChange={(e) => setYears(e.target.value)}
                disabled={isAdvancedMode}
                className={isAdvancedMode ? "bg-gray-100" : ""}
              />
              {isAdvancedMode && (
                <p className="text-xs text-gray-500 mt-1">
                  Suma total de los períodos definidos
                </p>
              )}
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


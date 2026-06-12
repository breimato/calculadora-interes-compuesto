import { useCompoundInterestCalculator } from '../../hooks/useCompoundInterestCalculator.ts'
import {
  CONTRIBUTION_FREQUENCY_OPTIONS,
  getTotalYearsFromPeriods,
  type ContributionFrequency,
  type InvestmentPeriod,
} from '../../types/compoundInterest.ts'
import type { CompoundInterestResult } from '../../types/CompoundInterestResult.ts'
import { CompoundInterestError } from '../../lib/errors/CompoundInterestError.ts'
import { Input } from '../ui/Input.tsx'
import { Select } from '../ui/Select.tsx'
import { Toggle } from '../ui/Toggle.tsx'
import { InvestmentChart } from './InvestmentChart.tsx'
import { YearlyBreakdown } from './YearlyBreakdown.tsx'

const FREQUENCY_SELECT_OPTIONS = CONTRIBUTION_FREQUENCY_OPTIONS.map((option) => ({
  value: option.value,
  label: option.label,
}))

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(value)
}

interface ResultsPanelProps {
  compoundInterestResult: CompoundInterestResult | null
  compoundInterestError: CompoundInterestError | null
  totalYears: number
  frequencyLabel: string
}

function ResultsPanel({
  compoundInterestResult,
  compoundInterestError,
  totalYears,
  frequencyLabel,
}: ResultsPanelProps) {
  if (compoundInterestError !== null) {
    return (
      <aside className="calculator-results" aria-live="polite">
        <p className="calculator-results__eyebrow">Resultados</p>
        <div className="results-error" role="alert">
          {compoundInterestError.message}
        </div>
      </aside>
    )
  }

  if (compoundInterestResult === null) {
    return null
  }

  return (
    <aside className="calculator-results" aria-live="polite">
      <p className="calculator-results__eyebrow">Proyección a {totalYears} años</p>
      <p className="calculator-results__monthly">
        {formatCurrency(compoundInterestResult.finalAmount)}
      </p>
      <dl className="calculator-results__stats">
        <div>
          <dt>Total invertido</dt>
          <dd>{formatCurrency(compoundInterestResult.totalContributions)}</dd>
        </div>
        <div>
          <dt>Intereses generados</dt>
          <dd>{formatCurrency(compoundInterestResult.totalInterestEarned)}</dd>
        </div>
        <div>
          <dt>Rentabilidad sobre aportado</dt>
          <dd>
            {compoundInterestResult.totalContributions > 0
              ? `${((compoundInterestResult.totalInterestEarned / compoundInterestResult.totalContributions) * 100).toLocaleString('es-ES', { maximumFractionDigits: 1 })} %`
              : '—'}
          </dd>
        </div>
      </dl>
      <p className="calculator-results__note">
        Capitalización {frequencyLabel.toLowerCase()}. Los valores negativos en aportes representan
        retiradas periódicas.
      </p>
    </aside>
  )
}

export function CompoundInterestCalculator() {
  const {
    formData,
    updateFormData,
    compoundInterestResult,
    compoundInterestError,
  } = useCompoundInterestCalculator()

  const totalYears = formData.isAdvancedMode
    ? getTotalYearsFromPeriods(formData.investmentPeriods)
    : formData.years

  const updateInvestmentPeriod = (
    index: number,
    partialPeriod: Partial<InvestmentPeriod>,
  ) => {
    const nextPeriods = formData.investmentPeriods.map((period, periodIndex) =>
      periodIndex === index ? { ...period, ...partialPeriod } : period,
    )
    updateFormData({ investmentPeriods: nextPeriods })
  }

  const frequencyLabel =
    CONTRIBUTION_FREQUENCY_OPTIONS.find(
      (option) => option.value === formData.contributionFrequency,
    )?.label ?? 'Mensual'

  return (
    <div className="calculator-page">
      <div className="calculator-layout">
        <section className="calculator-form" aria-labelledby="calculator-title">
          <header className="calculator-form__header">
            <h1 id="calculator-title">Calculadora de interés compuesto</h1>
            <p className="calculator-form__lead">
              Planifica el crecimiento de tu inversión con aportaciones periódicas y distintos
              tramos de ahorro.
            </p>
          </header>

          <div className="calculator-form__fields">
            <Toggle
              label="Modo avanzado"
              description="Define varios tramos con aportaciones distintas a lo largo del tiempo."
              checked={formData.isAdvancedMode}
              onChange={(event) =>
                updateFormData({ isAdvancedMode: event.target.checked })
              }
            />

            <div className="calculator-form__row">
              <Input
                label="Cantidad inicial"
                type="number"
                inputMode="decimal"
                min={0}
                step={100}
                value={formData.initialAmount}
                onChange={(event) =>
                  updateFormData({ initialAmount: Number(event.target.value) || 0 })
                }
              />
              <Select
                label="Frecuencia del aporte"
                options={FREQUENCY_SELECT_OPTIONS}
                value={formData.contributionFrequency}
                onChange={(event) =>
                  updateFormData({
                    contributionFrequency: event.target.value as ContributionFrequency,
                  })
                }
              />
            </div>

            {!formData.isAdvancedMode && (
              <Input
                label={`Aporte ${frequencyLabel.toLowerCase()}`}
                type="number"
                inputMode="decimal"
                step={50}
                value={formData.contributionPerPeriod}
                onChange={(event) =>
                  updateFormData({
                    contributionPerPeriod: Number(event.target.value) || 0,
                  })
                }
                hint="Valores negativos representan retiradas periódicas."
              />
            )}

            <div className="calculator-form__row">
              <Input
                label="Interés anual"
                type="number"
                inputMode="decimal"
                min={0}
                step={0.1}
                value={formData.annualInterestRate}
                onChange={(event) =>
                  updateFormData({
                    annualInterestRate: Number(event.target.value) || 0,
                  })
                }
              />
              <Input
                label={formData.isAdvancedMode ? 'Total de años' : 'Años a invertir'}
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                value={totalYears}
                readOnly={formData.isAdvancedMode}
                onChange={(event) =>
                  updateFormData({ years: Number(event.target.value) || 1 })
                }
              />
            </div>

            {formData.isAdvancedMode && (
              <fieldset className="calculator-form__taxes">
                <legend className="form-label">Tramos de inversión</legend>
                <p className="form-hint period-list__intro">
                  El total de años es la suma de los tramos definidos. Valores negativos en
                  los aportes representan retiradas periódicas.
                </p>
                <div className="period-list">
                  {formData.investmentPeriods.map((period, index) => (
                    <div key={index} className="period-list__item">
                      <p className="period-list__title">Tramo {index + 1}</p>
                      <div className="calculator-form__row">
                        <Input
                          label="Duración (años)"
                          type="number"
                          inputMode="numeric"
                          min={1}
                          step={1}
                          value={period.years}
                          onChange={(event) =>
                            updateInvestmentPeriod(index, {
                              years: Number(event.target.value) || 1,
                            })
                          }
                        />
                        <Input
                          label={`Aporte ${frequencyLabel.toLowerCase()}`}
                          type="number"
                          inputMode="decimal"
                          step={50}
                          value={period.contributionPerPeriod}
                          onChange={(event) =>
                            updateInvestmentPeriod(index, {
                              contributionPerPeriod: Number(event.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="period-list__actions">
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() =>
                      updateFormData({
                        investmentPeriods: [
                          ...formData.investmentPeriods,
                          { years: 5, contributionPerPeriod: 0 },
                        ],
                      })
                    }
                  >
                    Añadir tramo
                  </button>
                  {formData.investmentPeriods.length > 1 && (
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={() =>
                        updateFormData({
                          investmentPeriods: formData.investmentPeriods.slice(0, -1),
                        })
                      }
                    >
                      Eliminar último tramo
                    </button>
                  )}
                </div>
              </fieldset>
            )}
          </div>
        </section>

        <ResultsPanel
          compoundInterestResult={compoundInterestResult}
          compoundInterestError={compoundInterestError}
          totalYears={totalYears}
          frequencyLabel={frequencyLabel}
        />
      </div>

      {compoundInterestResult !== null && compoundInterestError === null && (
        <section className="calculator-extras" aria-label="Detalle de la proyección">
          <div className="calculator-extras__panel">
            <h2>Evolución de la inversión</h2>
            <InvestmentChart result={compoundInterestResult} />
          </div>
          <div className="calculator-extras__panel">
            <YearlyBreakdown yearlyData={compoundInterestResult.yearlyData} />
          </div>
        </section>
      )}
    </div>
  )
}

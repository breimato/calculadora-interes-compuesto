import type { CompoundInterestResult } from '../../types/CompoundInterestResult.ts'

interface InvestmentChartProps {
  result: CompoundInterestResult
}

const CHART_WIDTH = 720
const CHART_HEIGHT = 280
const MARGIN = { top: 16, right: 16, bottom: 40, left: 56 }

export function InvestmentChart({ result }: InvestmentChartProps) {
  const plotWidth = CHART_WIDTH - MARGIN.left - MARGIN.right
  const plotHeight = CHART_HEIGHT - MARGIN.top - MARGIN.bottom
  const barCount = result.years.length

  if (barCount === 0) {
    return null
  }

  const maxValue = Math.max(...result.totalAmount, 1)
  const barGap = barCount > 24 ? 2 : 6
  const barWidth = Math.max(4, (plotWidth - barGap * (barCount - 1)) / barCount)

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((fraction) => ({
    fraction,
    value: maxValue * fraction,
    y: MARGIN.top + plotHeight - fraction * plotHeight,
  }))

  return (
    <figure className="investment-chart" aria-label="Evolución de la inversión por año">
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        width="100%"
        height={CHART_HEIGHT}
        role="img"
        aria-hidden="true"
      >
        {yTicks.map((tick) => (
          <g key={tick.fraction}>
            <line
              x1={MARGIN.left}
              y1={tick.y}
              x2={CHART_WIDTH - MARGIN.right}
              y2={tick.y}
              className="investment-chart__grid"
            />
            <text
              x={MARGIN.left - 8}
              y={tick.y + 4}
              textAnchor="end"
              className="investment-chart__axis-label"
            >
              {formatCompactCurrency(tick.value)}
            </text>
          </g>
        ))}

        {result.years.map((year, index) => {
          const investedHeight = (result.totalInvested[index] / maxValue) * plotHeight
          const interestHeight = (result.totalInterest[index] / maxValue) * plotHeight
          const x = MARGIN.left + index * (barWidth + barGap)
          const investedY = MARGIN.top + plotHeight - investedHeight
          const interestY = investedY - interestHeight

          return (
            <g key={year}>
              <title>
                {`Año ${year}: invertido ${formatCurrency(result.totalInvested[index])}, intereses ${formatCurrency(result.totalInterest[index])}`}
              </title>
              <rect
                x={x}
                y={investedY}
                width={barWidth}
                height={investedHeight}
                className="investment-chart__bar investment-chart__bar--invested"
                rx={2}
              />
              <rect
                x={x}
                y={interestY}
                width={barWidth}
                height={interestHeight}
                className="investment-chart__bar investment-chart__bar--interest"
                rx={2}
              />
              {(barCount <= 12 || index % Math.ceil(barCount / 12) === 0) && (
                <text
                  x={x + barWidth / 2}
                  y={CHART_HEIGHT - 12}
                  textAnchor="middle"
                  className="investment-chart__axis-label"
                >
                  {year}
                </text>
              )}
            </g>
          )
        })}
      </svg>
      <figcaption className="investment-chart__legend">
        <span className="investment-chart__legend-item">
          <span className="investment-chart__swatch investment-chart__swatch--invested" />
          Capital invertido
        </span>
        <span className="investment-chart__legend-item">
          <span className="investment-chart__swatch investment-chart__swatch--interest" />
          Intereses acumulados
        </span>
      </figcaption>
    </figure>
  )
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString('es-ES', { maximumFractionDigits: 1 })} M€`
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toLocaleString('es-ES', { maximumFractionDigits: 0 })} k€`
  }

  return formatCurrency(value)
}

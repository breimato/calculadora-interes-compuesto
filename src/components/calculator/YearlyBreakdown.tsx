import type { YearlyBreakdownRow } from '../../types/CompoundInterestResult.ts'

interface YearlyBreakdownProps {
  yearlyData: YearlyBreakdownRow[]
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function YearlyBreakdown({ yearlyData }: YearlyBreakdownProps) {
  return (
    <div className="yearly-breakdown">
      <table className="results-breakdown">
        <caption className="yearly-breakdown__caption">Desglose anual</caption>
        <thead>
          <tr>
            <th scope="col">Año</th>
            <th scope="col">Balance inicial</th>
            <th scope="col">Aportaciones</th>
            <th scope="col">Intereses</th>
            <th scope="col">Balance final</th>
          </tr>
        </thead>
        <tbody>
          {yearlyData.map((row) => (
            <tr key={row.year}>
              <td>{row.year}</td>
              <td>{formatCurrency(row.startBalance)}</td>
              <td>{formatCurrency(row.contribution)}</td>
              <td>{formatCurrency(row.interest)}</td>
              <td>{formatCurrency(row.endBalance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

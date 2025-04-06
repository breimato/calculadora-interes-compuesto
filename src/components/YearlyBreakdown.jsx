export function YearlyBreakdown({ yearlyData }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-3 px-4 text-left font-medium">Año</th>
            <th className="py-3 px-4 text-left font-medium">Balance Inicial</th>
            <th className="py-3 px-4 text-left font-medium">Aportaciones</th>
            <th className="py-3 px-4 text-left font-medium">Intereses</th>
            <th className="py-3 px-4 text-left font-medium">Balance Final</th>
          </tr>
        </thead>
        <tbody>
          {yearlyData.map((data) => (
            <tr key={data.year} className="border-b">
              <td className="py-3 px-4">{data.year}</td>
              <td className="py-3 px-4">{formatCurrency(data.startBalance)}</td>
              <td className="py-3 px-4">{formatCurrency(data.contribution)}</td>
              <td className="py-3 px-4">{formatCurrency(data.interest)}</td>
              <td className="py-3 px-4 font-medium">{formatCurrency(data.endBalance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


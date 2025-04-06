import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function InvestmentChart({ result }) {
  const chartData = result.years.map((year, index) => ({
    year,
    Inversión: result.totalInvested[index],
    Intereses: result.totalInterest[index],
  }))

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" label={{ value: "Año", position: "insideBottom", offset: -10, dy: 15 }} tickMargin={15} />
        <YAxis
          tickFormatter={formatCurrency}
          width={120} // Ancho fijo muy amplio para los valores
          tickMargin={10}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(value), ""]}
          labelFormatter={(label) => `Año ${label}`}
          contentStyle={{ padding: "10px", borderRadius: "6px" }}
          wrapperStyle={{ zIndex: 1000 }}
        />
        <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingTop: "10px" }} />
        <Bar dataKey="Inversión" stackId="a" fill="#4f46e5" />
        <Bar dataKey="Intereses" stackId="a" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  )
}


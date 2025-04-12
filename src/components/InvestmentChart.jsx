import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function InvestmentChart({ result }) {
  const chartData = result.years.map((year, index) => ({
    year,
    Inversión: result.totalInvested[index],
    Intereses: result.totalInterest[index],
  }))

  // Calcular el tamaño óptimo de las barras basado en la cantidad de años
  const calculateBarSize = () => {
    const yearCount = chartData.length;
    if (yearCount <= 5) {
      // Para 5 años o menos, barras más anchas
      return Math.min(100, 700 / yearCount); // Limitar a 100px máximo
    } else if (yearCount <= 10) {
      // Para 6-10 años, tamaño medio
      return Math.min(60, 600 / yearCount);
    } else {
      // Para más de 10 años, tamaño estándar
      return 35;
    }
  }
  
  const barSize = calculateBarSize();

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
      <BarChart data={chartData} margin={{ top: 30, right: 20, left: 10, bottom: 35 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
        <XAxis 
          dataKey="year" 
          label={{ 
            value: "Año", 
            position: "insideBottom", 
            offset: -5, 
            dy: 25,
            style: { fill: "var(--foreground)" }
          }} 
          tickMargin={15} 
          stroke="var(--border)"
          tick={{ fill: "var(--foreground)" }}
          axisLine={{ strokeWidth: 1 }}
        />
        <YAxis
          tickFormatter={formatCurrency}
          width={120}
          tickMargin={10}
          stroke="var(--border)"
          tick={{ fill: "var(--foreground)" }}
          axisLine={{ strokeWidth: 1 }}
        />
        <Tooltip
          formatter={(value, name) => [formatCurrency(value), name]}
          labelFormatter={(label) => `Año ${label}`}
          contentStyle={{ 
            padding: "12px", 
            borderRadius: "var(--radius)",
            backgroundColor: "#ffffff",
            backdropFilter: "none",
            border: "1px solid var(--border)",
            color: "#333333",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            fontWeight: 500,
            opacity: 1
          }}
          wrapperStyle={{ zIndex: 1000 }}
          cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
          itemStyle={{ color: "var(--foreground)" }}
          labelStyle={{ fontWeight: 600, marginBottom: "5px" }}
        />
        <Legend 
          verticalAlign="top" 
          height={40} 
          wrapperStyle={{ 
            paddingTop: "0px",
            marginBottom: "15px",
            paddingBottom: "5px"
          }} 
          iconType="circle"
          iconSize={10}
          formatter={(value, entry) => {
            return <span style={{ color: 'var(--foreground)', margin: '0 10px', fontSize: '14px', fontWeight: 500 }}>{value}</span>;
          }}
        />
        <Bar 
          dataKey="Inversión" 
          stackId="a" 
          fill="#4f46e5" 
          radius={[0, 0, 0, 0]}
          barSize={barSize}
        />
        <Bar 
          dataKey="Intereses" 
          stackId="a" 
          fill="#10b981" 
          radius={[4, 4, 0, 0]}
          barSize={barSize}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}


import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useEffect, useState } from "react"

export function InvestmentChart({ result }) {
  // Detectar el modo oscuro para aplicar estilos específicos
  const [isDarkMode, setIsDarkMode] = useState(false)
  // Estado para detectar si estamos en vista móvil
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    // Comprobar si el tema actual es oscuro
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark')
      setIsDarkMode(isDark)
    }
    
    // Comprobar inicialmente
    checkDarkMode()
    
    // Configurar un observador para detectar cambios en el tema
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    // Función para detectar si estamos en vista móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640) // 640px es el breakpoint sm en Tailwind
    }
    
    // Comprobar inicialmente
    checkMobile()
    
    // Añadir listener para cambios de tamaño de ventana
    window.addEventListener('resize', checkMobile)
    
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', checkMobile)
    }
  }, [])
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
    // Si estamos en móvil y el valor es mayor a 10000, usamos formato abreviado
    if (isMobile && value >= 10000) {
      if (value >= 1000000000) {
        return (value / 1000000000).toFixed(1).replace('.0', '') + 'B€'
      } else if (value >= 1000000) {
        return (value / 1000000).toFixed(1).replace('.0', '') + 'M€'
      } else if (value >= 1000) {
        return (value / 1000).toFixed(1).replace('.0', '') + 'K€'
      }
    }
    
    // En caso contrario, usamos el formato normal
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
            style: { fill: isDarkMode ? "#e2e8f0" : "#334155" }
          }} 
          tickMargin={15} 
          stroke={isDarkMode ? "#475569" : "#cbd5e1"}
          tick={{ fill: isDarkMode ? "#e2e8f0" : "#334155" }}
          axisLine={{ strokeWidth: 1 }}
        />
        <YAxis
          tickFormatter={formatCurrency}
          width={isMobile ? 80 : 120}
          tickMargin={10}
          stroke={isDarkMode ? "#475569" : "#cbd5e1"}
          tick={{ fill: isDarkMode ? "#e2e8f0" : "#334155" }}
          axisLine={{ strokeWidth: 1 }}
        />
        <Tooltip
          formatter={(value, name) => [formatCurrency(value), name]}
          labelFormatter={(label) => `Año ${label}`}
          contentStyle={{ 
            padding: "12px", 
            borderRadius: "8px",
            backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
            backdropFilter: "none",
            border: `1px solid ${isDarkMode ? "#334155" : "#e2e8f0"}`,
            color: isDarkMode ? "#e2e8f0" : "#334155",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            fontWeight: 500,
            opacity: 1
          }}
          wrapperStyle={{ zIndex: 1000 }}
          cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
          itemStyle={{ color: isDarkMode ? "#e2e8f0" : "#334155" }}
          labelStyle={{ fontWeight: 600, marginBottom: "5px", color: isDarkMode ? "#e2e8f0" : "#334155" }}
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
            return <span style={{ color: isDarkMode ? "#e2e8f0" : "#334155", margin: '0 10px', fontSize: '14px', fontWeight: 500 }}>{value}</span>;
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


"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface YearlyBreakdownProps {
  yearlyData: {
    year: number
    startBalance: number
    contribution: number
    interest: number
    endBalance: number
  }[]
}

export function YearlyBreakdown({ yearlyData }: YearlyBreakdownProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Año</TableHead>
            <TableHead>Balance Inicial</TableHead>
            <TableHead>Aportaciones</TableHead>
            <TableHead>Intereses</TableHead>
            <TableHead>Balance Final</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {yearlyData.map((data) => (
            <TableRow key={data.year}>
              <TableCell>{data.year}</TableCell>
              <TableCell>{formatCurrency(data.startBalance)}</TableCell>
              <TableCell>{formatCurrency(data.contribution)}</TableCell>
              <TableCell>{formatCurrency(data.interest)}</TableCell>
              <TableCell className="font-medium">{formatCurrency(data.endBalance)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


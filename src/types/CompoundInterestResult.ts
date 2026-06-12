export interface YearlyBreakdownRow {
  year: number
  startBalance: number
  contribution: number
  interest: number
  endBalance: number
}

export interface CompoundInterestResult {
  years: number[]
  totalInvested: number[]
  totalInterest: number[]
  totalAmount: number[]
  yearlyData: YearlyBreakdownRow[]
  finalAmount: number
  totalContributions: number
  totalInterestEarned: number
}

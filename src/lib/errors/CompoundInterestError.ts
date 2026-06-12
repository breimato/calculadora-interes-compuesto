export const CompoundInterestErrorCode = {
  INVALID_INPUT: 'INVALID_INPUT',
} as const

export type CompoundInterestErrorCode =
  (typeof CompoundInterestErrorCode)[keyof typeof CompoundInterestErrorCode]

export class CompoundInterestError extends Error {
  readonly code: CompoundInterestErrorCode

  constructor(code: CompoundInterestErrorCode, message: string) {
    super(message)
    this.name = 'CompoundInterestError'
    this.code = code
  }
}

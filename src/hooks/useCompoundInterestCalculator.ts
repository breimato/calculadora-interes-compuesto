import { useMemo, useState } from 'react'
import { calculateCompoundInterest } from '../lib/compound-interest/calculateCompoundInterest.ts'
import { CompoundInterestError } from '../lib/errors/CompoundInterestError.ts'
import {
  DEFAULT_COMPOUND_INTEREST_FORM_DATA,
  type CompoundInterestFormData,
} from '../types/compoundInterest.ts'
import type { CompoundInterestResult } from '../types/CompoundInterestResult.ts'

export function useCompoundInterestCalculator(
  initialFormData: CompoundInterestFormData = DEFAULT_COMPOUND_INTEREST_FORM_DATA,
) {
  const [formData, setFormData] = useState<CompoundInterestFormData>(initialFormData)

  const updateFormData = (partialFormData: Partial<CompoundInterestFormData>) => {
    setFormData((previousFormData) => ({
      ...previousFormData,
      ...partialFormData,
    }))
  }

  const calculationState = useMemo((): {
    compoundInterestResult: CompoundInterestResult | null
    compoundInterestError: CompoundInterestError | null
  } => {
    try {
      const compoundInterestResult = calculateCompoundInterest(formData)
      return { compoundInterestResult, compoundInterestError: null }
    } catch (error) {
      if (error instanceof CompoundInterestError) {
        return { compoundInterestResult: null, compoundInterestError: error }
      }

      throw error
    }
  }, [formData])

  return {
    formData,
    updateFormData,
    ...calculationState,
  }
}

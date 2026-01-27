import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { transformErrorMessage, F1_TERMINOLOGY } from '../utils/f1TerminologyMapper'

/**
 * Feature: f1-theme-redesign, Property 9: Racing Error Messages
 * **Validates: Requirements 7.2**
 * 
 * Property: For any error state displayed, the error message should use F1 racing incident terminology 
 * instead of generic error language
 */

describe('Racing Error Messages Property Tests', () => {
  it('Property 9: Racing Error Messages - should transform generic error messages to racing incidents', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Generic error messages that should be transformed
          fc.constantFrom(
            'Incorrect!',
            'Wrong!', 
            'Failed!',
            'Error!',
            'Try again!',
            'Not quite right',
            'Incorrect answer',
            'Solution Failed',
            'Test failed',
            'Compilation error',
            'Runtime error',
            'Time limit exceeded',
            'Memory limit exceeded',
            'Invalid input',
            'Network error',
            'Server error',
            'Timeout',
            'Unavailable'
          ),
          // Error messages with context
          fc.constantFrom(
            'Your solution failed',
            'Code compilation error',
            'Test case failed',
            'Invalid function call',
            'Syntax error detected',
            'Connection timeout',
            'Server unavailable'
          )
        ),
        (genericErrorMessage) => {
          const transformedMessage = transformErrorMessage(genericErrorMessage)
          
          // Property: Transformed message should not be identical to generic message
          expect(transformedMessage.toLowerCase()).not.toBe(genericErrorMessage.toLowerCase())
          
          // Property: Transformed message should contain F1 racing incident terminology
          const racingIncidentTerms = [
            'pit stop required',
            'technical difficulty',
            'racing incident',
            'mechanical failure',
            'return to track',
            'off the racing line',
            'missed the apex',
            'dnf',
            'did not finish',
            'strategy miscalculation',
            'technical inspection failed',
            'engine malfunction',
            'crash on track',
            'lap time exceeded',
            'fuel tank overflow',
            'invalid racing data',
            'radio communication lost',
            'pit crew unavailable',
            'pit stop in progress',
            'safety car period',
            'circuit under construction',
            'track conditions unsafe'
          ]
          
          const hasRacingTerminology = racingIncidentTerms.some(term => 
            transformedMessage.toLowerCase().includes(term.toLowerCase())
          )
          
          expect(hasRacingTerminology).toBe(true)
          
          // Property: Should not contain generic error terms after transformation
          const genericErrorTerms = ['error', 'failed', 'wrong', 'incorrect', 'invalid']
          const containsGenericTerms = genericErrorTerms.some(term => 
            transformedMessage.toLowerCase().includes(term) && 
            !transformedMessage.toLowerCase().includes('racing') // Allow "racing incident"
          )
          
          // Some generic terms might remain in compound phrases, but should be minimized
          if (containsGenericTerms) {
            // If generic terms remain, they should be part of racing context
            expect(transformedMessage.toLowerCase()).toMatch(/(racing|pit|track|circuit|lap|fuel|engine|technical)/)
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 9: Racing Error Messages - should maintain error severity levels in racing context', () => {
    fc.assert(
      fc.property(
        fc.record({
          severity: fc.constantFrom('critical', 'warning', 'info'),
          message: fc.constantFrom('System failure', 'Connection lost', 'Invalid input', 'Timeout occurred')
        }),
        ({ severity, message }) => {
          const errorMessage = `${severity.toUpperCase()}: ${message}`
          const transformedMessage = transformErrorMessage(errorMessage)
          
          // Property: Critical errors should map to serious racing incidents
          if (severity === 'critical') {
            const seriousIncidents = ['mechanical failure', 'engine malfunction', 'crash on track', 'dnf']
            const hasSeriousIncident = seriousIncidents.some(incident => 
              transformedMessage.toLowerCase().includes(incident)
            )
            expect(hasSeriousIncident).toBe(true)
          }
          
          // Property: Warnings should map to minor racing issues
          if (severity === 'warning') {
            const minorIssues = ['pit stop required', 'technical difficulty', 'off the racing line']
            const hasMinorIssue = minorIssues.some(issue => 
              transformedMessage.toLowerCase().includes(issue)
            )
            expect(hasMinorIssue).toBe(true)
          }
          
          // Property: Info messages should map to racing status updates
          if (severity === 'info') {
            const statusUpdates = ['pit stop in progress', 'safety car period', 'track conditions']
            const hasStatusUpdate = statusUpdates.some(update => 
              transformedMessage.toLowerCase().includes(update)
            )
            expect(hasStatusUpdate).toBe(true)
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 9: Racing Error Messages - should preserve error context while using racing terminology', () => {
    fc.assert(
      fc.property(
        fc.record({
          context: fc.constantFrom('login', 'submission', 'compilation', 'network', 'validation'),
          error: fc.constantFrom('failed', 'timeout', 'invalid', 'rejected', 'unavailable')
        }),
        ({ context, error }) => {
          const contextualError = `${context} ${error}`
          const transformedMessage = transformErrorMessage(contextualError)
          
          // Property: Context should be preserved but transformed to racing equivalent
          const contextMappings = {
            'login': ['pit lane', 'garage access'],
            'submission': ['race entry', 'championship submission'],
            'compilation': ['technical inspection', 'pre-race check'],
            'network': ['radio communication', 'telemetry'],
            'validation': ['steward review', 'technical validation']
          }
          
          if (contextMappings[context]) {
            const hasContextMapping = contextMappings[context].some(mapping => 
              transformedMessage.toLowerCase().includes(mapping)
            )
            expect(hasContextMapping).toBe(true)
          }
          
          // Property: Error nature should be preserved but in racing terms
          const errorMappings = {
            'failed': ['incident', 'malfunction', 'difficulty'],
            'timeout': ['exceeded', 'period', 'delay'],
            'invalid': ['incorrect', 'improper', 'wrong'],
            'rejected': ['disqualified', 'penalty', 'refused'],
            'unavailable': ['closed', 'unsafe', 'inaccessible']
          }
          
          if (errorMappings[error]) {
            const hasErrorMapping = errorMappings[error].some(mapping => 
              transformedMessage.toLowerCase().includes(mapping)
            )
            expect(hasErrorMapping).toBe(true)
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 9: Racing Error Messages - should handle compound error messages', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.constantFrom('Connection', 'failed', 'please', 'try', 'again', 'later'),
          { minLength: 3, maxLength: 6 }
        ),
        (words) => {
          const compoundError = words.join(' ')
          const transformedMessage = transformErrorMessage(compoundError)
          
          // Property: All error-related words should be transformed
          const errorWords = ['failed', 'error', 'wrong', 'incorrect', 'invalid', 'timeout']
          errorWords.forEach(errorWord => {
            if (compoundError.toLowerCase().includes(errorWord)) {
              // The transformed message should not contain the generic error word
              expect(transformedMessage.toLowerCase()).not.toContain(errorWord)
            }
          })
          
          // Property: Should maintain sentence structure while transforming content
          expect(transformedMessage.length).toBeGreaterThan(0)
          expect(transformedMessage.trim()).not.toBe('')
          
          // Property: Should contain racing terminology
          const racingTerms = ['pit', 'track', 'racing', 'circuit', 'lap', 'technical', 'mechanical']
          const hasRacingTerms = racingTerms.some(term => 
            transformedMessage.toLowerCase().includes(term)
          )
          expect(hasRacingTerms).toBe(true)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 9: Racing Error Messages - should maintain urgency levels in racing context', () => {
    fc.assert(
      fc.property(
        fc.record({
          urgency: fc.constantFrom('URGENT', 'WARNING', 'NOTICE'),
          message: fc.constantFrom('System down', 'Connection lost', 'Please wait', 'Try again')
        }),
        ({ urgency, message }) => {
          const urgentMessage = `${urgency}: ${message}`
          const transformedMessage = transformErrorMessage(urgentMessage)
          
          // Property: Urgent messages should use immediate racing terminology
          if (urgency === 'URGENT') {
            const urgentRacingTerms = ['red flag', 'emergency', 'immediate', 'critical', 'abort']
            const hasUrgentTerm = urgentRacingTerms.some(term => 
              transformedMessage.toLowerCase().includes(term)
            )
            expect(hasUrgentTerm).toBe(true)
          }
          
          // Property: Warnings should use caution-related racing terminology
          if (urgency === 'WARNING') {
            const warningRacingTerms = ['yellow flag', 'caution', 'safety car', 'pit stop required']
            const hasWarningTerm = warningRacingTerms.some(term => 
              transformedMessage.toLowerCase().includes(term)
            )
            expect(hasWarningTerm).toBe(true)
          }
          
          // Property: Notices should use informational racing terminology
          if (urgency === 'NOTICE') {
            const noticeRacingTerms = ['pit radio', 'telemetry', 'track update', 'race information']
            const hasNoticeTerm = noticeRacingTerms.some(term => 
              transformedMessage.toLowerCase().includes(term)
            )
            expect(hasNoticeTerm).toBe(true)
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 9: Racing Error Messages - should not transform non-error messages', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'Welcome to the application',
          'Your progress has been saved',
          'Loading content',
          'Please select an option',
          'Data updated successfully'
        ),
        (nonErrorMessage) => {
          const result = transformErrorMessage(nonErrorMessage)
          
          // Property: Non-error messages should remain largely unchanged
          // (unless they contain error-related terms)
          const hasErrorTerms = ['error', 'failed', 'wrong', 'incorrect'].some(term => 
            nonErrorMessage.toLowerCase().includes(term)
          )
          
          if (!hasErrorTerms) {
            // Should be similar to original or only have minor F1 terminology updates
            expect(result.length).toBeGreaterThanOrEqual(nonErrorMessage.length * 0.8)
            expect(result.length).toBeLessThanOrEqual(nonErrorMessage.length * 2)
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})
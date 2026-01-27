import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { transformToF1Terminology, F1_TERMINOLOGY } from '../utils/f1TerminologyMapper'

/**
 * Feature: f1-theme-redesign, Property 4: Racing Terminology Replacement
 * **Validates: Requirements 2.2, 7.1**
 * 
 * Property: For any text content displayed in the application, 
 * the content should use F1 racing terminology and contain no generic or robot-themed language
 */

describe('Racing Terminology Replacement Property Tests', () => {
  it('Property 4: Racing Terminology Replacement - should transform generic terms to F1 racing terminology', () => {
    fc.assert(
      fc.property(
        // Generate text containing generic terms that should be transformed
        fc.oneof(
          // Navigation terms
          fc.constantFrom('Dashboard', 'Admin', 'Victory', 'Landing', 'Level', 'Challenge', 'Problem', 'Question'),
          // Success messages
          fc.constantFrom('Correct!', 'Perfect!', 'Excellent!', 'Great job!', 'Success!', 'Completed!', 'Solved!'),
          // Error messages  
          fc.constantFrom('Incorrect!', 'Wrong!', 'Failed!', 'Error!', 'Try again!', 'Not quite right'),
          // Instructions
          fc.constantFrom('Submit', 'Test Code', 'Try Again', 'Reset', 'Next', 'Continue', 'Start'),
          // Progress terms
          fc.constantFrom('Progress', 'Level', 'Score', 'Points', 'Achievement', 'Complete', 'Unlock'),
          // Technical terms
          fc.constantFrom('Algorithm', 'Code', 'Function', 'Variable', 'Array', 'String', 'Debug', 'Test'),
          // UI terms
          fc.constantFrom('Button', 'Menu', 'Modal', 'Form', 'Input', 'Output', 'Display', 'Panel'),
          // Robot-themed terms that should be eliminated
          fc.constantFrom('robot', 'Chitti', 'android', 'mechanical', 'circuits', 'sensors', 'optical')
        ),
        (genericTerm) => {
          const transformedText = transformToF1Terminology(genericTerm)
          
          // Property: Transformed text should not contain the original generic term
          expect(transformedText.toLowerCase()).not.toBe(genericTerm.toLowerCase())
          
          // Property: Transformed text should contain F1 racing terminology
          const hasF1Terminology = Object.values(F1_TERMINOLOGY).some(category =>
            Object.values(category).some(f1Term => 
              transformedText.toLowerCase().includes(f1Term.toLowerCase())
            )
          )
          
          // If the term was in our mapping, it should be transformed
          const isInMapping = Object.values(F1_TERMINOLOGY).some(category =>
            Object.keys(category).some(originalTerm => 
              originalTerm.toLowerCase() === genericTerm.toLowerCase()
            )
          )
          
          if (isInMapping) {
            expect(hasF1Terminology).toBe(true)
          }
          
          // Property: No robot-themed terms should remain
          const robotTerms = ['robot', 'chitti', 'android', 'mechanical', 'circuits', 'sensors', 'optical']
          robotTerms.forEach(robotTerm => {
            expect(transformedText.toLowerCase()).not.toContain(robotTerm)
          })
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 4: Racing Terminology Replacement - should preserve case when transforming', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('DASHBOARD', 'Dashboard', 'dashboard', 'SUCCESS', 'Success', 'success'),
        (term) => {
          const transformedText = transformToF1Terminology(term)
          
          // Property: Case should be preserved in transformation
          if (term === term.toUpperCase()) {
            // If original was all uppercase, result should be uppercase
            expect(transformedText).toBe(transformedText.toUpperCase())
          } else if (term[0] === term[0].toUpperCase()) {
            // If original was capitalized, result should be capitalized
            expect(transformedText[0]).toBe(transformedText[0].toUpperCase())
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 4: Racing Terminology Replacement - should handle sentences with multiple terms', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.constantFrom('Submit', 'your', 'code', 'solution', 'to', 'complete', 'the', 'challenge'),
          { minLength: 3, maxLength: 8 }
        ),
        (words) => {
          const sentence = words.join(' ')
          const transformedSentence = transformToF1Terminology(sentence)
          
          // Property: All transformable terms should be replaced
          const originalTerms = ['Submit', 'code', 'solution', 'complete', 'challenge']
          originalTerms.forEach(term => {
            if (sentence.includes(term)) {
              // The transformed sentence should not contain the original generic term
              expect(transformedSentence.toLowerCase()).not.toContain(term.toLowerCase())
            }
          })
          
          // Property: Sentence structure should be maintained
          const originalWordCount = sentence.split(' ').length
          const transformedWordCount = transformedSentence.split(' ').length
          
          // Word count might change due to multi-word replacements, but should be reasonable
          expect(transformedWordCount).toBeGreaterThanOrEqual(originalWordCount)
          expect(transformedWordCount).toBeLessThanOrEqual(originalWordCount * 3) // Allow for reasonable expansion
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 4: Racing Terminology Replacement - should not transform non-generic terms', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('hello', 'world', 'example', 'random', 'specific', 'unique', 'custom'),
        (nonGenericTerm) => {
          const transformedText = transformToF1Terminology(nonGenericTerm)
          
          // Property: Non-generic terms should remain unchanged
          expect(transformedText).toBe(nonGenericTerm)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 4: Racing Terminology Replacement - should handle empty and null inputs gracefully', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(''),
          fc.constant(null),
          fc.constant(undefined),
          fc.constant('   '), // whitespace only
        ),
        (input) => {
          const result = transformToF1Terminology(input)
          
          // Property: Should handle edge cases gracefully without throwing
          if (input === null || input === undefined) {
            expect(result).toBe(input)
          } else if (input === '') {
            expect(result).toBe('')
          } else if (input.trim() === '') {
            expect(result).toBe(input) // Preserve whitespace
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 4: Racing Terminology Replacement - should maintain F1 terminology consistency', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'Submit your solution',
          'Code challenge complete',
          'Algorithm test passed',
          'Debug the problem',
          'Function execution error'
        ),
        (phrase) => {
          const transformedPhrase = transformToF1Terminology(phrase)
          
          // Property: All F1 terms should be from our defined terminology
          const allF1Terms = Object.values(F1_TERMINOLOGY).flatMap(category => Object.values(category))
          
          // Check that transformed terms are legitimate F1 terminology
          const words = transformedPhrase.toLowerCase().split(/\s+/)
          words.forEach(word => {
            // Skip common words like 'the', 'a', 'your', etc.
            const commonWords = ['the', 'a', 'an', 'your', 'to', 'of', 'in', 'on', 'at', 'for', 'with', 'by']
            if (!commonWords.includes(word) && word.length > 2) {
              // If it's not a common word, it should either be:
              // 1. Part of our F1 terminology, or
              // 2. An unchanged technical term that wasn't in our mapping
              const isF1Term = allF1Terms.some(f1Term => 
                f1Term.toLowerCase().includes(word) || word.includes(f1Term.toLowerCase())
              )
              const wasOriginalTerm = phrase.toLowerCase().includes(word)
              
              // At least one should be true
              expect(isF1Term || wasOriginalTerm).toBe(true)
            }
          })
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})
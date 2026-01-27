import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import * as fc from 'fast-check'
import { BrowserRouter } from 'react-router-dom'
import StoryModal from '../components/StoryModal'
import FinalPasswordModal from '../components/FinalPasswordModal'
import { ProgressProvider } from '../context/ProgressContext'
import { MotionProvider } from '../context/MotionContext'

// Test wrapper component
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <MotionProvider>
      <ProgressProvider>
        {children}
      </ProgressProvider>
    </MotionProvider>
  </BrowserRouter>
)

describe('Pit Stop Modal Theming Property Tests', () => {
  /**
   * **Feature: f1-theme-redesign, Property 6: Pit Stop Modal Theming**
   * **Validates: Requirements 3.2**
   * 
   * For any modal dialog displayed, the modal should use pit stop interface styling 
   * with F1 team branding elements
   */
  it('should display F1 pit stop theming in StoryModal', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 50 }),
          content: fc.string({ minLength: 10, maxLength: 200 }),
          clue: fc.constantFrom('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z')
        }),
        (story) => {
          const mockOnClose = vi.fn()

          render(
            <TestWrapper>
              <StoryModal story={story} onClose={mockOnClose} />
            </TestWrapper>
          )

          // Verify F1 pit stop theming elements
          expect(screen.getByText(/PIT RADIO/i)).toBeInTheDocument()
          expect(screen.getByText(/Championship Clue/i)).toBeInTheDocument()

          // Verify F1 racing terminology is used
          const pitRadioElement = screen.getByText(new RegExp(`PIT RADIO: ${story.title}`, 'i'))
          expect(pitRadioElement).toBeInTheDocument()

          // Verify racing-themed button text
          expect(screen.getByText(/Reveal Championship Clue/i)).toBeInTheDocument()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should display F1 pit stop theming in FinalPasswordModal', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'), { minLength: 3, maxLength: 8 }),
        fc.string({ minLength: 3, maxLength: 10 }).map(s => s.toUpperCase()),
        (clues, expectedPassword) => {
          const mockOnClose = vi.fn()
          const mockOnSuccess = vi.fn()

          render(
            <TestWrapper>
              <FinalPasswordModal 
                clues={clues} 
                expectedPassword={expectedPassword}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
              />
            </TestWrapper>
          )

          // Verify F1 championship theming elements
          expect(screen.getByText(/Championship Finale/i)).toBeInTheDocument()
          expect(screen.getByText(/conquered all circuits/i)).toBeInTheDocument()
          expect(screen.getByText(/championship clues/i)).toBeInTheDocument()
          expect(screen.getByText(/claim your title/i)).toBeInTheDocument()

          // Verify F1 racing terminology in buttons
          expect(screen.getByText(/Claim Championship/i)).toBeInTheDocument()
          expect(screen.getByText(/Return to Pit/i)).toBeInTheDocument()

          // Verify championship code input placeholder
          expect(screen.getByPlaceholderText(/championship code/i)).toBeInTheDocument()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should use F1 color scheme in modal styling', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 30 }),
          content: fc.string({ minLength: 5, maxLength: 100 }),
          clue: fc.constantFrom('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z')
        }),
        (story) => {
          const mockOnClose = vi.fn()

          const { container } = render(
            <TestWrapper>
              <StoryModal story={story} onClose={mockOnClose} />
            </TestWrapper>
          )

          // Check for F1 color scheme elements in the DOM
          const modalElement = container.querySelector('[style*="linear-gradient"]')
          expect(modalElement).toBeTruthy()

          // Verify racing-themed visual elements are present
          const racingStripes = container.querySelectorAll('[class*="bg-yellow-400"]')
          expect(racingStripes.length).toBeGreaterThan(0)
        }
      ),
      { numRuns: 100 }
    )
  })
})
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import * as fc from 'fast-check'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import { ProgressProvider } from '../context/ProgressContext'
import { MotionProvider } from '../context/MotionContext'

// Mock the admin logger
vi.mock('../utils/adminLogger', () => ({
  logPageView: vi.fn()
}))

// Test wrapper component
const TestWrapper = ({ children, progressValue, motionValue }) => (
  <BrowserRouter>
    <MotionProvider>
      <ProgressProvider>
        {children}
      </ProgressProvider>
    </MotionProvider>
  </BrowserRouter>
)

describe('Championship Progress Format Property Tests', () => {
  /**
   * **Feature: f1-theme-redesign, Property 7: Championship Progress Format**
   * **Validates: Requirements 6.1**
   * 
   * For any progress indicator displayed, the indicator should show F1 championship data 
   * including points, positions, and racing terminology
   */
  it('should display F1 championship terminology in progress indicators', () => {
    fc.assert(
      fc.property(
        fc.boolean(), // reducedMotion
        (reducedMotion) => {
          render(
            <TestWrapper>
              <Dashboard />
            </TestWrapper>
          )

          // Verify F1 championship terminology is used - use getAllByText for all elements that may appear multiple times
          const racingChampionshipElements = screen.getAllByText('RACING CHAMPIONSHIP')
          expect(racingChampionshipElements.length).toBeGreaterThan(0)
          
          const championshipProgressElements = screen.getAllByText('Championship Progress')
          expect(championshipProgressElements.length).toBeGreaterThan(0)
          
          const championshipStandingsElements = screen.getAllByText('Championship Standings')
          expect(championshipStandingsElements.length).toBeGreaterThan(0)
          
          // Verify specific circuit progress text - use getAllByText for all text elements
          const circuitChallengeElements = screen.getAllByText(/5 Circuits • 28 Challenges • 1 Championship Title/)
          expect(circuitChallengeElements.length).toBeGreaterThan(0)
          
          const circuitsConqueredElements = screen.getAllByText(/circuits conquered/)
          expect(circuitsConqueredElements.length).toBeGreaterThan(0)
          
          // Verify F1 circuit names are displayed in standings section - use getAllByText for all circuit names
          const monacoElements = screen.getAllByText('MONACO')
          expect(monacoElements.length).toBeGreaterThan(0)
          
          const silverstoneElements = screen.getAllByText('SILVERSTONE')
          expect(silverstoneElements.length).toBeGreaterThan(0)
          
          const monzaElements = screen.getAllByText('MONZA')
          expect(monzaElements.length).toBeGreaterThan(0)
          
          const spaElements = screen.getAllByText('SPA')
          expect(spaElements.length).toBeGreaterThan(0)
          
          const suzukaElements = screen.getAllByText('SUZUKA')
          expect(suzukaElements.length).toBeGreaterThan(0)

          // Verify racing terminology in level cards - use getAllByText for all level names
          const monacoGrandPrixElements = screen.getAllByText('MONACO GRAND PRIX')
          expect(monacoGrandPrixElements.length).toBeGreaterThan(0)
          
          const silverstoneCircuitElements = screen.getAllByText('SILVERSTONE CIRCUIT')
          expect(silverstoneCircuitElements.length).toBeGreaterThan(0)
          
          const monzaSpeedwayElements = screen.getAllByText('MONZA SPEEDWAY')
          expect(monzaSpeedwayElements.length).toBeGreaterThan(0)
          
          const spaFrancorchampsElements = screen.getAllByText('SPA-FRANCORCHAMPS')
          expect(spaFrancorchampsElements.length).toBeGreaterThan(0)
          
          const suzukaChampionshipElements = screen.getAllByText('SUZUKA CHAMPIONSHIP')
          expect(suzukaChampionshipElements.length).toBeGreaterThan(0)

          // Verify racing status terminology using queryAll to handle multiple instances
          const victoryElements = screen.queryAllByText(/VICTORY/i)
          const raceReadyElements = screen.queryAllByText(/RACE READY/i)
          const lockedElements = screen.queryAllByText(/LOCKED/i)
          
          // At least one status should be present
          expect(victoryElements.length + raceReadyElements.length + lockedElements.length).toBeGreaterThan(0)
        }
      ),
      { numRuns: 10 }
    )
  })

  it('should use F1 racing terminology in progress descriptions', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (reducedMotion) => {
          render(
            <TestWrapper>
              <Dashboard />
            </TestWrapper>
          )

          // Verify F1 racing descriptions are used - use getAllByText for all elements that may appear multiple times
          const qualifyingElements = screen.getAllByText('Qualifying Session')
          expect(qualifyingElements.length).toBeGreaterThan(0)
          
          const technicalElements = screen.getAllByText('Technical Section')
          expect(technicalElements.length).toBeGreaterThan(0)
          
          const strategyElements = screen.getAllByText('Strategy Planning')
          expect(strategyElements.length).toBeGreaterThan(0)
          
          const championshipRaceElements = screen.getAllByText('Championship Race')
          expect(championshipRaceElements.length).toBeGreaterThan(0)

          // Verify racing-themed subtitles - use getAllByText for all elements
          const precisionQualifyingElements = screen.getAllByText('Precision Qualifying')
          expect(precisionQualifyingElements.length).toBeGreaterThan(0)
          
          const technicalChallengeElements = screen.getAllByText('Technical Challenge')
          expect(technicalChallengeElements.length).toBeGreaterThan(0)
          
          const strategyPredictionElements = screen.getAllByText('Strategy Prediction')
          expect(strategyPredictionElements.length).toBeGreaterThan(0)
          
          const championshipPointsElements = screen.getAllByText('Championship Points')
          expect(championshipPointsElements.length).toBeGreaterThan(0)
          
          const titleDeciderElements = screen.getAllByText('Title Decider')
          expect(titleDeciderElements.length).toBeGreaterThan(0)
        }
      ),
      { numRuns: 10 }
    )
  })
})
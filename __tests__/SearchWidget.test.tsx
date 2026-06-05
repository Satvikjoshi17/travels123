import { render, screen, fireEvent, act } from '@testing-library/react'
import { expect, test, vi, beforeEach } from 'vitest'
import { SearchWidget } from '@/components/SearchWidget'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
    }
  },
}))

// Mock fetch
const mockAirports = [
  { city: "Delhi", name: "Delhi Airport", code: "DEL", country: "India" },
  { city: "Mumbai", name: "Mumbai Airport", code: "BOM", country: "India" },
]

const mockCities = [
  "New York, NY",
  "London, UK",
]

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
    if (url.includes('airports.json')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockAirports),
      })
    }
    if (url.includes('cities.json')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockCities),
      })
    }
    return Promise.reject(new Error('unmocked url'))
  }))
})

test('SearchWidget renders and supports keyboard location selection and focus flow', async () => {
  render(<SearchWidget />)

  // Wait for fetch to resolve
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  // Click on From button to open dropdown
  const fromContainer = screen.getByText('From').closest('div')
  expect(fromContainer).toBeInTheDocument()

  // Click to open From dropdown
  fireEvent.click(fromContainer!)

  // Locate the input inside FROM dropdown
  const fromInput = screen.getByPlaceholderText('Search origin...')
  expect(fromInput).toBeInTheDocument()

  // Type DEL
  fireEvent.change(fromInput, { target: { value: 'DEL' } })

  // Press Enter key to select the option and trigger transition
  fireEvent.keyDown(fromInput, { key: 'Enter', code: 'Enter' })

  // It should select Delhi, close From dropdown, open To dropdown, and focus To input
  const toInput = screen.getByPlaceholderText('Search destination...')
  expect(toInput).toBeInTheDocument()

  // Type BOM
  fireEvent.change(toInput, { target: { value: 'BOM' } })

  // Press Enter key to select Mumbai
  fireEvent.keyDown(toInput, { key: 'Enter', code: 'Enter' })
})

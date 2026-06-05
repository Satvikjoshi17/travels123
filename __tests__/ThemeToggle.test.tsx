import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { ThemeProvider } from 'next-themes'
import ThemeToggle from '@/components/ThemeToggle'

test('ThemeToggle renders correctly', () => {
  render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  )
  const button = screen.getByRole('button')
  expect(button).toBeInTheDocument()
})

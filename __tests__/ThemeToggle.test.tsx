import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { ThemeProvider } from 'next-themes'
import { ThemeToggle } from '@/components/ThemeToggle'

test('ThemeToggle renders correctly', () => {
  const { container } = render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  )
  const span = container.querySelector('span')
  expect(span).toBeInTheDocument()
})

export const MOCK_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
} as const

export function generateMockToken(): string {
  return `mock-token-${crypto.randomUUID()}`
}

export function validateCredentials(
  username: string,
  password: string,
): boolean {
  return (
    username === MOCK_CREDENTIALS.username &&
    password === MOCK_CREDENTIALS.password
  )
}

export function isValidToken(token: string | null | undefined): boolean {
  return typeof token === 'string' && token.startsWith('mock-token-')
}

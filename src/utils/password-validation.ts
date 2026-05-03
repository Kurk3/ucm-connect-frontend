export interface PasswordRequirement {
  key: string
  label: string
  test: (password: string) => boolean
}

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    key: 'minLength',
    label: 'Minimálne 8 znakov',
    test: (p) => p.length >= 8
  },
  {
    key: 'lowercase',
    label: 'Aspoň jedno malé písmeno (a-z)',
    test: (p) => /[a-z]/.test(p)
  },
  {
    key: 'uppercase',
    label: 'Aspoň jedno veľké písmeno (A-Z)',
    test: (p) => /[A-Z]/.test(p)
  },
  {
    key: 'digit',
    label: 'Aspoň jedna číslica (0-9)',
    test: (p) => /\d/.test(p)
  },
  {
    key: 'special',
    label: 'Aspoň jeden špeciálny znak (napr. @, #, !, $)',
    test: (p) => /[^A-Za-z\d\s]/.test(p)
  }
]

export function validatePassword(password: string): string | null {
  for (const req of PASSWORD_REQUIREMENTS) {
    if (!req.test(password)) {
      return req.label
    }
  }
  return null
}

export function parseBackendErrors(data: any): string | null {
  if (data?.details && typeof data.details === 'object') {
    const messages = Object.values(data.details) as string[]
    if (messages.length > 0) {
      return messages.join('. ')
    }
  }
  return data?.message || null
}

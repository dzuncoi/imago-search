const DATE_PATTERN = /^(\d{2})\.(\d{2})\.(\d{4})$/

// Note: we assume the date format return from data is always follow the above pattern, eg 01.01.2026
// we return null for all other different types of inputs
// TODO: should write down this assumption in the submission
const parseDate = (input: string) => {
  const matches = input.match(DATE_PATTERN)
  if (!matches) return null

  const day = Number(matches[1])
  const month = Number(matches[2])
  const year = Number(matches[3])

  // construct UTC time from day-month-year to check validity
  const date = new Date(Date.UTC(year, month - 1, day))
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  )
    return null

  return `${matches[3]}-${matches[2]}-${matches[1]}`
}

export { parseDate }

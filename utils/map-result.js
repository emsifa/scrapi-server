const resolveKey = (key) => key.split('(').shift()

const mapResult = (schema, data) => {
  const result = {}
  for (let key in schema) {
    const field = resolveKey(key)
    const selector = schema[key]
    const value = data[field]

    if (typeof selector === 'string') {
      result[field] = typeof value === 'undefined' ? null : value
    } else if (Array.isArray(selector)) {
      const itemSchema = selector[0]
      result[field] = (value || []).map(val => mapResult(itemSchema, val))
    } else if (typeof selector === 'object') {
      result[field] = mapResult(selector, value)
    }
  }
  return result
}

module.exports = mapResult

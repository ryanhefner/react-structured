const warnedMessages = new Set<string>()

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const asArray = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : value === undefined ? [] : [value]

const hasValue = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return false
  }

  if (typeof value === 'string') {
    return value.trim().length > 0
  }

  if (Array.isArray(value)) {
    return value.length > 0
  }

  return true
}

const shouldWarn = (validate?: boolean) => {
  const nodeEnv = getNodeEnv()

  return validate !== false && nodeEnv !== undefined && nodeEnv !== 'production'
}

const getNodeEnv = () =>
  (
    globalThis as typeof globalThis & {
      process?: { env?: { NODE_ENV?: string } }
    }
  ).process?.env?.NODE_ENV

const warnOnce = (message: string) => {
  if (warnedMessages.has(message)) {
    return
  }

  warnedMessages.add(message)
  console.warn(message)
}

const addMissing = (
  warnings: string[],
  condition: boolean,
  message: string,
) => {
  if (!condition) {
    warnings.push(message)
  }
}

const validateProduct = (data: Record<string, unknown>) => {
  const warnings: string[] = []

  addMissing(
    warnings,
    hasValue(data.name),
    'Product rich results require `name`.',
  )
  addMissing(
    warnings,
    hasValue(data.review) ||
      hasValue(data.aggregateRating) ||
      hasValue(data.offers),
    'Product rich results require at least one of `review`, `aggregateRating`, or `offers`.',
  )

  return warnings
}

const validateBreadcrumbList = (data: Record<string, unknown>) => {
  const warnings: string[] = []
  const items = asArray(data.itemListElement)

  addMissing(
    warnings,
    items.length >= 2,
    'Breadcrumb rich results require `itemListElement` with at least two `ListItem` entries.',
  )

  items.forEach((item, index) => {
    if (!isObject(item)) {
      warnings.push(`Breadcrumb item ${index + 1} must be a ListItem object.`)
      return
    }

    addMissing(
      warnings,
      hasValue(item.position),
      `Breadcrumb item ${index + 1} requires \`position\`.`,
    )
    addMissing(
      warnings,
      hasValue(item.name) || (isObject(item.item) && hasValue(item.item.name)),
      `Breadcrumb item ${index + 1} requires \`name\` unless \`item\` is a Thing with a name.`,
    )

    if (index < items.length - 1) {
      addMissing(
        warnings,
        hasValue(item.item),
        `Breadcrumb item ${index + 1} requires \`item\` unless it is the final breadcrumb.`,
      )
    }
  })

  return warnings
}

const validateFAQPage = (data: Record<string, unknown>) => {
  const warnings: string[] = []
  const questions = asArray(data.mainEntity)

  addMissing(
    warnings,
    questions.length > 0,
    'FAQ rich results require `mainEntity` with at least one `Question`.',
  )

  questions.forEach((question, index) => {
    if (!isObject(question)) {
      warnings.push(`FAQ question ${index + 1} must be a Question object.`)
      return
    }

    addMissing(
      warnings,
      hasValue(question.name),
      `FAQ question ${index + 1} requires \`name\`.`,
    )
    addMissing(
      warnings,
      hasValue(question.acceptedAnswer),
      `FAQ question ${index + 1} requires \`acceptedAnswer\`.`,
    )

    asArray(question.acceptedAnswer).forEach((answer, answerIndex) => {
      if (!isObject(answer)) {
        warnings.push(
          `FAQ question ${index + 1} answer ${answerIndex + 1} must be an Answer object.`,
        )
        return
      }

      addMissing(
        warnings,
        hasValue(answer.text),
        `FAQ question ${index + 1} answer ${answerIndex + 1} requires \`text\`.`,
      )
    })
  })

  return warnings
}

const getSchemaWarnings = (data: Record<string, unknown>) => {
  switch (data['@type']) {
    case 'Product':
      return validateProduct(data)
    case 'BreadcrumbList':
      return validateBreadcrumbList(data)
    case 'FAQPage':
      return validateFAQPage(data)
    default:
      return []
  }
}

export const warnGoogleRichResultIssues = (
  data: unknown,
  options: { component: string; validate?: boolean },
) => {
  if (!shouldWarn(options.validate) || !isObject(data)) {
    return
  }

  const nodes = Array.isArray(data['@graph']) ? data['@graph'] : [data]

  nodes.forEach((node) => {
    if (!isObject(node)) {
      return
    }

    getSchemaWarnings(node).forEach((warning) => {
      warnOnce(`[react-structured] ${options.component}: ${warning}`)
    })
  })
}

export const serializeJsonLd = (schemaData: unknown) =>
  JSON.stringify(schemaData).replace(/</g, '\\u003c')

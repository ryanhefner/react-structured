import type { Key, ReactElement } from 'react'

import { serializeJsonLd } from './jsonLd'
import type { JsonLdData } from './types'
import { warnGoogleRichResultIssues } from './warnings'

export interface JsonLdScriptProps {
  /**
   * id attribute for the rendered script tag.
   */
  id?: string
  /**
   * nonce attribute for Content Security Policy.
   */
  nonce?: string
  /**
   * React key applied to the rendered script tag.
   *
   * React reserves the `key` prop for the component instance, so use
   * scriptKey when the underlying script element itself needs a key.
   */
  scriptKey?: Key
}

export interface JsonLdProps extends JsonLdScriptProps {
  /**
   * A complete JSON-LD document. Use Schema or Graph if you want the
   * component to set @context for you.
   */
  data: JsonLdData
  /**
   * Enable development-time warnings for Google rich result requirements.
   */
  validate?: boolean
}

/**
 * Low-level JSON-LD script renderer.
 */
export const JsonLd = ({
  data,
  id,
  nonce,
  scriptKey,
  validate = true,
}: JsonLdProps): ReactElement => {
  warnGoogleRichResultIssues(data, { component: 'JsonLd', validate })

  return (
    <script
      key={scriptKey}
      id={id}
      nonce={nonce}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(data),
      }}
    />
  )
}

export default JsonLd

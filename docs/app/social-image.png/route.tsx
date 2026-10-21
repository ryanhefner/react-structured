import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'

export function GET() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#000',
        color: '#fff',
        width: '100%',
        height: '100%',
        padding: 64,
      }}
    >
      <div style={{ fontSize: 28 }}>react-structured</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 80 }}>Structured data, composed.</div>
        <div style={{ fontSize: 28, color: '#a1a1aa' }}>
          Type-safe Schema.org JSON-LD for React.
        </div>
      </div>
      <div style={{ fontSize: 22 }}>
        react-structured.dev · By Commune Software
      </div>
    </div>,
    { width: 1200, height: 630 },
  )
}

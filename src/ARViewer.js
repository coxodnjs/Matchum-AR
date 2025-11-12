import { useEffect, useRef, useState } from 'react'
import '@google/model-viewer'

export default function ARViewer() {
  const [color, setColor] = useState('wood')
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const modelViewerRef = useRef(null)

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768)
  }, [])

  const modelPath = {
    wood: '/models/Matchum_cabinet(wood).glb',
    resin: '/models/Matchum_cabinet(resin).glb',
    metal: '/models/Matchum_cabinet(metal).glb'
  }

  const colors = {
    wood: { name: '원목', color: '#C19A6B' },
    resin: { name: '레진', color: '#2C5F7D' },
    metal: { name: '메탈', color: '#A8A8A8' }
  }

  const buttonSize = isMobile ? '45px' : '50px'
  const buttonGap = isMobile ? '8px' : '10px'

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#f5f5f5' }}>
      {/* model-viewer */}
      <model-viewer
        ref={modelViewerRef}
        src={modelPath[color]}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        touch-action="pan-y"
        shadow-intensity="1"
        camera-orbit="45deg 75deg 3m"
        min-camera-orbit="auto auto 2m"
        max-camera-orbit="auto auto 10m"
        style={{
          width: '100%',
          height: '100%',
          background: '#f5f5f5'
        }}
      >
        {/* AR 버튼 (iOS/Android 자동 감지) */}
        <button
          slot="ar-button"
          style={{
            position: 'absolute',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1a1a1a',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            padding: '15px 40px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            zIndex: 1000
          }}
        >
          📱 AR로 보기
        </button>
      </model-viewer>

      {/* 패널 토글 버튼 */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        style={{
          position: 'absolute',
          top: buttonGap,
          left: buttonGap,
          width: buttonSize,
          height: buttonSize,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: isMobile ? '18px' : '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          zIndex: 1001,
        }}
      >
        {isPanelOpen ? '◀' : '▶'}
      </button>

      {/* 좌측 컨트롤 패널 */}
      <div style={{
        position: 'absolute',
        top: isMobile ? `calc(${buttonSize} + ${buttonGap} * 2 + 5px)` : `calc(${buttonSize} + ${buttonGap} * 2)`,
        left: isPanelOpen ? buttonGap : `-${isMobile ? '180px' : '200px'}`,
        width: isMobile ? '160px' : '180px',
        background: 'rgba(255,255,255,0.98)',
        padding: isMobile ? '10px' : '12px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        zIndex: 1000,
        transition: 'left 0.3s',
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto',
      }}>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ 
            fontSize: isMobile ? '10px' : '11px',
            fontWeight: 'bold', 
            marginBottom: '6px',
            color: '#333'
          }}>
            🎨 색상
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {Object.entries(colors).map(([key, { name, color: c }]) => (
              <button
                key={key}
                onClick={() => setColor(key)}
                style={{
                  padding: '6px 8px',
                  border: color === key ? '2px solid #1a1a1a' : '1px solid #ddd',
                  borderRadius: '4px',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: isMobile ? '9px' : '10px',
                  fontWeight: color === key ? 'bold' : 'normal',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: c,
                  borderRadius: '3px',
                  flexShrink: 0,
                }}></div>
                {name}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          fontSize: isMobile ? '9px' : '10px',
          color: '#666',
          padding: '10px',
          background: '#f9f9f9',
          borderRadius: '4px',
          lineHeight: '1.4'
        }}>
          💡 스마트폰에서 "AR로 보기" 버튼을 눌러 실제 공간에 배치해보세요!
        </div>
      </div>

      {/* 하단 제품 정보 */}
      <div style={{
        position: 'absolute',
        bottom: '15px',
        left: buttonGap,
        right: buttonGap,
        background: 'rgba(255,255,255,0.95)',
        padding: isMobile ? '10px 12px' : '12px 15px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}>
        <div style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: 'bold', marginBottom: '3px' }}>
          맞춤장 (Matchum Cabinet)
        </div>
        <div style={{ fontSize: isMobile ? '10px' : '11px', color: '#666' }}>
          한옥 스타일 · {colors[color].name}
        </div>
      </div>
    </div>
  )
}
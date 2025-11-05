import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import { useState, useEffect } from 'react'

function Cabinet({ scale, color, rotation }) {
  const { scene } = useGLTF('/models/test_cabinet.glb')
  
  return (
    <primitive 
      object={scene} 
      scale={scale}
      rotation={[0, rotation * (Math.PI / 180), 0]}
    />
  )
}

export default function Viewer() {
  const [scale, setScale] = useState(5)
  const [rotation, setRotation] = useState(0)
  const [color, setColor] = useState('wood')
  const [autoRotate, setAutoRotate] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(true)

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768)
  }, [])

  const colors = {
    wood: { name: '원목', color: '#C19A6B' },
    resin: { name: '레진', color: '#2C5F7D' },
    metal: { name: '메탈', color: '#A8A8A8' }
  }

  const handleReset = () => {
    setScale(5)
    setRotation(0)
    setAutoRotate(false)
  }

  const buttonSize = isMobile ? '45px' : '50px'
  const buttonGap = isMobile ? '8px' : '10px'

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f5f5f5', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}>
        <Canvas camera={{ position: [3, 2, 4], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Environment preset="apartment" />
          <Cabinet scale={scale} color={color} rotation={rotation} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#cccccc" />
          </mesh>
          <OrbitControls 
            autoRotate={autoRotate}
            autoRotateSpeed={2}
            target={[0, 0.5, 0]}
          />
        </Canvas>
      </div>

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

        <div style={{ marginBottom: '12px' }}>
          <div style={{ 
            fontSize: isMobile ? '10px' : '11px',
            fontWeight: 'bold', 
            marginBottom: '6px',
            color: '#333'
          }}>
            🔄 회전
          </div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
            <button
              onClick={() => setRotation(r => r - 45)}
              style={{
                flex: 1,
                padding: '8px',
                background: '#1a1a1a',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: isMobile ? '10px' : '11px',
                fontWeight: 'bold',
              }}
            >
              ← 45°
            </button>
            <button
              onClick={() => setRotation(r => r + 45)}
              style={{
                flex: 1,
                padding: '8px',
                background: '#1a1a1a',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: isMobile ? '10px' : '11px',
                fontWeight: 'bold',
              }}
            >
              45° →
            </button>
          </div>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            fontSize: isMobile ? '9px' : '10px',
            cursor: 'pointer',
            color: '#666'
          }}>
            <input
              type="checkbox"
              checked={autoRotate}
              onChange={(e) => setAutoRotate(e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            자동 회전
          </label>
        </div>

        <button
          onClick={handleReset}
          style={{
            width: '100%',
            padding: '10px',
            background: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: isMobile ? '10px' : '11px',
            fontWeight: 'bold',
          }}
        >
          ↺ 리셋
        </button>
      </div>

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

useGLTF.preload('/models/test_cabinet.glb')
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
  const [scale, setScale] = useState(0.01)
  const [rotation, setRotation] = useState(0)
  const [color, setColor] = useState('natural')
  const [autoRotate, setAutoRotate] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768)
  }, [])

  const colors = {
    natural: { name: '오크', color: '#D4A574' },
    walnut: { name: '월넛', color: '#5C4033' },
    white: { name: '화이트', color: '#F5F5F0' }
  }

  const handleReset = () => {
    setScale(0.01)
    setRotation(0)
    setAutoRotate(false)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f5f5f5' }}>
      {/* 컨트롤 패널 */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '70px' : '80px',
        left: '10px',
        right: isMobile ? '10px' : 'auto',
        background: 'rgba(255,255,255,0.95)',
        padding: isMobile ? '10px' : '20px',
        borderRadius: isMobile ? '8px' : '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        zIndex: 1000,
        minWidth: isMobile ? 'auto' : '250px',
        maxWidth: isMobile ? 'calc(100vw - 20px)' : '300px',
      }}>
        {/* 크기 조절 */}
        <div style={{ marginBottom: isMobile ? '15px' : '25px' }}>
          <div style={{ 
            fontSize: isMobile ? '11px' : '14px',
            fontWeight: 'bold', 
            marginBottom: '8px',
            color: '#333'
          }}>
            📏 크기 조절
          </div>
          <div style={{ 
            fontSize: isMobile ? '10px' : '12px',
            color: '#666', 
            marginBottom: '6px' 
          }}>
            {Math.round(scale * 100)}%
          </div>
          <input
            type="range"
            min="0.005"
            max="0.03"
            step="0.001"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        {/* 색상 선택 */}
        <div style={{ marginBottom: isMobile ? '15px' : '25px' }}>
          <div style={{ 
            fontSize: isMobile ? '11px' : '14px',
            fontWeight: 'bold', 
            marginBottom: '8px',
            color: '#333'
          }}>
            🎨 색상 선택
          </div>
          <div style={{ display: 'flex', gap: isMobile ? '6px' : '10px' }}>
            {Object.entries(colors).map(([key, { name, color: c }]) => (
              <button
                key={key}
                onClick={() => setColor(key)}
                style={{
                  flex: 1,
                  padding: isMobile ? '6px' : '10px',
                  border: color === key ? '2px solid #1a1a1a' : '1px solid #ddd',
                  borderRadius: '6px',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: isMobile ? '9px' : '12px',
                  fontWeight: color === key ? 'bold' : 'normal',
                }}
              >
                <div style={{
                  width: '100%',
                  height: isMobile ? '20px' : '30px',
                  background: c,
                  borderRadius: '4px',
                  marginBottom: '4px'
                }}></div>
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* 회전 컨트롤 */}
        <div style={{ marginBottom: isMobile ? '15px' : '25px' }}>
          <div style={{ 
            fontSize: isMobile ? '11px' : '14px',
            fontWeight: 'bold', 
            marginBottom: '8px',
            color: '#333'
          }}>
            🔄 회전
          </div>
          <div style={{ display: 'flex', gap: isMobile ? '6px' : '10px', marginBottom: '8px' }}>
            <button
              onClick={() => setRotation(r => r - 45)}
              style={{
                flex: 1,
                padding: isMobile ? '8px' : '10px',
                background: '#1a1a1a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: isMobile ? '11px' : '14px',
                fontWeight: 'bold',
              }}
            >
              ← 45°
            </button>
            <button
              onClick={() => setRotation(r => r + 45)}
              style={{
                flex: 1,
                padding: isMobile ? '8px' : '10px',
                background: '#1a1a1a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: isMobile ? '11px' : '14px',
                fontWeight: 'bold',
              }}
            >
              45° →
            </button>
          </div>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            fontSize: isMobile ? '10px' : '12px',
            cursor: 'pointer',
            color: '#666'
          }}>
            <input
              type="checkbox"
              checked={autoRotate}
              onChange={(e) => setAutoRotate(e.target.checked)}
              style={{ marginRight: '6px' }}
            />
            자동 회전
          </label>
        </div>

        {/* 리셋 버튼 */}
        <button
          onClick={handleReset}
          style={{
            width: '100%',
            padding: isMobile ? '10px' : '12px',
            background: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: isMobile ? '11px' : '14px',
            fontWeight: 'bold',
          }}
        >
          ↺ 리셋
        </button>
      </div>

      {/* 제품 정보 */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '10px',
        right: isMobile ? '10px' : 'auto',
        background: 'rgba(255,255,255,0.95)',
        padding: isMobile ? '10px 12px' : '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}>
        <div style={{ fontSize: isMobile ? '13px' : '16px', fontWeight: 'bold', marginBottom: '3px' }}>
          맞춤장 (Matchum Cabinet)
        </div>
        <div style={{ fontSize: isMobile ? '10px' : '12px', color: '#666' }}>
          한옥 스타일 · {colors[color].name}
        </div>
      </div>

      {/* 3D Canvas */}
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
  )
}

useGLTF.preload('/models/test_cabinet.glb')
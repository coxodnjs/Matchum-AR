import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import { useState } from 'react'

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
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '20px',
        background: 'rgba(255,255,255,0.95)',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        zIndex: 1000,
        minWidth: '250px',
      }}>
        <div style={{ marginBottom: '25px' }}>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            marginBottom: '10px',
            color: '#333'
          }}>
            📏 크기 조절
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginBottom: '8px' 
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

        <div style={{ marginBottom: '25px' }}>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            marginBottom: '10px',
            color: '#333'
          }}>
            🎨 색상 선택
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {Object.entries(colors).map(([key, { name, color: c }]) => (
              <button
                key={key}
                onClick={() => setColor(key)}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: color === key ? '3px solid #1a1a1a' : '2px solid #ddd',
                  borderRadius: '8px',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: color === key ? 'bold' : 'normal',
                }}
              >
                <div style={{
                  width: '100%',
                  height: '30px',
                  background: c,
                  borderRadius: '5px',
                  marginBottom: '5px'
                }}></div>
                {name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            marginBottom: '10px',
            color: '#333'
          }}>
            🔄 회전
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button
              onClick={() => setRotation(r => r - 45)}
              style={{
                flex: 1,
                padding: '10px',
                background: '#1a1a1a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              ← 45°
            </button>
            <button
              onClick={() => setRotation(r => r + 45)}
              style={{
                flex: 1,
                padding: '10px',
                background: '#1a1a1a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              45° →
            </button>
          </div>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            fontSize: '12px',
            cursor: 'pointer',
            color: '#666'
          }}>
            <input
              type="checkbox"
              checked={autoRotate}
              onChange={(e) => setAutoRotate(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            자동 회전
          </label>
        </div>

        <button
          onClick={handleReset}
          style={{
            width: '100%',
            padding: '12px',
            background: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          ↺ 리셋
        </button>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(255,255,255,0.95)',
        padding: '15px 20px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
          맞춤장 (Matchum Cabinet)
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          한옥 스타일 · {colors[color].name}
        </div>
      </div>

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
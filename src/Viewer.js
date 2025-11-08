import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useState } from 'react'

function Model({ color }) {
  const modelPath = {
    wood: '/models/Matchum_cabinet(wood).glb',
    resin: '/models/Matchum_cabinet(resin).glb',
    metal: '/models/Matchum_cabinet(metal).glb'
  }
  
  const { scene } = useGLTF(modelPath[color])
  
  // 화질만 향상, 재질 변경 X
  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.needsUpdate = true
      if (child.material.map) {
        child.material.map.anisotropy = 16
      }
    }
  })
  
  return <primitive object={scene} scale={1.5} />
}

function Viewer() {
  const [color, setColor] = useState('wood')
  const [autoRotate, setAutoRotate] = useState(false)

  const colors = {
    wood: { name: '원목', color: '#C19A6B' },
    resin: { name: '레진', color: '#2C5F7D' },
    metal: { name: '메탈', color: '#A8A8A8' }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* 좌측 컨트롤 패널 */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10,
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '200px'
      }}>
        <div style={{ marginBottom: '15px', fontWeight: 'bold' }}>색상</div>
        {Object.entries(colors).map(([key, { name, color: bgColor }]) => (
          <button
            key={key}
            onClick={() => setColor(key)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '8px',
              border: color === key ? '2px solid #333' : '1px solid #ddd',
              borderRadius: '6px',
              background: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '3px',
              background: bgColor
            }} />
            <span>{name}</span>
          </button>
        ))}

        <div style={{ marginTop: '20px', marginBottom: '10px', fontWeight: 'bold' }}>
          회전
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <button
            style={{
              flex: 1,
              padding: '8px',
              background: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            ← 45°
          </button>
          <button
            style={{
              flex: 1,
              padding: '8px',
              background: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            45° →
          </button>
        </div>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={autoRotate}
            onChange={(e) => setAutoRotate(e.target.checked)}
          />
          자동 회전
        </label>
      </div>

      {/* 3D Canvas */}
      <Canvas 
        camera={{ position: [3, 2, 4], fov: 50 }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.75,
          outputColorSpace: THREE.SRGBColorSpace,
          pixelRatio: Math.min(window.devicePixelRatio, 2)
        }}
      >
        {/* 조명 조정 */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.4} />
        <directionalLight position={[-3, 2, -3]} intensity={0.2} color="#fff8e7" />
        
        <Environment preset="city" intensity={0.4} />
        
        <Model color={color} />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
          minDistance={2}
          maxDistance={10}
        />
        
        {/* 바닥 조정 */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#e8e8e8" roughness={0.9} />
        </mesh>
      </Canvas>

      {/* 하단 제품 정보 */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255,255,255,0.9)',
        padding: '12px 24px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          맞춤장 (Matchum Cabinet)
        </div>
        <div style={{ fontSize: '13px', color: '#666' }}>
          한옥 스타일 · {colors[color].name}
        </div>
      </div>
    </div>
  )
}

export default Viewer
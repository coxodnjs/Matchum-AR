import React, { Suspense, useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function Model({ color }) {
  const modelPath = {
    wood: '/models/Matchum_cabinet(wood).glb',
    resin: '/models/Matchum_cabinet(resin).glb',
    metal: '/models/Matchum_cabinet(metal).glb'
  }

  const { scene } = useGLTF(modelPath[color])

  React.useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.needsUpdate = true
        if (child.material.map) {
          child.material.map.anisotropy = 16
        }
      }
    })
  }, [scene])

  return <primitive object={scene} scale={1.5} />
}

export default function Viewer() {
  const [color, setColor] = useState('wood')
  const [autoRotate, setAutoRotate] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const controlsRef = useRef()

  const handleRotate = (direction) => {
    if (controlsRef.current) {
      const angle = (Math.PI / 4) * direction
      controlsRef.current.object.position.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        angle
      )
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* 좌측 패널 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: isPanelOpen ? 0 : '-300px',
          width: '300px',
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px',
          boxSizing: 'border-box',
          transition: 'left 0.3s',
          zIndex: 10,
          overflowY: 'auto',
          color: 'white'
        }}
      >
        <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>맞춤장 뷰어</h2>

        {/* 재질 선택 */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '10px', fontSize: '16px' }}>재질</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'wood', name: '원목', color: '#C19A6B' },
              { id: 'resin', name: '레진', color: '#2C5F7D' },
              { id: 'metal', name: '메탈', color: '#A8A8A8' }
            ].map((mat) => (
              <button
                key={mat.id}
                onClick={() => setColor(mat.id)}
                style={{
                  padding: '10px 15px',
                  background: color === mat.id ? mat.color : 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: color === mat.id ? '2px solid white' : 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: color === mat.id ? 'bold' : 'normal',
                  transition: 'all 0.2s'
                }}
              >
                {mat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 컨트롤 */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px', fontSize: '16px' }}>컨트롤</h3>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <button
              onClick={() => handleRotate(-1)}
              style={{
                flex: 1,
                padding: '10px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              ← 45°
            </button>
            <button
              onClick={() => handleRotate(1)}
              style={{
                flex: 1,
                padding: '10px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              45° →
            </button>
          </div>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            style={{
              width: '100%',
              padding: '10px',
              background: autoRotate ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            자동 회전 {autoRotate ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* 제품 정보 */}
        <div style={{ fontSize: '14px', lineHeight: '1.6', opacity: 0.9 }}>
          <p><strong>한국 전통 맞춤장</strong></p>
          <p>전통 목공 기법으로 제작된 수납장입니다.</p>
        </div>
      </div>

      {/* 패널 토글 버튼 */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        style={{
          position: 'absolute',
          top: '20px',
          left: isPanelOpen ? '320px' : '20px',
          width: '40px',
          height: '40px',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          zIndex: 11,
          fontSize: '20px',
          transition: 'left 0.3s'
        }}
      >
        {isPanelOpen ? '←' : '→'}
      </button>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 50 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.0} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />
          <Model color={color} />
          
          {/* 커스텀 HDRI 배경 */}
          <Environment preset="studio" background />
          
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            minDistance={2}
            maxDistance={8}
            autoRotate={autoRotate}
            autoRotateSpeed={2}
          />
        </Suspense>
      </Canvas>

      {/* 현재 설정 표시 */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          zIndex: 10
        }}
      >
        재질: <strong>{color === 'wood' ? '원목' : color === 'resin' ? '레진' : '메탈'}</strong>
      </div>
    </div>
  )
}
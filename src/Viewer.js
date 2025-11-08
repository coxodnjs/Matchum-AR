import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useState, useEffect } from 'react'

function Model({ color }) {
  const modelPath = {
    wood: '/models/Matchum_cabinet(wood).glb',
    resin: '/models/Matchum_cabinet(resin).glb',
    metal: '/models/Matchum_cabinet(metal).glb'
  }
  
  const { scene } = useGLTF(modelPath[color])
  
  useEffect(() => {
    // 한지 텍스처 로드
    const textureLoader = new THREE.TextureLoader()
    const hanjiDiffuse = textureLoader.load('/textures/hanji_color.jpg')
    const hanjiNormal = textureLoader.load('/textures/hanji_normal.jpg')
    const hanjiRoughness = textureLoader.load('/textures/hanji_roughness.jpg')
    
    // 텍스처 설정
    hanjiDiffuse.wrapS = hanjiDiffuse.wrapT = THREE.RepeatWrapping
    hanjiNormal.wrapS = hanjiNormal.wrapT = THREE.RepeatWrapping
    hanjiRoughness.wrapS = hanjiRoughness.wrapT = THREE.RepeatWrapping
    
    // 텍스처 반복 (크기 조절)
    hanjiDiffuse.repeat.set(3, 3)
    hanjiNormal.repeat.set(3, 3)
    hanjiRoughness.repeat.set(3, 3)
    
    // 고품질 필터링
    hanjiDiffuse.anisotropy = 16
    hanjiNormal.anisotropy = 16
    hanjiRoughness.anisotropy = 16
    
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        
        if (color === 'resin') {
          // 🎨 고퀄리티 한지 레진 재질
          child.material = new THREE.MeshPhysicalMaterial({
            // 레진 베이스 색상 (청회색)
            color: new THREE.Color('#4A6B7C'),
            
            // 한지 텍스처 적용
            map: hanjiDiffuse,
            normalMap: hanjiNormal,
            normalScale: new THREE.Vector2(0.5, 0.5),
            roughnessMap: hanjiRoughness,
            roughness: 0.6,
            
            // 반투명 레진 효과
            transparent: true,
            opacity: 0.85,
            transmission: 0.25,
            thickness: 0.8,
            ior: 1.5,
            
            // 표면 광택
            clearcoat: 0.3,
            clearcoatRoughness: 0.2,
            
            // 한지 섬유 산란광 효과
            sheen: 0.5,
            sheenRoughness: 0.5,
            sheenColor: new THREE.Color('#F0EAD6'),
            
            metalness: 0.05,
            reflectivity: 0.3,
            side: THREE.DoubleSide,
          })
          
        } else if (color === 'wood') {
          // 원목 재질
          child.material.transparent = false
          child.material.opacity = 1.0
          child.material.transmission = 0
          child.material.roughness = 0.7
          child.material.metalness = 0
          
        } else if (color === 'metal') {
          // 메탈 재질
          child.material.transparent = false
          child.material.opacity = 1.0
          child.material.transmission = 0
          child.material.roughness = 0.3
          child.material.metalness = 0.8
        }
        
        child.material.needsUpdate = true
        
        // 텍스처 품질 향상
        if (child.material.map) {
          child.material.map.anisotropy = 16
        }
        if (child.material.normalMap) {
          child.material.normalMap.anisotropy = 16
        }
      }
    })
  }, [scene, color])
  
  return <primitive object={scene} scale={1.5} />
}

function Viewer() {
  const [color, setColor] = useState('wood')
  const [autoRotate, setAutoRotate] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [isPanelOpen, setIsPanelOpen] = useState(true)

  const colors = {
    wood: { name: '원목', color: '#C19A6B' },
    resin: { name: '레진', color: '#2C5F7D' },
    metal: { name: '메탈', color: '#A8A8A8' }
  }

  const rotate = (degrees) => {
    setRotation(prev => prev + degrees)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => window.history.back()}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 100,
          background: '#333',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px',
          cursor: 'pointer',
          fontSize: '20px',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ◀
      </button>

      {/* 좌측 컨트롤 패널 */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: isPanelOpen ? '20px' : '-280px',
        transform: 'translateY(-50%)',
        zIndex: 10,
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        width: '240px',
        transition: 'left 0.3s ease'
      }}>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🎨</span>
          <strong>색상</strong>
        </div>
        
        {Object.entries(colors).map(([key, { name, color: bgColor }]) => (
          <button
            key={key}
            onClick={() => setColor(key)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '10px',
              border: color === key ? '2px solid #333' : '2px solid #ddd',
              borderRadius: '8px',
              background: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s'
            }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              background: bgColor,
              border: '1px solid #ddd'
            }} />
            <span style={{ fontWeight: color === key ? 'bold' : 'normal' }}>
              {name}
            </span>
          </button>
        ))}

        <div style={{ 
          marginTop: '30px', 
          paddingTop: '20px', 
          borderTop: '1px solid #eee',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>🔄</span>
          <strong>회전</strong>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button
            onClick={() => rotate(-45)}
            style={{
              flex: 1,
              padding: '10px',
              background: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            ← 45°
          </button>
          <button
            onClick={() => rotate(45)}
            style={{
              flex: 1,
              padding: '10px',
              background: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            45° →
          </button>
        </div>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          userSelect: 'none'
        }}>
          <input
            type="checkbox"
            checked={autoRotate}
            onChange={(e) => setAutoRotate(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <span>자동 회전</span>
        </label>

        <button
          onClick={() => setRotation(0)}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '15px',
            background: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ⟲ 리셋
        </button>
      </div>

      {/* 패널 토글 버튼 */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        style={{
          position: 'absolute',
          left: isPanelOpen ? '280px' : '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 11,
          background: '#333',
          color: 'white',
          border: 'none',
          borderRadius: '0 8px 8px 0',
          padding: '20px 8px',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'left 0.3s ease'
        }}
      >
        {isPanelOpen ? '◀' : '▶'}
      </button>

      {/* 3D Canvas */}
      <Canvas 
        camera={{ position: [3, 2, 4], fov: 50 }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          outputColorSpace: THREE.SRGBColorSpace,
          pixelRatio: Math.min(window.devicePixelRatio, 2)
        }}
      >
        {/* 주변광 */}
        <ambientLight intensity={1.2} />
        
        {/* 메인 라이트 */}
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.7}
          castShadow
        />
        
        {/* 백라이트 (한지 투과 효과) */}
        <directionalLight 
          position={[-3, 2, -3]} 
          intensity={0.5}
          color="#fff8e7"
        />
        
        {/* 림라이트 (윤곽선 강조) */}
        <spotLight
          position={[3, 3, 0]}
          intensity={0.4}
          angle={0.5}
          penumbra={1}
          color="#ffffff"
        />
        
        <Environment preset="studio" />
        
        <Model color={color} rotation={rotation} />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
          minDistance={2}
          maxDistance={10}
        />
        
        {/* 바닥 */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={1.0}
            metalness={0}
          />
        </mesh>
      </Canvas>

      {/* 하단 제품 정보 */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255,255,255,0.95)',
        padding: '15px 30px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
          맞춤장 (Matchum Cabinet)
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          한옥 스타일 · {colors[color].name}
        </div>
      </div>
    </div>
  )
}

export default Viewer
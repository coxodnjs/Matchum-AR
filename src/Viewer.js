import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useState } from 'react'

// 🎨 텍스처 한 번만 로드 (렉 방지)
const textureLoader = new THREE.TextureLoader()
const hanjiDiffuse = textureLoader.load('/textures/hanji_color.jpg')
const hanjiNormal = textureLoader.load('/textures/hanji_normal.jpg')
const hanjiRoughness = textureLoader.load('/textures/hanji_roughness.jpg')

hanjiDiffuse.wrapS = hanjiDiffuse.wrapT = THREE.RepeatWrapping
hanjiNormal.wrapS = hanjiNormal.wrapT = THREE.RepeatWrapping
hanjiRoughness.wrapS = hanjiRoughness.wrapT = THREE.RepeatWrapping

hanjiDiffuse.repeat.set(2, 2)
hanjiNormal.repeat.set(2, 2)
hanjiRoughness.repeat.set(2, 2)

hanjiDiffuse.anisotropy = 16
hanjiNormal.anisotropy = 16
hanjiRoughness.anisotropy = 16

function Model({ color }) {
  const modelPath = {
    wood: '/models/Matchum_cabinet(wood).glb',
    resin: '/models/Matchum_cabinet(resin).glb',
    metal: '/models/Matchum_cabinet(metal).glb'
  }
  
  const { scene } = useGLTF(modelPath[color])
  
  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      
      if (color === 'resin') {
        // 🎨 은은한 반투명 한지 레진
        child.material = new THREE.MeshPhysicalMaterial({
          // 베이스 색상 (밝은 베이지/크림)
          color: new THREE.Color('#E8DCC8'),
          
          // 한지 텍스처
          map: hanjiDiffuse,
          normalMap: hanjiNormal,
          normalScale: new THREE.Vector2(0.4, 0.4),
          roughnessMap: hanjiRoughness,
          roughness: 0.7,
          
          // 은은한 반투명
          transparent: true,
          opacity: 0.95,
          transmission: 0.1,
          thickness: 0.3,
          ior: 1.45,
          
          // 부드러운 광택
          clearcoat: 0.15,
          clearcoatRoughness: 0.4,
          
          // 한지 느낌 (섬유 산란)
          sheen: 0.4,
          sheenRoughness: 0.7,
          sheenColor: new THREE.Color('#F5F0E5'),
          
          metalness: 0,
          side: THREE.DoubleSide,
        })
        
      } else {
        // 원목, 메탈
        child.material.transparent = false
        child.material.opacity = 1.0
        child.material.transmission = 0
        child.material.needsUpdate = true
        
        if (child.material.map) {
          child.material.map.anisotropy = 16
        }
      }
    }
  })
  
  return <primitive object={scene} scale={1.5} />
}

function Viewer() {
  const [color, setColor] = useState('wood')
  const [autoRotate, setAutoRotate] = useState(false)
  const [rotation, setRotation] = useState(0)

  const colors = {
    wood: { name: '원목', color: '#C19A6B' },
    resin: { name: '레진', color: '#2C5F7D' },
    metal: { name: '메탈', color: '#A8A8A8' }
  }

  const rotate = (degrees) => {
    setRotation(prev => prev + degrees)
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
            onClick={() => rotate(-45)}
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
            onClick={() => rotate(45)}
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

        <button
          onClick={() => setRotation(0)}
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '10px',
            background: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ⟲ 리셋
        </button>
      </div>

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
        <ambientLight intensity={1.0} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        
        <Environment preset="studio" />
        
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
        
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#ffffff" roughness={1.0} />
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
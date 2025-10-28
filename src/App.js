import { useState } from 'react'
import Viewer from './Viewer'
import ARViewer from './ARViewer'

function App() {
  const [mode, setMode] = useState('3d')

  return (
    <div>
      {/* AR 모드 전환 버튼 (오른쪽 상단) */}
      <button
        onClick={() => setMode(mode === '3d' ? 'ar' : '3d')}
        style={{
          position: 'fixed',
          top: window.innerWidth <= 768 ? '8px' : '10px',
          right: window.innerWidth <= 768 ? '8px' : '10px',
          width: window.innerWidth <= 768 ? '45px' : '50px',
          height: window.innerWidth <= 768 ? '45px' : '50px',
          background: mode === 'ar' ? '#1a1a1a' : 'rgba(100,100,100,0.8)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: window.innerWidth <= 768 ? '10px' : '11px',
          fontWeight: 'bold',
          zIndex: 1002,
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        }}
      >
        AR
      </button>

      {mode === '3d' ? <Viewer /> : <ARViewer />}
    </div>
  )
}

export default App
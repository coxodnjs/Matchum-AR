import { useState } from 'react'
import Viewer from './Viewer'
import ARViewer from './ARViewer'

function App() {
  const [mode, setMode] = useState('3d')

  return (
    <div>
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1002,
        display: 'flex',
        gap: '10px',
      }}>
        <button
          onClick={() => setMode('3d')}
          style={{
            padding: '10px 20px',
            backgroundColor: mode === '3d' ? '#1a1a1a' : '#666',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          3D 뷰어
        </button>
        <button
          onClick={() => setMode('ar')}
          style={{
            padding: '10px 20px',
            backgroundColor: mode === 'ar' ? '#1a1a1a' : '#666',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          AR 모드
        </button>
      </div>

      {mode === '3d' ? <Viewer /> : <ARViewer />}
    </div>
  )
}

export default App
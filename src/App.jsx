import { Route, Routes } from 'react-router-dom'
import Gallery from './pages/Gallery.jsx'
import Editor from './pages/Editor.jsx'
import View from './pages/View.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Gallery />} />
      <Route path="/editar/:templateId" element={<Editor />} />
      <Route path="/i" element={<View />} />
      <Route path="*" element={<Gallery />} />
    </Routes>
  )
}

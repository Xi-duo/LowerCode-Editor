import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import '@ant-design/v5-patch-for-react-19';

createRoot(document.getElementById('root')!).render(
    //跨组件传递数据
    <DndProvider backend={HTML5Backend}>
            <App />
    </DndProvider>

)

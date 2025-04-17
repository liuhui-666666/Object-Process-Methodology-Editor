import React from 'react'
import { useRoutes } from 'react-router-dom'
import routes from '@/router/index'
import { WebSocketProvider } from "@/service/WebSocketContent";
function App() {
  return (
    <WebSocketProvider>
    <div className="App">
      {useRoutes(routes)}
    </div>
    </WebSocketProvider>
  )
}

export default App


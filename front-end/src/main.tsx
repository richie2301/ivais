// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { ConfigProvider, theme } from 'antd'

const { darkAlgorithm } = theme
ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <BrowserRouter >
    <ConfigProvider theme={{algorithm: darkAlgorithm, components: {Select: {optionSelectedBg: '#1668dc'}}}}>
    <Provider store={store}>
    <App />
    </Provider>
    </ConfigProvider>
    </BrowserRouter>
  // </React.StrictMode>,
)

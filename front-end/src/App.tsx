// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import AppLayout from './layouts/AppLayout'
import AuthLayout from './layouts/AuthLayout'
import MapView from './pages/MapView'

import { Routes, Route } from "react-router-dom";

// import process from 'process';

// import { useNavigate } from "react-router-dom";

// import Dashboard from "./pages/Dashboard";
// import CreateCase from "../pages/CreateCase";
// import AddVideo from "./pages/AddVideo";
// import Reporting from "./pages/Reporting";
// import UserManagement from './pages/UserManagement';
// import Profile from './pages/Profile';
// import AnalyzeVideo from './pages/AnalyzeVideo';
// import CaseDetails from './pages/CaseDetails';

// import { theme, message } from 'antd';
// import { useState } from 'react';

function App() {

  //use .env file
  // const url = process.env.REACT_APP_API_URL;
  // console.log(url);

  // const url = ;
  // console.log(url)

  // const url = process.env.REACT_APP_API_URL;
  // console.log(url);
  // console.log(process.env.REACT_APP_API_URL);
  // console.log(import.meta.env.VITE_APP_API_URL);
  // console.log(process.env.VITE_APP_API_URL);
  // console.log(import.meta.env.BASE_URL);
  console.log(import.meta.env.VITE_API_URL);

  // const [count, setCount] = useState(0)

  // const navigate = useNavigate();
  // const [collapsed, setCollapsed] = useState(false);
  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();
  // const [messageApi, contextHolder] = message.useMessage();

  // const success = (message : string) => {
  //   messageApi.open({
  //     type: 'success',
  //     content: message,
  //     duration: 10,
  //   });
  // };

  return (
    <>
      {/* <AppLayout /> */}
      <Routes>
          {/* <Route index element={<Dashboard />} /> */}
          {/* <Route path="/createCase" element={<CreateCase success={success} />} /> */}
          {/* <Route path="/addVideo" element={<AddVideo success={success} />} />
          <Route path="/reporting" element={<Reporting success={success} />} />
          <Route path="/userManagement" element={<UserManagement />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analyzeVideo" element={<AnalyzeVideo success={success} />} />
          <Route path="/caseDetails/:caseId" element={<CaseDetails success={success} />} /> */}
          <Route index element={<AuthLayout />} />
          <Route path="/*" element={<AppLayout />} />
          <Route path="/auth/*" element={<AuthLayout />} />
          <Route path="/mapView" element={<MapView />} />
      </Routes>
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App

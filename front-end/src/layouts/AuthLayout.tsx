import React from 'react'
import { Space, Card, message } from 'antd'
import { Routes, Route } from "react-router-dom";

// import { BorderOutlined } from '@ant-design/icons';

import Login from "../pages/Login";
import SignUp from "../pages/SignUp";

// import KorpsBrimob from "../assets/korps-brimob.png";
import Logo from "../assets/logo.png"

// const { Title } = Typography

// const login = () => {
//   const email = "johndoe@mail.com";
//     const password = "johndoe";
//     // const url = "http://192.168.221:5025/api/User/login";
//     // const url = "http://xingular.ngrok.dev/api/User/login"
//     const url = "http://192.168.8.124:5000/api/User/login"
  
//     fetch(url, {
//       method: 'POST',
//       // headers: {
//       //   'Content-Type': 'apvscode-file://vscode-app/c:/Users/Agnes/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.htmlplication/json'
//       // },
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         email: email,
//         password: password
//       })
//     })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       return response.json();
//     })
//     .then(data => {
//       console.log(data);
//     })
//     .catch(error => {
//       console.error('There was a problem with the fetch operation:', error);
//     });
//   }
  

const userManagement: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const error = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  }
    return (
      <div>
        {contextHolder}
        {/* <button onClick={login}>LOGIN</button> */}
        {/* <Title>auth layout</Title> */}
        {/* <Login /> */}
        <Space align="center" style={{ width: '100vw', height: '100vh', justifyItems: 'center'}}>
          <Space direction="vertical" align="center" style={{ width: '100vw' }}>
            <Card>
              <Space direction="vertical" style={{ width:'450px', height: '500px', padding: '20px' }}>
                <Space direction='vertical' align="center" style={{ width: '100%' }}>
                  {/* <BorderOutlined style={{fontSize: 70}} /> */}
                  <img src={Logo} alt="Logo" style={{width: '70px'}} />
                </Space>
                <Routes>
                  <Route index element={<Login errorMessage={error} />} />
                  <Route path="/login" element={<Login errorMessage={error} />} />
                  <Route path="/signup" element={<SignUp />} />
                </Routes>
              </Space>
              {/* <Login /> */}
            </Card>
          </Space>
        </Space>
      </div>
    );
  }
  
  export default userManagement;
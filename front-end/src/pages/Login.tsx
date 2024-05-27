import React from 'react'
import { Typography, Space } from 'antd'
import { Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { jwtDecode, JwtPayload } from "jwt-decode";

import useUserStore from '../store/userStore';
// import { UserStoreState } from '../type/storeTypes';

const { Title } = Typography
const { Text } = Typography

interface MyJwtPayload extends JwtPayload {
  UserId: string;
}

type LoginProps = {
  errorMessage: (message: string) => void;
}

const Login: React.FC<LoginProps> = ({errorMessage}) => {

  const navigate = useNavigate();

  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  // const setUserID = useUserStore(state => state.setUserID);
  // const [userID, setUserID] = React.useState<string>('');

  // console.log(userID)
  // test login

  const login = () => {
    // const email = "johndoe@mail.com";
    // const password = "johndoe";
    // const url = "http://192.168.8.124:5000/api/User/login"
    const url = import.meta.env.VITE_API_URL

    fetch(url + '/api/User/login', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    }).then((response) => {
      // console.log(response.text())
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      else {
        // navigate('/case')
      }
      return response.text();
    })
    .then((data) => {
      console.log(data);
      const decoded = jwtDecode<MyJwtPayload>(data);
      // console.log(decoded);
      // setUserID(decoded.UserId);
      useUserStore.setState({ userID: decoded.UserId });
      navigate('/case')
      // useUserStore.setUserID(decoded.UserId);
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
      errorMessage(error.message);
    });

    //temporary
    // setUserID("60ea2ba1-9f1b-4b4e-9810-e8eea3c832e5");
    // navigate('/')
  }
    
  const handleEmail = (event: any): void => {
    setEmail(event.target.value)
  }

  const handlePassword = (event: any): void => {
    setPassword(event.target.value)
    
  }

    return (
      <div>
        <Space direction="vertical" align="center" style={{ width: '100%' }}>
        <Title level={4} style={{margin: 0, marginBottom: '10px'}}>Login</Title>
        </Space>

        {/* <Text>Email</Text>
        <Input placeholder="Basic usage" value="email" onChange={handleEmail} />
        <Text>Password</Text>
        <Input placeholder="Basic usage" value="password" onChange={handlePassword} />
        <Button onClick={login}>GO LOGIN</Button> */}

        <Space direction="vertical" style={{ width: '100%', marginTop: '20px' }}>
          <Text>Email</Text>
          <Input placeholder="Enter your email address" onChange={handleEmail} />
          <Text>Password</Text>
          <Input.Password placeholder="Enter your password" onChange={handlePassword} />
          <Button type="primary" style={{ marginTop: '10px' }} onClick={login}>Login</Button>
        </Space>
        <Space direction="vertical" align="center" style={{ width: '100%', marginTop: '20px' }}>
          <Text>Don't have an account? <Text className="link" onClick={() => navigate('/auth/signUp')}>Sign Up</Text></Text>
        </Space>
      </div>
    );
  }
  
export default Login;

// function ref(arg0: string): [any, any] {
//   throw new Error('Function not implemented.');
// }

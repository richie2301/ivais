import React from 'react'
import { Typography, Space, Row, Col } from 'antd'
import { Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography
const { Text } = Typography

const SignUp: React.FC = () => {

  const navigate = useNavigate();

  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');

  // test login

  const login = () => {
    // const email = "johndoe@mail.com";
    // const password = "johndoe";
    // const url = "http://192.168.8.124:5000/api/User/login"
    const url = import.meta.env.VITE_API_URL

    fetch(url + '/api/User/register', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      })
    }).then((response) => {
      console.log(response)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      else {
        navigate('/auth/login')
      }
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
    });
  }
    
  const handleEmail = (event: any): void => {
    setEmail(event.target.value)
  }

  const handlePassword = (event: any): void => {
    setPassword(event.target.value)
  }

  const handleFirstName = (event: any): void => {
    setFirstName(event.target.value)
  }

  const handleLastName = (event: any): void => {
    setLastName(event.target.value)
  }

    return (
      <div>
        <Space direction="vertical" align="center" style={{ width: '100%' }}>
        <Title level={4} style={{margin: 0, marginBottom: '10px'}}>Sign Up</Title>
        </Space>
        <Space direction="vertical" style={{ width: '100%', marginTop: '20px' }}>
          <Row gutter={15}>
            <Col span={12}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>First Name</Text>
                <Input placeholder="Enter your first name" onChange={handleFirstName} />
              </Space>
            </Col>
            <Col span={12}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>Last Name</Text>
                <Input placeholder="Enter your last name" onChange={handleLastName} />
              </Space>
            </Col>
          </Row>
          <Text>Email</Text>
          <Input placeholder="Enter your email address" onChange={handleEmail} />
          <Text>Password</Text>
          <Input.Password placeholder="Enter your password" onChange={handlePassword} />
          {/* <Text>Confirm Password</Text>
          <Input.Password placeholder="Confirm password" onChange={handlePassword} /> */}
          <Button type="primary" style={{ marginTop: '10px' }} onClick={login}>Sign Up</Button>
        </Space>
        <Space direction="vertical" align="center" style={{ width: '100%', marginTop: '20px' }}>
          <Text>Already have an account? <Text className="link" onClick={() => navigate('/auth/login')}>Login</Text>
          {/* <Button style={{padding: 0}} type="link" onClick={() => navigate('/auth/login')}>Login</Button> */}
          </Text>
        </Space>
        
      </div>
    );
  }
  
export default SignUp;

// function ref(arg0: string): [any, any] {
//   throw new Error('Function not implemented.');
// }

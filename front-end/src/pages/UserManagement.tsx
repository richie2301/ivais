import React from 'react'
import { Typography } from 'antd'

const { Title } = Typography

const userManagement: React.FC = () => {
    return (
      <div>
        <Title>User Management</Title>
      </div>
    );
  }
  
  export default userManagement;
// import { useState } from 'react';

// import React, { useState } from 'react';
// import Map from '../components/Map';

// function YourComponent() {
//   // const [formData, setFormData] = useState({
//   //   createdUserId: '60ea2ba1-9f1b-4b4e-9810-e8eea3c832e5',
//   //   caseName: 'Sample Case',
//   //   faceFiles: null,
//   //   faceNames: null,
//   //   teamName: 'Sample Team',
//   //   teamMemberUserId: null,
//   //   videoName: 'Sample Video',
//   //   latitude: 12.34,
//   //   longitude: 56.78,
//   //   videoFile: null,
//   // });

//   // const handleFileChange = (event) => {
//   //   const { name, files } = event.target;
//   //   setFormData({
//   //     ...formData,
//   //     [name]: files[0], // Assumes you're handling only one file at a time
//   //   });
//   // };

//   // const handleSubmit = async () => {
//   //   const data = new FormData();
//   //   for (const key in formData) {
//   //     if (formData[key] !== null) {
//   //       if (key === 'teamMemberUserId') {
//   //         formData[key].forEach((userId, index) => {
//   //           data.append(`${key}[${index}]`, userId);
//   //         });
//   //       } else {
//   //         data.append(key, formData[key]);
//   //       }
//   //     }
//   //   }

//   //   try {
//   //     const response = await fetch('https://xingular.ngrok.dev/api/Video/analyze', {
//   //       method: 'POST',
//   //       // mode: 'no-cors',
//   //       // body: data,
//   //     });

//   //     if (response.ok) {
//   //       const responseData = await response.json();
//   //       console.log('API response:', responseData);
//   //     } else {
//   //       console.error('API error:', response.status, response.statusText);
//   //     }
//   //   } catch (error) {
//   //     console.error('API error:', error);
//   //   }
//   // };

//   return (
//     <div>
//       <Map />
//       {/* Other input fields for your form */}
//       {/* <button onClick={handleSubmit}>Submit</button> */}
//     </div>
//   );
//   }

// export default YourComponent;
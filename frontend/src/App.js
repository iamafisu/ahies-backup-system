import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Help from './help';  // Import Help component

function UploadPage() {
  const [files, setFiles] = useState([]);
  const [userId, setUserId] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = (replace = false) => {
    if (!files.length || !userId || !selectedTeam) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please select files, enter a 4-digit ID, and choose your team.',
      });
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('id', userId);
    formData.append('team', selectedTeam);
    formData.append('replace', replace);

    Swal.fire({
      title: 'Uploading...',
      text: 'Please wait while your files are being uploaded.',
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
    });

    axios.post('http://localhost:5001/upload', formData)
      .then(response => {
        if (response.data.exists) {
          Swal.fire({
            title: 'File Already Exists',
            text: 'A file with this ID already exists. Do you want to replace it?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Replace',
            cancelButtonText: 'Cancel',
          }).then((result) => {
            if (result.isConfirmed) {
              handleUpload(true);
            }
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Upload Successful',
            text: 'Your files have been uploaded successfully!',
          });

          // Clear the form after successful upload
          setFiles([]);
          setUserId('');
          setSelectedTeam('');
          document.querySelector('input[type="file"]').value = '';
        }
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: 'There was an error uploading your files. Please try again later.',
        });
      });
  };

  return (
    <div>
      {/* Header Section */}
      <header className="bg-white-500 text-black p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/newlogo.png" alt="gss-logo" className="w-10 h-10 mr-2" />
            <h1 className="text-xl font-bold">AHIES Backup System</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><Link to="/" className="hover:text-gray-300">Upload</Link></li>
              <li><Link to="/help" className="hover:text-gray-300">Help?</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content Section */}
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">File Upload</h1>

          {/* Dropdown for selecting the team */}
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="border p-2 mb-4 w-full"
          >
            <option value="">Select your team</option>
            {Array.from({ length: 40 }, (_, i) => (
              <option key={i} value={`Team ${i + 1}`}>{`Team ${i + 1}`}</option>
            ))}
          </select>

          <input 
            type="text" 
            placeholder="Enter your 4-digit Login ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border p-2 mb-4 w-full"
          />
          <input 
            type="file" 
            multiple 
            onChange={handleFileChange}
            className="border p-2 mb-4 w-full"
          />
          <button 
            onClick={() => handleUpload()} 
            className="bg-blue-500 text-white w-full p-2"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </Router>
  );
}

export default App;

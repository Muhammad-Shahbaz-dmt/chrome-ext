import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const SecretGenerator = () => {
  const [secret, setSecret] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const generateSecret = () => {
    // Generate a random secret
    const newSecret = Math.random().toString(36).slice(2);
    setSecret(newSecret);
    localStorage.setItem('secret', encryptSecret(newSecret, password));
  };

  const encryptSecret = (secret, password) => {
    // Encrypt the secret using AES encryption and the password as the key
    return CryptoJS.AES.encrypt(secret, password).toString();
  };

  const decryptSecret = (encryptedSecret, password) => {
    // Decrypt the encrypted secret using AES decryption and the password as the key
    return CryptoJS.AES.decrypt(encryptedSecret, password).toString(CryptoJS.enc.Utf8);
  };

  const handleNextClick = () => {
    if (password === confirmPassword) {
      generateSecret();
      setLoggedIn(true);
    } else {
      alert('Passwords do not match!');
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('secret');
    setPassword('');
    setConfirmPassword('');
    setLoggedIn(false);
  };

  const handleResetClick = () => {
    localStorage.clear();
    setSecret('');
    setPassword('');
    setConfirmPassword('');
    setLoggedIn(false);
  };

  if (!loggedIn) {
    // New user: show autogenerated secret and password fields
    return (
      <div>
        <p>Your secret: {secret || 'None'}</p>
        <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <button onClick={handleNextClick}>Next</button>
      </div>
    );
  } else {
    // Logged in user: show secret, regenerate button, and logout button
    const encryptedSecret = localStorage.getItem('secret');
    const decryptedSecret = decryptSecret(encryptedSecret, password);
    return (
      <div>
        <p>Your secret: {decryptedSecret || 'None'}</p>
        <button onClick={generateSecret}>Regenerate</button>
        <button onClick={handleLogoutClick}>Logout</button>
        <button onClick={handleResetClick}>Reset</button>
      </div>
    );
  }
};

export default SecretGenerator;

import React, { useEffect, useState } from 'react';
import "./App.css";
import CryptoJS from 'crypto-js';

class SecretGenerator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secret: '',
      newSecret: '',
      password: '',
      confirmPassword: '',
      loggedIn: false,
      errorMessage: ''
    };
  }

  componentDidMount() {
    const encryptedSecret = localStorage.getItem('secret');
    if (encryptedSecret) {
      this.setState({ secret: encryptedSecret });
    } else {
      this.generateSecretToShow();
    }
  }

  generateSecret = () => {
    const newSecret = Math.random().toString(36).slice(2);
    this.setState({ secret: newSecret });
    localStorage.setItem('secret', this.encryptSecret(newSecret, this.state.password));
  };

  saveSecret = (newSecret) => {
    this.setState({ secret: newSecret });
    localStorage.setItem('secret', this.encryptSecret(newSecret, this.state.password));
  };

  generateSecretToShow = () => {
    const newSecret = Math.random().toString(36).slice(2);
    this.setState({ newSecret });
  };

  encryptSecret = (secret, password) => {
    return CryptoJS.AES.encrypt(secret, password).toString();
  };

  decryptSecret = (encryptedSecret, password) => {
    return CryptoJS.AES.decrypt(encryptedSecret, password).toString(CryptoJS.enc.Utf8);
  };

  handleVerifySecret = () => {
    if (this.state.password.trim() === '') {
      this.setState({ errorMessage: 'Password is required' });
    } else {
      try {
        const encryptedSecretKey = localStorage.getItem('secret');
        let plainSecretText = this.decryptSecret(encryptedSecretKey, this.state.password);
        if (!plainSecretText) {
          this.setState({ errorMessage: 'System is unable to authenticate you' });
        } else {
          this.setState({ loggedIn: true, errorMessage: '' });
        }
      } catch (e) {
        this.setState({ errorMessage: 'System is unable to authenticate you' });
      }
    }
  };

  handleNextClick = () => {
    if (this.state.password.trim() === '' || this.state.confirmPassword.trim() === '') {
      this.setState({ errorMessage: 'Both password fields are required' });
    } else if (this.state.password === this.state.confirmPassword) {
      this.saveSecret(this.state.newSecret);
      this.setState({ loggedIn: true, errorMessage: '' });
    } else {
      this.setState({ errorMessage: 'Passwords do not match!' });
    }
  };

  handleLogoutClick = () => {
    localStorage.removeItem('secret');
    this.setState({
      password: '',
      confirmPassword: '',
      loggedIn: false
    });
  };

  handleResetClick = () => {
    localStorage.clear();
    this.setState({
      secret: '',
      password: '',
      confirmPassword: '',
      loggedIn: false
    });
    this.generateSecretToShow();
  };

  render() {
    if (this.state.loggedIn) {
      const encryptedSecret = localStorage.getItem('secret');
      const decryptedSecret = this.decryptSecret(encryptedSecret, this.state.password);
      return (
        <div className="secret-generator">
          <p>Your secret: {decryptedSecret || 'None'}</p>
          <button onClick={this.generateSecret}>Regenerate</button>
          <button onClick={this.handleLogoutClick}>Logout</button>
        </div>
      );
    } else if (this.state.secret && !this.state.loggedIn) {
      return (
        <div className="secret-generator">
          <input type="password"
            onChange={(e) => this.setState({ password: e.target.value })}
            value={this.state.password}
            placeholder="Enter Password" />
          <button onClick={this.handleVerifySecret}>Next</button>
          <button onClick={this.handleResetClick}>Reset</button>
          {this.state.errorMessage && <p className="error">{this.state.errorMessage}</p>}
        </div>
      );
    } else {
      return (
        <div className="secret-generator">
          <p>Create a new secret</p>
          <p>Generated Secret: {this.state.newSecret}</p>
          <input type="password"
            onChange={(e) => this.setState({ password: e.target.value })}
            value={this.state.password}
            placeholder="Enter Password" />
          <input type="password"
            onChange={(e) => this.setState({ confirmPassword: e.target.value })}
            value={this.state.confirmPassword}
            placeholder="Confirm Password" />
          <button onClick={this.handleNextClick}>Next</button>
          {this.state.errorMessage && <p className="error">{this.state.errorMessage}</p>}

        </div>
      );
    }
  }
}

export default SecretGenerator;

import React, { useState } from 'react';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const [state, setState] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { username, password } = state;

    try {
      const response = await fetch('https://da.maskideo.pw:5052/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Сохраняем токен сессии в localStorage
          localStorage.setItem('sessionToken', data.session_token);
          localStorage.setItem('sessionUsername', data.session_username);

          console.log('Успешная аутентификация');
          navigate('/home');
        } else {
          console.error('Ошибка аутентификации:', data.error);
        }
      } else {
        console.error('Ошибка аутентификации');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-box">
      <h2>Авторизация</h2>
      <form onSubmit={handleSubmit}>
        <div className="user-box">
          <input
            type="text"
            id="username"
            name="username"
            value={state.username}
            onChange={handleInputChange}
            required
          />
          <label>Логин</label>
        </div>
        <div className="user-box">
          <input
            type="password"
            id="password"
            name="password"
            value={state.password}
            onChange={handleInputChange}
            required
          />
          <label>Пароль</label>
        </div>
       
        <button className='btn' type='submit'>
          
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Войти
        </button>
       
      </form>
    </div>
  );
}

export default LoginForm;


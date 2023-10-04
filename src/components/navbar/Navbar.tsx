import React, { useState, useEffect } from "react";
import "./navbar.scss";
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const sessionUsername = localStorage.getItem('sessionUsername');
  const [userPhoto, setUserPhoto] = useState<string | null>("");

  const handleLogout = () => {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('sessionUsername');
    navigate("/");
  };

  const fetchUserPhoto = async () => {
    try {
      
      const response = await fetch("http://31.129.106.235:5052/get_user_photo", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionUsername }),
      });

      if (response.ok) {
        const data = await response.json();
        const userPhotoUrl = data.current_user;

      
        setUserPhoto(userPhotoUrl);
      } else {
        console.error("Ошибка при получении URL фото пользователя");
      }
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
    }
  };


const handlePhotoClick = () => {
  
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async (e) => {
    const file = e.target?.files?.[0];
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
      formData.append("user", sessionUsername || '');
      setUserPhoto(URL.createObjectURL(file));
      const response = await fetch("http://31.129.106.235:5052/add_photo", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("Данные успешно отправлены на сервер");
      }
    }
  };
  input.click();
};

  useEffect(() => {

    fetchUserPhoto();
  }, []);

  return (
    <div className="navbar">
      <div className="logo">
        <img src="logo.svg" alt="" />
        <span>ProfitONN</span>
      </div>
      <div className="icons">
        <div className="user" onClick={handlePhotoClick}>
          <img
            src={userPhoto || "https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"}
            alt=""
          />
          <span>{sessionUsername}</span>
        </div>
        <button className="exitButton" onClick={handleLogout}>Выход</button>
      </div>
    </div>
  );
};

export default Navbar;



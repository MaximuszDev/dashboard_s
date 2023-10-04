import React, { useState, useEffect } from "react";
import "./topBox.scss";

interface User {
  id: number;
  img: string;
  username: string;
  email: string;
  amount: number;
}

const TopBox: React.FC = () => {
  const [topDealUsers, setTopDealUsers] = useState<User[]>([]);


  useEffect(() => {
    fetch("http://31.129.106.235:5052/get_users", {
      method: "POST",
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setTopDealUsers(data.users);
        } else {
          console.error("Ошибка при получении данных1:", data.error);
        }
      })
      .catch((error) => {
        console.error("Ошибка при получении данных2:", error);
      });
  }, []);

  return (
    <div className="topBox">
      <h1>Top Deals</h1>
      <div className="list">
        {topDealUsers.map((user) => (
          <div className="listItem" key={user.id}>
            <div className="user">
              <img src={user.img} alt="" />
              <div className="userTexts">
                <span className="username">{user.username}</span>
                <span className="email">{user.email}</span>
              </div>
            </div>
            <span className="amount">${user.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBox;

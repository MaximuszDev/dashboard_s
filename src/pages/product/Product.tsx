import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import Add from "./productadd";
import "./product.scss";


interface Website {
  ids: number;
  nameWebsite: string;
  image: string;
}

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const [open, setOpen] = useState(false);

  // Выполняем запрос к серверу для получения списка сайтов по productID
  const { isLoading, data } = useQuery<{
    success: boolean;
    websites: Website[];
  }>({
    queryKey: ["allproducts", id], // Включаем выбранный оффер в ключ запроса
    queryFn: () =>
      fetch("https://da.maskideo.pw:5052/get_websites", {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({ id }), // Включаем выбранный оффер в тело запроса
      }).then((res) => res.json()),
  });
 

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  return (
    <div>
      <h1>Детали продукта {id}</h1>
      <button onClick={() => setOpen(true)}>Добавить сайт</button>

      <div className="container">
        {isLoading ? (
          "Loading..."
        ) : data && data.websites ? (
          data.websites.map((website) => (
            <div className="card" key={website.ids}> 
              <img
                src={website.image}
                alt={website.nameWebsite}
                onClick={() => handleImageClick(website.image)} // Обработчик клика на изображение
              />
              <h2>Сайт {website.nameWebsite}</h2> 
            </div>
          ))
        ) : (
          "No data available"
        )}
      </div>

      {open && <Add setOpen={setOpen} slug={""} columns={[]} />}
      
      {selectedImage && (
        <div className="fullscreen-image">
          <img
            src={selectedImage}
            alt="Full-Screen"
            onClick={() => setSelectedImage(null)} // Закрывает изображение при клике на него
          />
        </div>
      )}
    </div>
  );
};

export default Product;

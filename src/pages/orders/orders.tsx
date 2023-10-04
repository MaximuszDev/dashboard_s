import React, { useState } from "react";
import "./orders.scss";
import Add from "./AddProductForm";
import { useQuery, } from "@tanstack/react-query";
import CreativeCard from "./orderCard";

interface Creative {
  id: number;
  img: string;
  productName: string;
  description: string;
}

const Products: React.FC = () => {
  const sessionUsername = localStorage.getItem('sessionUsername');
  const [open, setOpen] = useState(false);
  

  const { isLoading, data } = useQuery<{
    success: boolean;
    creatives: Creative[];
  }>({
    queryKey: ["allproducts",], // Включаем выбранный оффер в ключ запроса
    queryFn: () =>
      fetch("https://da.maskideo.pw:5052/get_products", {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({ sessionUsername }), // Включаем выбранный оффер в тело запроса
      }).then((res) => res.json()),
  });

  return (
    <div className="products">
      <div className="info">
        <h1>Продукты</h1>
        <button onClick={() => setOpen(true)}>Добавить новый продукт</button>

      </div>

      {isLoading ? (
        "Loading..."
      ) : data && data.creatives ? (
        <div className="creative-cards">
          {data.creatives.map((creative) => (
            <CreativeCard key={creative.id} creative={creative} />
          ))}

       
        </div>
      ) : (
        "No data available"
      )}

      {open && <Add setOpen={setOpen} slug={""} columns={[]} />}
    </div>
  );
};

export default Products;

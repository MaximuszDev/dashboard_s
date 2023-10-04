import React, { useState } from "react";
import "./products.scss";
import Add from "../../components/add/Add";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CreativeCard from "./CreativeCard";

interface Creative {
  id: number;
  img: string;
  title: string;
  color: string;
  price: string;
  producer: string;
  createdAt: string;
  inStock: boolean;
}

const Products: React.FC = () => {
  const sessionUsername = localStorage.getItem('sessionUsername');
  const [open, setOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<string>(""); 

  // Функция для обновления выбранного оффера
  const handleOfferSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = e.target.value;
    setSelectedOffer(selectedValue); // Обновляем состояние с выбранным оффером
  };

  const { isLoading, data } = useQuery<{
    success: boolean;
    creatives: Creative[];
  }>({
    queryKey: ["allproducts", selectedOffer], // Включаем выбранный оффер в ключ запроса
    queryFn: () =>
      fetch("https://da.maskideo.pw:5052/get_creatives", {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({ sessionUsername, selectedOffer }), // Включаем выбранный оффер в тело запроса
      }).then((res) => res.json()),
  });

  return (
    <div className="products">
      <div className="info">
        <h1>Креативы</h1>
        <button onClick={() => setOpen(true)}>Добавить новый креатив</button>
        <select
          name="price"
          className="selectOption"
          value={selectedOffer}
          onChange={handleOfferSelectChange} // Добавляем обработчик изменения выбора оффера
        >
          <option value="">Выберите оффер</option>
          <option value="ProStrong русский">ProStrong русский</option>
          <option value="ProStrong казахский">ProStrong казахский</option>
          <option value="CardioSei русский">CardioSei русский</option>
          <option value="CardioSei казахский">CardioSei казахский</option>
          {/* Добавьте другие варианты офферов по аналогии */}
        </select>
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

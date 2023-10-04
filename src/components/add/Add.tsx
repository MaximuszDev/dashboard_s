import React, { useState } from "react";
import "./Add.scss";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  slug: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Add: React.FC<Props> = (props) => {
  const [newItem, setNewItem] = useState({
    price: "" as string, // Выбранное значение
    domain: "" as string,
    file: null as File | null,
  });

  const queryClient = useQueryClient();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { price, domain, file } = newItem;

    try {
      const formData = new FormData();
      formData.append("price", price);
      formData.append("domain", domain);
      if (file) {
        formData.append("file", file);
      }

      const response = await fetch("http://31.129.106.235:5052/add_creative", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Данные успешно отправлены на сервер");
        setNewItem({
          price: "",
          domain: "",
          file: null,
        });

        // Обновляем таблицу после успешного добавления
        queryClient.invalidateQueries(["allproducts"]); // Здесь используйте правильный ключ запроса
        props.setOpen(false);
      } else {
        console.error("Ошибка при отправке данных на сервер");
      }
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
    }
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => props.setOpen(false)}>
          X
        </span>
        <h1>Add new {props.slug}</h1>
        <form onSubmit={handleSubmit}>
          <div className="item">
            <label>Оффер</label>
            <select
              name="price"
              value={newItem.price}
              onChange={handleInputChange}
              className="selectOption"
            >
              <option value="All">Выберите оффер</option>
              <option value="ProStrong русский">ProStrong русский</option>
              <option value="ProStrong казахский">ProStrong казахский</option>
              <option value="CardioSei русский">CardioSei русский</option>
              <option value="CardioSei казахский">CardioSei казахский</option>
              {/* Добавьте другие варианты офферов по аналогии */}
            </select>
          </div>
          <div className="item">
            <label>Домен</label>
            <input
              type="text"
              name="domain"
              placeholder="Domain"
              value={newItem.domain}
              onChange={handleInputChange}
            />
          </div>
          <div className="item">
            <label>Креатив</label>
            <input
              type="file"
              accept="image/*,video/*"
              name="file"
              onChange={(e) =>
                setNewItem({ ...newItem, file: e.target.files ? e.target.files[0] : null })
              }
            />
          </div>
          <button type="submit">Отправить</button>
        </form>
      </div>
    </div>
  );
};

export default Add;

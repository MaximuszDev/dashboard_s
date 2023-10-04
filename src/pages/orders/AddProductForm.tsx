import React, { useState } from "react";
import "./AddProductForm.scss";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  slug: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Add: React.FC<Props> = (props) => {
  const [newItem, setNewItem] = useState({
    productName: "" as string,
    file: null as File | null,
    description: "" as string
  });

  const queryClient = useQueryClient();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { productName, file, description } = newItem;

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("productName", productName);
      if (file) {
        formData.append("file", file);
      }

      const response = await fetch("http://31.129.106.235:5052/add_products", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Данные успешно отправлены на сервер");
        setNewItem({
          productName: "",
          file: null,
          description: ""
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
        <h1>Добавить новый продукт{props.slug}</h1>
        <form onSubmit={handleSubmit}>
          <div className="item">
            <label>Название продукта</label>
            <input
              type="text"
              name="productName"
              placeholder="название продукта"
              value={newItem.productName}
              onChange={handleInputChange}
            />
          </div>
          <div className="item">
            <label>Фото продукта</label>
            <input
              type="file"
              accept="image/*,video/*"
              name="file"
              onChange={(e) =>
                setNewItem({ ...newItem, file: e.target.files ? e.target.files[0] : null })
              }
            />
          </div>
          <div className="item">
            <label>Описание</label>
            <input
              type="text"
              name="description"
              placeholder="Описание"
              value={newItem.description}
              onChange={handleInputChange}
            />
          </div>
          
          <button type="submit">Отправить</button>
        </form>
      </div>
    </div>
  );
};

export default Add;

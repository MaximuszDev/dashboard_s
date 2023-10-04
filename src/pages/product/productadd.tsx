import React, { useState } from "react";
import "./productadd.scss";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from 'react-router-dom';

interface Props {
  slug: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Add: React.FC<Props> = (props) => {
  const [newItem, setNewItem] = useState({
    webLink: "" as string,
    nameWebsite: "" as string,
    file: null as File | null,
  });

  const queryClient = useQueryClient();
  const { id } = useParams<{ id?: string }>(); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { webLink, nameWebsite, file } = newItem;

    try {

      if (!id) {
        // Обработка ситуации, когда id отсутствует
        return <div>Отсутствует параметр id</div>;
      }
      const formData = new FormData();
      formData.append("webLink", webLink);
      formData.append("nameWebsite", nameWebsite);
      formData.append("productID", id);
      if (file) {
        formData.append("file", file);
      }

      const response = await fetch("https://da.maskideo.pw:5052/add_website", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Данные успешно отправлены на сервер");
        setNewItem({
          webLink: "",
          nameWebsite: "",
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
            <label>Cсылка на сайт</label>
            <input
              type="text"
              name="webLink"
              placeholder="Ссылка на сайт"
              value={newItem.webLink}
              onChange={handleInputChange}
            />
          </div>
          <div className="item">
            <label>Название в Кейтаро</label>
            <input
              type="text"
              name="nameWebsite"
              placeholder="название в кейтаро"
              value={newItem.nameWebsite}
              onChange={handleInputChange}
            />
          </div>
          <div className="item">
            <label>Фото сайта</label>
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

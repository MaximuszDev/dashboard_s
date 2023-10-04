import React, { useState } from "react";
import "./CreativeCard.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreativeCardProps {
  creative: Creative; 
}

const CreativeCard: React.FC<CreativeCardProps> = ({ creative }) => {
  const sessionUsername = localStorage.getItem('sessionUsername');
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: number) => {
      return fetch(`https://da.maskideo.pw:5052/delete`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id,sessionUsername }),
      });
    },
    onSuccess: () => {
        queryClient.invalidateQueries(["allproducts"]); 
    },
  });

  const handleDelete = (id: number) => {
    mutation.mutate(id);
  };

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleVideoClick = () => {
    setIsVideoPlaying(!isVideoPlaying);
    const videoElement = document.getElementById(`video-${creative.id}`) as HTMLVideoElement;

    if (videoElement) {
      if (!isVideoPlaying) {
        videoElement.play();
      } else {
        videoElement.pause();
      }
    }
  };

  const handleDownload = async (id: number) => {
    try {
      const response = await fetch(`https://da.maskideo.pw:5052/download`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, sessionUsername }),
      });

      if (response.ok) {
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1]
          : 'downloaded_file';

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Ошибка при скачивании файла");
      }
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
    }
  };

  const handleReserve = async (id: number) => {
    try {
      const response = await fetch(`https://da.maskideo.pw:5052/reserve`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, sessionUsername }),
      });
      if (response.ok) {
        console.log("Успешный запрос на бронирование");
        alert("Успешно забронировано!");
        queryClient.invalidateQueries([`all${creative.slug}`]);
      } else {
        console.error("Ошибка при запросе на бронирование");
        alert("Ошибка при бронировании!");
      }
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
    }
  };

  return (
    <div className="creative-card">
      {creative.img.endsWith(".mp4") ? (
        <video
        className="video"
          id={`video-${creative.id}`}
          src={creative.img}
          controls
          onClick={handleVideoClick}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <img src={creative.img} alt="" />
      )}
      <h2 className="title">{creative.title}</h2>
      <p>Оффер: {creative.price}</p>
      <p>Арбитражник: {creative.producer}</p>
      <div className="action">
        <div className="delete" onClick={() => handleDownload(creative.id)}>
          <img src="/dw.png" alt="" />
        </div>
        <div className="delete" onClick={() => handleDelete(creative.id)}>
          <img src="/delete.svg" alt="" />
        </div>
        <div className="delete" onClick={() => handleReserve(creative.id)}>
          <img src="/view.svg" alt="" />
        </div>
      </div>
    </div>
  );
};

export default CreativeCard;

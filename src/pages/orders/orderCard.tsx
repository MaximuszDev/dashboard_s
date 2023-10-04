import React, { useState } from "react";
import "./orderCard.scss";
import { Link } from 'react-router-dom';
interface CreativeCardProps {
  creative: Creative; 
}

const CreativeCard: React.FC<CreativeCardProps> = ({ creative }) => {



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


  return (
    <div className="offers-card">
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
      <div className="text-container">
        <h2>{creative.productName}</h2>
        <p>Оффер: {creative.productName}</p>
        <p>Описание: {creative.description}</p>
      </div>
      <button className="more">
        <Link to={`/home/orders/${creative.id}`}>Подробнее</Link>
      </button>
    </div>
  );
};

export default CreativeCard;

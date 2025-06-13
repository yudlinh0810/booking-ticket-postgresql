import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

type StarRatingProps = {
  value?: number;
  onChange?: (rating: number) => void;
};

const StarRating: React.FC<StarRatingProps> = ({ value = 0, onChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hover || value);
        return (
          <FaStar
            key={star}
            size={24}
            color={isFilled ? "#ffc107" : "#e4e5e9"}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange?.(star)}
            style={{ cursor: "pointer", transition: "color 0.2s" }}
          />
        );
      })}
    </div>
  );
};

export default StarRating;

import { Star } from "lucide-react";
import { useState } from "react";

interface Props {
  value: number;
  onChange?: (v: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
}

const sizes = { sm: "w-3 h-3", md: "w-5 h-5", lg: "w-6 h-6" };

export default function StarRating({
  value,
  onChange,
  size = "md",
  readonly = false,
}: Props) {
  const [hovered, setHovered] = useState(0);
  const effective = hovered || value;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={readonly}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => !readonly && setHovered(i)}
          onMouseLeave={() => !readonly && setHovered(0)}
        >
          <Star
            className={`${sizes[size]} ${
              i <= effective
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

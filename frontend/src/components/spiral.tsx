import { useEffect, useRef, useState } from "react";

const Spiral = () => {
  const [count, setCount] = useState(20);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const rows = ["🗺️🤔🔍", "🔍🗺️🤔", "🤔🔍🗺️"];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setCount((prev) => prev + 10); // Load more spiral rows
      }
    });

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          {rows[i % 3]}
        </div>
      ))}
      <div ref={sentinelRef} style={{ height: "1px" }}></div>
    </div>
  );
};

export default Spiral;

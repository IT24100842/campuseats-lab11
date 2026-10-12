export default function DishCard({ dish }) {
  if (!dish) return null;

  return (
    <div className="dish-card">
      <h3>{dish.name}</h3>
      <p>Rs. {Number(dish.price).toFixed(2)}</p>
      <small>{dish.category}</small>
      {!dish.available && <span> — Sold out</span>}
    </div>
  );
}


import MenuItemCard from "../MenuItemCard.jsx";

function MenuList({ dishes, items, onToggleFavourite }) {
  const list = dishes ?? items ?? [];

  if (!list.length) return null;

  return (
    <div className="grid">
      {list.map((dish, index) => (
        <MenuItemCard
          key={dish.id ?? dish.name ?? index}
          item={dish}
          onToggleFavourite={onToggleFavourite}
        />
      ))}
    </div>
  );
}

export default MenuList;

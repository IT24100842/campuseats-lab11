import { memo } from "react";
import Card from "../../components/ui/Card.jsx";

// ── Slides 42–43: React.memo in a real component ─────────────────
// Without memo: typing in the search box re-renders EVERY card on
// every keystroke. With memo: a card re-renders only when ITS item
// prop changes. Watch the console while typing.
function MenuItemCard({ item, onToggleFavourite }) {
  console.log(`render <MenuItemCard> ${item.name}`);

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>{item.name}</h3>
        <button
          className="btn btn-ghost"
          style={{ padding: "2px 8px" }}
          title="Toggle favourite (optimistic update)"
          onClick={() => onToggleFavourite(item)}
        >
          {item.isFavourite ? "❤️" : "🤍"}
        </button>
      </div>
      <span className="badge">{item.category}</span>{" "}
      <span className="badge gray">{item.outlet}</span>
      <p className="price">Rs. {item.price}</p>
      {!item.available && <p className="error muted">Sold out today</p>}
    </Card>
  );
}

export default memo(MenuItemCard);

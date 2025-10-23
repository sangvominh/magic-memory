import "./SingleCard.css";

export default function SingleCard({ card, handleChoice, flipped, disable }) {
  return (
    <>
      <div className="card">
        <div className={flipped ? "flipped" : ""}>
          <img src={card.src} alt="front card" className="front-card" />
          <img
            src="/magic-memory/img/cover.png"
            alt="front card"
            className="back-card"
            onClick={() => {
              if (!disable) handleChoice(card);
            }}
          />
        </div>
      </div>
    </>
  );
}

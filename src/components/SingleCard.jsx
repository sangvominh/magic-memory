import "./SingleCard.css";

export default function SingleCard({ card, handleChoice, abc }) {

  const handleClick = () => {
    console.log(card.src)
  }

  return (
    <>
      <div className="card">
        <img src={card.src} alt="front card" className="front-card" />
        <img src="/img/cover.png" alt="front card" className="back-card" onClick={handleClick} />
      </div>
    </>
  );
}

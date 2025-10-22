import React, { useState, useEffect } from "react";

// Reusable Bot Card
const BotCard = ({ bot, onClick, onDelete }) => (
  <div
    style={{
      border: "1px solid gray",
      borderRadius: "8px",
      padding: "10px",
      width: "200px",
      position: "relative",
      cursor: onClick ? "pointer" : "default",
    }}
    onClick={onClick}
  >
    <button
      onClick={(e) => {
        e.stopPropagation(); // prevent triggering onClick of card
        onDelete(bot);
      }}
      style={{
        position: "absolute",
        top: "5px",
        right: "5px",
        backgroundColor: "red",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: "24px",
        height: "24px",
        fontWeight: "bold",
        cursor: "pointer",
      }}
      title="Discharge bot"
    >
      x
    </button>
    <img
      src={bot.avatar_url}
      alt={bot.name}
      style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
    />
    <h3>{bot.name}</h3>
    <p>Class: {bot.bot_class}</p>
    <p>Health: {bot.health}</p>
    <p>Damage: {bot.damage}</p>
    <p>Armor: {bot.armor}</p>
    <p>
      <em>{bot.catchphrase}</em>
    </p>
  </div>
);

function App() {
  const [bots, setBots] = useState([]);
  const [army, setArmy] = useState([]);

  // Fetch bots from server
  useEffect(() => {
    fetch("http://localhost:8002/bots")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched bots:", data); // Debug
        setBots(data);
      })
      .catch((error) => console.error("Error fetching bots:", error));
  }, []);

  // Enlist bot to army (if not already there)
  const enlistBot = (bot) => {
    if (!army.find((b) => b.id === bot.id)) {
      setArmy([...army, bot]);
    }
  };

  // Remove from army
  const releaseBot = (bot) => {
    setArmy(army.filter((b) => b.id !== bot.id));
  };

  // Delete from server and remove from both arrays
  const dischargeBot = (bot) => {
    fetch(`http://localhost:8002/bots/${bot.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete bot");
        }
        setBots(bots.filter((b) => b.id !== bot.id));
        setArmy(army.filter((b) => b.id !== bot.id));
      })
      .catch((error) => {
        console.error("Error deleting bot:", error);
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Bot Collection</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {bots.map((bot) => (
          <BotCard
            key={bot.id}
            bot={bot}
            onClick={() => enlistBot(bot)}
            onDelete={dischargeBot}
          />
        ))}
      </div>

      <h2 style={{ marginTop: "40px" }}>🛡️ Your Bot Army</h2>
      {army.length === 0 ? (
        <p>You haven’t enlisted any bots yet.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {army.map((bot) => (
            <BotCard
              key={bot.id}
              bot={bot}
              onClick={() => releaseBot(bot)}
              onDelete={dischargeBot}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
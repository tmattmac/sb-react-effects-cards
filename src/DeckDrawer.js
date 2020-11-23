import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './DeckDrawer.css';

const API = 'https://deckofcardsapi.com/api/deck';

const DeckDrawer = () => {
    const [cards, setCards] = useState([]);
    const [deckId, setDeckId] = useState(null);
    const [drawing, setDrawing] = useState(false);
    const [deckEmpty, setDeckEmpty] = useState(false);
    const timerRef = useRef(null);

    const shuffleDeck = () => {
        axios.get(`${API}/${deckId}/shuffle`)
            .then(() => {
                setCards([]);
                setDeckEmpty(false);
            });
    };

    const handleClick = () => {
        if (deckEmpty) shuffleDeck();
        else setDrawing(drawing => !drawing);
    };

    useEffect(() => {
        axios.get(`${API}/new/shuffle`)
            .then(({ data }) => {
                setDeckId(data.deck_id);
            });
    }, []);

    useEffect(() => {
        if (!drawing) return;

        const drawCard = () => {
            axios.get(`${API}/${deckId}/draw`)
                .then(({ data: { cards: [card], remaining } }) => {
                    setCards(cards => [...cards, card.image]);
                    if (remaining === 0) {
                        setDeckEmpty(true);
                        setDrawing(false);
                    }
                });
        };
        timerRef.current = setInterval(drawCard, 1000);
        return () => clearInterval(timerRef.current);
    }, [drawing, deckId]);

    const drawButton = (
        <button onClick={handleClick}>
            {deckEmpty ? 'Shuffle' : (drawing ? 'Stop Drawing' : 'Start Drawing')}
        </button>
    );

    return deckId ? (
        <div className="DeckDrawer">
            {drawButton}
            {cards.map((card, idx) => (
                <img
                    src={card}
                    key={card}
                    alt=""
                    style={{ left: `${idx * 40}px` }}
                />)
            )}
        </div>
    ) : <div>Loading...</div>;
};

export default DeckDrawer;
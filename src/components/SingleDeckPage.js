import React, { useEffect, useCallback, useState } from 'react';

import { NavLink, useHistory } from 'react-router-dom';

const SingleDeckPage = (props) => {
  const { match } = props;
  const { params } = match;
  const { id } = params;

  const history = useHistory();

  const [deck, setDeck] = useState();
  const [cards, setCards] = useState();
  const [cardsDiv, setCardsDiv] = useState();

  const saveToLocalStorage = () => {
    const deckCopy = deck;
    deckCopy.cards = cards;

    localStorage.setItem(id, JSON.stringify(deckCopy));
  };

  const addCard = () => {
    setCards((prevCards) => [...prevCards, { title: '', body: '' }]);
  };

  const deleteCard = useCallback(
    (index) => {
      setCards((prevCards) => prevCards.filter((_, i) => i !== index));
      setCardsDiv((prevCards) => prevCards.filter((_, i) => i !== index));
    },
    [cards],
  );

  const changeTitle = useCallback(
    (index, value) => {
      const tempCard = cards[index];
      tempCard.title = value;

      setCards((prevCards) => [
        ...prevCards.slice(0, index),
        tempCard,
        ...prevCards.slice(index + 1),
      ]);
    },
    [cards],
  );

  const changeBody = useCallback(
    (index, value) => {
      const tempCard = cards[index];
      tempCard.body = value;

      setCards((prevCards) => [
        ...prevCards.slice(0, index),
        tempCard,
        ...prevCards.slice(index + 1),
      ]);
    },
    [cards],
  );

  const loadDeck = () => {
    if (id !== 'create') {
      if (localStorage.getItem(id) !== null) {
        setDeck(JSON.parse(localStorage.getItem(id)));
      } else {
        history.push('/decks');
      }
    } else {
      const deckName = prompt('Enter deck name');
      if (deckName === null || deckName === '' || deckName.length < 1) {
        history.push('/decks');
        return;
      }

      const deckId = `${deckName.replace(/\s+/g, '-').toLowerCase()}-${
        Math.floor(Math.random() * 90000) + 10000
      }`;

      const tempDeck = {
        id: deckId,
        name: deckName,
        cards: [],
      };

      localStorage.setItem(deckId, JSON.stringify(tempDeck));

      const decks = JSON.parse(localStorage.getItem('decks'));
      decks.push(deckId);
      localStorage.setItem('decks', JSON.stringify(decks));

      history.push('/decks');
    }
  };

  const loadCards = () => {
    setCards(deck.cards);
  };

  const loadCardsDiv = () => {
    const tempCards = cards.map((item, index) => {
      return (
        <div key={`card${index}`} className="card">
          <button
            type="button"
            className="card__delete"
            onClick={() => deleteCard(index)}
          >
            X
          </button>
          <input
            type="text"
            className="card__title"
            defaultValue={item.title}
            onChange={(e) => changeTitle(index, e.target.value)}
          />
          <textarea
            className="card__body"
            defaultValue={item.body}
            onChange={(e) => changeBody(index, e.target.value)}
          />
        </div>
      );
    });

    setCardsDiv(tempCards);
  };

  useEffect(() => {
    loadDeck();
  }, []);

  useEffect(() => {
    if (deck !== undefined) {
      loadCards();
    }
  }, [deck]);

  useEffect(() => {
    if (cards !== undefined) {
      loadCardsDiv();
    }
  }, [cards]);

  return (
    <div className="cards">
      <NavLink to="/decks" className="cards__back">
        &lt; Back
      </NavLink>
      <div className="cards__title">{deck !== undefined && deck.name}</div>
      <div className="cards__buttons">
        <button type="button" className="button" onClick={saveToLocalStorage}>
          Save
        </button>

        <button type="button" className="button" onClick={addCard}>
          Add Card
        </button>
      </div>

      <div className="cards__cards">{cardsDiv}</div>
    </div>
  );
};

export default SingleDeckPage;

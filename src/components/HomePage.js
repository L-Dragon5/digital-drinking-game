import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';

const HomePage = () => {
  const history = useHistory();
  const [gameActive, setGameActive] = useState(false);
  const [playDisabled, setPlayDisabled] = useState(false);
  const [activeDeckIds, setActiveDeckIds] = useState();
  const [cards, setCards] = useState();

  const shuffle = (array) => {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  const handleClick = (url) => {
    history.push(url);
  };

  const beginGame = () => {
    // TODO: Fade out all elements. Display deck of cards. Clicking on card will pick a random card in deck and display.
    console.log(cards);
    setGameActive(true);
  };

  const loadActiveDeckIds = () => {
    if (localStorage.getItem('active_decks') === null) {
      localStorage.setItem('active_decks', JSON.stringify([]));
      setActiveDeckIds([]);
    } else {
      setActiveDeckIds(JSON.parse(localStorage.getItem('active_decks')));
    }
  };

  const loadCards = () => {
    if (activeDeckIds.length < 1) {
      setPlayDisabled(true);
    } else {
      const tempCards = activeDeckIds.map((id) => {
        const d = JSON.parse(localStorage.getItem(id));

        return d.cards;
      });

      setCards(shuffle([].concat(...tempCards)));
    }
  };

  useEffect(() => {
    loadActiveDeckIds();
  }, []);

  useEffect(() => {
    if (activeDeckIds !== undefined) {
      loadCards();
    }
  }, [activeDeckIds]);

  return (
    <>
      <div className={`home ${gameActive ? 'home--hide' : ''}`}>
        <div className="home__title">Digital Drinking Game</div>
        <div className="home__buttons">
          <button
            type="button"
            className={`button ${playDisabled ? 'button--disabled' : ''}`}
            disabled={playDisabled}
            onClick={beginGame}
          >
            Play Now
          </button>
          <button
            type="button"
            className="button"
            onClick={() => {
              handleClick('/decks');
            }}
          >
            Decks
          </button>
        </div>
      </div>
      <div className="home__about">Created by Joe (@L-Dragon)</div>

      <div className={`game ${gameActive ? 'game--active' : ''}`}>
        <div className="game__content">
          <div className="game__title">Game Time!</div>
          <div className="game__card" />
        </div>
      </div>
    </>
  );
};

export default HomePage;

import React, { useEffect, useState, useCallback } from 'react';

import { useHistory } from 'react-router-dom';

const HomePage = () => {
  const history = useHistory();
  const [gameActive, setGameActive] = useState(false);
  const [flipCard, setFlipCard] = useState(false);
  const [playDisabled, setPlayDisabled] = useState(false);
  const [activeDeckIds, setActiveDeckIds] = useState();
  const [cards, setCards] = useState();
  const [currentCard, setCurrentCard] = useState();

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

  const changeCard = useCallback(() => {
    setTimeout(() => {
      if (cards.length < 1) {
        setCurrentCard({
          title: 'No more cards!',
          body: 'Thanks for playing! Refresh the page to start over.',
        });
      } else {
        const randomIndex = Math.floor(Math.random() * cards.length);
        setCurrentCard(cards[randomIndex]);
        setCards((prevCards) => prevCards.filter((_, i) => i !== randomIndex));
      }

      setFlipCard(false);
    }, 750);
  }, [cards]);

  const loadActiveDeckIds = () => {
    if (localStorage.getItem('active_decks') === null) {
      localStorage.setItem('active_decks', JSON.stringify([]));
      setActiveDeckIds([]);
    } else {
      setActiveDeckIds(JSON.parse(localStorage.getItem('active_decks')));
    }
  };

  const loadCards = () => {
    const tempCards = activeDeckIds.map((id) => {
      const d = JSON.parse(localStorage.getItem(id));

      return d.cards;
    });

    setCards(shuffle([].concat(...tempCards)));
  };

  const beginGame = useCallback(() => {
    if (activeDeckIds !== undefined) {
      loadCards();
    }
    setGameActive(true);
  }, [activeDeckIds]);

  useEffect(() => {
    loadActiveDeckIds();
  }, []);

  useEffect(() => {
    if (activeDeckIds !== undefined) {
      if (activeDeckIds.length < 1) {
        setPlayDisabled(true);
      } else {
        setPlayDisabled(false);
      }
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
          <div
            className={`game__card ${flipCard ? 'is-flipped' : ''}`}
            onClick={() => {
              if (!flipCard) {
                setFlipCard(true);
                changeCard();
              }
            }}
          >
            <div className="game__card__face">
              {currentCard ? (
                <>
                  <div className="game__card__title">{currentCard.title}</div>
                  <div className="game__card__body">{currentCard.body}</div>
                </>
              ) : (
                <>
                  <div className="game__card__title">Let&apos;s Begin!</div>
                  <div className="game__card__body">
                    Click on card to change cards.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;

import React, { useEffect, useRef, useState } from 'react';

import { NavLink, useHistory } from 'react-router-dom';

const DecksPage = () => {
  const history = useHistory();
  const deckImportInput = useRef();
  const [activeDeckIds, setActiveDeckIds] = useState();
  const [deckIds, setDeckIds] = useState();
  const [decks, setDecks] = useState();

  const saveToLocalStorage = () => {
    localStorage.setItem('active_decks', JSON.stringify(activeDeckIds));
    localStorage.setItem('decks', JSON.stringify(deckIds));
  };

  const createDeck = () => {
    history.push(`/deck/create`);
  };

  const viewDeck = (id) => {
    history.push(`/deck/${id}`);
  };

  const setDeckInactive = (id) => {
    const index = activeDeckIds.indexOf(id);

    setActiveDeckIds((prevIds) => prevIds.filter((_, i) => i !== index));
  };

  const setDeckActive = (id) => {
    setActiveDeckIds((prevIds) => [...prevIds, id]);
  };

  const loadDecks = () => {
    const tempDecks = deckIds.map((item) => {
      const d = JSON.parse(localStorage.getItem(item));

      if (activeDeckIds.includes(d.id)) {
        return (
          <div key={d.id} className="deck">
            <div className="deck__title">
              {d.name} - ({d.cards.length})
            </div>
            <div className="deck__buttons">
              <button
                type="button"
                className="deck__button deck__button__active deck__button__active--active"
                onClick={() => {
                  setDeckInactive(d.id);
                }}
              >
                Active
              </button>
              <button
                type="button"
                className="deck__button deck__button__view button"
                onClick={() => {
                  viewDeck(d.id);
                }}
              >
                View
              </button>
            </div>
          </div>
        );
      }

      return (
        <div key={d.id} className="deck">
          <div className="deck__title">
            {d.name} - ({d.cards.length})
          </div>
          <div className="deck__buttons">
            <button
              type="button"
              className="deck__button deck__button__active deck__button__active--inactive"
              onClick={() => {
                setDeckActive(d.id);
              }}
            >
              Inactive
            </button>
            <button
              type="button"
              className="deck__button deck__button__view button"
              onClick={() => {
                viewDeck(d.id);
              }}
            >
              View
            </button>
          </div>
        </div>
      );
    });

    setDecks(tempDecks);
  };

  const loadDeckIds = () => {
    if (localStorage.getItem('decks') === null) {
      localStorage.setItem('decks', JSON.stringify([]));
      setDeckIds([]);
    } else {
      setDeckIds(JSON.parse(localStorage.getItem('decks')));
    }
  };

  const loadActiveDeckIds = () => {
    if (localStorage.getItem('active_decks') === null) {
      localStorage.setItem('active_decks', JSON.stringify([]));
      setActiveDeckIds([]);
    } else {
      setActiveDeckIds(JSON.parse(localStorage.getItem('active_decks')));
    }
  };

  const jsonInput = (e) => {
    const reader = new FileReader();

    reader.onload = (evt) => {
      const jsonObj = JSON.parse(evt.target.result);

      localStorage.setItem(jsonObj.id, JSON.stringify(jsonObj));

      if (!deckIds.includes(jsonObj.id)) {
        setDeckIds((prevIds) => [...prevIds, jsonObj.id]);
      }

      if (deckImportInput.current) {
        deckImportInput.current.value = '';
      }
    };

    reader.readAsText(e.target.files[0]);
  };

  useEffect(() => {
    loadDeckIds();
    loadActiveDeckIds();
  }, []);

  useEffect(() => {
    if (deckIds !== undefined) {
      loadDecks();
    }
  }, [deckIds, activeDeckIds]);

  return (
    <div className="decks">
      <NavLink to="/" className="decks__back">
        &lt; Back
      </NavLink>
      <div className="decks__title">Decks</div>
      <div className="decks__buttons">
        <div>
          <label htmlFor="json-file" className="button">
            Import Deck{' '}
            <input
              ref={deckImportInput}
              onChange={jsonInput}
              type="file"
              id="json-file"
            />
          </label>
        </div>

        <button type="button" className="button" onClick={saveToLocalStorage}>
          Save
        </button>

        <button type="button" className="button" onClick={createDeck}>
          Create Deck
        </button>
      </div>

      <div className="decks__decks">{decks}</div>
    </div>
  );
};

export default DecksPage;

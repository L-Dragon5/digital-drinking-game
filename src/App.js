import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ErrorPage from './components/ErrorPage';
import HomePage from './components/HomePage';
import DecksPage from './components/DecksPage';
import SingleDeckPage from './components/SingleDeckPage';

import './scss/styles.scss';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div>
        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/decks" component={DecksPage} />
          <Route path="/deck/:id" component={SingleDeckPage} />
          <Route component={ErrorPage} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;

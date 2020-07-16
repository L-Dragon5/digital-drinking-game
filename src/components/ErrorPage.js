import React from 'react';

import { NavLink } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="error-page">
      <div className="error-page__title">Oops! This doesn&apos;t exist!</div>
      <div className="error-page__body">
        <p>
          Looks like you drank a little too much and stumbled somewhere that
          doesn&apos;t exist.
        </p>

        <NavLink to="/">Head back home</NavLink>
      </div>
    </div>
  );
};

export default ErrorPage;

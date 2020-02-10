import React from 'react';
import Header from '../Header/Header';

const App = ({ children }) => {
  return (
    <div className="container-fluid">
      <Header />
      <main>
        {children}
      </main>
    </div>
  )
}

export default App;
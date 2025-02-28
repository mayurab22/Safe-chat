// import logo from './logo.svg';
import './App.css';
import LandingPage from './pages/lnading_page';
import AuthForm from './components/login_regester';
import { useEffect, useState } from 'react';


function App() {
  // let b = chatArea;
  const [authentication, setAuthentication] = useState(false)
  const [takenMain, setTokenMain] = useState('');
  const [view, setView] = useState('auth');
  const toggleView = () => {
    console.log("value of taken in app.js before moving to landing page", takenMain);
    setView((prevView) => (prevView === 'auth' ? 'landing' : 'auth'));
  };


  return (
    <>
      {view === 'auth' ? <AuthForm tv={toggleView} sa={setAuthentication} st = {setTokenMain} /> : <LandingPage ats = {takenMain}/>}
    </>
  );
}

export default App;

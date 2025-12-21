import './App.css';
import GMChat from './GameMaster.jsx'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div style={{height:"100vh"}}>
      <GMChat />
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
}

export default App;

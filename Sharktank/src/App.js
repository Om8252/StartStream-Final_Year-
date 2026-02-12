
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min'; 
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import All_Pitch from './Pages/All_Pitch';
import Register from './Pages/Register';
import My_pitches from './Pages/My_pitches';
import Add_Pitch from './Pages/Add_Pitch';
import Accpted from './Pages/Accpted';
import Rejected from './Pages/Rejected';
import All_Users from './Pages/All_Users'
import All_Investor from './Pages/All_Investor';
import All_Seaker from './Pages/All_Seaker';
import Edit_User from './Pages/Edit_User';
import Myseaker from './Pages/Myseaker';
import Profile from './Pages/Profile';
import Myinvestor from './Pages/Myinvestor';
import Chat from './Pages/Chat';
import Message from './Pages/Message';
import Profile1 from './Pages/Profile1';








function App() {

  return (
    <Router>

      <Routes>

        <Route path='/' element={<Login />} />
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/All_Pitch' element={<All_Pitch />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/My_pitches' element={<My_pitches />} />
        <Route path='/Add_Pitch' element={<Add_Pitch />} />
        <Route path='/Accpted' element={<Accpted />} />
        <Route path='/Rejected' element={<Rejected />} />
        <Route path='/All_Users' element={<All_Users />} />
        <Route path='/All_Investor' element={<All_Investor />} />
        <Route path='/All_Seaker' element={<All_Seaker />} />
        <Route path="/edit-user/:id" element={<Edit_User />} />
        <Route path="/Myseaker" element={<Myseaker />} />
        <Route path='/Profile' element={<Profile/>}/>
        <Route path='/Myinvestor' element={<Myinvestor/>}/>
        <Route path='/Chat/:receiverid' element={<Chat/>}/>
        <Route path='/Message' element={<Message/>}/>
        <Route path='/Profile1/:id' element={<Profile1/>}/>


      </Routes>
    </Router>
  );
}

export default App;

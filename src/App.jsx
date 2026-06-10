
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import HomeComp from './components/HomeComp';
import LoginComp from './components/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/userDashBoard';
import ProtectedRoutes from './components/ProtectedRoutes';
// import Login from './pages/Login';


function App() {
  

  return (
    <>
      {/* <Login/>
      <LoginForm/>
      <HomeComp /> */}

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomeComp/>}>
            <Route path='/login' element={<LoginComp/>} />
            <Route path='/register' element={<h1> Registration Form</h1>}/>
            <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
          </Route>
          <Route path='/admin' element={<ProtectedRoutes role={1}><AdminDashboard/> </ProtectedRoutes>}>
          <Route path="users" element={<h1> Users</h1>} />
                <Route path="reports" element={ <h1> Reports</h1>} />
                <Route path="logout" element={<h1>Log out</h1>} /> 

          </Route>
          <Route path='/user' element={<ProtectedRoutes role={2}><UserDashboard/></ProtectedRoutes>}>
          <Route path="users" element={<h1> Users</h1>} />
                <Route path="search" element={ <h1> Reports</h1>} />
                <Route path="buy" element={<h1>Log out</h1>} /> 
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

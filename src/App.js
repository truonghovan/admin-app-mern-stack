import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Home } from './containers/Home';
import { Signup } from './containers/Signup';
import PrivateRouter from './components/HOC/PrivateRouter';
import Signin from './containers/Signin';
import { useEffect } from 'react';
import { isUserLoggedIn } from './actions/auth';
import { useDispatch , useSelector } from 'react-redux';
import Products from './containers/Products';
import Orders from './containers/Orders';
import  {Category}  from './containers/Category';
import { getInitialData } from './actions/initialData';
import  NewPage  from './containers/NewPage';

function App() {
  const dispatch=useDispatch()
  const auth = useSelector(state => state.auth)
//component DidMount and component DidUpdate
  useEffect(() => {
    if (!auth.authenticate) {
      dispatch(isUserLoggedIn())
    }
    if(auth.authenticate){
      dispatch(getInitialData())
    }
  }, [auth.authenticate])
  return (
    <div className="App">
      <Switch>
        
        <PrivateRouter path="/products"  component={Products} />
        <PrivateRouter path="/orders"  component={Orders} /> 
        <PrivateRouter path="/page"  component={NewPage} /> 
        <PrivateRouter path="/category"  component={Category} /> 
        <PrivateRouter path="/" exact component={Home} />


        <Route path="/signin" component={Signin} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </div>
  );
}

export default App;

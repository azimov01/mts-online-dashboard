import React, {lazy} from 'react'
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import AccessibleNavigationAnnouncer from './components/AccessibleNavigationAnnouncer'
import history from './history';


const Layout = lazy(() => import('./containers/Layout'))
const Login = lazy(() => import('./pages/Login'))
const CreateAccount = lazy(() => import('./pages/CreateAccount'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

function App() {
    // const { token, setToken } = useToken();
    const token = localStorage.getItem('Bearer');

    if (!token) {
        history.push('/login')
        return <Login setToken={token}/>
    }

    return (
        <>
            <Router>
                <AccessibleNavigationAnnouncer/>
                <Switch>
                    <Route path="/login" component={Login}/>
                    {/*<Route path="/create-account" component={CreateAccount}/>*/}
                    {/*<Route path="/forgot-password" component={ForgotPassword}/>*/}

                    {/* Place new routes over this */}
                    <Route path="/app" component={Layout}/>
                    <Route path="/app/dashboard" component={Dashboard}/>
                    {/* If you have an index page, you can remothis Redirect */}
                    <Redirect exact from="/" to="/login"/>
                </Switch>
            </Router>
        </>
    )
}

export default App

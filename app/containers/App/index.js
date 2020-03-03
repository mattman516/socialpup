import React from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import { Authenticator } from 'aws-amplify-react';
import queryString from 'query-string';
import { useSelector, useDispatch } from 'react-redux';
import Amplify from 'aws-amplify';
import aws_exports from '../../aws-exports';
import MapPage from '../MapPage';
import { makeSelectAuthState } from './selectors';
import { setLogin, setLogout, createUser } from './actions';
import { useInjectSaga } from 'utils/injectSaga';
import saga from './saga';

Amplify.configure(aws_exports);

const HeaderLinks = ({ authState }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignContent: 'center',
      padding: 30,
    }}
  >
    <Link to="/" style={{ textDecoration: 'none' }}>
      Social Pups
    </Link>
    <Link to="/auth">
      {authState.loggedIn
        ? `${authState.userData.username} is logged in`
        : 'Not Logged In'}
    </Link>
  </div>
);

const ProtectedRoute = ({ render: C, props: childProps, ...rest }) => (
  <Route
    {...rest}
    render={rProps =>
      childProps.isLoggedIn ? (
        <C {...rProps} {...childProps} />
      ) : (
        <Redirect
          to={`/auth?redirect=${rProps.location.pathname}${
            rProps.location.search
          }`}
        />
      )
    }
  />
);

const ProppedRoute = ({ render: C, props: childProps, ...rest }) => (
  <Route {...rest} render={rProps => <C {...rProps} {...childProps} />} />
);

const AuthComponent = props => {
  const [authState, setAuthState] = React.useState();
  const [redirect, setRedirect] = React.useState();
  const handleStateChange = (state, user) => {
    console.log('STATE CHANGE', state, user);
    if (state === 'signedIn') {
      const params = queryString.parse(props.location.search);
      setRedirect(params.redirect);
      setAuthState(state);
      props.onUserSignIn(user);
      props.onUserSignUp(user);
    } else if (state === 'signIn') {
      props.onUserSignOut();
    }
  };
  return (
    <div>
      {authState === 'signedIn' && redirect ? (
        <Redirect to={redirect} />
      ) : (
        <Authenticator onStateChange={handleStateChange} />
      )}
    </div>
  );
};

const Routes = ({ childProps }) => (
  <Switch>
    <ProppedRoute
      exact
      path="/auth"
      render={AuthComponent}
      props={childProps}
    />
    <ProtectedRoute exact path="/" render={MapPage} props={childProps} />
    <Route exact path="/about" render={() => <div>About Content</div>} />
  </Switch>
);

const App = () => {
  const authState = useSelector(makeSelectAuthState());
  useInjectSaga({ key: 'app', saga });
  const dispatch = useDispatch();

  const handleUserSignIn = user => {
    console.log('SIGNIN');
    dispatch(setLogin(user));
  };

  const handleUserSignOut = () => {
    dispatch(setLogout());
  };
  const handleUserSignUp = (user) => {
    console.log('HANDLEUSERSIGNUP', user);
    dispatch(createUser(user));
  };

  const childProps = {
    isLoggedIn: authState.loggedIn,
    onUserSignIn: handleUserSignIn,
    onUserSignOut: handleUserSignOut,
    onUserSignUp: handleUserSignUp
  };

  return (
    <div className="App">
      <HeaderLinks {...{ authState }} />
      <br />
      <Routes childProps={childProps} />
    </div>
  );
};

export default App;

import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, Router, Route, Redirect } from 'react-router-dom';
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


const ProtectedRoute = ({ render: C, props: childProps, ...rest }) => (
  <Route
    {...rest}
    render={rProps =>
      childProps.isLoggedIn ? (
        <C {...rProps} {...childProps} />
      ) : (
        <React.Fragment/>
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
      <Authenticator onStateChange={handleStateChange} />
    </div>
  );
};

const Routes = ({ childProps }) => (
  <div>
    <ProppedRoute
      path="/"
      render={AuthComponent}
      props={childProps}
    />
    <ProtectedRoute path="/" render={MapPage} props={childProps} />
  </div>
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
      <Helmet>
        <title>Social Pups</title>
      </Helmet>
      <br />
      <Routes childProps={childProps} />
    </div>
  );
};

export default App;

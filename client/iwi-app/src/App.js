import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import './App.css';

import Header from './components/App/common/Header/Header';
import Footer from './components/App/common/Footer/Footer';
import Home from './components/App/Home/Home';
import UserProfile from './components/App/UserProfile/UserProfile';
import Discover from './components/App/Discover/Discover';
import EditUserInfo from './components/App/Edit/EditUserInfo';
import NotFound from './components/App/NotFound/NotFound';
import LoginForm from './components/Forms/LoginForm';
import RegisterForm from './components/Forms/RegisterForm';
import Me from './components/App/Me/Me';

import { getUserPosts, getAllSubsPosts } from './store/fetcher/postFetcher';

class App extends Component {
  render() {
    return (
      <div id="wrapper">
        <Header />
        <Switch>
          <Route path="/" exact render={() => localStorage.getItem('username') ? <Home /> : <LoginForm />} />
          <Route path="/profile/:userId" {...this.props} render={(props) => localStorage.getItem('username') ? <UserProfile {...props} /> : <LoginForm />} />
          <Route path="/me" render={() => localStorage.getItem('username') ? <Me /> : <LoginForm />} />
          <Route path="/discover" render={() => localStorage.getItem('username') ? <Discover /> : <LoginForm />} />
          <Route path="/edit" render={() => localStorage.getItem('username') ? <EditUserInfo /> : <LoginForm />} />
          <Route path="/signin" render={() => localStorage.getItem('username') ? <Home /> : <LoginForm />} />
          <Route path="/signup" render={() => localStorage.getItem('username') ? <Home /> : <RegisterForm />} />
          <Route component={NotFound} />
        </Switch>
        <Footer />
      </div>
    );
  }

  componentDidMount() {
      this.props.getSubsPosts();
      this.props.getUserPosts(localStorage.getItem('userId'));
  }
}


function mapStateToProps(state) {
  return {
    auth: state.auth
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getUserPosts: (id) => dispatch(getUserPosts(id)),
    getSubsPosts: () => dispatch(getAllSubsPosts())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

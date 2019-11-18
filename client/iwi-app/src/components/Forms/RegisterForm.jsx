import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserAlt, faUserCircle, faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../services/authFetcher';
import { resetErrors } from '../../store/actions/errorsActions/actionsCreator';
import { wrapComponent } from 'react-snackbar-alert';
import PropTypes from 'prop-types';
import { List } from 'immutable';

class RegisterForm extends Component {
    state = {
        email: '',
        username: '',
        firstName: '',
        lastName: '',
        password: '',
    }

    handleChangeInput = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { email, username, firstName, lastName, password } = this.state;

        if (email === '' 
        || password === ''
        || username === ''
        || firstName === ''
        || lastName === '') {
            this.props.createSnackbar({
                message: 'All fields are required!',
                timeout: 3000,
            })
        } else {
            this.props.register({ 
                email: this.state.email, 
                password: this.state.password,
                username: this.state.username,
                firstName: this.state.firstName,
                lastName: this.state.lastName
            });

            //clear all errors 
            this.props.resetErr();
        }
    }

    render() {
        const { username, firstName, lastName, email, password } = this.state;
        return (
            <main>
                <form id="registerForm" onSubmit={this.handleSubmit}>
                    <h1>SIGN UP</h1>
                    {
                        (this.props.errors.size > 0 && (<p className="error">{this.props.errors.getIn(['0', 'msg'])}</p>))
                    }
                    <span>

                        <FontAwesomeIcon icon={faUserCircle} />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username..."
                            id="username"
                            onChange={this.handleChangeInput}
                            value={username}
                        />

                    </span>
                    <span>
                        <FontAwesomeIcon icon={faUser} />
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name..."
                            id="firstName"
                            onChange={this.handleChangeInput}
                            value={firstName}
                        />
                    </span>
                    <span>
                        <FontAwesomeIcon icon={faUserAlt} />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name..."
                            id="lastName"
                            onChange={this.handleChangeInput}
                            value={lastName}
                        />
                    </span>
                    <span>
                        <FontAwesomeIcon icon={faEnvelope} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email..."
                            id="email"
                            onChange={this.handleChangeInput}
                            value={email}
                        />
                    </span>
                    <span>
                        <FontAwesomeIcon icon={faKey} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password..."
                            id="pass"
                            onChange={this.handleChangeInput}
                            value={password}
                        />
                    </span>
                    <input type="submit" defaultValue="SIGN UP" />
                </form>
                <div className="message">
                    <span>You are already sign in?</span> <Link to="/signin">SIGN IN</Link>
                </div>
            </main>
        )
    }

    //clear all errors after component unmount, so the same errors not showing up on another component        
    componentWillUnmount() {
        this.props.resetErr();
    }
}

function mapDispatchToProps(dispatch) {
    return {
        register: (data) => dispatch(registerUser(data)),
        resetErr: () => dispatch(resetErrors())
    }
}

function mapStateToProps(state) {
    return {
        errors: state.errorsReducer
    }
}

RegisterForm.propTypes = {
    register: PropTypes.func,
    resetErr: PropTypes.func,
    createSnackbar: PropTypes.func,
    errors: PropTypes.instanceOf(List),
}


export default connect(mapStateToProps, mapDispatchToProps)(wrapComponent(RegisterForm));
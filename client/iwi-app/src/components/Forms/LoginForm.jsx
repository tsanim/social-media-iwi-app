import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser } from '../../services/authFetcher';
import { wrapComponent } from 'react-snackbar-alert';
import { resetErrors } from '../../store/actions/errorsActions/actionsCreator';
import PropTypes from 'prop-types';
import { List } from 'immutable';

class LoginForm extends Component {
    state = {
        email: '',
        password: '',
    }

    handleChangeInput = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        if (this.state.email === '' || this.state.password === '') {
            this.props.createSnackbar({
                message: 'All fields are required!',
                timeout: 3000,
            })
        } else {
            this.props.login({ email: this.state.email, password: this.state.password });

            //clear all errors 
            this.props.resetErr();
        }
    }

    render() {
        const { errors } = this.props;
        const { email, password } = this.state;

        return (
            <main>
                <form id="loginForm" onSubmit={this.handleSubmit}>
                    <h1>SIGN IN</h1>
                    {
                        (errors.size > 0 && (<p className="error">{errors.getIn(['0', 'message'])}</p>))
                    }
                    <span>
                        <FontAwesomeIcon icon={faEnvelope} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email..."
                            id="email"
                            value={email}
                            onChange={this.handleChangeInput}
                        />
                    </span>
                    <span>
                        <FontAwesomeIcon icon={faKey} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password..."
                            id="password"
                            value={password}
                            onChange={this.handleChangeInput}
                        />
                    </span>
                    <input type="submit" defaultValue="SIGN IN" />
                </form>
                <div className="message">
                    <span>You are not signed up yet?</span> <Link to="/signup">SIGN UP</Link>
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
        login: (data) => dispatch(loginUser(data)),
        resetErr: () => dispatch(resetErrors())
    }
}

function mapStateToProps(state) {
    return {
        errors: state.errorsReducer
    }
}

LoginForm.propTypes = {
    login: PropTypes.func,
    resetErr: PropTypes.func,
    createSnackbar: PropTypes.func,
    errors: PropTypes.instanceOf(List),
}


export default connect(mapStateToProps, mapDispatchToProps)(wrapComponent(LoginForm));
import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import useForms from '../../hooks/useForms';
import { connect } from 'react-redux';
import { loginUser } from '../../store/fetcher/authFetcher';
import { wrapComponent } from 'react-snackbar-alert';
import { resetErrors } from '../../store/errors/actionsCreator';

function LoginForm({ login, errors, createSnackbar, resetErr }) {
    const { handleSubmit, handleChangeInput, inputs } = useForms((e) => {

        // if fields are less, send message to user that they are required
        if (Object.values(inputs).length < 2) {
            createSnackbar({
                message: 'All fields are required!',
                timeout: 3000,
            })
        } else {
            login(inputs);

            //clear all errors 
            resetErr();
        }
    });

    //clear all errors after component unmount, so the same errors not showing up on another component
    useEffect(() => {
        return () => {
            resetErr();
        }
    }, [resetErr]);

    return (
        <main>
            <form id="loginForm" onSubmit={handleSubmit}>
                <h1>SIGN IN</h1>
                {
                    (errors.length > 0 && (<p className="error">{errors[errors.length - 1].message}</p>))
                }
                <span>
                    <FontAwesomeIcon icon={faEnvelope} />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email..."
                        id="email"
                        value={inputs.email || ''}
                        onChange={handleChangeInput}
                    />
                </span>
                <span>
                    <FontAwesomeIcon icon={faKey} />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password..."
                        id="password"
                        value={inputs.password || ''}
                        onChange={handleChangeInput}
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

function mapDispatchToProps(dispatch) {
    return {
        login: (data) => dispatch(loginUser(data)),
        resetErr: () => dispatch(resetErrors())
    }
}

function mapStateToProps(state) {
    return {
        errors: state.errors
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrapComponent(LoginForm));
import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserAlt, faUserCircle, faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import useForms from '../../hooks/useForms';
import { connect } from 'react-redux';
import { registerUser } from '../../store/fetcher/authFetcher';
import { resetErrors } from '../../store/errors/actionsCreator';
import { wrapComponent } from 'react-snackbar-alert';

function RegisterForm({ register, errors, createSnackbar, resetErr }) {
    const { handleSubmit, handleChangeInput, inputs } = useForms((e) => {

        // if fields are less, send message to user that they are required
        if (Object.values(inputs).length < 5) {
            createSnackbar({
                message: 'All fields are required!',
                timeout: 3000,
            })
        } else {
            register(inputs);

            //clear all errors 
            resetErr();
        }
    }, true);

    //clear all errors after component unmount, so the same errors not showing up on another component
    useEffect(() => {
        return () => {
            resetErr();
        }
    }, [resetErr]);

    return (
        <main>
            <form id="registerForm" onSubmit={handleSubmit}>
                <h1>SIGN UP</h1>
                {
                    (errors.length > 0 && (<p className="error">{errors[errors.length - 1].msg}</p>))
                }
                <span>

                    <FontAwesomeIcon icon={faUserCircle} />
                    <input
                        type="text"
                        name="username"
                        placeholder="Username..."
                        id="username"
                        onChange={handleChangeInput}
                        value={inputs.username || ''}
                    />

                </span>
                <span>
                    <FontAwesomeIcon icon={faUser} />
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name..."
                        id="firstName"
                        onChange={handleChangeInput}
                        value={inputs.firstName || ''}
                    />
                </span>
                <span>
                    <FontAwesomeIcon icon={faUserAlt} />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name..."
                        id="lastName"
                        onChange={handleChangeInput}
                        value={inputs.lastName || ''}
                    />
                </span>
                <span>
                    <FontAwesomeIcon icon={faEnvelope} />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email..."
                        id="email"
                        onChange={handleChangeInput}
                        value={inputs.email || ''}
                    />
                </span>
                <span>
                    <FontAwesomeIcon icon={faKey} />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password..."
                        id="pass"
                        onChange={handleChangeInput}
                        value={inputs.password || ''}
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

function mapDispatchToProps(dispatch) {
    return {
        register: (data) => dispatch(registerUser(data)),
        resetErr: () => dispatch(resetErrors())
    }
}

function mapStateToProps(state) {
    return {
        errors: state.errors
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrapComponent(RegisterForm));
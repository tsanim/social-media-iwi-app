import React, { useEffect } from 'react';
import useForms from '../../hooks/useForms';
import { wrapComponent } from 'react-snackbar-alert';
import PropTypes from 'prop-types';

function ChangePasswordForm({ changePasswordHandler, createSnackbar, errors, resetErrorsHandler }) {
    const { handleSubmit, handleChangeInput, inputs } = useForms(() => {
        if (Object.values(inputs).length < 2) {
            createSnackbar({
                message: 'All fields are required!',
                timeout: 3000,
            });
        } else {
            changePasswordHandler(inputs);

            createSnackbar({
                message: 'Password is changed!',
                timeout: 3000,
            });

            //clear all errors 
            resetErrorsHandler();
        }
    });

    //clear all errors after component unmount, so the same errors not showing up on another component
    useEffect(() => {
        return () => {
            resetErrorsHandler();
        }
    }, [resetErrorsHandler]);

    return (
        <form className="editForm" onSubmit={handleSubmit}>
            {
                (errors.length > 0 && (<p className="error">{errors[errors.length - 1].message}</p>))
            }
            <span>
                <i className="fas fa-key" />
                <input
                    type="password"
                    name="oldPassword"
                    placeholder="Old password..."
                    value={inputs.oldPassword || ''}
                    onChange={handleChangeInput}
                />
            </span>
            <span>
                <i className="fas fa-lock" />
                <input
                    type="password"
                    name="newPassword"
                    placeholder="New password..."
                    value={inputs.newPassword || ''}
                    onChange={handleChangeInput}
                />
            </span>
            <input type="submit" value="CHANGE" />
        </form>
    )
}


ChangePasswordForm.propTypes = {
    changePasswordHandler: PropTypes.func,
    createSnackbar: PropTypes.func,
    errors: PropTypes.array,
    resetErrorsHandler: PropTypes.func
}

export default wrapComponent(ChangePasswordForm);
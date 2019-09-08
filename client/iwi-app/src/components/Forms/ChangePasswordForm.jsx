import React from 'react';
import useForms from '../../hooks/useForms';
import { connect } from 'react-redux';
import { changePassword } from '../../store/fetcher/userFetcher'
import { wrapComponent } from 'react-snackbar-alert';
import { resetErrors } from '../../store/errors/actionsCreator';

function ChangePasswordForm({ changePass, createSnackbar, errors, resetErr }) {
    const { handleSubmit, handleChangeInput, inputs } = useForms(() => {



        if (Object.values(inputs).length < 2) {
            createSnackbar({
                message: 'All fields are required!',
                timeout: 3000,
            });
        } else {
            changePass(inputs);
            
            createSnackbar({
                message: 'Password is changed!',
                timeout: 3000,
            });

            //clear all errors 
            resetErr();
        }
    });

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

function mapDispatchToProps(dispatch) {
    return {
        changePass: (data) => dispatch(changePassword(data)),
        resetErr: () => dispatch(resetErrors)
    }
}

function mapStateToProps(state) {
    return {
        errors: state.errors
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrapComponent(ChangePasswordForm));
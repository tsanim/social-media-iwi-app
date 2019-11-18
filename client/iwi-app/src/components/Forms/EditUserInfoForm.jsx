import React from 'react';
import useForms from '../../hooks/useForms';
import { wrapComponent } from 'react-snackbar-alert';
import PropTypes from 'prop-types';

function EditForm({ editUserInfoHandler, createSnackbar }) {
    const { handleSubmit, handleChangeInput, inputs } = useForms((e) => {
        editUserInfoHandler(inputs);
        createSnackbar({
            message: 'User info succesfully updated!',
            timeout: 3000,
        });
    });

    return (
        <form className="editForm" onSubmit={handleSubmit}>
            <span>
                <input
                    type="text"
                    name="username"
                    placeholder="Username..."
                    id="username"
                    value={inputs.username || ''}
                    onChange={handleChangeInput}
                />
            </span>
            <span>
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name..."
                    id="fistName"
                    value={inputs.firstName || ''}
                    onChange={handleChangeInput}
                />
            </span>
            <span>
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name..."
                    id="lastName"
                    value={inputs.lastName || ''}
                    onChange={handleChangeInput}
                />
            </span>
            <input type="submit" value="EDIT" />
        </form>
    )
}

EditForm.propTypes = {
    editUserInfoHandler: PropTypes.func,
    createSnackbar: PropTypes.func,
}

export default wrapComponent(EditForm);
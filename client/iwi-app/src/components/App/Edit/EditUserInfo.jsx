import React, { Component } from 'react';
import EditUserInfoForm from '../../Forms/EditUserInfoForm';
import ChangePasswordForm from '../../Forms/ChangePasswordForm';
import EditProfilePicForm from '../../Forms/EditProfilePicForm';

class EditUserInfo extends Component {
    render() {
        return (
            <main>
                <div className="editUserInfo">
                    <EditProfilePicForm />
                    <h3>Change your personal information</h3>
                    <EditUserInfoForm />
                    <h3>Change your password</h3>
                    <ChangePasswordForm />
                </div>
            </main>
        )
    }
}

export default EditUserInfo;
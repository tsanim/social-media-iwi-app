import React, { Component } from 'react';
import URI from '../../config/config';
import { wrapComponent } from 'react-snackbar-alert';
import PropTypes from 'prop-types';

class EditForm extends Component {
    state = {
        imagePreviewUrl: '',
        fd: new FormData()
    }

    handleChangeInput = (e) => {
        const files = e.target.files;

        if (files && files.length > 0) {
            let reader = new FileReader();
            let file = e.target.files[0];

            this.state.fd.append(e.target.name, file, e.target.name);

            reader.onloadend = () => {
                this.setState({
                    imagePreviewUrl: reader.result
                });
            }

            reader.readAsDataURL(file)
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.props.changeProfilePicHandler(this.state.fd);

        this.props.createSnackbar({
            message: 'Profile picture is changed!',
            timeout: 3000,
        });
    }

    render() {
        return (
            <form className="editForm" encType="multipart/form-data" onSubmit={this.handleSubmit}>
                <figure>
                    <img className="profileImg" src={this.state.imagePreviewUrl || `${URI}/feed/image/${this.props.imageId}`} alt="userPic" />
                    <div className="uploadImage">
                        <label htmlFor="file"><img className="icon" src="https://cdn.iconscout.com/icon/free/png-256/gallery-44-267592.png" alt="uploadImg" />Change
                      Profile Picture</label>
                        <input type="file" id="file" name="avatar" onChange={this.handleChangeInput} />
                    </div>
                </figure>
                <input type="submit" value="SAVE" />
            </form>
        )
    }
}

EditForm.propTypes = {
    imageId: PropTypes.string,
    changeProfilePicHandler: PropTypes.func,
    createSnackbar: PropTypes.func,
}

export default wrapComponent(EditForm);
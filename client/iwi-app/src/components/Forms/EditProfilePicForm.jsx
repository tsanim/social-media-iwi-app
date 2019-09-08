import React, { Component } from 'react';
import { changeUserPic } from '../../store/fetcher/userFetcher'
import { connect } from 'react-redux';
import URI from '../../config/config';
import { wrapComponent } from 'react-snackbar-alert';

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

        this.props.changeProfilePic(this.state.fd);

        this.props.createSnackbar({
            message: 'Profile picture is changed!',
            timeout: 3000,
        });
    }

    render() {
        return (
            <form className="editForm" encType="multipart/form-data" onSubmit={this.handleSubmit}>
                <figure>
                    <img className="profileImg" src={this.state.imagePreviewUrl || `${URI}/feed/image/${this.props.auth.imageId}`} alt="" />
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

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeProfilePic: (data) => dispatch(changeUserPic(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrapComponent(EditForm));
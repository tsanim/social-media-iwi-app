import React from 'react';
import { wrapComponent } from 'react-snackbar-alert';
import PropTypes from 'prop-types';

class PostForm extends React.Component {
    state = {
        text: '',
        fd: new FormData(),
        imagePreviewUrl: '',
    }

    handleChangeInput = (e) => {
        e.persist();

        const files = e.target.files;

        if (files && files.length > 0) {
            let reader = new FileReader();
            let file = e.target.files[0];

            if (!isImage(file.type)) {
                this.props.createSnackbar({
                    message: 'You should upload only images!',
                    timeout: 3000,
                })
                return;
            }

            this.state.fd.append(e.target.name, file, e.target.name);

            reader.onloadend = () => {
                this.setState((oldState) => ({
                    imagePreviewUrl: reader.result,
                }));
            }

            reader.readAsDataURL(file)
        }

        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        //check for empty text and send message to user or emtpy file 
        if (this.state.text === '' && !this.state.fd.get('postImg')) {
            //using createSnackbar for displaying warning message to user 
            this.props.createSnackbar({
                message: 'You can not upload post without image or text!',
                timeout: 3000,
            });
        } else {
            this.state.fd.append('text', this.state.text);
            this.props.uploadHandler(this.state.fd)
        }

        //reset state
        this.setState({ text: '', imagePreviewUrl: '', fd: new FormData() })
    }

    handlePreviewImgClose = (e) => {
        this.state.fd.delete('postImg');
        this.setState({ imagePreviewUrl: '' })
    }

    render() {
        const { text, imagePreviewUrl } = this.state;

        return (
            <div className="postForm">
                <form id="postForm" encType="multipart/form-data" onSubmit={this.handleSubmit}>
                    <textarea
                        name="text"
                        id="postText"
                        placeholder="Write something to your friends..."
                        value={text}
                        onChange={this.handleChangeInput}
                    />
                    <div className="inline-form-items">
                        <div className="uploadImage">
                            <label htmlFor="file"><img className="icon" src="https://cdn.iconscout.com/icon/free/png-256/gallery-44-267592.png" alt="uploadImg" />Image</label>
                            <input
                                type="file"
                                id="file"
                                name="postImg"
                                onChange={this.handleChangeInput}
                            />
                        </div>
                        <input disabled={!(this.state.fd.keys() > 0 || (text !== '' || imagePreviewUrl !== ''))} type="submit" value="Post" />
                    </div>
                </form>

                <div className="uploadedImgPreview">
                    {
                        imagePreviewUrl !== '' ? <React.Fragment>
                            <img id="previewImg" src={imagePreviewUrl} alt="uploadedImg" />
                            <div onClick={this.handlePreviewImgClose} className="overlay"><span>x</span></div>
                        </React.Fragment> : null
                    }
                </div>
            </div>
        )
    }
}

//function about checking whether is image
function isImage(type) {
    switch (type) {
        case 'image/jpeg':
        case 'image/png':
            return true;
        default:
            return false;
    }
}

PostForm.propTypes = {
    uploadHandler: PropTypes.func,
    createSnackbar: PropTypes.func,
}

export default wrapComponent(PostForm);
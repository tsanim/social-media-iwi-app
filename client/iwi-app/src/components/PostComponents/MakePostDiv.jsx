import React from 'react';
import PostForm from '../Forms/PostForm';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import URI from '../../config/config';

function MakePostDiv({ auth }) {
    return (
        <div id="makeAPost">
            <figure className="userInfo">
                <Link to={"/profile/" + auth._id}>
                    <img src={`${URI}/feed/image/${auth.imageId}`} alt="userPic" />
                    <figcaption>{auth.username}</figcaption>
                </Link>
            </figure>
            <PostForm />
        </div>
    )
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(MakePostDiv);
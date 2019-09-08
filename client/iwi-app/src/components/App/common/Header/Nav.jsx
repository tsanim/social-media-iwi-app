import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { logout } from '../../../../store/auth/actionsCreator';
import { resetPosts } from '../../../../store/userPosts/actionsCreator';
import URI from '../../../../config/config';

function Nav(props) {
    const { imageId } = props.auth;

    const handleSignOut = () => {

        props.resetUserPosts();
        props.signout();
    }

    return (
        <nav id="main-nav">
            <ul>
                <li>
                    <Link to="/me">
                        <figure className="nav-profilePic">
                            <img src={`${URI}/feed/image/${imageId}`} alt="" />
                            <figcaption>{localStorage.getItem('username')}</figcaption>
                        </figure>
                    </Link>
                </li>
                <li><Link to="/"><FontAwesomeIcon icon={faHome} /> HOME</Link></li>
                <li><Link to="/discover"><FontAwesomeIcon icon={faUsers} /> DISCOVER</Link></li>
                <li><Link to="/signin" onClick={handleSignOut}><FontAwesomeIcon icon={faSignOutAlt} /> LOGOUT</Link></li>
            </ul>
        </nav>
    )
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}

function mapDispatchToProps(dispatch) {
    return {
        signout: () => dispatch(logout()),
        resetUserPosts: () => dispatch(resetPosts())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
import React, { useState } from 'react';
import MakePostDiv from '../../PostComponents/MakePostDiv';
import Loader from '../../Loader/Loader';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PostsSection from '../../PostComponents/PostsSection';
import Modal from '../../Modals/Modal';
import URI from '../../../config/config';

function Me(props) {
    const [showModal, setShowModal] = useState(false);
    const [modalHeaderName, setModalHeaderName] = useState('');
    
    //followers and subscriptions
    const [users, setUsers] = useState([]);

    const handleShow = (e) => {
        e.persist();

        setShowModal((showModal) => true);
        setModalHeaderName(() => e.target.name);
        setUsers(() => props.auth[e.target.id]);
    }

    const handleClose = (e) => {
        e.persist();

        setShowModal((showModal) => false)
    }

    const { imageId, subscriptions, followers, username, _id } = props.auth;
    const { fetchStatus, userPosts } = props;
   
    return (
        <main>
            <div className="userInfoHeader">
                <Link to={"/profile/" + _id}>
                    <figure className="profilePic">
                        <img src={`${URI}/feed/image/${imageId}`} alt="" />
                        <figcaption>{username}</figcaption>
                    </figure>
                </Link>
                <div className="headerInfoContainer">
                    <div className="userMeta">
                        <span>{userPosts.length} posts</span>
                        <span><button name="Followers" id="followers" onClick={handleShow}>{followers.length} followers</button></span>
                        <span><button name="Subscriptions" id="subscriptions" onClick={handleShow}>{subscriptions.length} following</button></span>
                    </div>
                    <Link to="/edit" className="editBtn">EDIT PROFILE</Link>
                </div>
            </div>
            <MakePostDiv />

            {/* Showing loader when fetching posts */}
            {
                fetchStatus > 0
                    ? <Loader />
                    : <PostsSection posts={userPosts} />
            }

            {/* Modal for followers or following users */}
            {
                showModal ? <Modal handleClose={handleClose} modalHeaderName={modalHeaderName} users={users} /> : null
            }

        </main>
    )
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        userPosts: state.userPosts,
        fetchStatus: state.fetchStatus
    }
}


export default connect(mapStateToProps)(Me);

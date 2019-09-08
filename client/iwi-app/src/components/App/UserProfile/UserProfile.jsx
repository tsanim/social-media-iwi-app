import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostsSection from '../../PostComponents/PostsSection';
import { followUser, unfollowUser, getUser } from '../../../store/fetcher/userFetcher';
import Modal from '../../Modals/Modal';
import { Redirect } from 'react-router-dom';
import Loader from '../../Loader/Loader';
import URI from '../../../config/config';

class UserProfile extends Component {
    state = {
        showModal: false,
        users: [],
        modalHeaderName: '',
    }

    handleShow = (e) => {
        e.persist();

        this.setState((oldState) => ({ showModal: true, users: this.props.user[e.target.id], modalHeaderName: e.target.name }));
    }

    handleClose = (e) => {
        e.persist();

        this.setState((oldState) => ({ showModal: false, users: [], modalHeaderName: '' }));
    }

    render() {
        const { user } = this.props;

        if (Object.entries(user).length === 0) {
            return <Loader />
        }

        const isFollowed = user.followers.findIndex(u => u._id === localStorage.getItem('userId')) >= 0;

        if (user.id === localStorage.getItem('userId')) {
            return <Redirect to="/me" />
        }

        return (
            <main>
                <div className="userInfoHeader">
                    <a href="./myprofile.html">
                        <figure className="profilePic">
                            <img src={`${URI}/feed/image/${user.imageId}`} alt="userImg" />
                            <figcaption>{user.username}</figcaption>
                        </figure>
                    </a>
                    <div className="headerInfoContainer">
                        <div className="userMeta">
                            <span>{user.posts.length} posts</span>
                            <span><button name="Followers" id="followers" onClick={this.handleShow}>{user.followers.length} followers</button></span>
                            <span><button name="Subscriptions" id="subscriptions" onClick={this.handleShow}>{user.subscriptions.length} following</button></span>
                        </div>
                        {
                            isFollowed
                                ? <button onClick={() => this.props.unfollow(user.id)} className="followBtn">UNFOLLOW</button>
                                : <button onClick={() => this.props.follow(user.id)} className="followBtn">FOLLOW</button>
                        }
                    </div>
                </div>
                <PostsSection posts={user.posts} />

                {/* Modal for followers or following users */}
                {
                    this.state.showModal ? <Modal handleClose={this.handleClose} modalHeaderName={this.state.modalHeaderName} users={this.state.users} /> : null
                }
            </main>
        )
    }

    //when url change, make sure that component will fetch new user data and will re-render
    async componentDidUpdate(prevProps) {
        if (prevProps.match.params.userId !== this.props.match.params.userId) {
            this.props.getUserInfo(this.props.match.params.userId)
        }
    }

    componentDidMount() {
        this.props.getUserInfo(this.props.match.params.userId)
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        follow: (userId) => dispatch(followUser(userId)),
        unfollow: (userId) => dispatch(unfollowUser(userId)),
        getUserInfo: (userId) => dispatch(getUser(userId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);

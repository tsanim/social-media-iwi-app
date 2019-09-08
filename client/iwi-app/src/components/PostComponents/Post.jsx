import React, { useState } from 'react';
import CommentsList from '../CommentComponents/CommentsList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import calcTime from '../../utils/calcTime';
import { likePost, dislikePost, deletePost } from '../../store/fetcher/postFetcher'
import { followUser } from '../../store/fetcher/userFetcher'
import { connect } from 'react-redux';
import DeleteModal from '../Modals/DeleteModal';
import EditFeedForm from '../Forms/EditFeedForm';
import URI from '../../config/config';
import Modal from '../Modals/Modal';

function Post({ username, userImg, date, text, postImg, likes, comments, postId, like, dislike, userId, auth, delPost, userPosts }) {

    //hook for question modal about deleting
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    //hook for showing edit form
    const [showForm, setShowForm] = useState(false);
    //hook for showing comments section and comment form
    const [showComments, setShowComments] = useState(false);
    //hook for showing likes people
    const [showLikesPeopleModal, setShowLikesPeopleModal] = useState(false);
    //hook for handle like post 
    const [likesCount, setLikes] = useState(likes.length);
    //hook for handle liked/not liked
    const initPostLiked = likes.findIndex(like => like._id === localStorage.getItem('userId')) >= 0
    const [isLiked, setIsLiked] = useState(initPostLiked);

    //elements styles against post info
    const textDivClassName = (postImg ? 'postText' : 'postText text-only-large');
    const btnsDivClassName = (postImg ? "buttons" : "buttons text-only-small");
    const likesString = (likesCount === 1 ? 'like' : 'likes');

    const handleLikePost = (e) => {
        e.persist();

        setLikes((likesCount) => likesCount + 1);
        setIsLiked((isLiked) => !isLiked);
        like(postId);
    }

    const handleDisLikePost = (e) => {
        e.persist();

        setLikes((likesCount) => likesCount - 1);
        setIsLiked((isLiked) => !isLiked);
        dislike(postId);
    }

    const handleShowModal = (e) => {
        e.persist();

        setShowDeleteModal((showDeleteModal) => true);
    }

    const handleShowLikesModal = (e) => {
        e.persist();

        setShowLikesPeopleModal((showLikesPeopleModal) => true);
    }

    const handleShowEditForm = (e) => {
        e.persist();

        setShowForm((showForm) => true);
    }

    const handleClose = (e) => {
        e.persist();

        setShowDeleteModal((showDeleteModal) => false);
        setShowLikesPeopleModal(() => false);
    }

    const handleShowComments = (e) => {
        e.persist();

        setShowComments((showComments) => !showComments);
    }

    return (
        <div>
            <div className="meta">
                <div>
                    <figure className="userInfo">
                        <Link to={"/profile/" + userId}>
                            <img src={`${URI}/feed/image/${userImg}`} alt="userPic" />
                            <figcaption>{username}</figcaption>
                        </Link>
                    </figure>
                </div>
                <span className="date">{calcTime(date)}</span>
            </div>

            {/* If text is empty, dont show the paragraph */}
            {
                text === ''
                    ? null
                    : (<div className={textDivClassName}>
                        {
                            showForm ? <EditFeedForm isPost={true} feedId={postId} text={text} /> : <p>{text}</p>
                        }
                    </div>)
            }

            {
                postImg
                    ? (<figure>
                        <img className="postPic" src={`${URI}/feed/image/${postImg}`} alt="" />
                    </figure>)
                    : null
            }
            <div className={btnsDivClassName}>
                <div className="left">
                    {
                        // likes.findIndex(like => like._id === localStorage.getItem('userId')) >= 0
                        isLiked
                            ? <button onClick={handleDisLikePost} className="liked"><FontAwesomeIcon icon={faHeart} /></button>
                            : <button onClick={handleLikePost}><FontAwesomeIcon icon={faHeart} /></button>
                    }
                    <button style={(showComments ? { color: "#8AAAE5" } : { color: 'inherit' })} onClick={handleShowComments}><FontAwesomeIcon icon={faComment} /></button>
                </div>

                <div className="right">
                    {/* Check Post username whether is equal to logged in username so button for delete and edit can show */}
                    {
                        (username === auth.username)
                            ? (
                                <div>
                                    <button onClick={handleShowModal}><FontAwesomeIcon icon={faTrashAlt} /></button>
                                    <button onClick={handleShowEditForm}><FontAwesomeIcon icon={faEdit} /></button>
                                </div>
                            )
                            : (<div>
                                {
                                    localStorage.getItem('role') === 'Admin'
                                        ? <button onClick={handleShowModal}><FontAwesomeIcon icon={faTrashAlt} /></button>
                                        : null
                                }
                            </div>)
                    }
                </div>

            </div>
            <div className="postMeta">
                <div className="meta">
                    <button onClick={handleShowLikesModal} className="likes">{likesCount + ' ' + likesString}</button>
                    <span onClick={handleShowComments}>{comments.length} Comments</span>
                </div>

                {
                    showComments
                        ? <CommentsList comments={comments} postId={postId} />
                        : null
                }

            </div>

            {
                showDeleteModal ? <DeleteModal isPost={true} feedId={postId} deleteFunc={delPost} handleClose={handleClose} /> : null
            }

            {/* Modal for likers */}
            {
                showLikesPeopleModal ? <Modal handleClose={handleClose} modalHeaderName={'Likes'} users={likes} /> : null
            }
        </div>
    )
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        userPosts: state.userPosts
    }
}

function mapDispatchToProps(dispatch) {
    return {
        like: (postId) => dispatch(likePost(postId)),
        dislike: (postId) => dispatch(dislikePost(postId)),
        delPost: (postId) => dispatch(deletePost(postId)),
        follow: (userId) => dispatch(followUser(userId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Post);

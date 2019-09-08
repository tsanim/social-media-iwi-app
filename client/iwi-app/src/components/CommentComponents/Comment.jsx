import React, { useState, useEffect } from 'react';
import calcTime from '../../utils/calcTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { likeComment, dislikeComment, deleteComment, editComment } from '../../store/fetcher/commentFetcher'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DeleteModal from '../Modals/DeleteModal';
import URI from '../../config/config';
import Modal from '../Modals/Modal';

function Comment({ creatorName, creatorImg, text, date, likes, commentId, likeCom, dislikeCom, userId, auth, deleteComm }) {
    //hook for question modal about deleting
    const [showDeleteModal, setShowModal] = useState(false);
    //hook for showing likes people
    const [showLikesPeopleModal, setShowLikesPeopleModal] = useState(false);
    //hook for handle like post 
    const [likesCount, setlikesCount] = useState(likes.length);
    //hook for handle liked/not liked
    const initCommentIsLiked = likes.includes(localStorage.getItem('userId'))
    const [isLiked, setIsLiked] = useState(initCommentIsLiked);
    //hook for likers
    const [likers, setLikers] = useState([]);

    //function for fetch comment likes
    const fetchLikes = async () => {
        const res = await fetch(`${URI}/feed/comments/likes/${commentId}`);
        const data = await res.json();
        setLikers(data.likes);
    }

    //when component did mound , fetched the likers of the comment for showing them in the modal
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchLikes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLikeComment = (e) => {
        e.persist();

        setlikesCount((likesCount) => likesCount + 1);
        setIsLiked((isLiked) => !isLiked);
        likeCom(commentId);

        //correct likers like add logged in user in likers array
        setLikers((likers) => [...likers, auth]);
    }

    const handleDisLikeComment = (e) => {
        e.persist();

        setlikesCount((likesCount) => likesCount - 1);
        setIsLiked((isLiked) => !isLiked);
        dislikeCom(commentId);

        //correct likers like remove logged in user from likers array
        setLikers((likers) => {
            likers = likers.filter(l => l._id !== auth._id)
            return likers;
        });
    }

    const handleShowModal = (e) => {
        e.persist();

        setShowModal((showDeleteModal) => true);
    }

    const handleShowLikesModal = (e) => {
        e.persist();

        setShowLikesPeopleModal((showLikesPeopleModal) => true);
    }

    const handleClose = (e) => {
        e.persist();

        setShowModal((showDeleteModal) => false);
        setShowLikesPeopleModal((showLikesPeopleModal) => false);

    }

    return (
        <div className="comment">
            <figure className="commentData">
                <Link to={"/profile/" + userId}>
                    <img src={`${URI}/feed/image/${creatorImg}`} alt="" />
                    <figcaption>{creatorName}</figcaption>
                </Link>
            </figure>
            <div className="commentContainer">
                {/* If edit form is shown , both comment's text and buttons are not shown */}
                <p>{text} </p>
                <div className="commentBtns">
                    {
                        isLiked
                            ? <button onClick={handleDisLikeComment} className="liked"><FontAwesomeIcon icon={faHeart} /></button>
                            : <button onClick={handleLikeComment}><FontAwesomeIcon icon={faHeart} /></button>
                    }

                    {
                        auth._id === userId
                            ? <button onClick={handleShowModal} ><FontAwesomeIcon icon={faTrash} /></button>
                            : null
                    }
                </div>
            </div>
            <div className="meta">
                <span className="date">{calcTime(date)}</span>
                <span onClick={handleShowLikesModal} >{likesCount} likes</span>
            </div>

            {
                showDeleteModal
                    ? <DeleteModal
                        isPost={false}
                        feedId={commentId}
                        deleteFunc={deleteComm}
                        handleClose={handleClose} />
                    : null
            }

            {/* Modal for likers */}
            {
                showLikesPeopleModal ? <Modal handleClose={handleClose} modalHeaderName={'Likes'} users={likers} /> : null
            }
        </div >
    )
}

function mapDispatchToProps(dispatch) {
    return {
        likeCom: (commentId) => dispatch(likeComment(commentId)),
        dislikeCom: (commentId) => dispatch(dislikeComment(commentId)),
        editComm: (commentId) => dispatch(editComment(commentId)),
        deleteComm: (commentId) => dispatch(deleteComment(commentId))
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        userPosts: state.userPosts,
        posts: state.posts
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
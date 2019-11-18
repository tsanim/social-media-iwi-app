import React, { useState, useEffect } from 'react';
import calcTime from '../../utils/calcTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import DeleteModal from '../Modals/DeleteModal';
import URI from '../../config/config';
import Modal from '../Modals/Modal';
import UserDataLink from '../UserInfoComponents/UserDataLink';
import httpRequest from '../../utils/httpRequest';
import PropTypes from 'prop-types';

function Comment({ comment, currUser, likeCommentHandler, dislikeCommentHandler, deleteCommentHandler }) {
    const { creator, text, date, likes, _id } = comment;

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
        const options = {
            method: 'get',
            url: `${URI}/feed/comments/likes/${_id}`,
            headers: {
                'Content-Type': 'application/json'
            },
            onSuccess: (data) => {
                setLikers(() => data.likes);
            }, 
            onError: (error) => {
                console.log(error);
            }
        }

        httpRequest(options);
    }

    //when component did mound , fetched the likers of the comment for showing them in the modal
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchLikes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLikeComment = (e) => {
        setlikesCount((likesCount) => likesCount + 1);
        setIsLiked((isLiked) => !isLiked);
        likeCommentHandler(_id);

        //correct likers like add logged in user in likers array
        setLikers((likers) => [...likers, currUser]);
    }

    const handleDisLikeComment = (e) => {
        setlikesCount((likesCount) => likesCount - 1);
        setIsLiked((isLiked) => !isLiked);
        dislikeCommentHandler(_id);

        //correct likers like remove logged in user from likers array
        setLikers((likers) => {
            likers = likers.filter(l => l._id !== currUser._id)
            return likers;
        });
    }

    const handleShowModal = (e) => {
        setShowModal((showDeleteModal) => true);
    }

    const handleShowLikesModal = (e) => {
        setShowLikesPeopleModal((showLikesPeopleModal) => true);
    }

    const handleClose = (e) => {
        setShowModal((showDeleteModal) => false);
        setShowLikesPeopleModal((showLikesPeopleModal) => false);

    }

    return (
        <div className="comment">
            <figure className="commentData">
                <UserDataLink user={creator} />
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
                        currUser._id === creator._id
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
                        feedId={_id}
                        deleteFunc={deleteCommentHandler}
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

Comment.propTypes = {
    comment: PropTypes.object,
    currUser: PropTypes.object,
    likeCommentHandler: PropTypes.func,
    dislikeCommentHandler: PropTypes.func,
    deleteCommentHandler: PropTypes.func
}

export default Comment;
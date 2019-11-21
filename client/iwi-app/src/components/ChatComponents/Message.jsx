import React from 'react';
import URI from '../../config/config';
import PropTypes from 'prop-types';
import ReactEmoji from 'react-emoji';

function Message(props) {
    return (
        <div className={`chat-message column ${props.isMine ? 'float-right' : null}`}>
            <figure className={props.isMine ? "float-right" : null}>
                <img src={`${URI}/feed/image/${props.message.creator.imageId}`} alt="userImg" />
                <div className="names">
                    <figcaption>{props.message.creator.username}</figcaption>
                </div>
            </figure>
            <span className={props.isMine ? "mine" : null}>{ReactEmoji.emojify(props.message.text)}</span>
        </div>
    )
}

Message.propTypes = {
    isMine: PropTypes.bool,
    message: PropTypes.object
}


export default Message;



import React from 'react';
import URI from '../../config/config';
import ScrollToBottom from 'react-scroll-to-bottom';
import ReactEmoji from 'react-emoji';
import PropTypes from 'prop-types';

function Messages(props) {
    return (
        <ScrollToBottom className="messagesContainer">
            <p className="msg">{props.infoMessage}</p>
            <ul>
                {
                    props.messages.map((m, i) => {
                        let liClass = i === 0 ? 'clearfix' : null;
                        let isMine = m.user._id === localStorage.getItem('userId');

                        return (
                            isMine
                                ? (<li key={i} className={liClass}>
                                    <div className="chat-message column float-right">
                                        <figure className="float-right">
                                            <img src={`${URI}/feed/image/${m.user.imageId}`} alt="userImg" />
                                            <div className="names">
                                                <figcaption>{m.user.username}</figcaption>
                                            </div>
                                        </figure>
                                        <span className="mine">{ReactEmoji.emojify(m.text)}</span>
                                    </div>
                                </li>)
                                : (<li key={i}>
                                    <div className="chat-message column float-left">
                                        <figure>
                                            <img src={`${URI}/feed/image/${m.user.imageId}`} alt="" />
                                            <div className="names">
                                                <figcaption>{m.user.username}</figcaption>
                                            </div>
                                        </figure>
                                        <span>{ReactEmoji.emojify(m.text)}</span>
                                    </div>
                                </li>)
                        )
                    })
                }
            </ul>
        </ScrollToBottom>
    )
}

Messages.propTypes = {
    infoMessage: PropTypes.string,
    messages: PropTypes.array,
}

export default Messages;
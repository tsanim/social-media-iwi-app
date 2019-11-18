import React, { useEffect } from 'react';
import Messages from './Messages';
import URI from '../../config/config';
import PropTypes from 'prop-types';

function Room(props) {
    const { curUser, 
        onlineUser, 
        messages, 
        infoMessage, 
        typing, onInputChangeHandler, 
        onKeyPressHandler, 
        onFocusHandler, 
        onBlurHandler, 
        message, 
        sendMessageHandler } = props

    useEffect(() => {
        return () => {
            props.onUnmountHandler();
        }
    }, []);

    return (
        <div className="chat">
            <header className="chatHeader">
                <figure>
                    <img src={`${URI}/feed/image/${onlineUser.imageId}`} alt="userImg" />
                    <div className="names">
                        <figcaption>{onlineUser.username}</figcaption>
                    </div>
                </figure>
            </header>
            <Messages
                curUser={curUser}
                onlineUser={onlineUser}
                messages={messages}
                infoMessage={infoMessage}
            />
            <span className="typing">{typing}</span>
            <div className="messageForm">
                <form id="messageForm">
                    <input
                        type="text"
                        placeholder="Type a message"
                        name="message"
                        value={message}
                        onChange={onInputChangeHandler}
                        onKeyPress={onKeyPressHandler}
                        onFocus={onFocusHandler}
                        onBlur={onBlurHandler}
                    />
                    <input type="button" onClick={sendMessageHandler} value="Send" />
                </form>
            </div>
        </div>
    )
}

Room.propTypes = {
    onlineUser: PropTypes.object,
    messages: PropTypes.array,
    infoMessage: PropTypes.string,
    typing: PropTypes.string,
    onInputChangeHandler: PropTypes.func,
    onKeyPressHandler: PropTypes.func,
    onFocusHandler: PropTypes.func,
    onBlurHandler: PropTypes.func,
    message: PropTypes.string,
    sendMessageHandler: PropTypes.func
}


export default Room;
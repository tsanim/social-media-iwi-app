import React from 'react';
import PropTypes from 'prop-types';

function MessageForm(props) {
    return (
        <div className="messageForm">
            <form id="messageForm">
                <input
                    type="text"
                    placeholder="Type a message"
                    name="message"
                    value={props.message}
                    onChange={props.onInputChangeHandler}
                    onKeyPress={props.onKeyPressHandler}
                    onFocus={props.onFocusHandler}
                    onBlur={props.onBlurHandler}
                />
                <input type="button" onClick={props.sendMessageHandler} value="Send" />
            </form>
        </div>
    )
}

MessageForm.propTypes = {
    message: PropTypes.string,
    onInputChangeHandler: PropTypes.func,
    onKeyPressHandler: PropTypes.func,
    onFocusHandler: PropTypes.func,
    onBlurHandler: PropTypes.func,
    sendMessageHandler: PropTypes.func
}

export default MessageForm;

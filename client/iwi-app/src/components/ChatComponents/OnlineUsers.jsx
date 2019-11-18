import React from 'react';
import URI from '../../config/config';
import PropTypes from 'prop-types';

function OnlineUsers(props) {
    const {
        onlineUsers,
    } = props

    return (<div className="onlineUsers">
        <ul>
            <h3>Online users</h3>
            {
                (onlineUsers && onlineUsers.length > 0)
                    ? onlineUsers.map(u => {
                        return (<li key={u._id}>
                            <button id={`${u._id}`} onClick={props.showRoomHandler}>
                                <div className="card">
                                    <figure>
                                        <img src={`${URI}/feed/image/${u.imageId}`} alt="userImg" />
                                        <div className="names">
                                            <figcaption>{u.username}</figcaption>
                                            <span className="fullname">{`${u.firstName} ${u.lastName}`}</span>
                                        </div>
                                    </figure>
                                </div>
                            </button>
                        </li>)
                    })
                    : null
            }
        </ul>
    </div>
    )
}

OnlineUsers.propTypes = {
    onlineUser: PropTypes.array,
    showRoomHandler: PropTypes.func
}


export default OnlineUsers;



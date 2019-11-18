import React from 'react';
import PropTypes from 'prop-types';
import UserCard from '../DiscoverComponents/UserCard';

function Modal(props) {
    return (
        <div onClick={props.handleClose} id="myModal" className="modal">
            {/* Modal content */}

            <div className="modal-content">
                <span onClick={props.handleClose} className="close">&times;</span>
                <div className="modal-header">
                    <h2>{props.modalHeaderName}</h2>
                </div>

                <ul>
                    {
                        props.users.length > 0
                            ? props.users.map(u => (<li key={u._id}>
                                <UserCard
                                    user={u}
                                />
                            </li>))
                            : <li>No {props.modalHeaderName}</li>
                    }
                </ul>
            </div>
        </div>
    )
}

Modal.propTypes = {
    handleClose: PropTypes.func,
    modalHeaderName: PropTypes.string,
    isPost: PropTypes.bool,
    users: PropTypes.array,
}


export default Modal;
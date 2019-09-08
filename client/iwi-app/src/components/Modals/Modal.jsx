import React, { Component } from 'react';
import UserCard from '../App/Discover/UserCard';

class Modal extends Component {
    render() {
        const { users, modalHeaderName, handleClose } = this.props;

        return (
            <div onClick={handleClose} id="myModal" className="modal">
                {/* Modal content */}

                <div className="modal-content">
                    <span onClick={handleClose} className="close">&times;</span>
                    <div className="modal-header">
                        <h2>{modalHeaderName}</h2>
                    </div>

                    <ul>
                        {
                            users.length > 0 
                            ? users.map(u => (<li key={u._id}>
                                <UserCard
                                    imageId={u.imageId}
                                    username={u.username}
                                    firstName={u.firstName}
                                    lastName={u.lastName}
                                    id={u._id}
                                />
                            </li>))
                            : <li>No {modalHeaderName}</li>
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

export default Modal;
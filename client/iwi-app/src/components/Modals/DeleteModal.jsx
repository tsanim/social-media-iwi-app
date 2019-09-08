import React from 'react';

function DeleteModal({ handleClose, deleteFunc, feedId, isPost }) {
    return (
        <div>
            {/* The Modal */}
            <div id="myModal" className="modal">
                {/* Modal content */}
                <div className="modal-content">
                    <span onClick={handleClose} className="close">×</span>
                    <p>{`Do you really want to delete this ${isPost ? 'post' : 'comment'}?`}</p>
                    <button onClick={() => deleteFunc(feedId)} className="btn info">Yes</button>
                    <button onClick={handleClose} className="btn default">No</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal;
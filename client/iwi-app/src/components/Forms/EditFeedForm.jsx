import React from 'react';
import useForms from '../../hooks/useForms';
import { connect } from 'react-redux';
import { editComment } from '../../store/fetcher/commentFetcher';
import { editPost } from '../../store/fetcher/postFetcher';

function EditFeedForm({ isPost, feedId, text, editUserPost, editComm }) {
    const { handleSubmit, handleChangeInput, inputs } = useForms((e) => {
        if (isPost) {
            editUserPost(inputs, feedId);
        } else {
            editComm(inputs, feedId);
        }
    });

    return (
        <form id="editFeedForm" onSubmit={handleSubmit}>
            <textarea
                placeholder="Write something..."
                name="text"
                id="feed"
                value={inputs.text || text}
                onChange={handleChangeInput}
            />
            <input type="submit" value="SAVE" />
        </form>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        editComm: (data, commentId) => dispatch(editComment(data, commentId)),
        editUserPost: (data, postId) => dispatch(editPost(data, postId)),
    }
}

export default connect(null, mapDispatchToProps)(EditFeedForm);
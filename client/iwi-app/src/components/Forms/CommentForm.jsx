import React from 'react';
import useForms from '../../hooks/useForms';
import { connect } from 'react-redux';
import { makeComment } from '../../store/fetcher/commentFetcher';
import { wrapComponent } from 'react-snackbar-alert';

function CommentForm({ postId, commentPost, createSnackbar }) {
    const { handleSubmit, handleChangeInput, inputs } = useForms((e) => {

        //check for empty text and send message to user
        if (inputs.text === '') {
            createSnackbar({
                message: 'You can not make comment without text!',
                timeout: 3000,
            });
        } else {
            commentPost({ ...inputs, postId })
        }
    });

    return (
        <form className="commentForm" onSubmit={handleSubmit}>
            <textarea
                placeholder="Write a comment..."
                name="text"
                id="comment"
                value={inputs.text || ''}
                onChange={handleChangeInput}
            />
            <input disabled={inputs.text === '' || !inputs.text} type="submit" value="Comment" />
        </form>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        commentPost: (data) => dispatch(makeComment(data))
    }
}

export default connect(null, mapDispatchToProps)(wrapComponent(CommentForm));

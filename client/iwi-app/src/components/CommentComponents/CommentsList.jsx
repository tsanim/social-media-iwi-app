import React from 'react';
import Comment from './Comment';
import CommentForm from '../Forms/CommentForm';

function CommentsSection({ comments, postId }) {
    return (
        <section className="comments">
            <h3>Comments</h3>
            <ul>
                {
                    comments.length > 0
                        ? comments.map(c => (<li key={c._id}>
                            <Comment
                                creatorName={c.creator.username}
                                creatorImg={c.creator.imageId}
                                userId={c.creator._id}
                                text={c.text}
                                date={c.date}
                                likes={c.likes}
                                commentId={c._id}
                            />
                        </li>))
                        : null
                }
            </ul>
            <CommentForm postId={postId} />
        </section>
    )
}

export default CommentsSection;
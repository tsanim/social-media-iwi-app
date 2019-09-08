import React, { Component } from 'react';
import Post from './Post';
import sortByDate from '../../utils/sortByDate';

class PostsSection extends Component {
    render() {
        const { posts } = this.props;
        return (
            <section id="posts">
                {posts.length > 0
                    ? (
                        posts
                            .sort(sortByDate)
                            .map(p => {
                            return (<article key={p._id} className="post">
                                <Post
                                    username={p.creator.username}
                                    userId={p.creator._id}
                                    userImg={p.creator.imageId}
                                    postId={p._id}
                                    date={p.date}
                                    text={p.text}
                                    postImg={p.imageId}
                                    likes={p.likes}
                                    comments={p.comments}
                                />
                            </article>
                            )
                        })
                    )
                    : null
                }
            </section>
        )
    }
}

export default PostsSection;
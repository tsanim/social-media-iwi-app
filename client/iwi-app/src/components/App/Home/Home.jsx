import React, { Component } from 'react';
import { connect } from 'react-redux';
import MakePostDiv from '../../PostComponents/MakePostDiv';
import PostsSection from '../../PostComponents/PostsSection';
import Loader from '../../Loader/Loader';

class Home extends Component {
    render() {
        const { userPosts, subsPosts, fetchStatus } = this.props;
        console.log(userPosts, subsPosts);
        return (
            <main>
                <MakePostDiv />
                {
                    fetchStatus > 0
                        ? <Loader />
                        : <PostsSection posts={userPosts.concat(subsPosts)} />
                }
            </main>
        )
    }
}

function mapStateToProps(state) {
    return {
        userPosts: state.userPosts,
        subsPosts: state.posts,
        fetchStatus: state.fetchStatus
    }
}

export default connect(mapStateToProps)(Home);
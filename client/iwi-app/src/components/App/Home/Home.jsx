import React, { Component } from 'react';
import { connect } from 'react-redux';
import MakePostDiv from '../../PostComponents/MakePostDiv';
import PostsSection from '../../PostComponents/PostsSection';
import Loader from '../../Loader/Loader';

import { getUserPosts, getAllSubsPosts } from '../../../store/fetcher/postFetcher';

class Home extends Component {
    render() {
        const { userPosts, subsPosts, fetchStatus } = this.props;

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

    componentDidMount() {
        //when home component is rendered always fetch subs posts 
        this.props.getSubsPosts();
        this.props.getUserPosts(localStorage.getItem('userId'));
    }
}

function mapStateToProps(state) {
    return {
        userPosts: state.userPosts,
        subsPosts: state.posts,
        fetchStatus: state.fetchStatus
    }
}

function mapDispatchToProps(dispatch) {
    return {
      getUserPosts: (id) => dispatch(getUserPosts(id)),
      getSubsPosts: () => dispatch(getAllSubsPosts())
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Home);
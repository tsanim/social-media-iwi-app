import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUser } from '../../../store/fetcher/userFetcher';
import URI from '../../../config/config';

class UserCard extends Component {
    render() {
        const { imageId, username, id, firstName, lastName } = this.props;
        return (
            <div className="card">
                <Link to={"/profile/" + id}>
                    <figure>
                        <img src={`${URI}/feed/image/${imageId}`} alt="" />
                        <div className="names">
                            <figcaption>{username}</figcaption>
                            <span className="fullname">{firstName} {lastName}</span>
                        </div>
                    </figure>
                </Link>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getUserInfo: (userId) => dispatch(getUser(userId))
    }
}

export default connect(null, mapDispatchToProps)(UserCard);
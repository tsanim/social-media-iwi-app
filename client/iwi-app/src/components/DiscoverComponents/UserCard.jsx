import React from 'react';
import { Link } from 'react-router-dom';
import URI from '../../config/config';
import PropTypes from 'prop-types';

function UserCard(props) {
    const { imageId, username, _id, firstName, lastName } = props.user;

    return (
        <div className="card">
            <Link to={"/profile/" + _id}>
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

UserCard.propTypes = {
    user: PropTypes.object,
}

export default UserCard;
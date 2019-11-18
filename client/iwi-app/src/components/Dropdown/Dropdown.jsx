import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Dropdown.css';
import { faBell } from '@fortawesome/free-solid-svg-icons';

function Dropdown(props) {
    return (
        <div className="dropdown">
            <button className="dropbtn"><FontAwesomeIcon icon={faBell} />{props.notifications.length}</button>
            <div className="dropdown-content">
                {
                    props.notifications.map(n => <Link key={n.room} to={`/chat?sender=${n.sender}`}> {n.message} </Link>)
                }
            </div>
        </div>
    )
}

// Dropdown.propTypes = {
//     user: PropTypes.object,
//     resetUserPostsHandler: PropTypes.func,
//     signoutHandler: PropTypes.func,
//     switchToOffline: PropTypes.func,
//     switchToOnline: PropTypes.func,
// }

export default Dropdown;
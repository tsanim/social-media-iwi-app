import React from 'react';
import UserCard from './UserCard';
import WithLoader from '../HOCS/WithLoader';
import PropTypes from 'prop-types';

function FoundPeopleList(props) {
    const { foundUsers } = props;

    return (
        <div className="results">
            <ul>
                {
                    (foundUsers && foundUsers.length > 0)
                        ? (foundUsers.map(u => <li key={u._id}>
                            <UserCard
                                user={u}
                            />
                        </li>
                        ))
                        : <p>No found users</p>
                }
            </ul>
        </div>
    )
}

FoundPeopleList.propTypes = {
    foundUsers: PropTypes.array,
}


export default WithLoader(FoundPeopleList);
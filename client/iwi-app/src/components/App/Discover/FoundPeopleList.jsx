import React, { Component } from 'react';
import UserCard from './UserCard';
import { connect } from 'react-redux';

class FoundPeopleList extends Component {
    render() {
        const { foundUsers } = this.props;
        return (
            <div className="results">
                <ul>
                    {
                        (foundUsers && foundUsers.length > 0)
                            ? (foundUsers.map(u => <li key={u._id}>
                                <UserCard
                                    imageId={u.imageId}
                                    username={u.username}
                                    firstName={u.firstName}
                                    lastName={u.lastName}
                                    id={u._id}
                                />
                            </li>
                            ))
                            : <p>No found users</p>
                    }
                </ul>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        foundUsers: state.users.foundUsers
    }
}


export default connect(mapStateToProps)(FoundPeopleList);
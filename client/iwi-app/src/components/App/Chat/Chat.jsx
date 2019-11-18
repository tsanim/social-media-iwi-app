import React, { Component } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import URI from '../../../config/config';
import queryString from 'query-string';
import Room from '../../ChatComponents/Room';
import { Map, List } from 'immutable';
import PropTypes from 'prop-types';

const chatEndPoint = 'localhost:8888'
const socket = io(chatEndPoint);

class Chat extends Component {
    state = {
        onlineUsers: [],
        user: {},
        showRoom: false,
        messages: [],
        infoMessage: '',
        message: '',
        typing: '',
        room: '',
    }

    showRoomHandler = (e) => {
        const user = this.state.onlineUsers.find(u => u._id === e.currentTarget.id);

        socket.emit('send notification', { senderId: localStorage.getItem('userId'), notificatedUserId: user._id });
        socket.emit('join room', { userId: user._id, senderId: localStorage.getItem('userId') });
        socket.emit('get messages', { curUserId: this.props.curUser.get('id'), onlineUser: user._id });

        this.setState(oldState => ({
            user,
            showRoom: !oldState.showRoom,
            room: this.props.curUser.get('id') + user._id
        }));
    }

    sendMessageHandler = (e) => {
        e.preventDefault();

        socket.emit('send message', { text: this.state.message, room: this.state.room, userId: localStorage.getItem('userId') });

        this.setState({ message: '' });
    }

    onInputChangeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onKeyPressHandler = (e) => {
        return e.key === 'Enter' ? this.sendMessageHandler(e) : null;
    }

    onFocusHandler = (e) => {
        // socket.emit('seen')
        socket.emit('typing', { username: this.props.curUser.get('username'), room: this.state.room });
    }

    onBlurHandler = (e) => {
        socket.emit('stop typing', { room: this.state.room });
    }

    onUnmountHandler = () => {
        socket.emit('leave room', { room: this.state.room, username: this.props.curUser.get('username') });
    }

    render() {
        return (
            <main>
                <div className="chatWrapper">
                    <h1>Chat with your friends!</h1>

                    {
                        this.state.showRoom
                            ? <Room
                                curUser={this.props.curUser.toJS()}
                                onlineUser={this.state.user}
                                messages={this.state.messages}
                                infoMessage={this.state.infoMessage}
                                typing={this.state.typing}
                                onInputChangeHandler={this.onInputChangeHandler}
                                onKeyPressHandler={this.onKeyPressHandler}
                                onFocusHandler={this.onFocusHandler}
                                onBlurHandler={this.onBlurHandler}
                                message={this.state.message}
                                sendMessageHandler={this.sendMessageHandler}
                                onUnmountHandler={this.onUnmountHandler}
                            />
                            : null
                    }

                    <div className="onlineUsers">
                        <ul>
                            <h3>Online users</h3>
                            {
                                (this.state.onlineUsers && this.state.onlineUsers.length > 0)
                                    ? this.state.onlineUsers.map(u => {
                                        return (<li key={u._id}>
                                            <button id={`${u._id}`} onClick={this.showRoomHandler}>
                                                <div className="card">
                                                    <figure>
                                                        <img src={`${URI}/feed/image/${u.imageId}`} alt="userImg" />
                                                        <div className="names">
                                                            <figcaption>{u.username}</figcaption>
                                                            <span className="fullname">{`${u.firstName} ${u.lastName}`}</span>
                                                        </div>
                                                    </figure>
                                                </div>
                                            </button>
                                        </li>)
                                    })
                                    : null
                            }
                        </ul>
                    </div>
                </div>
            </main>
        )
    }

    //when url change, make sure that component will fetch new user data and will re-render
    componentDidUpdate(prevProps) {
        const { sender: oldSender } = queryString.parse(prevProps.location.search);
        const { sender } = queryString.parse(this.props.location.search);
        let stateMessages = [];

        if ((!oldSender && sender) || (oldSender !== sender)) {
            socket.emit('join sender room', { userId: localStorage.getItem('userId'), senderId: sender });
            socket.emit('get messages', { curUserId: localStorage.getItem('userId'), onlineUser: sender });

            socket.on('messages', ({ messages }) => {
                stateMessages = [...messages];
            });

            socket.on('join sender room', ({ user }) => {
                this.setState(oldState => {
                    return {
                        showRoom: !oldState.showRoom,
                        user,
                        room: user.room,
                        messages: stateMessages
                    }
                })
            })
        }
    }

    componentDidMount() {
        const { sender } = queryString.parse(this.props.location.search);

        socket.emit('join', { userId: localStorage.getItem('userId') });

        socket.on('messages', ({ messages }) => {
            this.setState({ messages });
        });

        socket.on('online users', ({ onlineUsers }) => {
            const curUserSubs = this.props.curUser.get('subscriptions').toJS();

            this.setState({
                onlineUsers: onlineUsers.filter(onlineUser => curUserSubs.some((u) => {
                    return u._id === onlineUser._id.toString()
                }))
            });
        });

        socket.on('typing', ({ username }) => {
            setTimeout(() => {
                this.setState({ typing: `${username} is typing...` })
            }, 500)
        });

        socket.on('stop typing', (data) => {
            setTimeout(() => {
                this.setState({ typing: '' })
            }, 500)
        });

        socket.on('join room', ({ user }) => {
            this.setState({ room: user.room });
        });

        if (sender) {
            socket.emit('join sender room', { userId: localStorage.getItem('userId'), senderId: sender });

            socket.on('join sender room', ({ user }) => {
                this.setState(oldState => {
                    return {
                        showRoom: !oldState.showRoom,
                        user,
                        room: user.room
                    }
                })
            })
        }

        socket.on('info message', ({ text }) => {
            this.setState({ infoMessage: text });
        });

        socket.on('message', (data) => {
            this.setState((oldState) => ({ messages: [...oldState.messages, data.message] }))
        });

        this.timer = setInterval(() => {
            const onlineUsers = getOnlineUsers();

            this.setState({ onlineUsers });
        }, 2000);
    }

    componentWillUnmount() {
        socket.emit('disconnect');
        socket.off();

        clearInterval(this.timer);
    }
}

function getOnlineUsers() {
    socket.emit('online users');

    socket.on('online users', ({ onlineUsers }) => {
        return onlineUsers;
    });
}

function mapStateToProprs(state) {
    return {
        curUser: state.systemReducer.get('curUser')
    }
}

Chat.propTypes = {
    curUser: PropTypes.instanceOf(Map),
}

export default connect(mapStateToProprs)(Chat);
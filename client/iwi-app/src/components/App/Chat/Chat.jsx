import React, { Component } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import queryString from 'query-string';
import Room from '../../ChatComponents/Room';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import OnlineUsers from '../../ChatComponents/OnlineUsers';
import { getRoomMessages, getOnlineUsers, joinSenderRoom } from '../../../services/chatService';

const chatEndPoint = 'localhost:8888'
const socket = io(chatEndPoint);

class Chat extends Component {
    state = {
        onlineUsers: [],
        onlineUser: {},
        isRoomShown: false,
        messages: [],
        infoMessage: '',
        messageText: '',
        typingMessage: '',
        roomId: '',
    }

    showRoomHandler = async (e) => {
        const onlineUser = this.state.onlineUsers.find(u => u._id === e.currentTarget.id);
        let stateMessages = await getRoomMessages(socket, this.props.curUser.get('id'), onlineUser._id);

        socket.emit('sendNotification', { senderId: localStorage.getItem('userId'), notificatedUserId: onlineUser._id });
        socket.emit('joinRoom', { userId: onlineUser._id, senderId: localStorage.getItem('userId') });

        this.setState(oldState => ({
            onlineUser,
            isRoomShown: true,
            messages: [...oldState.messages, ...stateMessages]
        }));
    }

    sendMessageHandler = (e) => {
        e.preventDefault();

        socket.emit('sendMessage', { text: this.state.messageText, roomId: this.state.roomId, userId: localStorage.getItem('userId') });

        this.setState({ messageText: '' });
    }

    onInputChangeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onKeyPressHandler = (e) => {
        return e.key === 'Enter' ? this.sendMessageHandler(e) : null;
    }

    onKeyDownHandler = (e) => {
        socket.emit('typing', { username: this.props.curUser.get('username'), roomId: this.state.roomId });
    }

    onBlurHandler = (e) => {
        socket.emit('stopTyping', { roomId: this.state.roomId });
    }

    onUnmountHandler = () => {
        socket.emit('leaveRoom', { roomId: this.state.roomId, username: this.props.curUser.get('username') });
    }

    render() {
        return (
            <main>
                <div className="chatWrapper">
                    <h1>Chat with your friends!</h1>

                    {
                        this.state.isRoomShown
                            ? <Room
                                curUser={this.props.curUser.toJS()}
                                onlineUser={this.state.onlineUser}
                                messages={this.state.messages}
                                infoMessage={this.state.infoMessage}
                                typingMessage={this.state.typingMessage}
                                onInputChangeHandler={this.onInputChangeHandler}
                                onKeyPressHandler={this.onKeyPressHandler}
                                onKeyDownHandler={this.onKeyDownHandler}
                                onBlurHandler={this.onBlurHandler}
                                messageText={this.state.messageText}
                                sendMessageHandler={this.sendMessageHandler}
                                onUnmountHandler={this.onUnmountHandler}
                            />
                            : null
                    }

                    <OnlineUsers
                        onlineUsers={this.state.onlineUsers}
                        showRoomHandler={this.showRoomHandler}
                    />
                </div>
            </main>
        )
    }

    async componentDidUpdate(prevProps) {
        const { sender: oldSender } = queryString.parse(prevProps.location.search);
        const { sender } = queryString.parse(this.props.location.search);

        if ((!oldSender && sender) || (oldSender !== sender)) {
            let stateMessages = await getRoomMessages(socket, localStorage.getItem('userId'), sender);
            let onlineUser = await joinSenderRoom(socket, localStorage.getItem('userId'), sender);

            this.setState({
                isRoomShown: true,
                onlineUser,
                roomId: onlineUser.roomId,
                messages: stateMessages
            });
        }
    }

    async componentDidMount() {
        const { sender } = queryString.parse(this.props.location.search);

        socket.emit('join', { userId: localStorage.getItem('userId') });

        socket.on('message', ({ message }) => {
            this.setState((oldState) => {
                return {
                    messages: [...oldState.messages, message]
                }
            })
        });

        socket.on('onlineUsers', ({ onlineUsers }) => {
            const curUserSubs = this.props.curUser.get('subscriptions').toJS();

            this.setState({
                onlineUsers: onlineUsers.filter(onlineUser => curUserSubs.some((u) => {
                    return u._id === onlineUser._id.toString()
                }))
            });
        });

        socket.on('typing', ({ username }) => {
            setTimeout(() => {
                this.setState({ typingMessage: `${username} is typing...` })
            }, 500)
        });

        socket.on('stopTyping', (data) => {
            setTimeout(() => {
                this.setState({ typingMessage: '' })
            }, 500)
        });

        socket.on('joinRoom', ({ user }) => {
            this.setState({ roomId: user.roomId });
        });

        socket.on('infoMessage', ({ text }) => {
            this.setState({ infoMessage: text });
        });

        if (this.state.onlineUser._id) {
            let messages = await getRoomMessages(socket, localStorage.getItem('userId'), this.state.onlineUser._id);

            this.setState({ messages });
        }

        if (sender) {
            let stateMessages = await getRoomMessages(socket, localStorage.getItem('userId'), sender);
            let onlineUser = await joinSenderRoom(socket, localStorage.getItem('userId'), sender);

            this.setState(oldState => {
                return {
                    isRoomShown: !oldState.isRoomShown,
                    onlineUser,
                    roomId: onlineUser.roomId,
                    messages: stateMessages
                }
            })
        }

        this.timer = setInterval(async () => {
            const onlineUsers = await getOnlineUsers(socket);
            const curUserSubs = this.props.curUser.get('subscriptions').toJS();

            this.setState({
                onlineUsers: onlineUsers.filter(onlineUser => curUserSubs.some((u) => {
                    return u._id === onlineUser._id.toString()
                }))
            });
        }, 2000);
    }

    componentWillUnmount() {
        socket.emit('disconnect', { userId: localStorage.getItem('userId') });
        socket.off();

        this.setState({ infoMessage: '' });
        clearInterval(this.timer);
    }
}



function mapStateToProps(state) {
    return {
        curUser: state.systemReducer.get('curUser')
    }
}

Chat.propTypes = {
    curUser: PropTypes.instanceOf(Map),
}

export default connect(mapStateToProps)(Chat);
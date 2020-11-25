import React, {Component} from 'react';
import {connect} from 'react-redux'
import firebase from "../../firebase";
import {setPrivateChannel, setCurrentChannel} from "../../redux/actions";
import {Icon, Menu} from "semantic-ui-react";

class Starred extends Component {
    state={
        user:this.props.currentUser,
        usersRef:firebase.database().ref('users'),
        activeChannel: '',
        starredChannels:[]
    };

    componentDidMount() {
       if (this.state.user){
           this.addListeners(this.state.user.uid);
       }
    }
    componentWillUnmount() {
        this.removeListeners();
    }

    removeListeners=()=>{
        this.state.usersRef.child(`${this.state.user.uid}/starred`).off();
    };

    addListeners=(userId)=>{
      this.state.usersRef
          .child(userId)
          .child('starred')
          .on('child_added', snap=>{
              const starredChannel={ id: snap.key, ...snap.val()};

              this.setState({
                  starredChannels: [...this.state.starredChannels, starredChannel]
              })
          });


        this.state.usersRef
            .child(userId)
            .child('starred')
            .on('child_removed', snap=>{
                const channelToRemove= {id: snap.key, ...snap.val()};

                const filteredChannels= this.state.starredChannels.filter(channel=>{
                    return channel.id !== channelToRemove.id;
                });

                this.setState({starredChannels: filteredChannels})
            })
    };

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id });
    };

    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
    };

    displayChannels = starredChannel =>
        starredChannel.length > 0 &&
        starredChannel.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={channel.id === this.state.activeChannel}
            >
                # {channel.name}
            </Menu.Item>
        ));


    render() {
        const {starredChannels}=this.state;
        return (
            <Menu.Menu className='menu'>
                <Menu.Item>
                        <span>
                          <Icon name="star" /> STARRED
                        </span>{" "}
                    ({starredChannels.length})
                </Menu.Item>
                {this.displayChannels(starredChannels)}
            </Menu.Menu>
        );
    }
}

Starred.propTypes = {};

export default connect(null, {setCurrentChannel, setPrivateChannel})(Starred);
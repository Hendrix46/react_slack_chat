import React, {Component} from 'react';
import firebase from "../../firebase";
import AvatarEditor from "react-avatar-editor";
import {Button, Dropdown, Grid, Header, Icon, Image, Input, Modal} from "semantic-ui-react";

class UserPanel extends Component {
    state={
        user: this.props.currentUser,
        modal:false,
        previewImage:'',
        croppedImage:'',
        blob:'',
        uploadedCroppedImage:'',
        storageRef: firebase.storage().ref(),
        userRef:firebase.auth().currentUser,
        usersRef: firebase.database().ref('users'),
        metadata: {
            contentType: 'image/jpeg'
        }
    };
    openModal=()=>this.setState({modal:true});
    closeModal=()=>this.setState({modal:false});
    dropdownOptions=()=>[
        {
            key:'user',
            text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true
        },
        {
            key:'avatar',
            text: <span onClick={this.openModal}>Change avatar</span>
        },
        {
            key:'signout',
            text: <span onClick={this.handleSignOut}>Sign Out</span>
        }
    ];

    uploadCroppedImage=()=>{
        const {storageRef, userRef, blob, metadata}=this.state;
        storageRef
            .child(`avatars/users/${userRef.uid}`)
            .put(blob, metadata)
            .then(snap=>{
                snap.ref.getDownloadURL().then(downloadUrl=>{
                    this.setState({uploadedCroppedImage: downloadUrl}, ()=>{this.changeAvatar()})
                })
            })
    };
    changeAvatar=()=>{
        this.state.userRef
            .updateProfile({
                photoURL: this.state.uploadedCroppedImage
            })
            .then(()=>{
                console.log('PhotoUrl updated');
                this.closeModal();
            })
            .catch(err=>{
                console.error(err)
            });

        this.state.usersRef
            .child(this.state.user.uid)
            .update({avatar: this.state.uploadedCroppedImage})
            .then(()=>{
                console.log('User Avatar updated')
            })
            .catch(err=>{
                console.error(err)
            })
    };
    handleSignOut=()=>{
        firebase
            .auth()
            .signOut()
            .then(()=> console.log('signet out'))
    };
    handleChange=(event)=>{
        const file= event.target.files[0];
        const reader= new FileReader();

        if (file){
            reader.readAsDataURL(file);
            reader.addEventListener('load', ()=>{
               this.setState({previewImage: reader.result});
            });
        }
    };
    handleCropImage=()=>{
        if(this.avatarEditor){
            this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl=URL.createObjectURL(blob);
                this.setState({
                    croppedImage: imageUrl,
                    blob
                })
            })
        }
    };
    render() {
        const {user, modal, previewImage, croppedImage} = this.state;
        const {primaryColor} = this.props;
        return (
            <div>
                <Grid style={{background: primaryColor , margin:0}}>
                    <Grid.Column>
                        <Grid.Row style={{padding: '1.2rem', margin : 0}}>
                            {/*App Header*/}
                            <Header inverted floated='left' as='h2'>
                                <Icon name='code'/>
                                <Header.Content>
                                    DevChat
                                </Header.Content>
                            </Header>
                            <Header style={{padding: '0.25em' , color:'white'}} as='h4'>
                                <Dropdown
                                    trigger={
                                        <span>
                                        <Image src={user.photoURL} spaced='right' avatar />
                                            {user.displayName}
                                    </span>
                                    }
                                    options={this.dropdownOptions()}
                                />
                            </Header>
                        </Grid.Row>

                        <Modal basic open={modal} onClose={this.closeModal}>
                            <Modal.Header>Change Avatar</Modal.Header>
                            <Modal.Content>
                                <Input
                                    onChange={this.handleChange}
                                    fluid
                                    type='file'
                                    label='new avatar'
                                    name='previewImage'
                                />
                                <Grid centered stackable columns={2}>
                                    <Grid.Row centered>
                                        <Grid.Column className='ui centered aligned grid'>
                                            {previewImage && (
                                                <AvatarEditor
                                                    ref={node => (this.avatarEditor = node)}
                                                    image={previewImage}
                                                    width={120}
                                                    height={120}
                                                    border={50}
                                                    scale={1.2}
                                                />
                                            )}
                                        </Grid.Column>
                                        <Grid.Column >
                                            {croppedImage && (
                                                <Image
                                                    style={{margin: '3.5em auto'}}
                                                    width={100}
                                                    height={100}
                                                    src={croppedImage}
                                                />
                                            )}
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Modal.Content>
                            <Modal.Actions>
                                {croppedImage && <Button color='green' inverted onClick={this.uploadCroppedImage}>
                                    <Icon name='save'/>Change Avatar
                                </Button>}
                                <Button color='green' inverted onClick={this.handleCropImage}>
                                    <Icon name='image'/>Preview
                                </Button>
                                <Button color='red' inverted onClick={this.closeModal   }>
                                    <Icon name='remove'/>Cancel
                                </Button>
                            </Modal.Actions>
                        </Modal>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}


export default UserPanel;
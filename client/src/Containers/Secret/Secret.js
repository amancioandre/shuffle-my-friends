import React, { Component } from 'react';


/* Components */
import Event from "../../Components/Form/Event";
import Friends from "../../Components/Form/Friend";
import Backdrop from "../../Components/Backdrop/Backdrop";

/* Material UI */
import { IconButton, Icon } from "@material-ui/core";

export default class Secret extends Component {
  constructor(props) {
    super(props);

    this.state = {
      friends : [{ name: '', email: ''}],
      event: { 
        title: '',
        date: '',
        time: '',
        giftValue: '',
        description: 'Hey friends, guess what!? ...'
      },
      submiting: false,
      step: 2,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addFriend = this.addFriend.bind(this);
    this.removeFriend = this.removeFriend.bind(this);
    this.clearFriends = this.clearFriends.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.prevStep = this.prevStep.bind(this);
  }

  handleChange(e) {
    const { value, className, dataset: { id }, name } = e.target;
    const { event } = this.state

    if (["name", "email"].includes(className)) {
      let friends = [...this.state.friends];
      friends[id][className] = value;
      this.setState({ friends });
    } else {
      event[name] = value;
      this.setState({ event });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submiting: !this.state.submiting })
    /* Axios Stuff */
  }

  addFriend() {
    this.setState((prevState) => ({
      friends: [...prevState.friends, { name: '', email: '' }]
    }));
  }
  
  removeFriend(idx) {
    this.setState((prevState) => {
      const friends = [...prevState.friends];
      friends.splice(idx, 1);
      return { friends }
    })
  }

  clearFriends() {
    this.setState({ friends: [{ name: '', email: ''}]});
  }

  nextStep() {
    let { step } = this.state;
    step >= 3 ? step = 3 : step += 1;
    this.setState({ step });
  }

  prevStep() {
    let { step } = this.state;
    step <= 0 ? step = 0 : step -= 1;
    this.setState({ step });
  }

  render() {
    const { friends, event, submiting, step } = this.state;
    let displayStep = '';

    switch(step) {
      case 0: // APP Title and Description, Landing Page per se.
        displayStep = 
          <div>
            App Title
            App Description
          </div>; break;
      
      case 1: // Event Form
        displayStep = <Event event={event} />; break;
      
      case 2: // Friends Form
        displayStep = 
          <div>
            <Friends friends={friends} deleteBtn={this.removeFriend}/>
            <IconButton 
              color="secondary"
              onClick={this.addFriend}>
                <Icon>add_circle</Icon>
            </IconButton>
            <IconButton 
              onClick={this.clearFriends}>
                <Icon>cancel</Icon></IconButton>
          </div>; break;
      case 3: // Send!
        displayStep = 
          <div>
            <input type="submit" value="Shuffle my Friends!" />
          </div>; break;
      default:
        displayStep = null; break;
    }

    return (
      <div>
        { submiting ? <Backdrop /> : null }
        <form onChange={(e) => this.handleChange(e)}>
          {displayStep}          
        </form>
        <div>
          <IconButton
            id='prevStep'
            size='small' 
            onClick={this.prevStep} 
            disabled={ step<=0 }>
              <Icon>arrow_back_ios</Icon>
          </IconButton>
          <IconButton
            id='nextStep'
            size='small' 
            onClick={this.nextStep} 
            disabled={ step>=3 }>
              <Icon>arrow_forward_ios</Icon>  
          </IconButton>
        </div>
      </div>
    )
  }
}

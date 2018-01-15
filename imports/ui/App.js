import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
 
import { Members } from '../api/members.js';

import Member from './Member.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

 
// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
    };
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 
    Meteor.call('members.insert', text);

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
 
  renderMembers() {
    let filteredMembers = this.props.members;
    if (this.state.hideCompleted) {
      filteredMembers = filteredMembers.filter(member => !member.checked);
    }
    return filteredMembers.map((member) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = member.owner === currentUserId;
 
      return (
        <Member
          key={member._id}
          member={member}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Members ({this.props.incompleteCount})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Checked Members
          </label>

          <AccountsUIWrapper />

          <form className="new-member" onSubmit={this.handleSubmit.bind(this)} >
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new members"
            />
          </form>
        </header>
 
        <ul>
          {this.renderMembers()}
        </ul>
      </div>
    );
  }
}

export default withTracker( () => {
  Meteor.subscribe('members');

  return {
    members: Members.find({}, { sort: { createdAt: -1} }).fetch(),
    incompleteCount: Members.find({ checked: { $ne: true } }).count(),
  };
})(App);
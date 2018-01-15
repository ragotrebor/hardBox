import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
 
import { Members } from  '../api/members.js';

// Task component - represents a single todo item
export default class Member extends Component {
	toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('members.setChecked', this.props.member._id, !this.props.member.checked);

  }
 
  deleteThisMember() {
    Meteor.call('members.remove', this.props.member._id);
  }

  togglePrivate() {
    Meteor.call('members.setPrivate', this.props.member._id, ! this.props.member.private);
  }

  render() {
  	const memberClassName = this.props.member.checked ? 'checked' : '';

    const taskClassName = classnames({
      checked: this.props.member.checked,
      private: this.props.member.private,
    });

    return (
      <li className={memberClassName}>
        <button className="delete" onClick={this.deleteThisMember.bind(this)}>
          &times;
        </button>
 
        <input
          type="checkbox"
          readOnly
          checked={!!this.props.member.checked}
          onClick={this.toggleChecked.bind(this)}
        />

        { this.props.showPrivateButton ? (
          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
            { this.props.member.private ? 'Private' : 'Public' }
          </button>
        ) : ''}
 
        <span className="text">{this.props.member.text}</span>
      </li>
    );
  }
}

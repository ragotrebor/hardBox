import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Members = new Mongo.Collection('members');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('members', function membersPublication() {
    return Members.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'members.insert'(text) {
    check(text, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Members.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'members.remove'(memberId) {
    check(memberId, String);

    const member = Members.findOne(memberId);
    if (member.private && member.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
 
    Members.remove(memberId);
  },
  'members.setChecked'(memberId, setChecked) {
    check(memberId, String);
    check(setChecked, Boolean);

    const member = Members.findOne(memberId);
    if (member.private && member.owner !== this.userId) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }
 
    Members.update(memberId, { $set: { checked: setChecked } });
  },
  'members.setPrivate'(memberId, setToPrivate) {
    check(memberId, String);
    check(setToPrivate, Boolean);
 
    const member = Members.findOne(memberId);
 
    // Make sure only the task owner can make a task private
    if (member.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Members.update(memberId, { $set: { private: setToPrivate } });
  },
});
import {observable, computed, action, decorate} from 'mobx';

class GlobalStore {
  nickName = '';
  photo = '';
  photoBase64 = '';
  age = '';
  selectedContact = '';
  selectedContactName = '';
  selectedContactNumber = '';
  notifIndicator = false;
  isNotification = false;

  setNickName(value) {
    this.nickName = value;
  }
  setPhoto(value) {
    this.photo = value;
  }
  setPhotoBase64(value) {
    this.photoBase64 = value;
  }
  setAge(value) {
    this.age = value;
  }
  setSelectedContact(value) {
    this.selectedContact = value;
  }
  setSelectedContactDetails(name, number) {
    this.selectedContactName = name;
    this.selectedContactNumber = number;
  }
  setNotifIndicator(value) {
    this.notifIndicator = value;
  }
  setIsNotification(value) {
    this.isNotification = value;
  }
}

decorate(GlobalStore, {
  nickName: observable,
  photo: observable,
  photoBase64: observable,
  age: observable,
  selectedContact: observable,
  selectedContactName: observable,
  selectedContactNumber: observable,
  notifIndicator: observable,
  isNotification: observable,
});

export default new GlobalStore();

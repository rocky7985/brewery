import { Component } from '@angular/core';
import { CommonService } from '../common.service';
import { NavigationService } from '../navigation.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage {

  profileData: any = [];
  loginUser: any = [];
  loadProfileData: boolean = false;

  constructor(
    private StorageService: StorageService,
    private CommonService: CommonService,
    private Navigation: NavigationService
  ) { }

  async ionViewWillEnter() {
    await this.getLoginUser();
    this.getProfileData();
  }

  async getLoginUser() {
    let user = await this.StorageService.get('login');
    if (user != null) {
      this.loginUser = user.data;
    }
    else {
      this.loginUser = [];
      console.log('User not found');
    }
  }

  getProfileData() {
    this.loadProfileData = true;
    const token = this.loginUser.token;
    this.CommonService.sendData('getUserInfo', [], token).subscribe({
      next: (p: any) => {
        if (p.status == 'success') {
          this.profileData = p.data;
          console.log('Profile Data:', this.profileData);
          this.loadProfileData = false;
        }
        else {
          console.log('Profile Data Not Found.');
          this.loadProfileData = false;
        }

      }, error: () => {
        this.loadProfileData = false;
      },

    });
  }

  backToHome() {
    this.Navigation.navigateWithRoute('/home');
  }

}

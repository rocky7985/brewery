import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../common.service';
import { NavigationService } from '../navigation.service';
import { StorageService } from '../storage.service';
import { ModalController } from '@ionic/angular';
import { ReviewModalPage } from '../review-modal/review-modal.page';

@Component({
  selector: 'app-brewery',
  templateUrl: './brewery.page.html',
  styleUrls: ['./brewery.page.scss'],
  standalone: false
})
export class BreweryPage {
  breweryId: string = '';
  breweryDetails: any = [];
  breweryReviews: any = [];
  loading: boolean = false;
  loginUser: any = [];
  showMore: boolean = false;
  rating: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private navigationService: NavigationService,
    private StorageService: StorageService,
    private modalController: ModalController
  ) {
    // Get brewery ID from the navigation params and assign it to breweryId
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params && params.id) {
        this.breweryId = params.id;
        console.log('id:', this.breweryId);
      }
    });

  }

  ionViewWillEnter() {
    // Call both getLoginUser and getBreweryDetails upon entering the view
    this.getLoginUser().then(() => {
      if (this.breweryId) {
        this.getBreweryDetails(this.breweryId).then(() => {
          this.getBreweryReviews(this.breweryId);  // Fetch brewery reviews only after details
        });
      }
    });
  }

  // Async method to fetch login user
  async getLoginUser() {
    let user = await this.StorageService.get('login');
    if (user != null) {
      this.loginUser = user.data;
      console.log('Logged in user:', this.loginUser); // Check if the token is correct
    } else {
      this.loginUser = [];
      console.log('User not found');
    }
  }

  // Method to get brewery details
  getBreweryDetails(id: string): Promise<void> {
    this.loading = true;
    const token = this.loginUser.token;
    return new Promise((resolve, reject) => {
      if (token) {
        this.commonService.sendData('getBreweryDetails', { id }, token).subscribe({
          next: (res: any) => {
            if (res.status === 'success') {
              this.breweryDetails = res.data;
              console.log('Single Brewery:', this.breweryDetails);
              resolve();
            } else {
              this.commonService.presentToast('Brewery details not found');
              reject('No details found');
            }
            this.loading = false;
          },
          error: (err) => {
            console.log('Error fetching brewery details:', err);
            this.commonService.presentToast('Error fetching brewery details');
            this.loading = false;
            reject(err);
          }
        });
      } else {
        console.log('Token is not available or invalid');
        this.loading = false;
        this.commonService.presentToast('Authentication token missing');
        reject('Token missing');
      }
    });
  }

  getBreweryReviews(breweryId: string) {
    this.loading = true;
    const token = this.loginUser?.token; // Check if the token exists safely

    if (token) {
      // Send a request to fetch brewery reviews by ID
      this.commonService.sendData("getBreweryReviews", { brewery_id: breweryId }, token).subscribe({
        next: (res: any) => {
          if (res.status === "success") {
            this.breweryReviews = res.data; // Update reviews with fetched data
            console.log("Brewery Reviews:", this.breweryReviews);
          } else {
            this.commonService.presentToast("No reviews found");
            this.breweryReviews = []; // Clear previous reviews if no data is found
          }
          this.loading = false;
        },
        error: (err) => {
          console.error("Error fetching brewery reviews:", err);
          this.commonService.presentToast("Error fetching brewery reviews");
          this.loading = false;
        },
      });
    } else {
      this.loading = false;
      this.commonService.presentToast("Authentication token missing");
    }
  }


  toggleDetails() {
    this.showMore = !this.showMore;
  }

  async openReviewModal() {
    const modal = await this.modalController.create({
      component: ReviewModalPage,
      componentProps: { breweryId: this.breweryId, rating: this.rating }
    });
    modal.onDidDismiss().then((data) => {
      if (data && data.data) {
        this.getBreweryReviews(this.breweryId);
      }
    });
    await modal.present();
  }

  goToHome() {
    this.navigationService.navigateWithRoute('/home');
  }

}


import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CommonService } from '../common.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.page.html',
  styleUrls: ['./review-modal.page.scss'],
})

export class ReviewModalPage {
  @Input()
  breweryId!: string;
  @Input()
  rating!: number;
  reviewForm: FormGroup;
  loading: boolean = false;
  loginUser: any = [];

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private commonService: CommonService,
    private StorageService: StorageService,
  ) {
    this.reviewForm = this.fb.group({
      rating: [this.rating, [Validators.required, Validators.min(1), Validators.max(5)]],
      description: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ionViewWillEnter() {
    // Call both getLoginUser and getBreweryDetails upon entering the view
    this.getLoginUser().then(() => {
      if (this.breweryId) {
        this.submitReview();
      }
    });
  }

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

  submitReview() {
    if (this.reviewForm.valid) {
      this.loading = true;
      const token = this.loginUser.token;
      const formData = {
        brewery_id: this.breweryId,
        rating: this.reviewForm.value.rating,
        description: this.reviewForm.value.description
      };
      this.commonService.sendData('insertReview', formData, token).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.status === 'success') {
            this.modalController.dismiss(res); // Close modal with success data
          } else {
            this.commonService.presentToast(res.message || 'Failed to submit review');
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Error submitting review:', err);
          this.commonService.presentToast('Error submitting review');
        }
      });
    }
  }

  setRating(index: number) {
    this.reviewForm.patchValue({ rating: index + 1 });
  }

  closeModal() {
    this.modalController.dismiss();
  }
}

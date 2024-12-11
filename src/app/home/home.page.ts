import { Component } from '@angular/core';
import { CommonService } from '../common.service';
import { NavigationService } from '../navigation.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  searchResults: any = [];
  searchQuery: string = '';
  loginUser: any = [];
  loadSearchData: boolean = false;
  selectedFilter: string = '';  // To store selected filter type
  isPopoverOpen: boolean = false;  // To track the state of popover
  currentPage: number = 1;  // Track current page for pagination
  totalPages: number = 1;  // Total pages to handle when no more data
  perPage: number = 10;

  constructor(
    private StorageService: StorageService,
    private CommonService: CommonService,
    private Navigation: NavigationService
  ) { }

  async ionViewWillEnter() {
    this.searchResults = [];
    this.searchQuery = '';
    this.selectedFilter = '';
    this.currentPage = 1; // Reset page number on entering view
    await this.getLoginUser();
  }

  async getLoginUser() {
    let user = await this.StorageService.get('login');
    if (user != null) {
      this.loginUser = user.data;
    } else {
      this.loginUser = [];
      console.log('User not found');
    }
  }

  presentPopover(event: any) {
    this.isPopoverOpen = true;
  }

  onFilterChange(filter: string) {
    this.selectedFilter = filter;
    this.searchQuery = '';  // Reset the search query when filter is changed
    this.currentPage = 1; // Reset page number on entering view
    this.getSearchResults();
  }

  onSearchChange(event: any) {
    this.getSearchResults();
  }

  onSearchClear() {
    this.searchQuery = ''; // Clear the search query when the user clears the search bar
    this.getSearchResults();
  }

  getSearchResults() {
    if (!this.searchQuery.trim() || !this.selectedFilter) {
      console.log('Empty search query or no filter selected');
      return;
    }

    this.loadSearchData = true;
    const token = this.loginUser.token;

    // Prepare request parameters based on the selected filter
    const requestData: any = {
      [this.selectedFilter]: this.searchQuery, // e.g., by_city, by_name, or by_type
      per_page: this.perPage,
      page: this.currentPage,
    };

    this.CommonService.sendData('searchBrewery', requestData, token).subscribe({
      next: (res: any) => {
        if (res.status === 'success' && res.data.length > 0) {
          // If it's the first page, reset search results. If it's subsequent pages, append data
          this.searchResults = this.currentPage === 1 ? res.data : [...this.searchResults, ...res.data];

          // Assuming the backend sends the total number of results
          this.totalPages = Math.ceil(res.total / this.perPage);  // Calculate total pages based on response
          console.log('Search Results:', this.searchResults);
        } else {
          console.log('No results found.');
        }
        this.loadSearchData = false;
      },
      error: (err) => {
        console.log('Error fetching search results:', err);
        this.loadSearchData = false;
      },
    });
  }

  loadMore(event: any) {
    if (this.currentPage < this.totalPages) {
      this.currentPage++; // Increment the current page
      this.getSearchResults(); // Fetch the next set of results
      event.target.complete(); // Signal that loading is complete
    } else {
      event.target.disabled = true; // Disable infinite scroll when no more data is available
      event.target.complete(); // Ensure that the loading spinner is hidden
    }
  }

  navigateToBrewery(id: any) {
    this.Navigation.goToNavigateForword('/brewery', { id });
    console.log('Navigating to BreweryId:', id);
  }

}

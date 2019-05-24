import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  flightSearchForm: FormGroup;
  flightNumber: FormControl;
  origin: FormControl;
  destination: FormControl;
  departure: FormControl;
  flights: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  createForm(){
    this.flightSearchForm = new FormGroup({
      flightNumber: this.flightNumber,
      origin: this.origin,
      destination: this.destination,
      departure: this.departure
    });
  }

  createFormControls(){
    this.flightNumber = new FormControl('', Validators.required);
    this.origin = new FormControl('', Validators.required);
    this.destination = new FormControl('', Validators.required);
    this.departure = new FormControl('', Validators.required);
  }

  onFlightNumberChange(){
    if(this.flightNumber.value != ""){
      this.origin.setValidators([]);
      this.destination.setValidators([]);
    }else{
      this.origin.setValidators([Validators.required]);
      this.destination.setValidators([Validators.required]);
    }
    this.origin.updateValueAndValidity();
    this.destination.updateValueAndValidity();
  }

  onPlaceChange() {
    if(this.origin.value != "" && this.destination.value != ""){
      this.flightNumber.setValidators([]);
    } else {
      this.flightNumber.setValidators([Validators.required]);
    }
    this.flightNumber.updateValueAndValidity();
  }

  onFlightSearch(){
    if(this.flightSearchForm.valid){
      let payload = {};
      payload['flightNumber'] = this.flightNumber.value;
      payload['origin'] = this.origin.value;
      payload['destination'] = this.destination.value;
      var res = this.departure.value.split("T");
      if(res[1].length == 8){
        payload['departure'] = this.departure.value;
      } else{ //in chrome if select seconds 00 then not giving 00 as part of value
        payload['departure'] = this.departure.value + ':00';
      }
      let url = '/list';
      if(payload['flightNumber'] != ""){
        url += '?flightNumber='+payload['flightNumber']+'&departure='+payload['departure'];
      } else{
        url += '?origin='+payload['origin']+'&destination='+payload['destination']+'&departure='+payload['departure']+':00';
      }
      
      // console.log(payload);
      this.http.get(url).subscribe((res) => {
        this.flights = res;
      });
    }
  }

}
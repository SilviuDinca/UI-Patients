import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators'
import { IPatients } from "./IPatients";

@Injectable({
    providedIn: 'root'
})
export class PatientsService {
    private patientsUrl = 'assets/patients/patients.json'
    constructor(private http: HttpClient) { }

    getPatients(): Observable<IPatients[]> {
        return this.http.get<IPatients[]>(this.patientsUrl)
            .pipe(tap(data => console.log(JSON.stringify(data))));
    }
}
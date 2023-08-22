import { Guid } from "guid-typescript";
export interface IPatients {
    id: string,
    lastName: string;
    fatherInitial: string;
    firstName: string;
    birthday: string | number;
    listPhone: {
        name: {
            name: string
        }
    };
    phoneNumber: number;
    addressHome: {
        street: string;
        numberStreet: number;
        building: string | number;
        floor: number;
        apartment: number;
        county: string | number;
        city: string
    };
    residenceAddress: {
        residenceCheck: boolean;
        residenceStreet: string;
        residenceNumberStreet: number;
        residenceBuilding: string | number;
        residenceFloor: number;
        residenceApartment: number;
        residenceCounty: string | number;
        residenceCity: string;
    };
    age: number;
    gender: string;
    cnp: number;
}
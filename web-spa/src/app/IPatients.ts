export interface IPatients {
    id: number,
    lastName: string;
    fatherInitial: string;
    firstName: string;
    birthday: string | number;
    phoneNumber: number;
    address: {
        street: string;
        numberStreet: number;
        building: string | number;
        floor: number;
        apartment: string;
        county: string | number;
        city: string
    }
    age: number;
    gender: string;
    cnp: string;
}
export class Client {
    id_client!: number;
    username!: string;
    first_name!: string;
    last_name!: string;
    email!: string;
    password!: string;  // It's recommended to handle passwords securely and hash them on the backend
    phone!: string;
    address!: string;
    state!: string;
    date_of_birth!: string; // Date type can be formatted as a string (e.g., 'YYYY-MM-DD')
    created_at!: string;  // ISO string format
    updated_at!: string;  // ISO string format
    is_active!: boolean;
    selected: boolean = false;
    clientname!: string; 
    profile_image!: any;
    [key: string]: any;
  }

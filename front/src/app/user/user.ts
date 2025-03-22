export class User {
  id!: number;
  username!: string; // Nom d’utilisateur — utilisé pour se connecter
  first_name!: string; // Prénom
  last_name!: string; // Nom de famille
  email!: string;
  password!: string; // Mot de passe (doit être stocké de manière sécurisée)
  phone_number!: string;
  address!: string;
  role!: string;
  profile_image!: any;
  
  date_of_birth!: Date;
  is_active!: boolean; // Indique si l'utilisateur est actif
  selected?: boolean; 
  created_at!: Date;
  [key: string]: any;
}
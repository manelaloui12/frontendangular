export class claim {
 
    id_claim!: number;
    claimname !: string;
    date_claim!: string; // Could be a string formatted as 'YYYY-MM-DD'
    description!: string;
    type_panne!: string;
    localisation!: string;
    // localisation!: string = '';

    images?: ClaimImage[]; 
    etat!: string;

    created_at!: string; // ISO string format
    updated_at!: string; // ISO string format
    is_active!: boolean;
    selected: boolean = false;
    [key: string]: any;
    id_client!:string;
    id_breakdown!:string;
    // selected?: boolean; 
  }

  
      
  export class ClaimImage {
    id?: number;
    image?: string; // URL de l'image
    cloudinary_id?: string;
    image_url?: string;
    created_at?: string;
    updated_at?: string;
  }
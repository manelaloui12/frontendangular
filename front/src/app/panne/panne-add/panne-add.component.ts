import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PanneService } from '../panne.service';
import { panne } from '../panne';  // Renommé pour être conforme à la convention
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-panne-add',
  templateUrl: './panne-add.component.html',
  styleUrls: ['./panne-add.component.css']  // Correction du nom de l'attribut "styleUrls"
})
export class PanneAddComponent implements OnInit {

  currentStep: number = 1;
  maxSteps: number = 3;
  isFinalStep: boolean = false;
  panneForm: FormGroup;
  msg: string = "";
  show: boolean = false;
  showError: boolean = false;
  base64Image: string = '';
  tailleInvalid!: boolean;
  filename!: string;
  filesize!: number;
  selectedFile: File | null = null;
  panne = new panne();
  imageUrl!: string;
  formData: FormData = new FormData();
  panne_image: File | null = null;
  center: google.maps.LatLngLiteral = { lat: 23.0225 , lng: 72.5714 }; // Initial location (San Francisco)



  constructor(private fb: FormBuilder, private panneService: PanneService, private router: Router) {
    this.panneForm = this.fb.group({
      Panneinfo: this.fb.group({

        title:  ['', [Validators.required, Validators.minLength(2)]],
        // description:  ['', [Validators.required, Validators.minLength(2)]],

        breakdown_type:  ['', [Validators.required, Validators.minLength(2)]],
      }),
      PanneInfo: this.fb.group({
        date_signalement: ['', Validators.required],
        panne_image: [''],
      }),
      AdresseInfo: this.fb.group({
        adresse:['', Validators.required],
        ville: ['', Validators.required],
        position: ['', Validators.required],
      }),
    });
    
  }

  ngOnInit(): void {   
     this.getCurrentLocation();
  }
  

    // Méthode pour récupérer la position actuelle via l'API de géolocalisation
    getCurrentLocation(): void {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          // Met à jour le champ de localisation du formulaire
          // this.panne.get('AdresseInfo.adresse')?.setValue(
          //   `lat: ${this.center.lat}, lng: ${this.center.lng}`
          // );
          this.panneForm.get('AdresseInfo.adresse')?.setValue(
            `lat: ${this.center.lat}, lng: ${this.center.lng}`
          );
          
        }, error => {
          console.error('Erreur de géolocalisation', error);
        });
      } else {
        console.error('La géolocalisation n\'est pas supportée par ce navigateur.');
      }
    }
  
    // Méthode déclenchée lors d'un clic sur la carte
    onMapClick(event: google.maps.MapMouseEvent): void {
      if (event.latLng) {
        this.center = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        // Met à jour le champ localisation du formulaire
        this.panneForm.get('AdresseInfo.adresse')?.setValue(
          `lat: ${this.center.lat}, lng: ${this.center.lng}`
        );
        
      }
    }





  goToPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }


  goToNextStep(): void {
    if (this.currentStep < this.maxSteps) {
      this.currentStep++;
    }
  }
 

  
  picked(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('✅ Fichier sélectionné:', file.name, ' | Type:', file.type);
  
      this.selectedFile = file; // Stocke le fichier correctement
  
      this.filename = file.name;
      this.filesize = file.size;
  
      if (this.filesize > 5000000) { // 5MB limit
        this.tailleInvalid = true;
        alert("Fichier trop volumineux (Max: 5MB)");
        return;
      }
      this.tailleInvalid = false;
  
      // Vérifier que c'est bien une image
      if (!file.type.startsWith('image/')) {
        alert("Veuillez sélectionner un fichier image valide.");
        return;
      }
    } else {
      console.log("⚠️ Aucun fichier sélectionné.");
    }
  }
  
  handleInputChange(file: File) {
    const reader = new FileReader();
    if (!file.type.match(/image-*/)) {
      return; // Invalid image format
    }
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  async _handleReaderLoaded(e: any) {
    this.base64Image = e.target.result;
    console.log('Image Base64:', this.base64Image);
    this.panne.panne_image = this.base64Image;  // Store the base64 encoded image
  }
  onImageSelected(event: any) {
    this.panne_image = event.target.files[0];  // Store the selected file
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files[0]) {
        const file = input.files[0];
        console.log('Fichier sélectionné:', file);  // Vérifiez ici
  
        // Vérifiez que c'est bien une image
        if (!file.type.startsWith('image/')) {
            alert('Veuillez sélectionner un fichier image.');
            return;
        }
        
        this.selectedFile = file;
        this.imageUrl = URL.createObjectURL(file);
        console.log('✅ Fichier sélectionné:', file.name, 'Type:', file.type);
    } else {
        console.log('⚠️ Aucun fichier sélectionné.');
    }
  }
  
// onFileSelected(event: Event): void {
//   const input = event.target as HTMLInputElement;
//   if (input && input.files && input.files[0]) {
//       const file = input.files[0];
      
//       // Vérifiez que c'est bien une image
//       if (!file.type.startsWith('image/')) {
//           alert('Veuillez sélectionner un fichier image.');
//           return;
//       }
  
//       // Stockez le fichier sélectionné dans la variable selectedFile
//       this.selectedFile = file;
      
//       // Mettez à jour l'URL de l'image pour l'afficher en prévisualisation
//       this.imageUrl = URL.createObjectURL(file);

//       console.log('Fichier sélectionné:', file.name, 'Type:', file.type);
//   } else {
//       console.log('⚠️ Aucun fichier sélectionné.');
//   }
// }

  onSubmit(): void {
    const formValues = this.panneForm.value;
    const formData = new FormData();

    this.panne.title = formValues.Panneinfo.title;
    this.panne.description = formValues.Panneinfo.description;
    this.panne.breakdown_type = formValues.Panneinfo.breakdown_type;
    this.panne.date_signalement = formValues.PanneInfo.date_signalement;
    this.panne. adresse = formValues.AdresseInfo. adresse;
    this.panne.ville = formValues.AdresseInfo.ville;
    this.panne.position = formValues.AdresseInfo.position;

    if (this.selectedFile) {
      formData.append('panne_image', this.selectedFile, this.selectedFile.name);
      console.log('✅ Fichier ajouté au FormData:', this.selectedFile.name);
    } else {
      console.log('⚠️ Aucun fichier sélectionné.');
    }

  

  // Ajouter les autres champs utilisateur au FormData
  for (let key in this.panne) {
    if (this.panne.hasOwnProperty(key)) {
      formData.append(key, this.panne[key]);
    }
  }
  // Appeler le service pour soumettre le formulaire
  this.panneService.create(formData).subscribe(
    data => {
      console.log('Utilisateur créé avec succès:', data);
      this.imageUrl = data.panne_image;

      this.show = true;
      this.msg = 'Utilisateur ajouté avec succès!';
    },
    error => {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      this.showError = true;
      this.msg = 'Veuillez remplir tous les champs correctement.';
    }
  );
}
  

back() {
  this.router.navigate(["/client"]);
}

finishStepper(): void {
  this.isFinalStep = true;
}

isStepSuccess(step: number): boolean {
  return false;
}

isStepCompleted(step: number): boolean {
  return false;
}
}



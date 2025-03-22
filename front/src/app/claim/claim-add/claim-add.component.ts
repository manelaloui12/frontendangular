import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ClaimService } from '../claim.service';
import { Router } from '@angular/router';
import { claim } from '../claim';
import { SharedService } from '../../shared/shared.service';
import { PanneService } from '../../panne/panne.service';
import { clientService } from '../../client/client.service';
import { Client } from '../../client/client';
import { panne } from '../../panne/panne';

@Component({
  selector: 'app-claim-add',
  templateUrl: './claim-add.component.html',
  styleUrls: ['./claim-add.component.css']
})
export class ClaimAddComponent implements OnInit {

  currentStep: number = 1;
  maxSteps: number = 3;
  isFinalStep: boolean = false;

  // Formulaire et variables d'upload
  claimForm: FormGroup;
  imageUrl!: string;
  selectedFile: File | null = null;
  base64Image: string = '';
  show: boolean = false;
  msg: string = '';
  showError: boolean = false;
  formData: FormData = new FormData();
  base64!: string;
  file!: File;
  filesize!: number;
  isSubmitting: boolean = false;
  clients: any[] = [];
  pannes: any[] = [];
  filename!: string;
  claim = new claim();
  image: File | null = null;
  localisation: string = '';

  // Variables pour la sélection multiple d'images
  selectedFiles: File[] = [];
  imageUrls: string[] = [];
  tailleInvalid: boolean = false;

  // Carte Google Maps
  center: google.maps.LatLngLiteral = { lat: 23.0225, lng: 72.5714 };

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private panneService: PanneService,
    private clientService: clientService,
    private claimService: ClaimService,
    private router: Router
  ) {
    this.claimForm = this.fb.group({
      claimInfo: this.fb.group({
        claimname: ['', [Validators.required, Validators.minLength(2)]],
        date_claim: ['', Validators.required],
        image: [''],
        description: ['', [Validators.required]],
        localisation: ['', Validators.required],
        etat: ['', Validators.required],
        id_client: ['', Validators.required],
        id_breakdown: ['', Validators.required]
      })
    });
  }

  ngOnInit(): void {
    this.getClients();
    this.getPannes();
    this.getCurrentLocation();
  }

  // Récupère la position actuelle et la met dans le formulaire
  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.claimForm.get('claimInfo.localisation')?.setValue(
          `lat: ${this.center.lat}, lng: ${this.center.lng}`
        );
      }, error => {
        console.error('Erreur de géolocalisation', error);
      });
    } else {
      console.error('La géolocalisation n\'est pas supportée par ce navigateur.');
    }
  }

  // Met à jour la localisation quand on clique sur la carte
  onMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      this.center = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      this.claimForm.get('claimInfo.localisation')?.setValue(
        `lat: ${this.center.lat}, lng: ${this.center.lng}`
      );
    }
  }

  getClients(): void {
    this.clientService.listclient().subscribe(
      (clients: any[]) => {
        console.log('Clients:', clients);
        this.clients = clients;
        if (clients.length > 0) {
          this.claimForm.get('claimInfo.id_client')?.setValue(clients[0].id);
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des clients:', error);
      }
    );
  }

  getPannes(): void {
    this.panneService.listpanne().subscribe(
      (pannes: any[]) => {
        console.log('Pannes:', pannes);
        this.pannes = pannes;
        if (pannes.length > 0) {
          this.claimForm.get('claimInfo.id_breakdown')?.setValue(pannes[0].id);
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des pannes:', error);
      }
    );
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

  // Pour un upload simple (non multiple)
  picked(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('✅ Fichier sélectionné:', file.name, ' | Type:', file.type);
      this.selectedFile = file;
      this.filename = file.name;
      this.filesize = file.size;
      if (this.filesize > 5000000) {
        this.tailleInvalid = true;
        alert("Fichier trop volumineux (Max: 5MB)");
        return;
      }
      this.tailleInvalid = false;
      if (!file.type.startsWith('image/')) {
        alert("Veuillez sélectionner un fichier image valide.");
        return;
      }
    } else {
      console.log("⚠️ Aucun fichier sélectionné.");
    }
  }

  handleInputChange(file: File): void {
    const reader = new FileReader();
    if (!file.type.match(/image-*/)) {
      return;
    }
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  async _handleReaderLoaded(e: any): Promise<void> {
    this.base64Image = e.target.result;
    console.log('Image Base64:', this.base64Image);
    this.claim['image'] = this.base64Image;
  }

  onImageSelected(event: any): void {
    this.image = event.target.files[0];
  }

  // Gestion de la sélection de plusieurs images
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files) {
      const newFiles = Array.from(input.files);
  
      // On ajoute les nouveaux fichiers au tableau existant
      this.selectedFiles = this.selectedFiles.concat(newFiles);
  
      // On génère des aperçus pour chaque nouveau fichier
      newFiles.forEach(file => {
        if (!file.type.startsWith('image/')) {
          alert('Veuillez sélectionner uniquement des fichiers images.');
          return;
        }
        if (file.size > 5000000) {
          this.tailleInvalid = true;
          alert("Fichier trop volumineux (Max: 5MB par image)");
          return;
        }
        this.tailleInvalid = false;
        const url = URL.createObjectURL(file);
        // On ajoute l'URL à l'array sans réinitialiser les précédentes
        this.imageUrls.push(url);
      });
    } else {
      console.log('⚠️ Aucun fichier sélectionné.');
    }
  }
  

  // Envoi du formulaire avec les images multiples
  onSubmit(): void {
    if (this.claimForm.invalid) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const formValues = this.claimForm.value.claimInfo;
    console.log('Client sélectionné:', formValues.id_client);
    console.log('Panne sélectionnée:', formValues.id_breakdown);
    const formData = new FormData();
    formData.append('claimname', formValues.claimname);
    formData.append('description', formValues.description);
    formData.append('date_claim', formValues.date_claim);
    formData.append('localisation', formValues.localisation);
    formData.append('etat', formValues.etat);
    formData.append('id_client', formValues.id_client);
    formData.append('id_breakdown', formValues.id_breakdown);

    // Ajout de toutes les images sélectionnées
    this.selectedFiles.forEach((file) => {
      formData.append('images[]', file, file.name);
      console.log('✅ File added to FormData:', file.name);
    });
    

    // Ajout d'autres valeurs de votre modèle, le cas échéant
    for (let key in this.claim) {
      if (this.claim.hasOwnProperty(key)) {
        formData.append(key, this.claim[key]);
      }
    }

    this.claimService.create(formData).subscribe(
      data => {
        console.log('✅ Claim created successfully:', data);
        alert("Your claim has been submitted successfully!");
        this.isSubmitting = false;
        this.router.navigateByUrl('/claim');
      },
      error => {
        console.error('❌ Error creating the claim:', error);
        alert("An error occurred while submitting the form.");
        this.isSubmitting = false;
      }
    );
  }

  back(): void {
    this.router.navigate(["/claim"]);
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

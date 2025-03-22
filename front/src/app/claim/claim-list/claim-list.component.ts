import { Component, OnInit } from '@angular/core';
import { ClaimService } from '../claim.service';
import { Router } from '@angular/router';
import { claim } from '../claim'; 

@Component({
  selector: 'app-claim-list',
  templateUrl: './claim-list.component.html',
  styleUrl: './claim-list.component.css'
})
export class ClaimListComponent implements OnInit{

  selectAll: boolean = false; // Flag to track "select all" checkbox state
  isButtonDisabled: boolean = true; // Disable buttons initially
  count: number=0;
  close: boolean=false;
  showConfirmation: boolean = false;
  ClaimId!: number; 
  claims: claim[] = [];
  // selectedImageUrl: string | null = null;

  constructor(private claimservice: ClaimService , private router:Router) { }

  ngOnInit(): void {
    this.getListClaim();
  }


  // Method to handle checkbox changes and update button status
  onCheckboxChange() {
    this.isButtonDisabled = this.selectedclaims.length !== 1; // Button enabled only when one Claim is selected
    console.log(this.isButtonDisabled)
    console.log(this.selectedclaims)
    console.log('selectedclaims[0].id',this.selectedclaims[0]. id_claim)
  }

  
  get selectedclaims() {
    return this.claims.filter(Claim => Claim.selected);
  }
  
  // Method to toggle the selection of all claims
  toggleSelectAll() {
    this.claims.forEach(Claim => Claim.selected = this.selectAll);
    this.onCheckboxChange();  // Update button state after toggling "select all"
  }

  // Method to check if all claims are selected, used to update "select all" checkbox
  checkIfAllSelected() {
    this.selectAll = this.claims.every(Claim => Claim.selected);
  }

  // Method to update "select all" checkbox when a single Claim is selected or deselected
  updateSelectAll() {
    this.checkIfAllSelected();
  }
  actionOpen() {
    this.close = true; // Afficher la boîte de dialogue
  }
  
  actionClose() {
    this.close = false; // Fermer la boîte de dialogue
  }
  
  actionSave() {
    this.close = false;
    this.getListClaim(); // Rafraîchir la liste des utilisateurs après suppression
  }
  

  deleteselectedclaims() {
    const selectedIds = this.selectedclaims.map(Claim => Claim. id_claim);
    console.log("Utilisateurs à supprimer:", selectedIds);
  
    if (selectedIds.length === 0) {
      console.warn("Aucun utilisateur sélectionné !");
      return;
    }
  
    this.claimservice.deleteclaims(selectedIds).subscribe({
      next: () => {
        this.claims = this.claims.filter(Claim => !selectedIds.includes(Claim. id_claim));
        this.selectAll = false;
        console.log("Utilisateurs supprimés avec succès.");
      },
      error: (err) => console.error("Erreur suppression:", err)
    });
  }
  

getListClaim() {
  this.claimservice.listclaim().subscribe(data => {
    console.log("Réponse API - Utilisateurs : ", data);
    this.claims = data;  // Assure-toi que cette ligne est correctement exécutée et que 'data' contient la bonne structure
    this.count = data.length;  // Si tu veux également mettre à jour le nombre d'utilisateurs
  }, error => {
    console.error("Erreur API lors de la récupération des utilisateurs : ", error);
  });
}

  editRouter(): void {
    if (this.selectedclaims && this.selectedclaims.length > 0) {
      const id = this.selectedclaims[0]. id_claim;
      // Vérifiez que l'ID est correct
      console.log('ID de l\'utilisateur :', id);
      this.router.navigate(['/Claim/update-Claim', id]); // Naviguer avec l'ID
    } else {
      console.log('Aucun utilisateur sélectionné');
    }
  }
}

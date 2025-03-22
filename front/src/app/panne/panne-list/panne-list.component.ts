import { Component, OnInit } from '@angular/core';
import { PanneService } from '../panne.service';
import { Router } from '@angular/router';
import { panne } from '../panne'; 

@Component({
  selector: 'app-panne-list',
  templateUrl: './panne-list.component.html',
  styleUrl: './panne-list.component.css'
})
export class PanneListComponent implements OnInit{

  selectAll: boolean = false; // Flag to track "select all" checkbox state
  isButtonDisabled: boolean = true; // Disable buttons initially
  count: number=0;
  close: boolean=false;
  showConfirmation: boolean = false;
  // panneToDelete: any = null; 
  panneId!: number; 
  pannes: panne[] = [];

  constructor(private panneService:  PanneService , private router:Router) { }

  ngOnInit(): void {
    this.getListpanne();
  }


  // Method to handle checkbox changes and update button status
  onCheckboxChange() {
    this.isButtonDisabled = this.selectedpannes.length !== 1; // Button enabled only when one panne is selected
    console.log(this.isButtonDisabled)
    console.log(this.selectedpannes)
    console.log('selectedpannes[0].id',this.selectedpannes[0].id_breakdown)
  }

  // Helper method to get the number of selected pannes
  get selectedpannes() {
    return this.pannes.filter(panne=> panne.selected); // Filters pannes that are selected
  }

  // Method to toggle the selection of all pannes
  toggleSelectAll() {
    this.pannes.forEach(panne => panne.selected = this.selectAll);
    this.onCheckboxChange();  // Update button state after toggling "select all"
  }

  // Method to check if all pannes are selected, used to update "select all" checkbox
  checkIfAllSelected() {
    this.selectAll = this.pannes.every(panne => panne.selected);
  }

  // Method to update "select all" checkbox when a single panne is selected or deselected
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
    this.getListpanne(); // Rafraîchir la liste des utilisateurs après suppression
  }
  

  deleteSelectedpannes() {
    const selectedIds = this.selectedpannes.map(panne => panne.id_breakdown);
    console.log("Utilisateurs à supprimer:", selectedIds);
  
    if (selectedIds.length === 0) {
      console.warn("Aucun utilisateur sélectionné !");
      return;
    }
  
    this.panneService.deletepanne(selectedIds).subscribe({
      next: () => {
        this.pannes = this.pannes.filter(panne => !selectedIds.includes(panne.id_breakdown));
        this.selectAll = false;
        console.log("Utilisateurs supprimés avec succès.");
      },
      error: (err) => console.error("Erreur suppression:", err)
    });
  }
  

getListpanne() {
  this.panneService.listpanne().subscribe(data => {
    console.log("Réponse API - Utilisateurs : ", data);
    this.pannes = data;  // Assure-toi que cette ligne est correctement exécutée et que 'data' contient la bonne structure
    this.count = data.length;  // Si tu veux également mettre à jour le nombre d'utilisateurs
  }, error => {
    console.error("Erreur API lors de la récupération des utilisateurs : ", error);
  });
}

  editRouter(): void {
    if (this.selectedpannes && this.selectedpannes.length > 0) {
      const id = this.selectedpannes[0].id_breakdown;
      // Vérifiez que l'ID est correct
      console.log('ID de l\'utilisateur :', id);
      this.router.navigate(['/panne/update-panne', id]); // Naviguer avec l'ID
    } else {
      console.log('Aucun utilisateur sélectionné');
    }
  }



}




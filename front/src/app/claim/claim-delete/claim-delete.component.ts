import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClaimService } from '../claim.service';

@Component({
  selector: 'app-claim-delete',
  templateUrl: './claim-delete.component.html',
  styleUrl: './claim-delete.component.css'
})
export class ClaimDeleteComponent {

  @Input('selectedList') selectedList: any[] = [];
    
      @Output()
      close= new EventEmitter<boolean>()
      @Output()
      save= new EventEmitter<boolean>()
      constructor(private claimService:ClaimService){
    
      }
      closedEvent()
      {
        this.close.emit(true)
      }
      deletelist() {
        if (this.selectedList.length === 0) {
          console.warn("Aucun utilisateur sélectionné !");
          return;
        }
      
        const claimIds = this.selectedList.map(claim => claim.id_claim);
        console.log("Utilisateurs sélectionnés :", claimIds);
      
        this.claimService.deleteMultiple(claimIds).subscribe({
          next: (data: any) => {
            console.log("Réponse après suppression :", data); // Afficher la réponse si la suppression est réussie
            this.save.emit(true);
          },
          error: (error) => {
            // Afficher une erreur si la suppression échoue
            console.error("Erreur lors de la suppression des utilisateurs : ", error);
          }
        });
        
      }
      
      
      
    
    }
    
  
  
  


import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PanneService } from '../panne.service';

@Component({
  selector: 'app-panne-delete',
  templateUrl: './panne-delete.component.html',
  styleUrl: './panne-delete.component.css'
})
export class PanneDeleteComponent {

  @Input('selectedList') selectedList: any[] = [];
    
      @Output()
      close= new EventEmitter<boolean>()
      @Output()
      save= new EventEmitter<boolean>()
      
      constructor(private panneService:PanneService){}

      closedEvent()
      {
        this.close.emit(true)
      }
      deletelist() {
        if (this.selectedList.length === 0) {
          console.warn("Aucun utilisateur sélectionné !");
          return;
        }
      
        const panneIds = this.selectedList.map(panne => panne.id_breakdown);
        console.log("Utilisateurs sélectionnés :", panneIds);
      
        this.panneService.deleteMultiple(panneIds).subscribe({
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
    
  
  
  


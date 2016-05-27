import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {TreeNode} from '../../model/tree-node';
import {TreeNodeService} from "../../service/tree-node-service";
import {PaginatePipe, PaginationControlsCmp, PaginationService} from 'ng2-pagination';

@Component({
  template: require('./leaf-view.html'),
  styles: [require('./leaf-view.css')],
  selector:'leaf-view',
  providers: [PaginationService],
  pipes: [PaginatePipe],
  directives: [PaginationControlsCmp]

})

export class LeafView implements OnInit, OnDestroy{

  leafs: Array<TreeNode>;
  subscription: Subscription;
  leafsPerPage: number = 9;  

  constructor(private _treeNodeService: TreeNodeService){
    this.subscription = _treeNodeService.showLeafNodesChanges.subscribe(
        leafs => {
          console.log(`Received leafs - ${leafs.length}`);
          this.leafs = leafs;
        })
  }

  ngOnInit(){
    console.log(`In OnInit - LeafView`);
    this.subscription = this._treeNodeService.showLeafNodesChanges.subscribe(
        leafs => {
          console.log(`Received leafs - ${leafs.length}`);
          this.leafs = leafs;
        })
  }

  newMedia(val) {
        console.log(`In newMedia - ${val}`);
  }

  newFolder(val) {
        console.log(`In newFolder - ${val}`);
  }

  ngOnDestroy(){
    console.log(`In OnDestroy - LeafView : `);
    this.subscription.unsubscribe();
  }

}

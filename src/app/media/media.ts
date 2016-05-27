import {Component, OnInit} from '@angular/core';
import {ComponentInstruction, CanActivate} from '@angular/router-deprecated';
import {TreeView} from '../common/directives/tree-view/tree-view';
import {LeafView} from '../common/directives/leaf-view/leaf-view';
import {TreeNode} from '../common/model/tree-node';
import {TreeNodeService} from '../common/service/tree-node-service';
import {authCheck} from '../auth/auth-check';
import {MainMenu} from '../menu/menu-component';

@Component({
    template: require('./media.html'),
    styles: [require('./media.css'), require('../app.css')],
    directives:[TreeView, LeafView, MainMenu],
    providers:[TreeNodeService]
})
@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('admin', next, previous);
})

export class MediaComponent implements OnInit {

    node: TreeNode = null;
    leafs: Array<TreeNode> = null;

    ngOnInit(){
        this.node = new TreeNode('root','/', '');
    }

    displayLeafsForNode(leafs) {
        console.log(`In displayLeafsForNode - ${leafs.length}`);
        this.leafs = leafs;
    }
    selectNode(node) {
        console.log(`Node selected is - ${JSON.stringify(node)}`);
    }

}

/* Scene Graph Playground
 * CSCI 4611, Spring 2022, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as paper from 'paper';
import { Point } from 'paper/dist/paper-core';

class Game 
{
    // Width and height are defined in project coordinates
    // This is different than screen coordinates!
    private width : number;
    private height : number;
    private parentNode : paper.Group | undefined;
    private childNode1 : paper.Group | undefined;
    private childNode2 : paper.Group | undefined;
    private selectedNode : paper.Item | undefined;
    private lastMousePoint : paper.Point;

    private instructionsText : paper.PointText | undefined;
    private parentNodeText : paper.PointText | undefined;
    private child1Text : paper.PointText | undefined;
    private child2Text : paper.PointText | undefined;
    
    constructor()
    {
        paper.setup('canvas');
        this.width = 1200;
        this.height = 800;
        this.lastMousePoint = new paper.Point(0, 0);
    }

    start() : void 
    {
        this.resize();
        this.createScene();      

        // This registers the event handlers for window and mouse events
        paper.view.onResize = () => {this.resize();};
        paper.view.onMouseMove = (event: paper.MouseEvent) => {this.onMouseMove(event)};
        paper.view.onMouseDown = (event: paper.MouseEvent) => {this.onMouseDown(event)};
        paper.view.onFrame = (event: GameEvent) => {this.update(event)};
        new paper.Tool().onKeyDown = (event: paper.KeyEvent) => {this.onKeyDown(event)};
    }

    private createScene() : void 
    {
        // create a border around the view
        var borderGeometry = new paper.Rectangle(new paper.Point(0, 0), new paper.Size(this.width, this.height));
        var border = new paper.Path.Rectangle(borderGeometry);
        border.strokeWidth = 10;
        border.strokeColor = new paper.Color('black');

        // create a parent scene graph node
        this.parentNode = new paper.Group();
        // create the rectangle geometry
        var rectGeometry = new paper.Rectangle(new paper.Point(0, 0), new paper.Size(50, 50));

        // create a purple drawable rectangle from the geometry and add it to the parent node
        var redDrawableRect = new paper.Path.Rectangle(rectGeometry);
        redDrawableRect.fillColor = new paper.Color('red');
        redDrawableRect.position = new paper.Point(0, 0);
        redDrawableRect.addTo(this.parentNode);

        // create two child nodes
        this.childNode1 = new paper.Group();
        this.childNode2 = new paper.Group();
        this.childNode1.addTo(this.parentNode);
        this.childNode2.addTo(this.parentNode);
        
        // create a purple drawable rectangle from the geometry
        var purpleDrawableRect = new paper.Path.Rectangle(rectGeometry);
        purpleDrawableRect.fillColor = new paper.Color('purple');

        // create a symbol from the rectangle geometry
        var rectSymbol = new paper.SymbolDefinition(purpleDrawableRect);

        // create two instances of the rectangle
        var rectInstance1 = rectSymbol.place(new paper.Point(200, 0));
        var rectInstance2 = rectSymbol.place(new paper.Point(0, 200));

        // add both instances to the child node
        rectInstance1.addTo(this.childNode1);
        rectInstance2.addTo(this.childNode2);

        // perform an initial translation of the parent node
        this.parentNode.translate(paper.view.center.subtract(new paper.Point(100, 150)));

        // create some text and place it at the center of the bottom of the view
        this.instructionsText = new paper.PointText(new paper.Point(paper.view.center.x, 700));
        this.instructionsText.fontSize = 24;
        this.instructionsText.content = 'Click the red box to select the parent node. Click the purple box to select the child node.';
        this.instructionsText.justification = 'center';

        this.parentNodeText = new paper.PointText(redDrawableRect.position.add(new Point(0, 50)));
        this.parentNodeText.fontSize = 18;
        this.parentNodeText.justification = 'center';
        this.parentNodeText.addTo(this.parentNode);
        this.parentNodeText.visible = true;

        this.child1Text = new paper.PointText(rectInstance1.position.add(new Point(0, 50)));
        this.child1Text.fontSize = 18;
        this.child1Text.justification = 'center';
        this.child1Text.addTo(this.childNode1);
        this.child1Text.visible = true;

        this.child2Text = new paper.PointText(rectInstance2.position.add(new Point(0, 50)));
        this.child2Text.fontSize = 18;
        this.child2Text.justification = 'center';
        this.child2Text.addTo(this.childNode2);
        this.child2Text.visible = true;

        
    }

    // This method will be called once per frame
    private update(event: GameEvent) : void
    {
        // update all the text items with the local and global positions
        var parentPosGlobal = this.parentNode!.firstChild.position;
        this.parentNodeText!.content = "global: (" + Math.round(parentPosGlobal.x) + ", " + Math.round(parentPosGlobal.y) + ")";

        var child1PosGlobal = this.childNode1!.firstChild.position;
        var child1PosLocal = this.childNode1!.firstChild.globalToLocal(parentPosGlobal);
        this.child1Text!.content = "global: (" + Math.round(child1PosGlobal.x) + ", " + Math.round(child1PosGlobal.y) + ")";
        this.child1Text!.content += "\nlocal: (" + Math.round(-child1PosLocal.x) + ", " + Math.round(-child1PosLocal.y) + ")";

        var child2PosGlobal = this.childNode2!.firstChild.position;
        var child2PosLocal = this.childNode2!.firstChild.globalToLocal(parentPosGlobal);
        this.child2Text!.content = "global: (" + Math.round(child2PosGlobal.x) + ", " + Math.round(child2PosGlobal.y) + ")";
        this.child2Text!.content += "\nlocal: (" + Math.round(-child2PosLocal.x) + ", " + Math.round(-child2PosLocal.y) + ")";
    }

    private onKeyDown(event: paper.KeyEvent) : void
    {
        if(this.selectedNode)
        {
            if(event.key == 'r')
            {
                // rotate the node by 10 degrees
                this.selectedNode.rotate(10, this.selectedNode.firstChild.position);
                console.log(this.selectedNode);
            }
            else if(event.key == 's')
            {
                // increase the node scale by 1%
                this.selectedNode.scale(1.01, this.lastMousePoint);
            }

        }
    }

    private onMouseMove(event: paper.MouseEvent) : void
    {
        // if a node is currently selected, translate it by the amount the mouse has moved
        if(this.selectedNode)
            this.selectedNode.translate(event.point.subtract(this.lastMousePoint));

        this.lastMousePoint = event.point;
    }

    private onMouseDown(event: paper.MouseEvent) : void
    {
        // if we have a currently selected node, then drop it
        if(this.selectedNode)
        {
            this.selectedNode = undefined;
            this.instructionsText!.content = 'Click the red box to select the parent node. Click the purple box to select the child node.'
        }
        // if we have not selected a node, conduct a hit test
        else
        {
            // conduct a hit test for everything in the scene
            var hits = paper.project.hitTestAll(event.point);

            // get the group node, which is the parent of the drawable item
            this.selectedNode = hits.at(0)?.item.parent;

            if(this.selectedNode)
            {
                this.instructionsText!.content = 'Press r to rotate.  Press s to scale.'
            }
        }
    }  

    // This handles dynamic resizing of the browser window
    // You do not need to modify this function
    private resize() : void
    {
        var aspectRatio = this.width / this.height;
        var newAspectRatio = paper.view.viewSize.width / paper.view.viewSize.height;

        // using <, the view will be resized to fit within the window
        // using >, thhe view will be resized to fill the width of the window, and the portions top and bottom may be cut off
        if(newAspectRatio < aspectRatio)
            paper.view.zoom = paper.view.viewSize.width  / this.width;  
        else
            paper.view.zoom = paper.view.viewSize.height / this.height;
        
        paper.view.center = new paper.Point(this.width / 2, this.height / 2);
        
    }  
}

// This is included because the paper is missing a TypeScript definition
// You do not need to modify it
class GameEvent
{
    readonly delta: number;
    readonly time: number;
    readonly count: number;

    constructor()
    {
        this.delta = 0;
        this.time = 0;
        this.count = 0;
    }
}
    
// Start the game
var game = new Game();
game.start();
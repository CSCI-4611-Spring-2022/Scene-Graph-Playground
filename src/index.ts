/* Lecture 2
 * CSCI 4611, Spring 2022, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as paper from 'paper';

class Game 
{
    // Width and height are defined in project coordinates
    // This is different than screen coordinates!
    private width : number;
    private height : number;
    private parentNode : paper.Group | undefined;
    private childNode : paper.Group | undefined;
    private selectedNode : paper.Item | undefined;
    private lastMousePoint : paper.Point;
    private text : paper.PointText | undefined;
    
    constructor()
    {
        paper.setup('canvas');
        this.width = 1200;
        this.height = 800;
        this.lastMousePoint = new paper.Point(0, 0);
    }

    start() : void 
    {
        this.createScene();
        this.resize();

        // This registers the event handlers for window and mouse events
        paper.view.onResize = () => {this.resize();};
        paper.view.onMouseMove = (event: paper.MouseEvent) => {this.onMouseMove(event)};
        paper.view.onMouseDown = (event: paper.MouseEvent) => {this.onMouseDown(event)};
        paper.view.onFrame = (event: GameEvent) => {this.update(event)};
    }

    private createScene() : void 
    {
        // create a parent and child screne graph node
        this.parentNode = new paper.Group();
        this.childNode = new paper.Group();
        this.childNode.addTo(this.parentNode);

        // create the rectangle geometry
        var rectGeometry = new paper.Rectangle(new paper.Point(0, 0), new paper.Size(50, 50));
        var drawableRect = new paper.Path.Rectangle(rectGeometry);
        drawableRect.fillColor = new paper.Color('purple');

        // create a symbol from the rectangle geometry
        var rectSymbol = new paper.SymbolDefinition(drawableRect);

        // create two instances of the rectangle
        var rectInstance1 = rectSymbol.place(new paper.Point(0, 0));
        var rectInstance2 = rectSymbol.place(new paper.Point(200, 0));

        // add one instance to the parent node and one instance to the child node
        rectInstance1.addTo(this.parentNode);
        rectInstance2.addTo(this.childNode);

        // perform an initial translation of the parent node
        this.parentNode.translate(new paper.Point(200, 200));

        // create some text and place it at the center of the bottom of the view
        this.text = new paper.PointText(new paper.Point(0, 0));
        this.text.fontSize = 30;
        this.text.content = 'Press r to rotate.  Press s to scale.';
        this.text.justification = 'center';
        this.text.position = new paper.Point(paper.view.center.x - 50, paper.view.size.height - 50);
        this.text.visible = true;
    }

    // This method will be called once per frame
    private update(event: GameEvent) : void
    {
        
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
            this.text!.visible = false;
        }
        // if we have not selected a node, conduct a hit test
        else
        {
            // conduct a hit test for everything in the scene
            var hits = paper.project.hitTestAll(event.point);

            // get the group node, which is the parent of the drawable item
            this.selectedNode = hits.at(0)?.item.parent;
            this.text!.visible = true;
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
/* Scene Graph Playground
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
    private childNode1 : paper.Group | undefined;
    private childNode2 : paper.Group | undefined;
    private selectedNode : paper.Item | undefined;
    private lastMousePoint : paper.Point;
    private text1 : paper.PointText | undefined;
    private text2 : paper.PointText | undefined;
    
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
        new paper.Tool().onKeyDown = (event: paper.KeyEvent) => {this.onKeyDown(event)};
    }

    private createScene() : void 
    {
        // create a parent and two child screne graph nodes
        this.parentNode = new paper.Group();
        this.childNode1 = new paper.Group();
        this.childNode2 = new paper.Group();
        this.childNode1.addTo(this.parentNode);
        this.childNode2.addTo(this.parentNode);

        // create the rectangle geometry
        var rectGeometry = new paper.Rectangle(new paper.Point(0, 0), new paper.Size(50, 50));

        // create a purple drawable rectangle from the geometry and add it to the parent node
        var redDrawableRect = new paper.Path.Rectangle(rectGeometry);
        redDrawableRect.fillColor = new paper.Color('red');
        redDrawableRect.position = new paper.Point(0, 0);
        redDrawableRect.addTo(this.parentNode);
        
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
        this.parentNode.translate(new paper.Point(200, 200));

        // create some text and place it at the center of the bottom of the view
        this.text1 = new paper.PointText(new paper.Point(0, 0));
        this.text1.fontSize = 24;
        this.text1.content = 'Click the red box to select the parent node. Click the purple box to select the child node.';
        this.text1.justification = 'center';
        this.text1.position = new paper.Point(paper.view.center.x - 50, paper.view.size.height - 50);

        // create some text and place it at the center of the bottom of the view
        this.text2 = new paper.PointText(new paper.Point(0, 0));
        this.text2.fontSize = 30;
        this.text2.content = 'Press r to rotate.  Press s to scale.';
        this.text2.justification = 'center';
        this.text2.position = new paper.Point(paper.view.center.x - 50, paper.view.size.height - 50);
        this.text2.visible = false;
    }

    // This method will be called once per frame
    private update(event: GameEvent) : void
    {
        
    }

    private onKeyDown(event: paper.KeyEvent) : void
    {
        if(this.selectedNode)
        {
            if(event.key == 'r')
            {
                // rotate the node by 10 degrees
                this.selectedNode.rotate(10, this.lastMousePoint);
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
            this.text1!.visible = true;
            this.text2!.visible = false;
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
                this.text1!.visible = false;
                this.text2!.visible = true;
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
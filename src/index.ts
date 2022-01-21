/* Lecture 2
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
    private childNode : paper.Group | undefined;
    private selectedNode : paper.Item | undefined;
    private lastMousePoint : paper.Point;
    
    constructor()
    {
        paper.setup('canvas');
        this.width = 1200;
        this.height = 800;
        this.lastMousePoint = new Point(0, 0);
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
        this.parentNode = new paper.Group();
        this.childNode = new paper.Group();
        this.childNode.addTo(this.parentNode);

        var rectGeometry = new paper.Rectangle(new paper.Point(0, 0), new paper.Size(50, 50));
        var drawableRect = new paper.Path.Rectangle(rectGeometry);
        drawableRect.fillColor = new paper.Color('purple');

        var rectSymbol = new paper.SymbolDefinition(drawableRect);

        var rectInstance1 = rectSymbol.place(new Point(0, 0));
        rectInstance1.addTo(this.parentNode);

        var rectInstance2 = rectSymbol.place(new Point(200, 0));
        rectInstance2.addTo(this.childNode);

        this.parentNode.translate(new Point(200, 200));
    }

    // This method will be called once per frame
    private update(event: GameEvent) : void
    {
        
    }

    private onMouseMove(event: paper.MouseEvent) : void
    {
        if(this.selectedNode)
            this.selectedNode.translate(event.point.subtract(this.lastMousePoint));

        this.lastMousePoint = event.point;
    }

    private onMouseDown(event: paper.MouseEvent) : void
    {
        if(this.selectedNode)
        {
            this.selectedNode = undefined;
        }
        else
        {
            // conduct a hit test for everything in the scene
            var hits = paper.project.hitTestAll(event.point);

            // get the group node, which is the parent of the drawable item
            this.selectedNode = hits.at(0)?.item.parent;
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
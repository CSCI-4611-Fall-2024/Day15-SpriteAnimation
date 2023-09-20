/** CSci-4611 Example Code
 * Copyright 2023+ Regents of the University of Minnesota
 * Please do not distribute beyond the CSci-4611 course
 * 
 * This example created by Prof. Evan Suma Rosenberg.
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */

import * as gfx from 'gophergfx'
import { SpriteCharacter } from './SpriteCharacter';

export class ExampleApp extends gfx.GfxApp
{
    private character: SpriteCharacter;
    private cameraControls: gfx.OrbitControls;

    constructor()
    {
        super();

        this.cameraControls = new gfx.OrbitControls(this.camera);
        this.character = new SpriteCharacter(1, 512/360, 40/360, 30);
    }

    createScene(): void 
    {
        // Setup camera
        this.camera.setPerspectiveCamera(60, 1920/1080, 1, 800);
        this.cameraControls.setTargetPoint(new gfx.Vector3(0, 0, 0));
        this.cameraControls.setOrbit(gfx.MathUtils.degreesToRadians(-30), gfx.MathUtils.degreesToRadians(-135));
        this.cameraControls.rotationSpeedX = 0;
        this.cameraControls.setDistance(12);

        // Set a black background
        this.renderer.background.set(0, 0, 0);
        
        // Create an ambient light
        const ambientLight = new gfx.AmbientLight(new gfx.Vector3(0.6, 0.6, 0.6));
        this.scene.add(ambientLight);

        // Create a directional light
        const directionalLight = new gfx.DirectionalLight(new gfx.Vector3(0.6, 0.6, 0.6));
        directionalLight.position.set(1, 1, 1)
        this.scene.add(directionalLight);

        // Create a sky sphere
        const sky = gfx.Geometry3Factory.createSphere(400, 1);
        sky.material = new gfx.UnlitMaterial();
        sky.material.setColor(new gfx.Color(0.698, 1, 1));
        sky.material.side = gfx.Side.BACK;
        this.scene.add(sky);

        // Create a sky sphere
        const ground = gfx.Geometry3Factory.createPlane(400, 400);
        ground.rotation = gfx.Quaternion.makeRotationX(Math.PI/2);
        ground.material.setColor(new gfx.Color(.375, .476, .198));
        this.scene.add(ground);

        const rpgMaterial = new gfx.GouraudMaterial();
        rpgMaterial.texture = new gfx.Texture('./assets/textures/rpgpp_lt_tex_a.png');

        const terrain = gfx.MeshLoader.loadOBJ('./assets/meshes/terrain.obj');
        terrain.position.y = -1;
        terrain.material = rpgMaterial;
        this.scene.add(terrain);

        const buildings1 = gfx.MeshLoader.loadOBJ('./assets/meshes/buildings1.obj');
        buildings1.material = rpgMaterial;
        this.scene.add(buildings1);

        const buildings2 = gfx.MeshLoader.loadOBJ('./assets/meshes/buildings2.obj');
        buildings2.material = rpgMaterial;
        this.scene.add(buildings2);

        const vegetation = gfx.MeshLoader.loadOBJ('./assets/meshes/vegetation.obj');
        vegetation.position.y = 0.5;
        vegetation.material = rpgMaterial;
        this.scene.add(vegetation);

        const props = gfx.MeshLoader.loadOBJ('./assets/meshes/props.obj');
        props.position.y = 1;
        props.material = rpgMaterial;
        this.scene.add(props);

        this.character.position.set(-5, 0, 2);
        this.character.scale.set(2, 2, 1);
        this.scene.add(this.character);
    }

    update(deltaTime: number): void 
    {
        // Make sure the camera always aims at the sprite
        this.cameraControls.setTargetPoint(this.character.position);

        // Update the camera orbit controls
        this.cameraControls.update(deltaTime);

        this.character.update(deltaTime);
    }

    onKeyDown(event: KeyboardEvent): void 
    {
        if(event.key == "d" || event.key == "ArrowRight")
        {
            this.character.moveDirection.x = 1;
        }
        else if(event.key == "a" || event.key == "ArrowLeft")
        {
            this.character.moveDirection.x = -1;
        }

        if(event.key == "w" || event.key == "ArrowUp")
        {
            this.character.moveDirection.y = 1;
        }
        else if(event.key == "s" || event.key == "ArrowDown")
        {
            this.character.moveDirection.y = -1;
        }
    }

    onKeyUp(event: KeyboardEvent): void 
    {
        if(event.key == "d" || event.key == "ArrowRight")
        {
            if(this.character.moveDirection.x == 1)
                this.character.moveDirection.x = 0;
        }
        else if(event.key == "a" || event.key == "ArrowLeft")
        {
            if(this.character.moveDirection.x == -1)
                this.character.moveDirection.x = 0;
        }

        if(event.key == "w" || event.key == "ArrowUp")
        {
            if(this.character.moveDirection.y == 1)
                this.character.moveDirection.y = 0;
        }
        else if(event.key == "s" || event.key == "ArrowDown")
        {
            if(this.character.moveDirection.y == -1)
                this.character.moveDirection.y = 0;
        }
    }
}
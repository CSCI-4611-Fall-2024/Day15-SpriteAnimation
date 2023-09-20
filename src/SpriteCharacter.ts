/** CSci-4611 Example Code
 * Copyright 2023+ Regents of the University of Minnesota
 * Please do not distribute beyond the CSci-4611 course
 * 
 * This example created by Prof. Evan Suma Rosenberg.
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */

import * as gfx from 'gophergfx'

export class SpriteCharacter extends gfx.Mesh3
{
    public moveDirection: gfx.Vector2;
    public walkSpeed: number;

    private spriteMaterial: gfx.UnlitMaterial;
    private fps: number;

    private rightWalkTextures: gfx.Texture[];
    private frontWalkTextures: gfx.Texture[];
    private backWalkTextures: gfx.Texture[];

    private currentFrame: number;
    private lastFrameTime: number;

    constructor(width: number, height: number, bottomPadding: number, fps: number)
    {
        super();

        // Hack because we exceeded the number of textures
        this.fps = fps / 3;

        const vertices: number[] = [];
        vertices.push(-width/2, -bottomPadding, 0);
        vertices.push(width/2, -bottomPadding, 0);
        vertices.push(width/2, height - bottomPadding, 0);
        vertices.push(-width/2, height - bottomPadding,0);

        const normals: number[] = [];
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
        
        const indices: number[] = [];
        indices.push(0, 2, 1);
        indices.push(2, 0, 3);

        const uvs: number[] = [];
        uvs.push(1, 1);
        uvs.push(0, 1);
        uvs.push(0, 0);
        uvs.push(1, 0);

        this.setVertices(vertices);
        this.setNormals(normals);
        this.setIndices(indices);
        this.setTextureCoordinates(uvs);
        this.createDefaultVertexColors();

        this.frontWalkTextures = [];
        for(let i=0; i < this.fps; i++)
        {
            if(i < 4)
                this.frontWalkTextures[i] = new gfx.Texture('./assets/sprites/HumanoidCharacter-Front-walk_0' + i*3 + '.png');
            else
                this.frontWalkTextures[i] = new gfx.Texture('./assets/sprites/HumanoidCharacter-Front-walk_' + i*3 + '.png');
        }

        this.backWalkTextures = [];
        for(let i=0; i < this.fps; i++)
        {
            if(i < 4)
                this.backWalkTextures[i] = new gfx.Texture('./assets/sprites/HumanoidCharacter-Back-walk_0' + i*3 + '.png');
            else
                this.backWalkTextures[i] = new gfx.Texture('./assets/sprites/HumanoidCharacter-Back-walk_' + i*3 + '.png');
        }

        this.rightWalkTextures = [];
        for(let i=0; i < this.fps; i++)
        {
            if(i < 4)
                this.rightWalkTextures[i] = new gfx.Texture('./assets/sprites/HumanoidCharacter-Right-walk_0' + i*3 + '.png');
            else
                this.rightWalkTextures[i] = new gfx.Texture('./assets/sprites/HumanoidCharacter-Right-walk_' + i*3 + '.png');
        }

        this.spriteMaterial = new gfx.UnlitMaterial();
        this.spriteMaterial.side = gfx.Side.DOUBLE;
        this.material = this.spriteMaterial;
        this.spriteMaterial.texture = this.frontWalkTextures[0];

        this.moveDirection = new gfx.Vector2();
        this.currentFrame = 0;
        this.lastFrameTime = 0;
        this.walkSpeed = 1.5;
    }

    update(deltaTime: number): void
    {
        const camera = gfx.GfxApp.getInstance().camera;
        this.lookAt(camera.position);

        if(this.moveDirection.length() == 0)
            return;

        const currentTime = Date.now() / 1000;
        if(currentTime - this.lastFrameTime > 1 / this.fps)
        {
            if(this.moveDirection.x > 0)
            {
                this.scale.x = Math.abs(this.scale.x);
                this.advanceFrame(this.rightWalkTextures);
            }
            else if(this.moveDirection.x < 0)
            {
                this.scale.x = -Math.abs(this.scale.x);
                this.advanceFrame(this.rightWalkTextures);
            }
            else if(this.moveDirection.y > 0)
            {
                this.advanceFrame(this.backWalkTextures);
            }
            else if(this.moveDirection.y < 0)
            {
                this.advanceFrame(this.frontWalkTextures);
            }

            this.lastFrameTime = currentTime;
        }

        // Get the character's walking velocity in world space
        const velocity = new gfx.Vector3(this.moveDirection.x, 0, -this.moveDirection.y);

        // Rotate in the direction of the camera
        velocity.rotate(camera.rotation);

        // Zero out any change in height
        velocity.y = 0;

        // Normalize and scale by the walk speed
        velocity.normalize();
        velocity.multiplyScalar(this.walkSpeed * deltaTime);

        // Add to the character's root position
        this.position.add(velocity);
    }

    private advanceFrame(textures: gfx.Texture[]): void
    {
        this.currentFrame++;

        if(this.currentFrame >= textures.length)
            this.currentFrame = 0;
        
        this.spriteMaterial.texture = textures[this.currentFrame];
    }
}
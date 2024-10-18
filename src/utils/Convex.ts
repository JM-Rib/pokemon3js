import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import * as Utils from './FunctionLibrary.ts';
import {Object3D, Vector3} from 'three';
import {Vec3} from 'cannon-es';
import { threeToCannon, ShapeType } from 'three-to-cannon';

export interface ICollider {
	body: CANNON.Body;
}

export class Convex implements ICollider
{
	public mesh: any;
	public options: any;
	public body: CANNON.Body;
	public debugModel: any;

	constructor(mesh, options)
    {
        this.body = new CANNON.Body();
        
        console.log("----mesh----");
        console.log(mesh);
        
        this.mesh = mesh.clone();

        let defaults = {
            mass: 0,
            position: mesh.position,
            friction: 0.3
        };
        options = Utils.setDefaults(options, defaults);
        this.options = options;

        let mat = new CANNON.Material();
        mat.friction = options.friction;
        // mat.restitution = 0.7;

        const result: any = threeToCannon(mesh, {type: ShapeType.HULL});

        const {shape, offset, orientation} = result;

        this.body.addShape(shape, offset, orientation);
    }
}
import * as CANNON from 'cannon-es';
import * as Utils from './FunctionLibrary.ts';
import {Object3D} from 'three';
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


        let shape = new CANNON.ConvexPolyhedron({vertices: this.mesh.geometry.vertices, faces: this.mesh.geometry.faces});
        shape.material = mat;

        // Add phys sphere
        let physBox = new CANNON.Body({
            mass: options.mass,
            position: options.position,
            shape: shape
        });

        physBox.material = mat;

        this.body = physBox;
    }
}
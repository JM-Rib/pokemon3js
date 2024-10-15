import * as CANNON from 'cannon-es';
import * as Utils from './FunctionLibrary.ts';
import {Object3D} from 'three';
import { threeToCannon, ShapeType } from 'three-to-cannon';

export interface ICollider {
	body: CANNON.Body;
}

export class TrimeshCollider implements ICollider
{
	public mesh: any;
	public options: any;
	public body: CANNON.Body;
	public debugModel: any;

	constructor(mesh: Object3D, options: any)
	{
		this.mesh = mesh.clone();

		let defaults = {
			mass: 0,
			position: mesh.position,
			rotation: mesh.quaternion,
			friction: 0.3
		};
		options = Utils.setDefaults(options, defaults);
		this.options = options;

		// let mat = new CANNON.Material('triMat');
		let mat = new CANNON.Material('ground');
		mat.friction = options.friction;
		// mat.restitution = 0.7;

		let shape = threeToCannon(this.mesh, {type: ShapeType.MESH});
		// shape['material'] = mat;

		// Add phys sphere
		let physBox = new CANNON.Body({
			mass: options.mass,
			position: options.position,
			quaternion: options.rotation,
			shape: shape?.shape,
		});
		// console.log(physBox);

		physBox.material = mat;

		this.body = physBox;
	}
}
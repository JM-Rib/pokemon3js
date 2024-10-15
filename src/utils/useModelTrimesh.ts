/* Pas utilisé mais j'ai passé 45 Min à essayer cette solution avant de me rendre compte que c'était eclatax donc je le laisse qd même */

import type {
  AtomicName,
  AtomicProps,
  BodyProps,
  BodyShapeType,
  BoxProps,
  CannonWorkerAPI,
  CompoundBodyProps,
  ConeTwistConstraintOpts,
  ConstraintOptns,
  ConstraintTypes,
  ContactMaterialOptions,
  ConvexPolyhedronArgs,
  ConvexPolyhedronProps,
  CylinderProps,
  DistanceConstraintOpts,
  HeightfieldProps,
  HingeConstraintOpts,
  LockConstraintOpts,
  MaterialOptions,
  ParticleProps,
  PlaneProps,
  PointToPointConstraintOpts,
  PropValue,
  Quad,
  RayhitEvent,
  RayMode,
  RayOptions,
  SetOpName,
  SphereArgs,
  SphereProps,
  SpringOptns,
  SubscriptionName,
  Subscriptions,
  SubscriptionTarget,
  TrimeshProps,
  Triplet,
  VectorName,
  WheelInfoOptions,
} from '@pmndrs/cannon-worker-api'
import type { DependencyList, MutableRefObject, Ref, RefObject } from 'react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { DynamicDrawUsage, Euler, InstancedMesh, MathUtils, Object3D, Quaternion, Vector3 } from 'three'

// chemin: \@react-three\cannon\src\debug-context.ts
import { useDebugContext } from '@react-three/cannon/src/debug-context'
import type { CannonEvents } from '@react-three/cannon/src/physics-context'
import { usePhysicsContext } from '@react-three/cannon/src/physics-context'

// --- Definitions pour mise en place de useBody --- 
// 
type GetByIndex<T extends BodyProps> = (index: number) => T
type ArgFn<T> = (args: T) => unknown[]

// 
type AtomicApi<K extends AtomicName> = {
  set: (value: AtomicProps[K]) => void
  subscribe: (callback: (value: AtomicProps[K]) => void) => () => void
}
type QuaternionApi = {
  copy: ({ w, x, y, z }: Quaternion) => void
  set: (x: number, y: number, z: number, w: number) => void
  subscribe: (callback: (value: Quad) => void) => () => void
}
type VectorApi = {
  copy: ({ x, y, z }: Vector3 | Euler) => void
  set: (x: number, y: number, z: number) => void
  subscribe: (callback: (value: Triplet) => void) => () => void
}
type WorkerApi = {
  [K in AtomicName]: AtomicApi<K>
} & {
  [K in VectorName]: VectorApi
} & {
  applyForce: (force: Triplet, worldPoint: Triplet) => void
  applyImpulse: (impulse: Triplet, worldPoint: Triplet) => void
  applyLocalForce: (force: Triplet, localPoint: Triplet) => void
  applyLocalImpulse: (impulse: Triplet, localPoint: Triplet) => void
  applyTorque: (torque: Triplet) => void
  quaternion: QuaternionApi
  rotation: VectorApi
  scaleOverride: (scale: Triplet) => void
  sleep: () => void
  wakeUp: () => void
}
interface PublicApi extends WorkerApi {
  at: (index: number) => WorkerApi
}
type Api<O extends Object3D> = [RefObject<O>, PublicApi]

// 
function useForwardedRef<T>(ref: Ref<T>): MutableRefObject<T | null> {
  const nullRef = useRef<T>(null)
  return ref && typeof ref !== 'function' ? ref : nullRef
}

// 
function prepare(object: Object3D, { position = [0, 0, 0], rotation = [0, 0, 0], userData = {} }: BodyProps) {
  object.userData = userData
  object.position.set(...position)
  object.rotation.set(...rotation)
  object.updateMatrix()
}

//
const temp = new Object3D()

// 
function setupCollision(
  events: CannonEvents,
  { onCollide, onCollideBegin, onCollideEnd }: Partial<BodyProps>,
  uuid: string,
) {
  events[uuid] = {
    collide: onCollide,
    collideBegin: onCollideBegin,
    collideEnd: onCollideEnd,
  }
}

// 
function capitalize<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>
}
function getUUID(ref: Ref<Object3D>, index?: number): string | null {
  const suffix = index === undefined ? '' : `/${index}`
  if (typeof ref === 'function') return null
  return ref && ref.current && `${ref.current.uuid}${suffix}`
}

//
let incrementingId = 0
function subscribe<T extends SubscriptionName>(
  ref: RefObject<Object3D>,
  worker: CannonWorkerAPI,
  subscriptions: Subscriptions,
  type: T,
  index?: number,
  target: SubscriptionTarget = 'bodies',
) {
  return (callback: (value: PropValue<T>) => void) => {
    const id = incrementingId++
    subscriptions[id] = { [type]: callback }
    const uuid = getUUID(ref, index)
    uuid && worker.subscribe({ props: { id, target, type }, uuid })
    return () => {
      delete subscriptions[id]
      worker.unsubscribe({ props: id })
    }
  }
}

// 
const e = new Euler()
const q = new Quaternion()
const quaternionToRotation = (callback: (v: Triplet) => void) => {
  return (v: Quad) => callback(e.setFromQuaternion(q.fromArray(v)).toArray() as Triplet)
}

function useBody<B extends BodyProps<unknown[]>, O extends Object3D>(
  type: BodyShapeType,
  fn: GetByIndex<B>,
  argsFn: ArgFn<B['args']>,
  fwdRef: Ref<O> = null,
  deps: DependencyList = [],
): Api<O> {
  const ref = useForwardedRef(fwdRef)

  const { events, refs, scaleOverrides, subscriptions, worker } = usePhysicsContext()
  const debugApi = useDebugContext()

  useLayoutEffect(() => {
    if (!ref.current) {
      // When the reference isn't used we create a stub
      // The body doesn't have a visual representation but can still be constrained
      // Yes, this type may be technically incorrect
      ref.current = new Object3D() as O
    }

    const object = ref.current
    const currentWorker = worker

    const objectCount =
      object instanceof InstancedMesh ? (object.instanceMatrix.setUsage(DynamicDrawUsage), object.count) : 1

    const uuid =
      object instanceof InstancedMesh
        ? new Array(objectCount).fill(0).map((_, i) => `${object.uuid}/${i}`)
        : [object.uuid]

    const props: (B & { args: unknown })[] =
      object instanceof InstancedMesh
        ? uuid.map((id, i) => {
            const props = fn(i)
            prepare(temp, props)
            object.setMatrixAt(i, temp.matrix)
            object.instanceMatrix.needsUpdate = true
            refs[id] = object
            debugApi?.add(id, props, type)
            setupCollision(events, props, id)
            return { ...props, args: argsFn(props.args) }
          })
        : uuid.map((id, i) => {
            const props = fn(i)
            prepare(object, props)
            refs[id] = object
            debugApi?.add(id, props, type)
            setupCollision(events, props, id)
            return { ...props, args: argsFn(props.args) }
          })

    // Register on mount, unregister on unmount
    currentWorker.addBodies({
      props: props.map(({ onCollide, onCollideBegin, onCollideEnd, ...serializableProps }) => {
        return { onCollide: Boolean(onCollide), ...serializableProps }
      }),
      type,
      uuid,
    })
    return () => {
      uuid.forEach((id) => {
        delete refs[id]
        debugApi?.remove(id)
        delete events[id]
      })
      currentWorker.removeBodies({ uuid })
    }
  }, deps)

  const api = useMemo(() => {
    const makeAtomic = <T extends AtomicName>(type: T, index?: number) => {
      const op: SetOpName<T> = `set${capitalize(type)}`

      return {
        set: (value: PropValue<T>) => {
          const uuid = getUUID(ref, index)
          uuid &&
            worker[op]({
              props: value,
              uuid,
            } as never)
        },
        subscribe: subscribe(ref, worker, subscriptions, type, index),
      }
    }

    const makeQuaternion = (index?: number) => {
      const type = 'quaternion'
      return {
        copy: ({ w, x, y, z }: Quaternion) => {
          const uuid = getUUID(ref, index)
          uuid && worker.setQuaternion({ props: [x, y, z, w], uuid })
        },
        set: (x: number, y: number, z: number, w: number) => {
          const uuid = getUUID(ref, index)
          uuid && worker.setQuaternion({ props: [x, y, z, w], uuid })
        },
        subscribe: subscribe(ref, worker, subscriptions, type, index),
      }
    }

    const makeRotation = (index?: number) => {
      return {
        copy: ({ x, y, z }: Vector3 | Euler) => {
          const uuid = getUUID(ref, index)
          uuid && worker.setRotation({ props: [x, y, z], uuid })
        },
        set: (x: number, y: number, z: number) => {
          const uuid = getUUID(ref, index)
          uuid && worker.setRotation({ props: [x, y, z], uuid })
        },
        subscribe: (callback: (value: Triplet) => void) => {
          const id = incrementingId++
          const target = 'bodies'
          const type = 'quaternion'
          const uuid = getUUID(ref, index)

          subscriptions[id] = { [type]: quaternionToRotation(callback) }
          uuid && worker.subscribe({ props: { id, target, type }, uuid })
          return () => {
            delete subscriptions[id]
            worker.unsubscribe({ props: id })
          }
        },
      }
    }

    const makeVec = (type: VectorName, index?: number) => {
      const op: SetOpName<VectorName> = `set${capitalize(type)}`
      return {
        copy: ({ x, y, z }: Vector3 | Euler) => {
          const uuid = getUUID(ref, index)
          uuid && worker[op]({ props: [x, y, z], uuid })
        },
        set: (x: number, y: number, z: number) => {
          const uuid = getUUID(ref, index)
          uuid && worker[op]({ props: [x, y, z], uuid })
        },
        subscribe: subscribe(ref, worker, subscriptions, type, index),
      }
    }

    function makeApi(index?: number): WorkerApi {
      return {
        allowSleep: makeAtomic('allowSleep', index),
        angularDamping: makeAtomic('angularDamping', index),
        angularFactor: makeVec('angularFactor', index),
        angularVelocity: makeVec('angularVelocity', index),
        applyForce(force: Triplet, worldPoint: Triplet) {
          const uuid = getUUID(ref, index)
          uuid && worker.applyForce({ props: [force, worldPoint], uuid })
        },
        applyImpulse(impulse: Triplet, worldPoint: Triplet) {
          const uuid = getUUID(ref, index)
          uuid && worker.applyImpulse({ props: [impulse, worldPoint], uuid })
        },
        applyLocalForce(force: Triplet, localPoint: Triplet) {
          const uuid = getUUID(ref, index)
          uuid && worker.applyLocalForce({ props: [force, localPoint], uuid })
        },
        applyLocalImpulse(impulse: Triplet, localPoint: Triplet) {
          const uuid = getUUID(ref, index)
          uuid && worker.applyLocalImpulse({ props: [impulse, localPoint], uuid })
        },
        applyTorque(torque: Triplet) {
          const uuid = getUUID(ref, index)
          uuid && worker.applyTorque({ props: [torque], uuid })
        },
        collisionFilterGroup: makeAtomic('collisionFilterGroup', index),
        collisionFilterMask: makeAtomic('collisionFilterMask', index),
        collisionResponse: makeAtomic('collisionResponse', index),
        fixedRotation: makeAtomic('fixedRotation', index),
        isTrigger: makeAtomic('isTrigger', index),
        linearDamping: makeAtomic('linearDamping', index),
        linearFactor: makeVec('linearFactor', index),
        mass: makeAtomic('mass', index),
        material: makeAtomic('material', index),
        position: makeVec('position', index),
        quaternion: makeQuaternion(index),
        rotation: makeRotation(index),
        scaleOverride(scale) {
          const uuid = getUUID(ref, index)
          if (uuid) scaleOverrides[uuid] = new Vector3(...scale)
        },
        sleep() {
          const uuid = getUUID(ref, index)
          uuid && worker.sleep({ uuid })
        },
        sleepSpeedLimit: makeAtomic('sleepSpeedLimit', index),
        sleepTimeLimit: makeAtomic('sleepTimeLimit', index),
        userData: makeAtomic('userData', index),
        velocity: makeVec('velocity', index),
        wakeUp() {
          const uuid = getUUID(ref, index)
          uuid && worker.wakeUp({ uuid })
        },
      }
    }

    const cache: { [index: number]: WorkerApi } = {}
    return {
      ...makeApi(undefined),
      at: (index: number) => cache[index] || (cache[index] = makeApi(index)),
    }
  }, [])
  return [ref, api]
}

export function useModelTrimesh<O extends Object3D>(
    fn: GetByIndex<TrimeshProps>,
    fwdRef?: Ref<O>,
    deps?: DependencyList,
  ) {


    return useBody<TrimeshProps, O>('Trimesh', fn, (args) => args, fwdRef, deps)
  }
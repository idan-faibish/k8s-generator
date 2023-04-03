# K8s generator

A CLI tool to generate k8s namespaces/pods and create traffic.

## Prerequisites

1. [Node.js](https://nodejs.org) and [npm](https://npmjs.com) installed (verified with npm version 8.13.2 and Node 17.4.0).

## Installation

1. Clone this repository.
2. `npm ci` (from inside the repo folder)
3. `npm link` (from inside the repo folder)

## Usage

At any time, you can run `k8s-generator --help` to see the available commands.

## Create/Delete resources commands

##### Create a namespaces(s)

`k8s-generator create-namespace ns-name1 ns-name2 ...`

##### Delete a namespace(s)

`k8s-generator delete-namespace ns-name1 ns-name2 ...`

##### Create a pod(s) in a namespace (if the namespace doesn't exist, it will be created)

`k8s-generator create-pod -n ns-name pod-name1 pod-name2 ... --ports FROM_PORT-TO_PORT`

##### Delete a pod(s) in a namespace

`k8s-generator delete-pod -n ns-name pod-name1 pod-name2 ...`

## Traffic generation commands

##### Generate internal traffic (from pods to pods in the same namespace)

`k8s-generator internal-traffic -n ns-name --from-pods pod1 pod2 --to-pods pod3 pod4 --ports FROM_PORT-TO_PORT`

##### Generate egress traffic (from pods to external addresses)

`k8s-generator egress-traffic -n ns-name --from-pods pod1 pod2 --addresses google.com amazon.com`

##### Generate cross namespace traffic (from pods in one namespace to pods in another namespace)

`k8s-generator cross-namespace-traffic --from-namespace ns-name1 --to-namespace ns-name2 --from-pods pod1 pod2 --to-pods pod3 pod4 --ports FROM_PORT-TO_PORT`

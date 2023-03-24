#! /usr/bin/env node
import { Command } from 'commander';
import * as k8s from '@kubernetes/client-node';

const program = new Command();
program.version('0.0.1');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const coreApi = kc.makeApiClient(k8s.CoreV1Api);
const appsApi = kc.makeApiClient(k8s.AppsV1Api);

program
    .command('create-ns')
    .argument('<names...>', 'namespaces names to create')
    .action(async (namespaces) => {
        for (const namespace of namespaces) {
            try {
                await coreApi.createNamespace({ metadata: { name: namespace } });
                console.log(`created namespace: ${namespace}`);
            } catch (e) {
                if (e.response.statusCode === 409) {
                    console.log(`failed to create namespace: ${namespace} (already exists)`);
                    continue;
                }

                throw e;
            }
        }
    });

// TODO: create deployment (in namespace)
// TODO: create pod (in namespace)

program
    .command('delete-ns')
    .argument('<names...>', 'namespaces names to delete')
    .action(async (namespaces) => {
        for (const namespace of namespaces) {
            try {
                await coreApi.deleteNamespace(namespace);
                console.log(`deleted namespace: ${namespace}`);
            } catch (e) {
                if (e.response.statusCode === 404) {
                    console.log(`failed to delete namespace: ${namespace} (not found)`);
                    continue;
                }

                throw e;
            }
        }
    });

// TODO: delete deployment (in namespace)
// TODO: delete pod (in namespace)

program.parse(process.argv);

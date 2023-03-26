import * as k8s from '@kubernetes/client-node';
import fs from 'fs';
import yaml from 'js-yaml';

import { createNamespace } from '../namespace/index.js';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const coreApi = kc.makeApiClient(k8s.CoreV1Api);
const appsApi = kc.makeApiClient(k8s.AppsV1Api);

export const createPod = async (pods, { namespace }) => {
    console.log('11');
    createNamespace([namespace]);
    for (const pod of pods) {
        try {
            const descriptor = yaml.load(fs.readFileSync('resources/pod.yaml'));
            await coreApi.createNamespacedPod(
                namespace,
                JSON.parse(JSON.stringify(descriptor).replaceAll('$POD_NAME', pod))
            );
            console.log(`created pod: ${pod}`);
        } catch (e) {
            if (e.response.statusCode === 404) {
                console.log(`failed to create pod: ${pod} because the namespace: ${namespace} not found`);
                continue;
            }
            throw e;
        }
    }
};

export const deletePod = async (pods, { namespace }) => {
    for (const pod of pods) {
        try {
            await coreApi.deleteNamespacedPod(pod, namespace);
            console.log(`deleted pod: ${pod}`);
        } catch (e) {
            if (e.response.statusCode === 404) {
                console.log(`failed to delete pod: ${pod} (not found)`);
                continue;
            }
            throw e;
        }
    }
};

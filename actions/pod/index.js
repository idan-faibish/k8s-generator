import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import * as k8s from '@kubernetes/client-node';
import fs from 'fs';
import yaml from 'js-yaml';
import { portsParser } from '../../utils/index.js';

import { createNamespace } from '../namespace/index.js';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const coreApi = kc.makeApiClient(k8s.CoreV1Api);
const appsApi = kc.makeApiClient(k8s.AppsV1Api);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createPod = async (pods, { namespace, ports }) => {
    if (!portsParser(ports).isValid) {
        console.log('invalid ports range');
        return;
    }

    await createNamespace([namespace]);
    for (const pod of pods) {
        try {
            const podYaml = yaml.load(fs.readFileSync(resolve(__dirname, '../../resources/pod.yaml')));
            // prettier-ignore
            const podYamlString = JSON.stringify(podYaml)
                .replaceAll('$POD_NAME', pod)
                .replaceAll('$PORTS', ports)
            await coreApi.createNamespacedPod(namespace, JSON.parse(podYamlString));

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

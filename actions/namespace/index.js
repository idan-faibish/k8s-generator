import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const coreApi = kc.makeApiClient(k8s.CoreV1Api);
const appsApi = kc.makeApiClient(k8s.AppsV1Api);

export const createNamespace = async (namespaces) => {
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
};

export const deleteNamespace = async (namespaces) => {
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
};

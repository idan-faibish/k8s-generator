import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const coreApi = kc.makeApiClient(k8s.CoreV1Api);
const appsApi = kc.makeApiClient(k8s.AppsV1Api);

export const getPodMetadata = async (podName, namespace) => {
    const pod = await coreApi.readNamespacedPod(podName, namespace);
    const fromIp = pod.body.status.podIP;

    return { name: podName, namespace, ip: fromIp };
};

export const portsParser = (ports) => {
    const isSinglePort = ports.split('-').length === 1;
    const [fromPort, toPort] = ports.split('-');
    const fromPortNumber = Number.parseInt(fromPort);
    const toPortNumber = isSinglePort ? fromPortNumber : Number.parseInt(toPort);

    return {
        fromPort: fromPortNumber,
        toPort: toPortNumber,
        isValid: isSinglePort
            ? !Number.isNaN(fromPortNumber) && fromPortNumber === toPortNumber
            : !Number.isNaN(fromPortNumber) && !Number.isNaN(toPortNumber) && fromPortNumber < toPortNumber
    };
};

import * as k8s from '@kubernetes/client-node';
import { getPodMetadata, portsParser } from '../../utils/index.js';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const coreApi = kc.makeApiClient(k8s.CoreV1Api);
const appsApi = kc.makeApiClient(k8s.AppsV1Api);
const containerName = 'david-container';

export const createInternalTraffic = async ({ namespace, fromPods, toPods, ports }) => {
    const { fromPort, toPort, isValid } = portsParser(ports);
    if (!isValid) {
        console.log('invalid ports range');
        return;
    }

    try {
        for (const fromPod of fromPods) {
            for (const toPod of toPods) {
                const from = await getPodMetadata(fromPod, namespace);
                const to = await getPodMetadata(toPod, namespace);
                if (from.name === to.name) {
                    console.log(`skipping traffic from ${from.name} to ${to.name}`);
                    continue;
                }

                const exec = new k8s.Exec(kc);
                for (let i = fromPort; i <= toPort; i++) {
                    console.log(
                        `creating traffic in ${namespace} from ${from.name} (${from.ip}) to ${to.name} (${to.ip}) on port ${i}`
                    );
                    await exec.exec(
                        namespace,
                        from.name,
                        containerName,
                        ['curl', `${to.ip}:${i}`],
                        process.stdout,
                        process.stderr,
                        null,
                        true,
                        (result) => {
                            if (result.status.toLowerCase() === 'success') {
                                console.log('created internal traffic!');
                            } else {
                                console.log('failed to create internal traffic!');
                            }
                        }
                    );
                }
            }
        }
    } catch (e) {
        if (e.response.statusCode === 404) {
            console.log(`some pod wasn't found in namespace: ${namespace}, please check before trying again`);
        }
    }
};

export const createEgressTraffic = async ({ namespace, fromPods, addresses }) => {
    try {
        for (const fromPod of fromPods) {
            const from = await getPodMetadata(fromPod, namespace);

            const exec = new k8s.Exec(kc);
            for (const address of addresses) {
                console.log(`creating egress traffic in ${namespace} from ${from.name} (${from.ip}) to ${address}`);
                await exec.exec(
                    namespace,
                    from.name,
                    containerName,
                    ['curl', address],
                    process.stdout,
                    process.stderr,
                    null,
                    true,
                    (result) => {
                        if (result.status.toLowerCase() === 'success') {
                            console.log('created egress traffic!');
                        } else {
                            console.log('failed to create egress traffic!');
                        }
                    }
                );
            }
        }
    } catch (e) {
        if (e.response.statusCode === 404) {
            console.log(`some pod wasn't found in namespace: ${namespace}, please check before trying again`);
        }
    }
};

export const crossNamespaceTraffic = async ({ fromNamespace, toNamespace, fromPods, toPods, ports, opposite }) => {
    const { fromPort, toPort, isValid } = portsParser(ports);
    if (!isValid) {
        console.log('invalid ports range');
        return;
    }

    if (opposite) {
        [toNamespace, fromNamespace] = [fromNamespace, toNamespace];
        [toPods, fromPods] = [fromPods, toPods];
    }

    try {
        for (const fromPod of fromPods) {
            for (const toPod of toPods) {
                const from = await getPodMetadata(fromPod, fromNamespace);
                const to = await getPodMetadata(toPod, toNamespace);

                const exec = new k8s.Exec(kc);
                for (let i = fromPort; i <= toPort; i++) {
                    console.log(
                        `creating traffic from ${from.name} (${from.ip}) in ${fromNamespace} to ${to.name} (${to.ip}) in ${toNamespace} on port ${i}`
                    );
                    await exec.exec(
                        fromNamespace,
                        from.name,
                        containerName,
                        ['curl', `${to.ip}:${i}`],
                        process.stdout,
                        process.stderr,
                        null,
                        true,
                        (result) => {
                            if (result.status.toLowerCase() === 'success') {
                                console.log('created cross namespace traffic!');
                            } else {
                                console.log('failed to create cross namespace traffic!');
                            }
                        }
                    );
                }
            }
        }
    } catch (e) {
        if (e.response.statusCode === 404) {
            console.log(`some pod wasn't found in namespace: ${fromNamespace}, please check before trying again`);
        }
    }
};

#! /usr/bin/env node
import { Command } from 'commander';
import { createNamespace, deleteNamespace } from './actions/namespace/index.js';
import { createPod, deletePod } from './actions/pod/index.js';
import { createEgressTraffic, createInternalTraffic, crossNamespaceTraffic } from './actions/traffic/index.js';

const program = new Command();
program.version('0.0.1');

/////////////////////////////////
////// Namespaces commands //////
/////////////////////////////////
// prettier-ignore
program
    .command('create-namespace')
    .argument('<names...>', 'namespaces names to create')
    .action(createNamespace);

// prettier-ignore
program
    .command('delete-namespace')
    .argument('<names...>', 'namespaces names to delete')
    .action(deleteNamespace);

///////////////////////////
////// Pods commands //////
///////////////////////////
program
    .command('create-pod')
    .argument('<names...>', 'pods names')
    .requiredOption('-n, --namespace <namespace>', 'namespace name')
    .action(createPod);

program
    .command('delete-pod')
    .argument('<names...>', 'pods names')
    .requiredOption('-n, --namespace <namespace>', 'namespace name')
    .action(deletePod);

//////////////////////////////
////// Traffic commands //////
//////////////////////////////
program
    .command('internal-traffic')
    .requiredOption('-n, --namespace <namespace>', 'namespace name')
    .requiredOption('--from-pods <fromPods...>', 'from pods names')
    .requiredOption('--to-pods <toPods...>', 'to pods names')
    .requiredOption('-p, --ports <ports>', 'ports to use', '5000')
    .action(createInternalTraffic);

program
    .command('egress-traffic')
    .requiredOption('-n, --namespace <namespace>', 'namespace name')
    .requiredOption('--from-pods <fromPods...>', 'from pods names')
    .requiredOption('--addresses <addresses...>', 'egress addresses')
    .action(createEgressTraffic);

program
    .command('cross-namespace-traffic')
    .requiredOption('--from-namespace <fromNamespace>', 'from namespace name')
    .requiredOption('--to-namespace <toNamespace>', 'to namespace name')
    .requiredOption('--from-pods <fromPods...>', 'from pods names')
    .requiredOption('--to-pods <toPods...>', 'to pods names')
    .requiredOption('-p, --ports <ports>', 'ports to use', '5000')
    .requiredOption('-o, --opposite', 'opposite traffic', false)
    .action(crossNamespaceTraffic);

program.parse(process.argv);

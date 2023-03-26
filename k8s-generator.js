#! /usr/bin/env node
import { Command } from 'commander';
import { createNamespace, deleteNamespace } from './actions/namespace/index.js';
import { createPod, deletePod } from './actions/pod/index.js';

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

program.parse(process.argv);

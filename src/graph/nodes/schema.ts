import { GraphQLSchema } from 'graphql';
import { addErrorLoggingToSchema, makeExecutableSchema } from 'graphql-tools';

import { resolvers } from './resolvers';
import { generateTypeScriptTypes }from 'graphql-schema-typescript';


const typeDefs = [
  // tslint:disable no-require-imports no-var-requires
  require('./index.gql'), // root schema
  require('./blogPost').default,
  require('./comment').default,
  // tslint:enable
];


// TODO: create a webpack loader for this functionality
async function generateSchemaTypeDefs(executableSchema: GraphQLSchema): Promise<void> {
  const output = './src/graph/nodes/schemaDefs.autogen.ts';
  // tslint:disable-next-line:no-require-imports

  await generateTypeScriptTypes(executableSchema, output, {
    typePrefix: 'IGql',
    contextType: 'Context',
    importStatements:[
"// tslint:disable",
"import { Context } from '~/graph/context';"

    ],
  });
}

const createSchema = () => {
  const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers : resolvers as any,
  });

  if (process.env.NODE_ENV === 'development' && !process.env.SKIP_GQL_SCHEMA_GEN) {
    generateSchemaTypeDefs(executableSchema)
      // tslint:disable-next-line:no-console
      .then(() => console.log('### Schema was updated ###'))
      // tslint:disable-next-line:no-console
      .catch(err => console.log(`Schema generation err: ${err}`));
  }

  // tslint:disable-next-line no-console
  addErrorLoggingToSchema(executableSchema, { log: (e) => console.log(e) });
  return executableSchema;
};

export const schema = createSchema();

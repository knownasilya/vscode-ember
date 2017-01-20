/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import * as path from 'path';

import { workspace, Disposable, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions, TransportKind } from 'vscode-languageclient';

export function activate(context: ExtensionContext) {

  // The server is implemented in node
  let serverModule = context.asAbsolutePath(path.join('server', 'src', 'start-server.js'));
  // The debug options for the server
  let debugOptions = { execArgv: ["--nolazy", "--debug=6004"] };

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  let serverOptions: ServerOptions = {
    run : { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
  };

  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
    // Register the server for plain text documents
    documentSelector: ['handlebars', 'javascript'],
    outputChannelName: 'Ember Language Server',
    synchronize: {
      fileEvents: [
        workspace.createFileSystemWatcher('**/*.hbs'),
        workspace.createFileSystemWatcher('**/*.js'),
      ],
    },
  };

  // Create the language client and start the client.
  let disposable = new LanguageClient('emberLanguageServer', 'Ember Language Server', serverOptions, clientOptions).start();

  // Push the disposable to the context's subscriptions so that the
  // client can be deactivated on extension deactivation
  context.subscriptions.push(disposable);
}

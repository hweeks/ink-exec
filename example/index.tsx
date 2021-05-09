import React from "react"
import { ExecWrapper } from "../src"
import {render, Box} from 'ink';

render(
  <Box flexDirection="column">
    <ExecWrapper command="node ./jabber.js" cwd={__dirname} />
    <ExecWrapper command="node ./jabber2.js" cwd={__dirname} />
  </Box>
)

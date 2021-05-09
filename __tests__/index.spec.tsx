import React from "react"
import { ExecWrapper } from "../src"
import { Box } from "ink"
import { render, cleanup } from "ink-testing-library"

const sleep = (time) => new Promise((res) => setTimeout(res, time))
const flushPromises = () => new Promise(setImmediate)

describe("ink-exec", () => {
  test("renders single child", async () => {
    const { lastFrame } = render(
      <ExecWrapper command="node ../example/jabber.js" cwd={__dirname} />
    )
    expect(lastFrame()).toContain("cmd: node ../example/jabber.js")
    await sleep(100)
    expect(lastFrame()).toContain("running right now")
    await flushPromises()
    cleanup()
  })
  test("renders dual children", async () => {
    const { lastFrame } = render(
      <Box flexDirection="column">
        <ExecWrapper command="node ../example/jabber.js" cwd={__dirname} />
        <ExecWrapper command="node ../example/jabber2.js" cwd={__dirname} />
      </Box>
    )
    expect(lastFrame()).toContain("cmd: node ../example/jabber.js")
    expect(lastFrame()).toContain("cmd: node ../example/jabber2.js")
    await sleep(100)
    expect(lastFrame()).toContain("running right now")
    expect(lastFrame()).toContain("running 2 right now")
    await sleep(100)
    await flushPromises()
    cleanup()
  })
})

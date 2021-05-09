import React, { useState, useEffect } from "react"
import { Box, Text, useApp } from "ink"
import { exec, ChildProcess } from "child_process"

export const ansiRegex = ({ onlyFirst = false } = {}): RegExp => {
  const pattern = [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
  ].join("|")
  return new RegExp(pattern, onlyFirst ? undefined : "g")
}

interface ExecWrapperProps {
  command: string
  cwd: string
  rows?: number
}

const stdoutHelper = (rowCount, setOutput, datum) => {
  setOutput((prevOutput) => {
    let lines = [
      ...prevOutput.split("\n").filter(Boolean),
      ...datum.replace(ansiRegex(), "").split("\n").filter(Boolean),
    ]
    if (lines.length <= rowCount - 1) {
      lines = [...Array(rowCount - 1).fill(""), ...lines]
    }
    const builtOutput = lines.slice(-rowCount).join("\n")
    return builtOutput
  })
}

export const ExecComp = ({
  command,
  cwd,
  rows,
}: ExecWrapperProps): JSX.Element => {
  const rowCount = rows ?? 5
  const { exit } = useApp()
  const [output, setOutput] = useState("")
  const [runningCommand, setCommand] = useState<ChildProcess>(null)
  const boundStdoutHelper = stdoutHelper.bind(null, rowCount, setOutput)
  if (!runningCommand) {
    const internalCommand = exec(command, { cwd })
    internalCommand.stdout.on("data", boundStdoutHelper)
    setCommand(internalCommand)
  }
  useEffect(() => {
    return () => {
      if (runningCommand.exitCode !== null) {
        runningCommand?.removeAllListeners()
        exit()
      }
    }
  })
  return <Text>{output}</Text>
}

export const ExecWrapper = (props: ExecWrapperProps): JSX.Element => {
  const { command } = props
  return (
    <Box flexDirection="column">
      <Text>cmd: {command} </Text>
      <Box flexGrow={1} borderStyle="single">
        <ExecComp {...props} />
      </Box>
    </Box>
  )
}

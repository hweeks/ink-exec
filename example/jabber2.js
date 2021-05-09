let runs = 0
const maxRuns = process.env.MAX_RUNS || 10
const renderLoop = process.env.NODE_ENV === 'test' ? 1 : 500;

let logNoise = () => {
  if (runs < maxRuns) console.log("running 2 right now ", runs + 1)
  else if (runs === maxRuns) process.exit(2)
  runs++
  setTimeout(logNoise, renderLoop)
}

setTimeout(logNoise, renderLoop)
